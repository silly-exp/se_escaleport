# Ici on trouve des outils pour se simplifier la vie mais ils ne doivent pas dépendre de sélénium.
from escaleport_api import *

# FIME: TODO
def loginAs(browser, userName, url = 'http://escaleport-test.dsi.damgm.i2/'):
	"""Se connecte à Escaleport avec le compte userName.
	Utilise la configuration du cerbère bouchon pour déterminer le mot de passe.
	Si une session existe déjà, quel que soit l'utilisateur celui-ci est déconnecté avant de créer la 
	nouvelle session.
	Si l'utilisateur n'existe pas dans la conf de cerbere bouchon, retourne l'exception userNotDefinedException
	Si la connexion échoue à cause du site retourne l'exception loginFailException
	
	paramètres:
	browser : navigateur Sélénium initialisé avec l'url du site.
	userName : String
		Nom de l'utilisateur à utiliser pour se logguer. il doit être décrit dans le xml du bouchon cerbere
	url : String
		url de la page d'accueil du site. l'adresse du site d'intégration est l'url par défaut.
	"""
	pass

	