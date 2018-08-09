from selenium import webdriver
from selenium.webdriver.support.ui import Select
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait 
from selenium.webdriver.support import expected_conditions as EC

from selenium.common.exceptions import StaleElementReferenceException

import time

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
	

# TODO C'est une extension du driver, je pourrais faire une classe qui l'étend 
# plutôt que de le passer en paramètre ou bien le conserver en attribut pour 
# éviter l'héritage
	
def waitTokenGuardOnNewPage(driver, old_element = None):
	""" On attend que le jeton tokenGuard soit générer par le javascript.
	Le truc c'est qu'il y en a plein la page des tokenGuard, et comme je ne 
	sais pas combien il y en a, j'en surveille un qui apparaît sur toutes 
	les pages.
	De manière générale je voudrait éviter d'avoir une condition d'attente
	différente pour chaque page de l'application."""
	# Le code suivant permet de vérifier qu'on a quitter la page de départ avant de
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
		WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.XPATH, "//form[@name='MenuForm']//input[@name='tokenGuard']")))
		print("tokenGuard trouvé!")
	except Exception as e:
		print("pas de tokenGuard...")
		print(e)
		return False

	
def cliqueLien(driver, terms, by="partial link text"):
	"""clique sur le lien contenant le libelle.
	Ce lien doit provoquer le rechargement de la page, cette fonction n'est pas 
	adaptées pour dans le cas contraire car la codition qui détermine la fin du 
	chargement ne sera pas correcte
	
	driver: le pilote du navigateur
	libelle: le texte du lien à rechercher
	by : valeur de la classe By qui indique la signification du libelle
		par défaut le libellé est considéré comme le texte du lien."""
	print("[{}][{}]".format(terms, by))
	link = driver.find_element(by, terms)
	link.click()
	waitTokenGuardOnNewPage(driver, link)
		
def cliqueMenu(driver, terms, menu="gauche"):
	""" Comme les entrées du menu sont dupliquées en haut et à gauche il n'est pas 
	possible de les rechercher avec seulement leur texte. Cette fonction permet 
	de cliquer sur une entrée du menu en utilisant par défaut le menu gauche.
	FIXME: implémenter le menu haut."""
	link = driver.find_element(By.XPATH, "//table[@class='liensMenuGauche']//a[normalize-space()='{}']".format(terms))
	link.click()

	#Accès par le menu haut (menu principal)
#	driver.find_element(By.XPATH, "//div[@id='manuprincipal']//a[normalize-space()='{}']".format(terms)).click()
	waitTokenGuardOnNewPage(driver, link)

	
def selectDansListe(driver, listId, value):
	"""sélectionne la valeur value dans la liste d'id idList"""
	Select(driver.find_element_by_id(listId)).select_by_visible_text(value)
	
