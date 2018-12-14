from selenium import webdriver
from selenium.webdriver.support.ui import Select
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.action_chains import ActionChains

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
		
	def cliqueLien(self, label, startElem=None):
		"""clique sur le lien contenant le libelle.
		Ce lien ne doit pas se trouver dans les menus (utiliser cliqueMenu pour cela).
		Ce lien doit provoquer le rechargement de la page, cette fonction n'est pas 
		adaptées dans le cas contraire car la condition qui détermine la fin du 
		chargement ne sera pas correcte
		
		libelle: le texte du lien à rechercher
		by : valeur de la classe By qui indique la signification du libelle
			par défaut le libellé est considéré comme le texte du lien."""
		if startElem == None:	
			link = self.find_element(By.XPATH, f"//td[@class='corpsDePage']/*[not (self::a[@name='top']) and not (self::form[@name='MenuForm']) and not (self::div[@id='menuprincipal']) and not (self::script) and not (self::table[@class='entete'])]//a[normalize-space()='{label}']")
		else:
			link = startElem.find_element(By.LINK_TEXT, label)
		link.click()
		self.waitTokenGuardOnNewPage(link)
			
	def cliqueMenu(self, label, menu="gauche"):
		""" Comme les entrées du menu sont dupliquées en haut et à gauche il n'est pas 
		possible de les rechercher avec seulement leur texte. Cette fonction permet 
		de cliquer sur une entrée du menu en utilisant par défaut le menu gauche.
		FIXME: implémenter le menu haut."""
		link = self.find_element(By.XPATH, f"//table[@class='liensMenuGauche']//a[normalize-space()='{label}']")
		link.click()

		#Accès par le menu haut (menu principal)
	#	self.find_element(By.XPATH, "//div[@id='manuprincipal']//a[normalize-space()='{}']".format(terms)).click()
		self.waitTokenGuardOnNewPage(link)

	def cliqueAriane(self, label):
		""" clique sur un lien du fil d'Ariane"""
		link = self.find_element(By.XPATH, f"//table[@class='entete']//a[normalize-space()='{label}']")
		link.click()
		self.waitTokenGuardOnNewPage(link)
		pass
	
	def cliqueOnglet(self, label):
		""" clique sur un onglet des demandes"""
		elems = self.find_elements(By.CLASS_NAME, "ongletTextDis")
		elems += self.find_elements(By.CLASS_NAME, "ongletTextEna")
		for e in elems:
			if e.text.strip() == label:
				e.click()
				self.waitTokenGuardOnNewPage(e)
		raise Exception(f"Onglet {label} non trouvé.")
		
	def selectDansListe(self, listId, value):
		"""sélectionne la valeur value dans la liste d'id idList"""
		Select(self.find_element_by_id(listId)).select_by_visible_text(value)
		
	def cerbereLogin(self, params):
		""" saisie et valide le formulaire d'authentification cerbère.
		Dans un premier temps on le traite à part, mais il pourrait être traité avec fillForm()"""
		nameField = self.find_element_by_name('uid')
		nameField.send_keys(params['uid'])
		pwdField = self.find_element_by_name('pwd')
		pwdField.send_keys(params['pwd'])
		pwdField.submit() # FIXME c'est un peu louche parce que c'est le formulaire que je veux soumettre...
		self.waitTokenGuardOnNewPage()
		
	def _getFormFields(self):
		try:
			formElem = self.find_element(By.XPATH, "//td[@class='corpsDePage']/form[@name!='MenuForm']")
		except : #selenium.common.exceptions.NoSuchElementException:
			formElem = self.find_element(By.XPATH, "//td[@class='ongletMain']/div")
		
		formFields = {}
		fieldsElems = formElem.find_elements(By.XPATH, "//input | //select | //textarea")
		for fieldElem in fieldsElems:
			if (not fieldElem.is_displayed()):
				continue
			inputType=""
			if fieldElem.tag_name == 'textarea':
				inputType = 'text'
			elif fieldElem.tag_name == 'select':
				inputType = 'select'
			else:
				inputType = fieldElem.get_attribute("type")
			print('------{}:{}:{}'.format(fieldElem.tag_name, fieldElem.get_attribute("name"), inputType))
			formFields[fieldElem.get_attribute("name")]={'searchBy':'name', 'searchValue':fieldElem.get_attribute("name"), 'inputType':inputType}
			
		return formFields
	
	def fillForm(self, params):
		""" Remplir le formulaire de la page courante avec les paramètres params.
		"""
		# analyse de la page pour trouver les champs du formulaire
		formFields = self._getFormFields()
		#print(formFields)
		
		# valider les id des parametres
		for fieldId, fieldValue in params.items():
			if fieldId not in formFields.keys():
				raise  ValueError(f"Le paramètre {fieldId} n'est pas défini dans le formulaire")

		# remplir le formulaire.
		for fieldId, fieldDesc in formFields.items():
			if fieldId not in params.keys():
				# ce champ reste vide
				continue
			print(fieldId, fieldDesc)
			field_elem = self.find_element(fieldDesc['searchBy'], fieldDesc['searchValue'])
			if fieldDesc['inputType']=='text':
				field_elem.clear()
				field_elem.send_keys(params[fieldId])
				# Pour certains champs utilisant la validation/autocomplétion il est nécessaire d'envoyer des événements keyUp (ex: locode)
				# Dans le cas contraire la liste des valeurs possibles n'est pas calculée et le contrôle pense que la valeur saisie n'a
				# pas de correspandance dans la liste des codes.
				ActionChains(self).key_down(Keys.CONTROL, field_elem).key_up(Keys.CONTROL, field_elem).pause(0.2).perform();
			elif fieldDesc['inputType']=='select':
				Select(field_elem).select_by_visible_text(params[fieldId])
			else:
				raise ValueError(f"L'inputType {fieldDesc['inputType']} du champ {fieldId} n'est pas géré.")
	
	def resultContent(self):
		""" retourne le tableau de résultat pour analyse et permettre de trouver celui qui nous intéresse."""
		"""FIXME: à faire"""
		pass
		
	def clickResultAction(self, resultNbr=0, actionLabel=None):
		""" Dans un tableau de résultats sélectionne l'action actionLabel du résultat resultNbr.
			Les numéros des résultats commencent à 0. Le premier est en haut le dernier en bas.
			si resultNbr est omis, le premier résultat est sélectionné.
			Si actionLabel est omis on clique sur la ligne du tableau."""
			
		# cliquer sur le bouton action de la ligne resultNbr (commence à 0)
		self.find_element_by_id(f"menu{resultNbr}").find_element_by_xpath("./..").click()
		#time.sleep(1)
		# cliquer sur l'action Voulue
		if actionLabel is None:
			# TODO
			raise NotImplementedError("Je ne sais pas encore vraiment cliquer sur la ligne du résultat...")
		else:
			self.cliqueLien(actionLabel, startElem = self.find_element_by_id(f"menu{resultNbr}"))
			
