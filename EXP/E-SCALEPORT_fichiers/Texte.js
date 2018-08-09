/**********************************************************************************************************************************************

	Nom 			: Texte.js
	Description		: Objet permettant la gestion du texte dans les champs de saisie
	Version			: 0.1
	Auteur			: ELG

***********************************************************************************************************************************************/

/**
 *	Contructeur
 */
 
function Texte()
{
	// M�thodes	publiques	
	this.onBlur            	= Texte_onBlur;
	this.onKeypress        	= Texte_onKeypress;
	this.onFocus           	= Texte_onFocus;
	this.onPaste 			= Texte_onPaste;
	
	// M�thode priv�s
	this.ctrValidite 		= Texte_ctrValidite;	
	this.initialiser		= Texte_initialiser;
}
 
// --------------------- M�thodes Publiques -------------------------------------


/**
 * Texte_onFocus : fonction de gestion d'entr�e dans le champ
 *
 * entr�e 	: 	event : evenement JavaScript
 * sortie 	: 	n�ant
 */
 
function Texte_onFocus(event, format) 
{
	var element = getElement(event) ;
		
	if(element.init != "true")
	{
		this.initialiser(element, format);
	}
	
	element.select() ;
	event.returnValue = false ;
}

/**
 * Texte_onKeypress : fonction de controle de la validit� de la touche frapp�e
 *
 * entr�e 	: 	event : evenement JavaScript
 * sortie 	: 	n�ant
 */
 
function Texte_onKeypress(event) 
{
	var element	= getElement(event);
	var keyCode = getKeyCode(event);
	var	regExp	= null;	
	
	if(keyCode != "13") {	
	
		element.validerEntree = null;	
		
		if (element.chaineRegExp != null && element.chaineRegExp != "") {

			regExp = new RegExp("[" + element.chaineRegExp + "]");
 		
 			if (!(regExp.test(String.fromCharCode(keyCode))) && keyCode != 0 && keyCode != 8 && !event.ctrlKey) {
				event.returnValue = false;
				return false;
			}
 		}
		
		if (element.value.length >= element.maxlength) {
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
 * Texte_onBlur : fonction de gestion de la sortie du champ
 *
 * entr�e 	: 	event : evenement JavaScript
 * sortie 	: 	n�ant
 */
 
function Texte_onBlur(event, saisieRapide)
{
	var element = getElement(event);
	var taille	= element.value.length;
	var iErreur = 0;
	
	iErreur = 0 ;
	
	if (element.value.length != 0)
	{
		iErreur = this.ctrValidite(element);
	}

	if (iErreur == 1)
	{
		texteErreur = "Vous devez saisir au moins " + element.minLength + " caract�res" ;
	}
	
	if (iErreur == 2)
	{
		texteErreur = "Vous avez saisi des caract�res invalides. Les caract�res autoris�s sont : ";
		texteErreur += element.chaineRegExp.replace("\\", "");
	}
			
	if (iErreur > 0)
	{
		event.returnValue = false ;
		gestionErreur(element, texteErreur);
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

/**
 * Texte_onPaste : fonction de gestion du coller
 *
 * entr�e  :  event : evenement JavaScript
 * sortie  :  n�ant
 */
function Texte_onPaste(event) {

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
 * Texte_ctrValidite : fonction de contr�le de la validit� en sortie du champ
 *
 * entr�e 	: 	element : element html
 * sortie 	: 	le code erreur
 */
 
function Texte_ctrValidite(element)
{
	var iLongueur = null;

	if(element.minLength != null && element.minLength != "")
	{
		iLongueur = element.value.length;
				
		if( iLongueur<element.minLength )
		{
			element.iErreur = 1;
		}
	}
	
	if (element.chaineRegExp != null && element.chaineRegExp != "") {
		regExp = new RegExp("^[" + element.chaineRegExp + "]*$");
 	
 		if (!(regExp.test(element.value))) {
			element.iErreur = 2;
		}
	} 			
	
	return element.iErreur;
}

/**
 * Date2_initialiser : fonction d'initialisation de majuscule lors du premier focus
 *
 * entr�e 	: 	element : element html
 * sortie 	: 	n�ant
 */
 
function Texte_initialiser(element, format)
{
	element.init	= "true";
	element.format	= format;
	
	if (element.format != null && element.format != "") {
		element.format = element.format.toUpperCase();
	}
	
	try
	{
		if ((element.format == null) || (element.format == "")) {
			element.format = "DEFAUT";
		}
		
		if (element.format == "NOM_NAVIRE") { 
			element.chaineRegExp = "a-zA-Z0-9 '.\\-";
		} else if (element.format == "DEFAUT") { 
			element.chaineRegExp = "";
		}
		
	} catch (exception) {
	}
}
