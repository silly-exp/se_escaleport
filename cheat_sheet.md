##cliquer un Lien qui va provoquer le rechargment de la page:
Remarque la plupart des boutons d'Escaleport sont des liens.
```browser.find_element_by_id('btnChangerPort').click()```
On voudrait:
=> cliqueLien('btnChangerPort','id')
=> cliqueLien(<string>, selecteur = 'text')


##Sélectionner une valeur dans une liste:
element = self.browser.find_element_by_id("idPortLocode")
select = Select(element)
select.select_by_visible_text("Caen")

ou bien sur une ligne
Select(self.browser.find_element_by_id("idPortLocode")).select_by_visible_text("Caen")

On voudrait:
selectDansListe('idPortLocode', 'Caen')
		