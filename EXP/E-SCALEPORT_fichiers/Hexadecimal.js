/**********************************************************************************************************************************************

	Nom 			: Hexadecimal.js
	Description		: Objet permettant la gestion des nombres hexadécimaux dans les champs de saisie
	Version			: 0.1
	Auteur			: EFO

***********************************************************************************************************************************************/

/**
 *	Contructeur
 */
 
function Hexadecimal()
{
	// Méthodes	publiques	
	this.onBlur            	= Hexadecimal_onBlur;
	this.onKeypress        	= Hexadecimal_onKeypress;
	this.onFocus           	= Hexadecimal_onFocus;
	
	// Méthode privés
	this.ctrTypage   		= Hexadecimal_ctrTypage;
	this.ctrValidite 		= Hexadecimal_ctrValidite;
}

// --------------------- Méthodes Publiques -------------------------------------


/**
 * Hexadecimal_onFocus : fonction de gestion d'entrée dans le champ
 *
 * entrée 	: 	event : evenement JavaScript
 * sortie 	: 	néant
 */
 
function Hexadecimal_onFocus(event)
{
	var element = getElement(event) ;
		
	if(element.init != "true")
	{
		element.init = "true" 
		
		// Si une longeur est indiquée
		if(element.longueur != null)
		{
			element.maxLength	= element.longueur;
		}	
		
		// Sauvegarde du maxLength par defaut
		element.maxLengthDefaut = element.maxLength;	
	}
	
	element.select() ;
	event.returnValue = false ;
}

/**
 * Hexadecimal_onKeypress : fonction de controle de la validité de la touche frappée
 *
 * entrée 	: 	event : evenement JavaScript
 *            joker : caractère joker à accepter 
 * sortie 	: 	néant
 */
 
function Hexadecimal_onKeypress(event, joker)
{
	var element = getElement(event);	
	var keyCode = getKeyCode(event);
	var caract	= String.fromCharCode(keyCode);	
	var taille	= element.value.length;
	var erreur	= false;
	var valeur	= null;
	var max		= null;
		
	if(keyCode != "13") {
	
		element.maxLength = element.maxLengthDefaut;
		
		if(element.longueur == null)
			max = element.maxLengthDefaut;
		else
			max = element.longueur;
		
		if (joker != null && joker != '') {
 			var regExp1 = new RegExp("[0-9A-Fa-f\\"+joker+"]", "g");
	 		var regExp2 = new RegExp("^[0-9A-Fa-f\\"+joker+"]{0," + max + "}$", "g");
		} else {
			var regExp1 = new RegExp("[0-9A-Fa-f]", "g");
	 		var regExp2 = new RegExp("^[0-9A-Fa-f]{0," + max + "}$", "g");
		}
		
		if(taille == 0)
		{
			if(!regExp1.test(caract))
				erreur = true;			
		}
		else
		{	
			if(!regExp1.test(caract))
				erreur = true;	
				
			if(!regExp2.test(element.value))
				erreur = true;	
		}	
		
		element.validerEntree = null;	
		
		if(erreur && keyCode != 0 && keyCode != 8) {
			event.returnValue = false;
			return false;
		}
			
	} else {
		element.validerEntree = true;
		element.blur();
		event.cancelBubble = true;
	}
}

/**
 * Hexadecimal_onBlur : fonction de gestion de la sortie du champ
 *
 * entrée 	: 	event : evenement JavaScript
 *            saisieRapide : ???
 *            joker : caractère joker à accepter  
 * sortie 	: 	néant
 */

function Hexadecimal_onBlur(event, saisieRapide, joker)
{
	var element = getElement(event);
	var taille	= element.value.length;
	var iErreur	= 0 ;
	
	if(taille == 0)
		element.maxLength = element.maxLengthDefaut;

	if ( element.value.length != 0 )
	{
		iErreur = this.ctrTypage( element, joker ) ;
		
		if ( iErreur == 0 )
		{
			iErreur = this.ctrValidite( element ) ;			
		}
	}
	
	if ( iErreur == 10 )
	{
		hexadecimalErreur = "Vous devez saisir un nombre hexadécimal de " + element.longueur + " caractères" ;
	}
	
	if ( iErreur == 11 )
	{
		hexadecimalErreur = "Vous devez saisir un nombre hexadécimal de " + element.maxLengthDefaut + " caractères maximum" ;
	}

	if ( iErreur == 12 )
	{
		hexadecimalErreur = "Vous devez saisir un nombre hexadécimal de " + element.minLength + " caractères minimum" ;
	}

	if ( iErreur > 0 )
	{
		event.returnValue = false ;
		gestionErreur(element, hexadecimalErreur);
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
	
	return ( iErreur == 0 ) ;
}

// --------------------- Méthodes Privées -------------------------------------

/**
 * Hexadecimal_ctrTypage : fonction de contrôle de la validité du typage en sortie du champ
 *
 * entrée 	: 	element : element html
 *            joker : caractère joker à accepter  
 * sortie 	: 	le code erreur
 */
 
function Hexadecimal_ctrTypage(element, joker)
{
	var regExp     	= null;
	var max			= null;
	var value		= element.value;
	var iErreur		= 0;
		
	if( element.longueur == null)
	{
		max 	= element.maxLengthDefaut;
		if (joker != null && joker != '') {
 		regExp 	= new RegExp("^[0-9A-Fa-f\\"+joker+"]{1," + max + "}$", "g");
		} else {
			regExp 	= new RegExp("^[0-9A-Fa-f]{1," + max + "}$", "g");
		}
		
		if (!regExp.test(value))
			iErreur = 11;	
	}	
	else
	{
		max 	= element.longueur;	
		if (joker != null && joker != '') {
 		regExp 	= new RegExp("^[0-9A-Fa-f\\"+joker+"]{" + max + "}$", "g");
		} else {
			regExp 	= new RegExp("^[0-9A-Fa-f]{" + max + "}$", "g");
		}
		
		if (!regExp.test(value))
			iErreur = 10;		
	}

	return iErreur ;
}

/**
 * Hexadecimal_ctrValidite : fonction de contrôle de la validité en sortie du champ
 *
 * entrée 	: 	element : element html
 * sortie 	: 	le code erreur
 */
 
function Hexadecimal_ctrValidite(element)
{
 	var iErreur = 0;
 	
	if(element.minLength != null && element.minLength != "")
	{
		iLongueur = element.value.length;

		if( iLongueur<element.minLength )
		{
			iErreur = 12;
		}
	}

	return iErreur;
}