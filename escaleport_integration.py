import unittest

from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait 
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import Select
from selenium.webdriver.common.by import By

import time

from lib import *

class UserInfo:

	def __init__(self):
		pass


class EscaleportTestCase(unittest.TestCase):

	# Prérequis: 
	#  o il faut se trouver sur la page Cerbère
	# Param:
	#  - Le nom du compte cerbère
	#  - Le mot de passe du compte
	# Retour:
	#  Aucun. TODO: devrait gérer les problèmes de connexion...
	#---------------------------------------------------------
	def cerbereLogin(self, name, pwd):
		self.assertIn('Connexion', self.browser.title)
		nameField = self.browser.find_element_by_name('uid')
		nameField.send_keys(name)
		pwdField = self.browser.find_element_by_name('pwd')
		pwdField.send_keys(pwd)
		pwdField.submit() # FIXME c'est un peu louche parce que c'est le formulaire que je veux soumettre...
	
	# Prérequis:
	# o Etre connecté à Escaleport
	#---------------------------------------------------------
	def deconnexion(self):
		element = self.browser.find_element_by_link_text("Déconnexion")
		#element = self.browser.find_element_by_partial_link_text("Déconnexion")
		element.click()
	
	# Charge le fichier de conf de cerbère bouchon pour récupérer 
	# les noms, prénoms, pwd, ... et profiles des utilisateurs.
	#
	# Retourne la liste des utilisateurs (objets UserInfo)
	#
	# FIXME: à faire en vrai
	#---------------------------------------------------------
	def loadUserInfo():
		userList=[]
		admin = UserInfo()
		admin.nom = "PNDT"
		admin.prenom = "Tests Admin Tech Central"
		admin.identifiant = "adminTechCentral"
		admin.passe = "1"
		userList.append(admin)
		
		pnd = UserInfo()
		pnd.nom = "PND"
		pnd.prenom = "Tests Cap_stats"
		pnd.identifiant = "pnd"
		pnd.passe = "1"
		userList.append(pnd)
		
		return userList
	
	# Retourne le nom de l'utilisateur connecté.
	# Retourne None si on est pas connecté.
	#
	# Cette fonction se base sur le libellé "Nom" du cartouche Cerbère et
	# retrouve l'identifiant correspondant dans le fichier de configuration du cerbère bouchon
	# fourni pour les tests.
	#---------------------------------------------------------
	def connectedUser(self):
		nameElem = self.browser.find_element(By.XPATH, "//table[@class='bloc']/tbody/tr/td")
		
	
	# Prérequis: 
	#  o il faut se trouver sur la page d'accueil
	#  o il faut avoir les droits pour se connecter au port demandé
	# Param:
	#  - Le nom du port tel qu'il est libellé dans le formulaire.
	# Retour:
	#  Aucun. Retourne une exception en cas de problème
	#---------------------------------------------------------
	def accueilSelectPort(self, portName):
		selectDansListe(self.browser, "idPortLocode", portName)
		cliqueLien(self.browser,"Valider")

	def rechercherNavire(self, referentiel="Lloyds", nom='', OMI=''):
		selectDansListe(self.browser, "idcReferentielNavire", referentiel)
		self.browser.find_element_by_id("nomNavire").send_keys(nom)
		self.browser.find_element_by_id("numeroOMI").send_keys(OMI)
		cliqueLien(self.browser, "//td[@class='corpsDePage']//*[not (name()='menuprincipal')]//a[normalize-space()='Rechercher']", By.XPATH)
		# FIXME retourner le nombre de résultat

	def rechercherNavireSelect(self, resultNbr=0):
		# cliquer sur le bouton action de la ligne resultNbr (commence à 0)
		self.browser.find_element_by_id("menu{}".format(resultNbr)).find_element_by_xpath("./..").click()
		#time.sleep(1)
		# cliquer sur l'action Sélectionner le navire
		cliqueLien(self.browser, "selectionnerNavire{}".format(resultNbr), By.ID)
		
	def DAPAQFlash(self, date_ETA=None, time_ETA="2000", objet="Commerciale"):
		#Si pas de date indiquée => aujourd'hui
		if date_ETA is None:
			date_ETA = time.strftime("%d%m%y")
		self.browser.find_element_by_id("datePrevueArrivee").send_keys(date_ETA)
		self.browser.find_element_by_id("heurePrevueArrivee").send_keys(time_ETA)
		selectDansListe(self.browser, "idcObjetEscale", objet)
		cliqueLien(self.browser, "Enregistrer")
		
	
	def setUp(self):
		self.browser = webdriver.Firefox()
		#self.addCleanup(self.browser.quit)

	def testPageTitle(self):
		self.browser.get('https://escaleport-test.csam.e2.rie.gouv.fr/escaleport/iAuthentification')
		#self.cerbereLogin("admintechcentral", "1")
		self.cerbereLogin("capg141", "14")
		waitTokenGuardOnNewPage(self.browser)

		# Sélection du port de Caen
		#--------------------------
		self.accueilSelectPort("Caen")
		
		# On se déconnecte
		#self.deconnexion()

		# Rechercher une DAPAQ
		#-------------------
		#element = self.browser.find_element_by_link_text("Créer DAPAQ") # évidemment uft8 vs latin...
		#cliqueMenu(self.browser, "Rechercher demande")
		#cliqueLien(self.browser, "Rechercher")
		#cliqueLien(self.browser, "Changement de port")
		
		cliqueMenu(self.browser, "Créer DAPAQ")
		self.rechercherNavire(nom="MARION DUFRESNE")
		self.rechercherNavireSelect()
		self.DAPAQFlash()
		

if __name__ == '__main__':
	unittest.main(verbosity=2)
	
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