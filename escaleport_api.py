from selenium import webdriver
from selenium.webdriver.support.ui import Select
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait 
from selenium.webdriver.support import expected_conditions as EC

from selenium.common.exceptions import StaleElementReferenceException

import time
import csv

"""
ID = "id"
XPATH = "xpath"
LINK_TEXT = "link text"
PARTIAL_LINK_TEXT = "partial link text"
NAME = "name"
TAG_NAME = "tag name"
CLASS_NAME = "class name"
CSS_SELECTOR = "css selector"
"""
	
class escaleportDriver(webdriver.Firefox):

	def __init__(self):
		super().__init__()
		
	def waitTokenGuardOnNewPage(self, old_element = None):
		""" On attend que le jeton tokenGuard soit générer par le javascript.
		Le truc c'est qu'il y en a plein la page des tokenGuard, et comme je ne 
		sais pas combien il y en a, j'en surveille un qui apparaît sur toutes 
		les pages.
		De manière générale je voudrait éviter d'avoir une condition d'attente
		différente pour chaque page de l'application."""
		# Le code suivant permet de vérifier qu'on a quitté la page de départ avant de
		# chercher des éléments dans la nouvelle page.
		# voir : https://blog.codeship.com/get-selenium-to-wait-for-page-load/
		MAX_WAIT = 20
		def old_element_has_gone_stale():
			try:
			  # poll the old_element with an arbitrary call
			  old_element.find_elements_by_id('doesnt-matter') 
			  return False
			except StaleElementReferenceException:
			  return True

		def wait_for(condition_function):
			start_time = time.time() 
			while time.time() < start_time + MAX_WAIT: 
				if condition_function(): 
					return True 
				else: 
					time.sleep(0.2) 
			raise Exception(
				'Timeout waiting for {}'.format(condition_function.__name__) 
			)
			  
		if old_element is not None:	
			wait_for(old_element_has_gone_stale)

			
		try:
			WebDriverWait(self, 10).until(EC.presence_of_element_located((By.XPATH, "//form[@name='MenuForm']//input[@name='tokenGuard']")))
			print("tokenGuard trouvé!")
		except Exception as e:
			print("pas de tokenGuard...")
			print(e)
			return False

		
	def cliqueLien(self, label, by="partial link text"):
		"""clique sur le lien contenant le libelle.
		Ce lien doit provoquer le rechargement de la page, cette fonction n'est pas 
		adaptées dans le cas contraire car la condition qui détermine la fin du 
		chargement ne sera pas correcte
		
		libelle: le texte du lien à rechercher
		by : valeur de la classe By qui indique la signification du libelle
			par défaut le libellé est considéré comme le texte du lien."""
		print("[{}][{}]".format(label, by))
		link = self.find_element(by, label)
		link.click()
		self.waitTokenGuardOnNewPage(link)
			
	def cliqueMenu(self, label, menu="gauche"):
		""" Comme les entrées du menu sont dupliquées en haut et à gauche il n'est pas 
		possible de les rechercher avec seulement leur texte. Cette fonction permet 
		de cliquer sur une entrée du menu en utilisant par défaut le menu gauche.
		FIXME: implémenter le menu haut."""
		link = self.find_element(By.XPATH, "//table[@class='liensMenuGauche']//a[normalize-space()='{}']".format(label))
		link.click()

		#Accès par le menu haut (menu principal)
	#	self.find_element(By.XPATH, "//div[@id='manuprincipal']//a[normalize-space()='{}']".format(terms)).click()
		self.waitTokenGuardOnNewPage(link)

		
	def selectDansListe(self, listId, value):
		"""sélectionne la valeur value dans la liste d'id idList"""
		Select(self.find_element_by_id(listId)).select_by_visible_text(value)
		
	# Rempli et valide de formulaire de login de cerbère.
	# Prérequis: 
	#  o il faut se trouver sur la page Cerbère
	# Param:
	#  - Le nom du compte cerbère
	#  - Le mot de passe du compte
	# Retour:
	#  Aucun. TODO: devrait gérer les problèmes de connexion...
	#---------------------------------------------------------
	def cerbereLogin(self, name, pwd):
		nameField = self.find_element_by_name('uid')
		nameField.send_keys(name)
		pwdField = self.find_element_by_name('pwd')
		pwdField.send_keys(pwd)
		pwdField.submit() # FIXME c'est un peu louche parce que c'est le formulaire que je veux soumettre...
		self.waitTokenGuardOnNewPage()
		
		
	def fillForm(self, params, formId = None):
		""" Remplir le formulaire d'identifiant formId avec les paramètres params.
		Le formulaire doit être décrit dans le fichier ./forms/formId.yaml.
		Le format excel c'est pratique mais pas versionnable et il faut excel...
		Le format ods en version non zippée pourquoi pas, à étudier mais ajoute une dépendance et c'est qd un xml tres parasité. 
		Le format CSV est assez cool mais il ne permet pas de stocker des données de nature différentes (ex: fil d'Ariane + fields + submit)
		Les formats yaml ou json sont moins simple à écrire et oblige à copier le nom du champ à chaque fois...
		Le yaml est plus compliqué que json et nécessite un module externe.
		
		=> csv ou json. Va pour le CSV. Il conviendra bien pour les fields.
		
		Le field dont l'Id est "submit" correspond à l'élément à cliquer pour valider le formulaire.
		Les champs sont remplis dans l'ordre de leur définition dans le csv sauf le champ submit qui 
		sera toujours utilisé à la fin (pour éviter les erreurs incompréhensibles). Cette histoire 
		d'ordre de saisie sera utile lorsqu'on aura des listes qui dépendent d'autre champs"""
		
		""" Recommandation: par convention le nom des parametres servant à remplir le formulaire est le libellé du champ
		traduit en camelCase et commençant par une minuscule. Cette règle n'est pas implémentée et elle
		est uniquement destiné à ce que l'utilisteur s'y retrouve facilement."""
		
		"""FIXME voir comment faire pour valider les listes de valeurs modifiées en fonction d'autres valeurs saisies
		   ou plus généralement comment valider des comportements qui interviennent avant la validation du formulaire."""
		"""TODO idéalement se serait vraiment cool de pouvoir désigner le formulaire avec seulement un copier/coller du fil d'Ariane"""
		"""FIXME: le chargement des csv ne devrait pas se trouver ici mais dans un module de gestion des configs à écrire"""
		"""TODO:  pour gérer correctement les listes dépendantes il faudra trouver un système qui attend que la liste se mette à jour."""
		# Détermination de la page sur laquelle on se trouve.
		# En première approche on se base sur le nom de la balise form.
		# Il y a toujours plusieurs formulaire qui ne nous intéressent pas on est obligé de faire un peu de tri
		if formId is None:
			formElem = self.find_element(By.XPATH, "//td[@class='corpsDePage']/form[@name!='MenuForm']")
			formId = formElem.get_attribute("name")
		print("formId=[{}]".format(formId))
		
		# Récupérer la définition du formulaire
		formDescPath = 'forms/{}_fields.csv'.format(formId)
		formFields = dict()
		with open(formDescPath, 'r') as formDescFile:
			reader = csv.reader(formDescFile, delimiter="\t")	
			for row in reader:
				if (row[0].strip())[:2]=='//':
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
				raise ValueError("Dans le fichier {}, pour le champ {}, l'inputType {} n'est pas connu.".format(formDescPath, fieldId, fieldDesc['inputType']))
		
		# soumission du formulaire
		if 'submit' not in formFields.keys():
			raise ValueError("Pas de champ submit définit dans le fichier {}: impossible de valider le formulaire.".format(formDescPath))
		
		if formFields['submit']['inputType']=='link':
			self.cliqueLien(label=formFields['submit']['searchValue'], by=formFields['submit']['searchBy'])
		else:
			raise ValueError("Dans le fichier {}, l'inputType {} n'est pas définit pour le champ de soumission du formulaire.".format(formDescPath, formFields['submit']['inputType']))
			
