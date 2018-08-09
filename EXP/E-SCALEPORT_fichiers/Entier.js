/**********************************************************************************************************************************************

	Nom 			: Entier.js
	Description		: Objet permettant la gestion des entiers dans les champs de saisie
	Version			: 0.1
	Auteur			: ELG

***********************************************************************************************************************************************/

/**
 *	Contructeur
 */
 
function Entier()
{
	// Méthodes	publiques	
	this.onBlur            	= Entier_onBlur;
	this.onKeypress        	= Entier_onKeypress;
	this.onFocus           	= Entier_onFocus;
	
	// Méthode privés
	this.ctrTypage   		= Entier_ctrTypage;
	this.ctrValidite 		= Entier_ctrValidite;
}

// --------------------- Méthodes Publiques -------------------------------------


/**
 * Entier_onFocus : fonction de gestion d'entrée dans le champ
 *
 * entrée 	: 	event : evenement JavaScript
 * sortie 	: 	néant
 */
 
function Entier_onFocus(event, min, max, minLength)
{
	var element = getElement(event);	
				
	if(typeof element.init == "undefined" || element.init != "true")
	{
		element.init		= "true";
		element.min			= min;
		element.max			= max;
		element.minLength	= minLength;	
		element.iErreur		= 0;	
		
		// Si une longeur est indiquée
		if(element.longueur != null)
		{
			element.maxLength	= element.longueur;
		}	
		
		// Sauvegarde du maxLength par defaut
		element.maxLengthDefaut = element.maxLength;	
	}
	
	element.select();
	element.hasFocus = true;
	event.returnValue = false;		
}

/**
 * Entier_onKeypress : fonction de controle de la validité de la touche frappée
 *
 * entrée 	: 	event : evenement JavaScript
 *            joker : caractère joker à accepter
 * sortie 	: 	néant
 */
 
function Entier_onKeypress(event, joker)
{
	var element = getElement(event);	
	var keyCode = getKeyCode(event);
	var ctrlKey	= getCtrlKey(event);	
	var caract	= String.fromCharCode(keyCode);	
	var taille	= element.value.length;
	var erreur	= false;
	var valeur	= null;
	var max		= null;

	if (keyCode != "13") {
		
		if(taille == 0 && caract == "-") {
			element.maxLength = element.maxLengthDefaut + 1;
		} else 	{
			value = element.value;
			
			if(value != null && value.charAt(0) != "-")
				element.maxLength = element.maxLengthDefaut;
		}
		
		if(element.longueur == null)
			max = element.maxLengthDefaut;
		else
			max = element.longueur;
		
		if (joker != null && joker != '') {
	 		var regExp1 = new RegExp("\-|[0-9\\"+joker+"]", "g");
		 	var regExp2	= new RegExp("[0-9\\"+joker+"]", "g");	
		 	var regExp3 = new RegExp("(\-?)([0-9\\"+joker+"]{0," + max + "})$", "g");
		} else {
	 		var regExp1 = new RegExp("\-|[0-9]", "g");
		 	var regExp2	= new RegExp("[0-9]", "g");	
		 	var regExp3 = new RegExp("(\-?)([0-9]{0," + max + "})$", "g");
		}
		
		if(taille == 0 ) {
			if(!regExp1.test(caract)) {
				erreur = true;			
			}
		} else {	
			if(!regExp2.test(caract)) {
				erreur = true;	
			}
				
			if(!regExp3.test(element.value)) {
				erreur = true;	
			}
		}	
		
		element.validerEntree = null;
		
		if(erreur && keyCode != 0 && keyCode != 8 && !ctrlKey) {
			event.returnValue = false;
			return false;
		}	
		
	} else {
		element.validerEntree = true;
		event.cancelBubble = true;
		element.blur();
	}
}

/**
 * Entier_onBlur : fonction de gestion de la sortie du champ
 *
 * entrée 	: 	event : evenement JavaScript
 *            saisieRapide : ??
 *            joker : caractère joker à accepter 
 * sortie 	: 	néant
 */

function Entier_onBlur(event, saisieRapide, joker)
{
	var element = getElement(event);
	var taille	= element.value.length;
	var iErreur = 0;
	
	if (taille == 0) {
		element.maxLength = element.maxLengthDefaut;
	}
	
	if (element.value.length != 0) {
		iErreur = this.ctrTypage(element, joker);
		
		if (iErreur == 0) {
			iErreur = this.ctrValidite(element);
		}
	}

	if ( iErreur == 1 ) {
		entierErreur = "La valeur doit être comprise entre " + element.min + " et " + element.max;
	}
	
	if ( iErreur == 2 ) {
		entierErreur = "La valeur doit être supérieure à " + element.min ;
	}
	
	if ( iErreur == 3 )	{
		entierErreur = "La valeur doit être inférieure à " + element.max ;
	}
	
	if ( iErreur == 10 ) {
		entierErreur = "Vous devez saisir un entier de " + element.longueur + " caractères" ;
	}
	
	if ( iErreur == 11 ) {
		entierErreur = "Vous devez saisir un entier de " + element.maxLengthDefaut + " caractères maximum" ;
	}

	if ( iErreur == 12 ) {
		entierErreur = "Vous devez saisir un entier de " + element.minLength + " caractères minimum" ;
	}

	element.iErreur = iErreur;

	if (iErreur > 0) {
		element.hasFocus = true;			
		gestionErreur(element, entierErreur);
		element.select();
		event.returnValue = false;		
		return false;
	}
	
	event.cancelBubble = true;
	
	// Suppression de la validation entrée si il y a une erreur
	if(iErreur > 0) {
		element.validerEntree = null;
	} else {
		window.top.entreeOK = "true";
	}
	
	gestionOnBlurSaisieRapide(event, saisieRapide, iErreur);
	
	element.hasFocus = (iErreur != 0);
	
	return (iErreur == 0);
}

// --------------------- Méthodes Privées -------------------------------------

/**
 * Entier_ctrTypage : fonction de contrôle de la validité du typage en sortie du champ
 *
 * entrée 	: 	element : element html
 *            joker : caractère joker à accepter 
 * sortie 	: 	le code erreur
 */
 
function Entier_ctrTypage(element, joker)
{
	var regExp     	= null;
	var max			= null;
	var value		= element.value;
	var iErreur		= 0;
		
	if( element.longueur == null)
	{
		max = element.maxLengthDefaut;
		
		if (joker != null && joker != '') {
			regExp = new RegExp( "^\-?[0-9\\"+joker+"]{1," + max + "}$","g" );
		} else {
 		regExp 	= new RegExp( "^\-?[0-9]{1," + max + "}$","g" );
		}
		
		if (!regExp.test(value))
			iErreur = 11;	
	}	
	else
	{
		max = element.longueur;	
		
		if (joker != null && joker != '') {
			regExp = new RegExp( "^\-?[0-9\\"+joker+"]{" + max + "}$","g" );
		} else {
 		regExp	= new RegExp( "^\-?[0-9]{" + max + "}$","g" );	
		}
		
		if (!regExp.test(value))
			iErreur = 10;		
	}

	return iErreur ;
}

/**
 * Entier_ctrValidite : fonction de contrôle de la validité en sortie du champ
 *
 * entrée 	: 	element : element html
 * sortie 	: 	le code erreur
 */
 
function Entier_ctrValidite(element)
{
	var iEntier = parseInt(element.value, 10);
	
	var iCopieBorneMin 	= null;
	var iCopieBorneMax 	= null;
	var iErreur			= 0;

	if(element.min != null && element.min != "")
	{
		iCopieBorneMin = parseInt(element.min, 10);
				
		if(element.max != null && element.max != "")
		{
			iCopieBorneMax = parseInt(element.max, 10);
					
			if(!((iEntier >= iCopieBorneMin) && (iEntier <= iCopieBorneMax)))
			{
				iErreur = 1;
			}
		}
		else
		{		
			if(iEntier < iCopieBorneMin)
			{
				iErreur = 2;		
			}
		}	
		
	}
	else
	{
		if(element.max != null && element.max != "")
		{
			iCopieBorneMax = parseInt( element.max, 10);

			if (iEntier > iCopieBorneMax)
			{
				iErreur = 3;		
			}				
		}		
	}

	if(element.minLength != null && element.minLength != "")
	{
		iLongueur = element.value.length;

		if(iLongueur < element.minLength) {
			iErreur = 12;
		}
	}

	return iErreur;
}