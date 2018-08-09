/**********************************************************************************************************************************************

	Nom 			: Alphanumerique.js
	Description		: Objet permettant la gestion d'un contenu alphanum�rique dans les champs de saisie
	Version			: 0.1
	Auteur			: EFO

***********************************************************************************************************************************************/

/**
 *	Contructeur
 */
 
function Alphanumerique()
{
	// M�thodes	publiques	
	this.onBlur            	= Alphanumerique_onBlur;
	this.onKeypress        	= Alphanumerique_onKeypress;
	this.onFocus           	= Alphanumerique_onFocus;
	this.onPaste 			= Alphanumerique_onPaste;
	
	// M�thode priv�s
	this.ctrTypage  		= Alphanumerique_ctrTypage;	
	this.ctrValidite 		= Alphanumerique_ctrValidite;
	
}
 
// --------------------- M�thodes Publiques -------------------------------------


/**
 * Alphanumerique_onFocus : fonction de gestion d'entr�e dans le champ
 *
 * entr�e 	: 	event : evenement JavaScript
 * sortie 	: 	n�ant
 */
 
function Alphanumerique_onFocus(event) 
{
	var element = getElement(event) ;
		
	if(element.init != "true")
	{
		element.initialiser		= "true" 
		
		// Si une longeur est indiqu�e
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
 * Alphanumerique_onKeypress : fonction de controle de la validit� de la touche frapp�e
 *
 * entr�e 	: 	event : evenement JavaScript
 *            joker : caract�re joker � accepter  
 * sortie 	: 	n�ant
 */
 
function Alphanumerique_onKeypress(event, joker) 
{
	var element	= getElement(event);
	var keyCode = event.keyCode;	
	var regExp;
	var caract	 = String.fromCharCode(keyCode);
	
	if(keyCode != "13") {
	
		if (joker != null && joker != '') {
			regExp = new RegExp("[a-zA-Z0-9\\"+joker+"]");
		} else {
			regExp = new RegExp("[a-zA-Z0-9]");
		}
		
		if (element.value.length >= element.maxlength) {
	 	event.returnValue = false;
		} else {
			event.returnValue = regExp.test(caract);
		}
		
		element.validerEntree = null;
	
	} else {
		element.validerEntree = true;
		element.blur();
		event.cancelBubble = true;
	}
}

/**
 * Alphanumerique_onBlur : fonction de gestion de la sortie du champ
 *
 * entr�e 	: 	event : evenement JavaScript
 *            saisieRapide : ???
 *            joker : caract�re joker � accepter   
 * sortie 	: 	n�ant
 */
 
function Alphanumerique_onBlur(event, saisieRapide, joker)
{
	var element = getElement(event);
	var taille	= element.value.length;
	var iErreur = 0 ;
	
	if ( element.value.length != 0 )
	{
		iErreur = this.ctrTypage( element, joker ) ;
		
		if ( iErreur == 0 )
		{
 			iErreur = this.ctrValidite( element ) ;			
		}
	}

	if ( iErreur == 1 )
	{
		alphanumeriqueErreur = "Vous devez saisir au moins " + element.minLength + " caract�res" ;
	}
	
	if ( iErreur == 10 )
	{
		alphanumeriqueErreur = "Vous devez saisir une cha�ne alphanum�rique de " + element.longueur + " caract�res" ;
	}
	
	if ( iErreur == 11 )
	{
		alphanumeriqueErreur = "Vous devez saisir un cha�ne alphanum�rique de " + element.maxLengthDefaut + " caract�res maximum" ;
	}

	if ( iErreur == 12 )
	{
		alphanumeriqueErreur = "Vous devez saisir un cha�ne alphanum�rique de " + element.minLength + " caract�res minimum" ;
	}
		
	if ( iErreur > 0 )
	{
		event.returnValue = false ;
		gestionErreur(element, alphanumeriqueErreur);
		element.select();
	} else {
		window.top.entreeOK = "true";
	}
	
	event.cancelBubble = true ;
	
	// Suppression de la validation entr�e si il y a une erreur
	if(iErreur > 0) {
		element.validerEntree = null;
	} else {
		window.top.entreeOK = "true";
	}
	
	gestionOnBlurSaisieRapide(event, saisieRapide, iErreur);
	
	return ( iErreur == 0 ) ;
}

/**
 * Alphanumerique_onPaste : fonction de gestion du coller
 *
 * entr�e  :  event : evenement JavaScript
 * sortie  :  n�ant
 */
function Alphanumerique_onPaste(event) {

 	var element	= getElement(event);

  	event.returnValue = false;
  	
	 if (element.value.length < element.maxlength) {
	
		var txt    = window.clipboardData.getData("Text");
		var taille = Math.min(element.maxlength - element.value.length, txt.length);
		
		element.value = element.value + txt.substr(0, taille);
	}
}

// --------------------- M�thodes Priv�es -------------------------------------

/**
 * Alphanumerique_ctrTypage : fonction de contr�le de la validit� du typage en sortie du champ
 *
 * entr�e 	: 	element : element html
 *            joker : caract�re joker � accepter  
 * sortie 	: 	le code erreur
 */
 
function Alphanumerique_ctrTypage(element, joker)
{
	var regExp     	= null;
	var max			= null;
	var value		= element.value;
	var iErreur		= 0;
		
	if( element.longueur == null)
	{
		max 	= element.maxLengthDefaut;
		if (joker != null && joker != '') {
 			regExp = new RegExp("^[0-9A-Za-z\\"+joker+"]{1," + max + "}$", "g");
		} else {
 			regExp = new RegExp("^[0-9A-Za-z]{1," + max + "}$", "g");
		}
		
		if (!regExp.test(value))
			iErreur = 11;	
	}	
	else
	{
		max 	= element.longueur;	
		if (joker != null && joker != '') {
 			regExp	= new RegExp("^[0-9A-Za-z\\"+joker+"]{" + max + "}$","g");	
		} else {
			regExp	= new RegExp("^[0-9A-Za-z]{" + max + "}$","g");	
		}
		
		if (!regExp.test(value))
			iErreur = 10;		
	}

	return iErreur ;
}

/**
 * Alphanumerique_ctrValidite : fonction de contr�le de la validit� en sortie du champ
 *
 * entr�e 	: 	element : element html
 * sortie 	: 	le code erreur
 */
 
function Alphanumerique_ctrValidite(element)
{
	var iLongueur 	= null;
	var iErreur		= 0;

	if(element.minLength != null && element.minLength != "")
	{
		iLongueur = element.value.length;
				
		if( iLongueur<element.minLength )
		{
			iErreur = 1;
		}
	}
	return iErreur;
}