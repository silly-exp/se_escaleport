Organisation du code
====================

Alors écrire des tests automatisés, déjà c'est long. Et puis il faut les modifiers à chaque évolution de l'application et en plus il est bien probable que l'outil utilisé sera obsolète dans 5 ans et si en plus le langage est plus à la mode tout ces efforts pourraient bien partir à la poubelle et je serai encore triste et déprimé.

Il faut donc que les scénarios soient simples à écrire et indépendant de l'outil (ici Selenium)
Pour pousser encore plus loin on pourrait avoir une description des scénarios indépendante du langage (ici python).
Et si en plus la conception de l'IHM de l'appli pouvait nous simplifier la vie ce serait formidable, par exemple qu'elle soit homogène sur les appli ACAÏ avec toujours des id et un bon moyen de déterminer quand la page est chargée.


On voudrait avoir des scénarios du type:
En tant que <user>
Quand je fait <action> (enchaînement de scénarios plus petits)
Alors je dois avoir <résultat>

Mais c'est un peu compliqué et probablement une perte de temps de décrire tout de suite des scénarios de haut niveau car rien ne fonctionnera tant qu'on aura pas fait les scénarios de détail comme remplir un formulaire etc.

Je confirme donc mes notes, il faut dabord se faire une bibliothèque efficace pour remplir n'importe quel formulaire et récupérer des informations dans la page. Bref il faut savoir bien se servir de Sélénium avant de concevoir du cathédrale.

-- insérer ici le diagramme --

## Règles de desgin
* Il faut qu'il n'y ai aucune dépendance à webdriver dans les scénarios pour qu'il n'y ai rien à faire lors de la migration.
* Il faut qu'il y ai un minimum de fonction dans l'api escaleport pour que l'effort de migration de l'API soit minimal.
* La règle précédente implique qu'il y aura peut-être un ou deux niveaux d'API dans le package scénario qui y seront parce que ces fonctions ne dépendrons pas de Sélénium... à tester.

## Desciption de l'API de test:

LoginAs(user) permet de se (re)connecter