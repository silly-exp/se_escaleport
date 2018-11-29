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


	def setUp(self):
		self.browser = escaleportDriver()
		self.browser.get('https://escaleport-test.csam.e2.rie.gouv.fr/escaleport/iAuthentification')
		#self.addCleanup(self.browser.quit)
		
	def _testChoisirPort(self):
		#self.cerbereLogin("admintechcentral", "1")
		self.browser.fillForm({"identifiant":"capg141", "motDePasse":"14"}, "cerbereLogin")
		
		# Sélection du port de Caen : inutile si on est en capg141
		self.browser.fillForm({'port':"Caen"})


	def testCreerDAPAQ(self):
		# s'identifier sur cerbere
		self.browser.fillForm({"identifiant":"capg141", "motDePasse":"14"}, "cerbereLogin")
		# Sélection du port de Caen : inutile si on est en capg141
		#self.browser.fillForm({'port':"Caen"})
		self.browser.fillForm({'idPortLocode':"Caen"})

		# Créer une demande
		self.browser.cliqueMenu("Créer DAPAQ")
		#   Chercher un navire
		self.browser.fillForm({'nomNavire':"MARION DUFRESNE"})
		#     Sélectionner un résultat.
		self.browser.clickResultAction(0,"Sélectionner")
		#     Compléter la DAPAQFlash
		self.browser.fillForm({'datePrevueArrivee':'10102018', 'heurePrevueArrivee':'2000', 'idcObjetEscale':'Commerciale'})
#		self.rechercherNavireSelect()
#		self.DAPAQFlash()

	def _testRechercherDemande(self):
		self.browser.fillForm({"identifiant":"capg141", "motDePasse":"14"}, "cerbereLogin")
		self.browser.cliqueMenu("Rechercher demande")
		# formulaire de recherche
		self.browser.fillForm({'dateDebut':"10102018",'dateFin':"11102018"})
		# consulter le premier résultat.
		self.browser.clickResultAction(0,"Consulter demande")
		
		
		
		

if __name__ == '__main__':
	unittest.main(verbosity=2)
	
