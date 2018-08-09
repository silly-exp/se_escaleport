from selenium import webdriver
from selenium.webdriver.common.by import By


""" Qd je tente de trouver le lien "Rechercher demande" dans le cas réel j'obtiens le message
 Message: Unable to locate element: //table[@class='liensMenuGauche']//a[normalize-space()='Rechercher demande']
 Pourtant si j'enregistre la page et que j'exécute le code suivant (en principe équivalent) le lien est correctement trouvé.
 => J'en déduit que:
 - le xpath est correct
 - la structure du html n'est pas en cause
 => il est possible que le dom ne soit pas encore correctement chargé malgré mon test d'attente
	- comprendre l'ordre de chargement de la page en tenant compte des exécutions de js et améliorer le test
	- ajouter une attente de 1s ou 2s python pour assurer le coup.
"""
browser = webdriver.Firefox()
browser.get('file:///D:/ESCALEPORT/SURVEILLANCE/E-SCALEPORT.htm')
e = browser.find_element(By.XPATH, "//table[@class='liensMenuGauche']//a[normalize-space()='{}']".format('Rechercher demande'))
print(e.text)
