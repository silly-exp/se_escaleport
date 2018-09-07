import unittest

from selenium import webdriver
""" FIME: idéalement pour permettre la survie de nos scénarios lorsqu'on changera de pilote de navigateur
il ne faudrait pas qu'il y ai ici de dépendence à selenium"""

from selenium.webdriver.support.ui import WebDriverWait 
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import Select
from selenium.webdriver.common.by import By

import time

from escaleport_api import *



class EscaleportTestCase(unittest.TestCase):

	
	# Prérequis:
	# o Etre connecté à Escaleport
	#---------------------------------------------------------
	def deconnexion(self):
		element = self.browser.find_element_by_link_text("Déconnexion") #FIXME 
		#element = self.browser.find_element_by_partial_link_text("Déconnexion")
		element.click()
	
	
	# Retourne le nom de l'utilisateur connecté.
	# Retourne None si on est pas connecté.
	#
	# Cette fonction se base sur le libellé "Nom" du cartouche Cerbère et
	# retrouve l'identifiant correspondant dans le fichier de configuration du cerbère bouchon
	# fourni pour les tests.
	#---------------------------------------------------------
	def connectedUser(self):
		nameElem = self.browser.find_element(By.XPATH, "//table[@class='bloc']/tbody/tr/td") #FIXME
		
	
#	# Prérequis: 
#	#  o il faut se trouver sur la page d'accueil
#	#  o il faut avoir les droits pour se connecter au port demandé
#	# Param:
#	#  - Le nom du port tel qu'il est libellé dans le formulaire.
#	# Retour:
#	#  Aucun. Retourne une exception en cas de problème
#	#---------------------------------------------------------
#	def accueilSelectPort(self, portName):
#		self.browser.selectDansListe("idPortLocode", portName)
#		self.browser.cliqueLien("Valider")
#
#	def rechercherNavire(self, referentiel="Lloyds", nom='', OMI=''):
#		self.browser.selectDansListe("idcReferentielNavire", referentiel)
#		self.browser.find_element_by_id("nomNavire").send_keys(nom)
#		self.browser.find_element_by_id("numeroOMI").send_keys(OMI)
#		cliqueLien(self.browser, "//td[@class='corpsDePage']//*[not (name()='menuprincipal')]//a[normalize-space()='Rechercher']", By.XPATH)
#		# FIXME retourner le nombre de résultat

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
		self.browser = escaleportDriver()
		#self.browser = webdriver.Firefox()
		#self.addCleanup(self.browser.quit)

	def testPageTitle(self):
		self.browser.get('https://escaleport-test.csam.e2.rie.gouv.fr/escaleport/iAuthentification')
		#self.cerbereLogin("admintechcentral", "1")
		self.browser.fillForm({"identifiant":"capg141", "motDePasse":"14"}, "cerbereLogin")
		
		# Sélection du port de Caen
		#--------------------------
		self.browser.fillForm({'port':"Caen"})
		
		# On se déconnecte
		#self.deconnexion()

		# Rechercher une DAPAQ
		#-------------------
		#element = self.browser.find_element_by_link_text("Créer DAPAQ") # évidemment uft8 vs latin...
		#cliqueMenu(self.browser, "Rechercher demande")
		#cliqueLien(self.browser, "Rechercher")
		#cliqueLien(self.browser, "Changement de port")
		
		self.browser.cliqueMenu("Créer DAPAQ")
		#self.rechercherNavire(nom="MARION DUFRESNE")
		self.browser.fillForm({'nomNavire':"MARION DUFRESNE"})
#		self.rechercherNavireSelect()
#		self.DAPAQFlash()
		

if __name__ == '__main__':
	unittest.main(verbosity=2)
	
