Organisation du code
====================
Pour que le code reste maintenable et que les scénarios soient écrits rapidement il faut se préparer des briques de base efficaces.

LoginAs(user) permet de se (re)connecter

On voudrait avoir des scénarios du type:
En tant que <user>
Quand je fait <action> (enchaînement de scénarios plus petits)
Alors je dois avoir <résultat>

Mais c'est un peu compliqué et probablement une perte de temps de décrire tout de suite des scénarios de haut niveau car rien ne fonctionnera tant qu'on aura pas fait les scénarios de détail comme remplir un formulaire etc.

Je confirme donc mes notes, il faut dabord résoudre le problème de certificat https et se faire une bibliothèque efficace de remplir n'importe quel formulaire et récupérer des informations dans la page. Bref il faut savoir bien se servir de Sélénium avant de concevoir du cathédrale.