/**********************************************************************************************************************************************

	Nom 			: Majuscule.js
	Description		: Objet permettant la gestion de texte en majuscule dans les champs de saisie
	Version			: 0.1
	Auteur			: ELG

***********************************************************************************************************************************************/
/*
 * Formats support�s : NOM_NAVIRE, INDICATIF_APPEL, DEFAUT
 *
 * NOM_NAVIRE		: [A-Z0-9 '.-]
 * INDICATIF_APPEL	: [A-Z0-9]
 * DEFAUT			: Tous
 */

/**
 *	Contructeur
 */
 
function Majuscule()
{
	// M�thodes	publiques	
	this.onBlur            	= Majuscule_onBlur;
	this.onKeypress        	= Majuscule_onKeypress;
	this.onFocus           	= Majuscule_onFocus;
	
	// M�thode priv�s
	this.ctrValidite 		= Majuscule_ctrValidite;
	this.initialiser		= Majuscule_initialiser;
}

// --------------------- M�thodes Publiques -------------------------------------


/**
 * Majuscule_onFocus : fonction de gestion d'entr�e dans le champ
 *
 * entr�e 	: 	event : evenement JavaScript
 * sortie 	: 	n�ant
 */
 
function Majuscule_onFocus(event, format) 
{
	var element = getElement(event);
	
	if (element.init != "true") {		
		this.initialiser(element, format);
	}
	
	element.select() ;
}

/**
 * Majuscule_onKeypress : fonction de controle de la validit� de la touche frapp�e
 *
 * entr�e 	: 	event : evenement JavaScript
 *              joker : caract�re joker pour une recherche
 * sortie 	: 	n�ant
 */

function Majuscule_onKeypress(event, joker) 
{
	var element	= getElement(event);
	var keyCode = getKeyCode(event);
	var	regExp	= null;	
	
	if(keyCode != "13") {	
	
		element.validerEntree = null;	
		
		if (element.chaineRegExp != null && element.chaineRegExp != "") {

			regExp = new RegExp("[" + element.chaineRegExp + "]");
 		
 			if (!(regExp.test(String.fromCharCode(keyCode).toUpperCase())) && keyCode != 0 && keyCode != 8 && !event.ctrlKey) {
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
	 	return false;
	}
}

/**
 * Majuscule_onBlur : fonction de gestion de la sortie du champ
 *
 * entr�e 	: 	event : evenement JavaScript
 *              saisieRapide : indique si on est dans une saisie rapide
 *              joker : caract�re joker pour une recherche
 * sortie 	: 	n�ant
 */
function Majuscule_onBlur(event, saisieRapide, joker)
{
	var element = getElement(event);
	var taille	= element.value.length;
	var maj     = element.value;	
	var iErreur = 0;	
	
	if (taille != 0)
	{
		iErreur = this.ctrValidite(element);
	}

	if (iErreur == 1) {
		texteErreur = "Vous devez saisir au moins " + element.minLength + " caract�res" ;
	}
	
	if (iErreur == 2) {
		texteErreur = "Vous avez saisi des caract�res invalides. Les caract�res autoris�s sont : ";
		texteErreur += element.chaineRegExp.replace("\\", "");
	}
			
	if (iErreur > 0) {
		event.returnValue = false ;
		gestionErreur(element, texteErreur);
		element.select() ;
	}
	
	var sansAccent = no_accent(maj);
	var sansEspace = trim(sansAccent);
	element.value = sansEspace.toUpperCase();
	
	event.cancelBubble = true;
	
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
 * Majuscule_ctrValidite : fonction de contr�le de la validit� en sortie du champ
 *
 * entr�e 	: 	element : element html
 *              joker : caract�re joker pour une recherche
 * sortie 	: 	le code erreur
 */
 
function Majuscule_ctrValidite(element, joker)
{
	var iLongueur = null;
	
	element.iErreur = 0;

	if (element.minLength != null && element.minLength != "")
	{
		iLongueur = element.value.length;
				
		if (iLongueur < element.minLength) {
			element.iErreur = 1;
		}
	}
	
	if (element.chaineRegExp != null && element.chaineRegExp != "") {
		if (joker != null && joker != "") {
			regExp = new RegExp("^[" + element.chaineRegExp + "\\" + joker + "]*$");
		} else {
			regExp = new RegExp("^[" + element.chaineRegExp + "]*$");
		}
 	
 		if (!(regExp.test(element.value.toUpperCase()))) {
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
 
function Majuscule_initialiser(element, format)
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
			element.chaineRegExp = "A-Z0-9 '.\\-";
		} else if (element.format == "INDICATIF_APPEL") { 
			element.chaineRegExp = "A-Z0-9";
		} else if (element.format == "DEFAUT") { 
			element.chaineRegExp = "";
		}
		
	} catch (exception) {
	}
}
