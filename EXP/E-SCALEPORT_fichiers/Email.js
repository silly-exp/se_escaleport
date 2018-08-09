/**********************************************************************************************************************************************

	Nom 			: Email.js
	Description		: Objet permettant la gestion adresses mail dans les 
					  champs de saisie
	Version			: 0.1
	Auteur			: YCH

***********************************************************************************************************************************************/

/**
 *	Contructeur
 */
 
function Email()
{
	// Méthodes	publiques	
	this.onBlur            	= Email_onBlur;
	this.onKeypress        	= Email_onKeypress;
	this.onFocus           	= Email_onFocus;
	
	// Méthode privés
	this.ctrTypage   		= Email_ctrTypage;
	
}

// --------------------- Méthodes Publiques -------------------------------------

/**
 * Email_onFocus : fonction de gestion d'entrée dans le champ
 *
 * entrée 	: 	event : evenement JavaScript
 * sortie 	: 	néant
 */
 
function Email_onFocus(event)
{
	var element = getElement(event) ;
	element.select() ;
	event.returnValue = false ;
}

/**
 * Email_onKeypress : fonction de controle de la validité de la touche frappée
 *
 * entrée 	: 	event : evenement JavaScript
 * sortie 	: 	néant
 */
 
function Email_onKeypress(event)
{
	var element	= getElement(event);
	var keyCode = getKeyCode(event);
	
	if(keyCode == "13")	{
		element.validerEntree = true;
		element.blur();
		event.cancelBubble = true;
	}	
}

/**
 * Email_onBlur : fonction de gestion de la sortie du champ
 *
 * entrée 	: 	event : evenement JavaScript
 * sortie 	: 	néant
 */
 
function Email_onBlur(event, saisieRapide)
{
	var element = getElement(event) ;
	var iErreur = 0;
	
	iErreur 				= 0 ;
	element.valeurSaisie  	= element.value;
		
		
	
	if (element.value.length != 0)	{	
		iErreur = this.ctrTypage(element) ;		
	}	
	if (iErreur == 1)	{
		event.returnValue = false ;
		gestionErreur(element, "Vous devez saisir une adresse mail valide") ;		
		element.select() ;	
	}
	
	event.cancelBubble = true ;
	
	// Suppression de la validation entrée si il y a une erreur
	if(iErreur > 0) {
		element.validerEntree = null;
	} else {
		window.top.entreeOK = "true";
	}
	
	gestionOnBlurSaisieRapide(event, saisieRapide, iErreur);

	return (iErreur == 0);
}

// --------------------- Méthodes Privées -------------------------------------



/**
 * Email_ctrTypage : fonction de contrôle de la validité du typage en sortie du champ
 *
 * entrée 	: 	element : element html
 * sortie 	: 	le code erreur
 */

function Email_ctrTypage( element )
{	
	var result = 0;
	if (element.value.search(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/) == -1) {		
		result = 1;
	}
	return result;	
}