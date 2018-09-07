""" Lib contenant toutes les fonctions utilitaires liées à cerbère"""
""" FIXME: pour le moment il n'y a rien d'utile"""

class UserInfo:

	def __init__(self):
		pass


# Charge le fichier de conf de cerbère bouchon pour récupérer 
# les noms, prénoms, pwd, ... et profiles des utilisateurs.
#
# Retourne la liste des utilisateurs (objets UserInfo)
#
# FIXME: à faire en vrai mais est-ce vraiment utile?
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
