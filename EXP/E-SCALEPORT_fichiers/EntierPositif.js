/**********************************************************************************************************************************************

	Nom 			: EntierPositif
	Description		: Objet permettant la gestion des entiers dans les champs de saisie
	Version			: 0.1
	Auteur			: ELG

***********************************************************************************************************************************************/

/**
 *	Contructeur
 */
 
function EntierPositif()
{
	// Méthodes	publiques	
	this.onBlur            	= EntierPositif_onBlur;
	this.onKeypress        	= EntierPositif_onKeypress;
	this.onFocus           	= EntierPositif_onFocus;
	
	// Méthode privés
	this.ctrTypage   		= EntierPositif_ctrTypage;
	this.ctrValidite 		= EntierPositif_ctrValidite;
}

// --------------------- Méthodes Publiques -------------------------------------


/**
 * EntierPositif_onFocus : fonction de gestion d'entrée dans le champ
 *
 * entrée 	: 	event : evenement JavaScript
 * sortie 	: 	néant
 */
 
function EntierPositif_onFocus(event, min, max, minLength)
{
	var element = getElement(event) ;
	//On defini des valeurs logiques par defaut pour eviter les erreurs
	min = typeof min !== 'undefined' && min !== null ? min : 0;
	max = typeof max !== 'undefined' && max !== null ? max : 65365;
	if(element.init != "true")
	{
		element.init 		= "true" 
		element.min			= min;
		element.max			= max;		
		element.minLength	= minLength;	
		
		// Si une longeur est indiquée
		if(element.longueur != null)
		{
			element.maxLength = element.longueur;
		}		
	}
	
	element.select();
	element.hasFocus = true;
	event.returnValue = false ;
}

/**
 * EntierPositif_onKeypress : fonction de controle de la validité de la touche frappée
 *
 * entrée 	: 	event : evenement JavaScript
 *            joker : caractère joker à accepter
 * sortie 	: 	néant
 */
 
function EntierPositif_onKeypress(event, joker)
{
	var element = getElement(event);	
	var keyCode = getKeyCode(event);
	var ctrlKey	= getCtrlKey(event);	
	var caract	= String.fromCharCode(keyCode);	
	var taille	= element.value.length;
	var erreur	= false;
	var valeur	= null;
	var max		= null;
		
	if(keyCode != "13") {
	
		max = element.maxLength;
		
		if (joker != null && joker != '') {
	 		var regExp1 = new RegExp("[0-9\\"+joker+"]", "g");
		 	var regExp2 = new RegExp("([0-9\\"+joker+"]{0," + max + "})$", "g");
		} else {
		 	var regExp1	= new RegExp("[0-9]", "g");	
		 	var regExp2 = new RegExp("([0-9]{0," + max + "})$", "g");
		}
		
		if (!regExp1.test(caract)) {
			erreur = true;	
		}

		if (!regExp2.test(caract)) {
			erreur = true;	
		}
				
		element.validerEntree = null;		
		
		if (erreur && keyCode != 0 && keyCode != 8 && !ctrlKey) {
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
 * EntierPositif_onBlur : fonction de gestion de la sortie du champ
 *
 * entrée 	: 	event : evenement JavaScript
 *            saisieRapide : ??
 *            joker : caractère joker à accepter 
 * sortie 	: 	néant
 */

function EntierPositif_onBlur(event, saisieRapide, joker)
{
	var element = getElement(event);
	var taille	= element.value.length;
	var iErreur = 0;

	
	if (taille > 0) {
		iErreur = this.ctrTypage(element, joker);
		
		if (iErreur == 0) {
			iErreur = this.ctrValidite(element);
		}
	}

	if (iErreur == 1) {
		entierErreur = "La valeur doit être comprise entre " + element.min + " et " + element.max;
	}
	
	if (iErreur == 2) {
		entierErreur = "La valeur doit être supérieure à " + element.min ;
	}
	
	if (iErreur == 3)	{
		entierErreur = "La valeur doit être inférieure à " + element.max ;
	}
	
	if (iErreur == 10) {
		entierErreur = "Vous devez saisir un entier de " + element.longueur + " caractères" ;
	}
	
	if (iErreur == 11) {
		entierErreur = "Vous devez saisir un entier de " + element.maxLength + " caractères maximum" ;
	}

	if (iErreur == 12) {
		entierErreur = "Vous devez saisir un entier de " + element.minLength + " caractères minimum" ;
	}

	if (iErreur > 0) {
		element.hasFocus = true;			
		gestionErreur(element, entierErreur);
		element.select();
		annulerEvent(event);
		return false;
	}

	arreterPropagationEvent(event);
	
	// Suppression de la validation entrée si il y a une erreur
	if (iErreur > 0) {
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
 * EntierPositif_ctrTypage : fonction de contrôle de la validité du typage en sortie du champ
 *
 * entrée 	: 	element : element html
 *            joker : caractère joker à accepter 
 * sortie 	: 	le code erreur
 */
 
function EntierPositif_ctrTypage(element, joker)
{
	var regExp     	= null;
	var max			= null;
	var value		= element.value;
	var iErreur		= 0;
		
	if( element.longueur == null)
	{
		max = element.maxLength;
		
		if (joker != null && joker != '') {
			regExp = new RegExp( "^[0-9\\"+joker+"]{1," + max + "}$","g" );
		} else {
 		regExp 	= new RegExp( "^[0-9]{1," + max + "}$","g" );
		}
		
		if (!regExp.test(value))
			iErreur = 11;	
	}	
	else
	{
		max = element.longueur;	
		
		if (joker != null && joker != '') {
			regExp = new RegExp( "^[0-9\\"+joker+"]{" + max + "}$","g" );
		} else {
 		regExp	= new RegExp( "^[0-9]{" + max + "}$","g" );	
		}
		
		if (!regExp.test(value))
			iErreur = 10;		
	}

	return iErreur ;
}

/**
 * EntierPositif_ctrValidite : fonction de contrôle de la validité en sortie du champ
 *
 * entrée 	: 	element : element html
 * sortie 	: 	le code erreur
 */
 
function EntierPositif_ctrValidite(element)
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