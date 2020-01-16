import unittest

# from selenium import webdriver
# """ FIME: idéalement pour permettre la survie de nos scénarios lorsqu'on changera de pilote de navigateur
# il ne faudrait pas qu'il y ai ici de dépendence à selenium"""
#
# from selenium.webdriver.support.ui import WebDriverWait
# from selenium.webdriver.support import expected_conditions as EC
# from selenium.webdriver.support.ui import Select
# from selenium.webdriver.common.by import By

import datetime
import json

from escaleport_api import *


class EscaleportTestCase(unittest.TestCase):
    def setUp(self):
        """ FIXME: doit récupérer l'environnement dans les paramètre de la ligne de commande et les urls dans le fichier de commande """
        """ FIXME: doit récupérer le niveau de log dans les paramètre de la commande."""
        """ FIXME: sur l'environnement PROD seuls les tests en lecture seuls sont exécutés"""
        self.browser = escaleportDriver()
        config = {}
        with open("config.json", "r") as config_file:
            config = json.loads(config_file.read())
        self.url = config["env"]["integration"]["url"]
        self.url_visiteur = config["env"]["integration"]["url_visiteur"]
        # self.browser.get('https://escaleport-test.csam.e2.rie.gouv.fr/escaleport/iAuthentification')
        # self.addCleanup(self.browser.quit)

    def _testChoisirPort(self):
        # s'identifier sur cerbere
        self.browser.cerbereLogin({"uid": "pnd", "pwd": "1"})
        self.browser.fillForm({"idPortLocode": "Caen"})
        self.browser.cliqueLien("Valider")

    def _testCreerDAPAQ(self):
        """ Crée une DAPAQ à Caen pour le MARION DUFRESNE aujourd'hui et saisit la FAL1.
		"""
        # s'identifier sur cerbere
        self.browser.cerbereLogin({"uid": "pnd", "pwd": "1"})
        # choisir un port
        self.browser.fillForm({"idPortLocode": "Caen"})
        self.browser.cliqueLien("Valider")

        # Créer une demande
        self.browser.cliqueMenu("Créer DAPAQ")
        #   Chercher un navire
        self.browser.fillForm({"nomNavire": "MARION DUFRESNE"})
        self.browser.cliqueLien("Rechercher")
        #     Sélectionner le premier résultat.
        self.browser.cliqueResultatAction(0, "Sélectionner")
        #     Compléter la DAPAQFlash pour aujourd'hui
        self.browser.fillForm(
            {
                "datePrevueArrivee": datetime.date.today().strftime("%d%m%Y"),
                "heurePrevueArrivee": "1100",
                "idcObjetEscale": "Commerciale",
            }
        )
        self.browser.cliqueLien("Compléter demande")
        #       Compléter la FAL1
        self.browser.fillForm(
            {
                "idPortDernierTouche_input": "FR-Brest",
                "idPortProchainTouche_input": "FR-Brest",
                "datePrevueDepart": datetime.date.today().strftime("%d%m%Y"),
                "heurePrevueDepart": "2300",
                "armateur": "NICO_ARMA",
                "tonnageNet": 1000,
                "idPaq": "B1 - B1",
                "nbTotalEquipage": 10,
                "nombreTotalPassagers": 10,
                "tirantEauArriere": 5,
                "presenceMD": "Oui",
                "niveauInspection": "Aucune inspection",
                "avarie": "Non",
            }
        )
        self.browser.cliqueLien("Enregistrer")

    def _testRechercherDemande(self):
        """ FIXME: ne fonctionne pas et ne fait pas ce qui est décrit ci dessous.
			recherche les DAPAQ d'aujourd'hui
			choisi la demande d'entrée du Marion Dufresne.
		"""
        # s'identifier sur cerbere
        self.browser.cerbereLogin({"uid": "pnd", "pwd": "1"})
        self.browser.fillForm({"idPortLocode": "Caen"})
        self.browser.cliqueLien("Valider")

        self.browser.cliqueMenu("Rechercher demande")
        # formulaire de recherche
        self.browser.fillForm(
            {"numDemande": "2018000745", "dateDebut": "", "dateFin": ""}
        )
        self.browser.cliqueLien("Rechercher")
        # consulter le premier résultat.
        self.browser.cliqueResultatAction(0, "Consulter demande")

        self.browser.cliqueOnglet("Poste / Moyens")
        # self.browser.fillForm(...)
        # self.browser.cliqueLien('Enregistrer')

    def testVisiteur(self):
        self.browser.get(self.url_visiteur)
        # controler que seule la page des liens est présente dans le menu
        self.assertEqual(self.browser.listeMenu(), ["Changement de port", "Liens"])
        # controler l'accès à la page des liens
        self.browser.cliqueMenu("Liens")
        # sélectionner le port de Caen
        self.browser.cliqueMenu("Changement de port")
        self.browser.fillForm({"idPortLocode": "Caen"})
        self.browser.cliqueLien("Valider")
        # controler le contenu du menu
        self.assertEqual(
            self.browser.listeMenu(),
            [
                "Changement de port",
                "Occupation des quais",
                "Navires attendus",
                "Navires à quai",
                "Navires au départ",
                "Avis aux usagers",
                "Liens",
            ],
        )

        # fonctionnement de occupation des quais
        self.browser.cliqueMenu("Occupation des quais")
        self.browser.fillForm(
            {
                "strDateRecherche": "2019-07-31",  # "31072019",
                "idBassin": "Tous",
                # "imoNavire": "<text>",
                # "nomNavire": "<text>",
                # "immatNavire": "<text>",
                "mouvement": True,
                "demande": True,
                "annonce": True,
                "indispo": False,
            }
        )
        self.browser.cliqueLien("Rechercher")

        """
        # fonctionnement de navires attendu
        self.browser.cliqueMenu("Navires attendus")

        # fonctionnement de navires à quai
        self.browser.cliqueMenu("Navires à quai")

        # fonctionnement de navires au départ
        self.browser.cliqueMenu("Navires au départ")

        # fonctionnement de avis aux usagers
        self.browser.cliqueMenu("Avis aux usagers")
        """


if __name__ == "__main__":
    unittest.main(verbosity=2)

