from selenium import webdriver
from selenium.webdriver.common.by import By

browser = webdriver.Firefox()
browser.get('file:///D:/ESCALEPORT/SURVEILLANCE/test.html')
e = browser.find_element(By.TAG_NAME, "h1")
print(e.text)
e = browser.find_element(By.XPATH, "//table[@class='menuGauche']//a[normalize-space()='toto titi']")
print(e.text)
e = browser.find_element(By.XPATH, "//a[contains(text(),'toto titi')]")
print(e.text)

for e in browser.find_elements(By.XPATH, "//a"):
	print(e.text)

