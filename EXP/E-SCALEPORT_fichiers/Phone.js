/**********************************************************************************************************************************************

	Nom 			: Phone.js
	Description		: Objet permettant la gestion adresses mail dans les 
					  champs de saisie
	Version			: 0.1
	Auteur			: YCH

***********************************************************************************************************************************************/

/**
 *	Contructeur
 */
 
function Phone()
{
	// M�thodes	publiques	
	this.onBlur            	= Phone_onBlur;
	this.onKeypress        	= Phone_onKeypress;
	this.onFocus           	= Phone_onFocus;
	
	// M�thode priv�s
	this.ctrTypage   		= Phone_ctrTypage;
	
}

// --------------------- M�thodes Publiques -------------------------------------

/**
 * Phone_onFocus : fonction de gestion d'entr�e dans le champ
 *
 * entr�e 	: 	event : evenement JavaScript
 * sortie 	: 	n�ant
 */
 
function Phone_onFocus(event)
{
	var element = getElement(event) ;
	element.select() ;
	event.returnValue = false ;
}

/**
 * Phone_onKeypress : fonction de controle de la validit� de la touche frapp�e
 *
 * entr�e 	: 	event : evenement JavaScript
 * sortie 	: 	n�ant
 */
 
function Phone_onKeypress(event)
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
 * Phone_onBlur : fonction de gestion de la sortie du champ
 *
 * entr�e 	: 	event : evenement JavaScript
 * sortie 	: 	n�ant
 */
 
function Phone_onBlur(event, saisieRapide)
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
		gestionErreur(element, "Vous devez saisir un num�ro de t�l�phone valide (ex : +33141234567)") ;		
		element.select() ;	
	}
	
	event.cancelBubble = true ;
	
	// Suppression de la validation entr�e si il y a une erreur
	if(iErreur > 0) {
		element.validerEntree = null;
	} else {
		window.top.entreeOK = "true";
	}
	
	gestionOnBlurSaisieRapide(event, saisieRapide, iErreur);

	return (iErreur == 0);
}

// --------------------- M�thodes Priv�es -------------------------------------



/**
 * Phone_ctrTypage : fonction de contr�le de la validit� du typage en sortie du champ
 *
 * entr�e 	: 	element : element html
 * sortie 	: 	le code erreur
 */

function Phone_ctrTypage( element )
{	
	var result = 0;
	if (element.value.search(/^\+[0-9]{6,20}$/) == -1) {		
		result = 1;
	}
	return result;	
}