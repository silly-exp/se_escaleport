from datetime import date
from selenium import webdriver
""" FIME: idéalement pour permettre la survie de nos scénarios lorsqu'on changera de pilote de navigateur
il ne faudrait pas qu'il y ai ici de dépendence à selenium"""

from selenium.webdriver.support.ui import WebDriverWait 
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import Select
from selenium.webdriver.common.by import By

import time

from escaleport_api import *


browser = escaleportDriver()
browser.get('http://localhost:8080/escaleport/iAuthentification')
		
# s'identifier sur cerbere
browser.fillForm({"identifiant":"capg141", "motDePasse":"14"}, formId = "cerbereLogin")
# Sélection du port de Caen : inutile si on est en capg141
#browser.fillForm({'idPortLocode':"Caen"})

# Créer une demande
browser.cliqueMenu("Créer DAPAQ")
#   Chercher un navire
browser.fillForm({'nomNavire':"MARION DUFRESNE"}, submitLink = "FIXME")
#     Sélectionner un résultat.
browser.clickResultAction(0,"Sélectionner")
#     Compléter la DAPAQFlash
browser.fillForm({'datePrevueArrivee':date.today().strftime("%d%m%Y"), 'heurePrevueArrivee':'1000', 'idcObjetEscale':'Commerciale'},
                 submitLink = "FIXME")

