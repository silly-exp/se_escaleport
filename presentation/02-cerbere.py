""" 
	Login cerbère
"""
from selenium import webdriver

nav = webdriver.Firefox()
nav.get('https://escaleport-test.csam.e2.rie.gouv.fr/escaleport/iAuthentification')

nameField = nav.find_element_by_name('uid')
nameField.send_keys('pnd')

pwdField = nav.find_element_by_name('pwd')
pwdField.send_keys('1')

pwdField.submit()
