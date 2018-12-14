	def fillForm(self, params, formId = None, submitLink = None):
		""" Remplir le formulaire d'identifiant formId avec les paramètres params.
		
		Le field dont l'Id est "submit" correspond à l'élément à cliquer pour valider le formulaire.
		Les champs sont remplis dans l'ordre de leur définition dans le csv sauf le champ submit qui 
		sera toujours utilisé à la fin (pour éviter les erreurs incompréhensibles). Cette histoire 
		d'ordre de saisie sera utile lorsqu'on aura des listes qui dépendent d'autre champs"""
		
		"""FIXME voir comment faire pour valider les listes de valeurs modifiées en fonction d'autres valeurs saisies
		   ou plus généralement comment valider des comportements qui interviennent avant la validation du formulaire."""
		"""TODO idéalement se serait vraiment cool de pouvoir désigner le formulaire avec seulement un copier/coller du fil d'Ariane"""
		"""FIXME: le chargement des csv ne devrait pas se trouver ici mais dans un module de gestion des configs à écrire"""
		"""TODO:  pour gérer correctement les listes dépendantes il faudra trouver un système qui attend que la liste se mette à jour."""
		"""FIXME: comment permettre de choisir entre deux validations possibles (exemple DAPAQ flash ou compléter)"""
		"""TODO: on doit pas être loin de pouvoir générer la liste des champs du formulaire automatiquement."""
		"""TODO: faire en sorte que ça fonctionne aussi avec les onglets de la demande."""
		# Détermination de la page sur laquelle on se trouve.
		# En première approche on se base sur le nom de la balise form.
		# Il y a toujours plusieurs formulaire qui ne nous intéressent pas on est obligé de faire un peu de tri
		userFormId = formId
		if userFormId is None:
			formElem = self.find_element(By.XPATH, "//td[@class='corpsDePage']/form[@name!='MenuForm']")
			formId = formElem.get_attribute("name")
		print("formId=[{}]".format(formId))
		
		formFields = dict()
		# Récupérer la définition du formulaire...
		if userFormId is None:
			# en analysant le contenu de la page.
			formFields = self.getFormFields()
		else:
			# en chargeant le fichier de config.
			formDescPath = 'forms/{}_fields.csv'.format(formId)
			with open(formDescPath, 'r') as formDescFile:
				reader = csv.reader(formDescFile, delimiter="\t")	
				for row in reader:
					if (row[0].strip())[:2]=='//':
						# c'est un commentaire
						continue
					formFields[row[0].strip()]={'searchBy':row[1].strip(), 'searchValue':row[2].strip(), 'inputType':row[3].strip()}
		
		# valider les id des parametres
		for fieldId, fieldValue in params.items():
			if fieldId not in formFields.keys():
				raise  ValueError("Le paramètre {} n'est pas défini dans le formulaire {}".format(fieldId, formId))
		# remplir le formulaire.
		for fieldId, fieldDesc in formFields.items():
			if fieldId == 'submit':
				# on valide le formulaire à la fin
				continue
			if fieldId not in params.keys():
				# ce champ reste vide
				continue
			field_elem = self.find_element(fieldDesc['searchBy'], fieldDesc['searchValue'])
			if fieldDesc['inputType']=='text':
				field_elem.send_keys(params[fieldId])
			elif fieldDesc['inputType']=='select':
				Select(field_elem).select_by_visible_text(params[fieldId])
			else:
				raise ValueError("L'inputType {} du champ {} n'est pas géré.".format(fieldDesc['inputType'], fieldId))
		
		# soumission du formulaire
		if userFormId is None:
			if submitLink is None:
				raise ValueError("Pas de lien de soumission transmis pour le formulaire ".format(formId))
			#FIXME: et si submitLink est là??
		else: 
			if 'submit' not in formFields.keys():
				raise ValueError("Pas de champ submit définit dans le fichier {}: impossible de valider le formulaire.".format(formDescPath))
			if formFields['submit']['inputType']=='link':
				self.cliqueLien(label=formFields['submit']['searchValue'], by=formFields['submit']['searchBy'])
			else:
				raise ValueError("Dans le fichier {}, l'inputType {} n'est pas définit pour le champ de soumission du formulaire.".format(formDescPath, formFields['submit']['inputType']))