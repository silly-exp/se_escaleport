/**********************************************************************************************************************************************

	Nom 			: Commun.js
	Description		: Fonctions javascript communes � tous les "taglib",
	                  avec gestion du non-respect des normes de MSIE
	Version			: 0.1
	Auteur			: EFO

***********************************************************************************************************************************************/

/*
 * Fonction qui teste si le navigateur est MSIE et donc qu'il
 * ne respecte pas les normes d'ECMA et du W3C
 *
 * Sortie : 
 *   true si c'est MSIE
 */
function estMSIE() {
	return (navigator.appName.indexOf("Microsoft") != -1);
}

/*
 * Fonction qui renvoie l'�l�ment concern� par un �v�nement.
 * Cette fonction prend en compte le type de navigateur.
 *
 * Entr�e :
 *   event : l'�v�nement javascript
 *
 * Sortie:
 *   l'�l�ment qui a d�clench� l'�v�nement
 */
function getElement(event) {
	if (estMSIE()) {
		return event.srcElement;
	} else {
		return event.target;
	}
}

/*
 * Fonction qui positionne l'�l�ment concern� par un �v�nement.
 * Cette fonction prend en compte le type de navigateur.
 *
 * Entr�e :
 *   event : l'�v�nement javascript
 *   element : l'�l�ment
 *
 * Sortie:
 */
function setElement(event, element) {
	if (estMSIE()) {
		event.srcElement = element;
	} else {
		event.target = element;
	}
}

/*
 * Fonction qui renvoie le code de la touche appuy�e.
 * Cette fonction prend en compte le type de navigateur.
 *
 * Entr�e :
 *   event : l'�v�nement javascript
 *
 * Sortie:
 *   l'�l�ment qui a d�clench� l'�v�nement
 */
function getKeyCode(event) {
	if (estMSIE()) {
		return event.keyCode;
	} else {
		return event.which;
	}
}

/*
 * Fonction qui renvoie true si la touche Ctrl est appuy�e.
 * Cette fonction prend en compte le type de navigateur.
 *
 * Entr�e :
 *   event : l'�v�nement javascript
 *
 * Sortie:
 *   true si Ctrl
 */
function getCtrlKey(event) {
	return event.ctrlKey;
}

/*
 * Fonction qui modifie la touche d'un �v�nement, si possible.
 * Cette fonction prend en compte le type de navigateur.
 *
 * Entr�es :
 *   event : l'�v�nement javascript
 *   keyCode : le nouveau code
 *
 * Sortie:
 *   N�ant
 */
function setKeyCode(event, keyCode) {
	if (estMSIE()) {
		event.keyCode = keyCode;
	} else {
		// pas de setter sous gecko
	}
}

/*
 * Fonction qui renvoie le code du bouton de souris appuy�.
 * Cette fonction prend en compte le type de navigateur.
 *
 * Entr�e :
 *   event : l'�v�nement javascript
 *
 * Sortie:
 *   le code du bouton de souris
 */
function getButton(event) {
	if (estMSIE()) {
		return event.button;
	} else {
		return event.which;
	}
}

function gestionOnBlurSaisieRapide(event, saisieRapide, iErreur) {
	if (window.top.fabrique.gestionSaisieRapide) {

		var element = getElement(event);
	
		// Valider l'entr�e si tout est bon
		if (element.validerEntree != null && element.validerEntree 
			&& (saisieRapide == null || (saisieRapide != null && !saisieRapide))
			&& iErreur == 0) {
		
			element.validerEntree = null;
			
			if (typeof validerEntree != "undefined") {
				
				validerEntree();
			 	event.returnValue = false;
				setKeyCode(event, 0);
			}
		}
		
		if(iErreur == 0 && saisieRapide) {
			validerRecherche();
		}	
	}
}

/**
 * gestionErreur : fonction de gestion des erreurs
 *
 * entr�e 	: 	element : element html
 *				msg	    : message d'erreur
 * sortie 	: 	n�ant
 */ 
function gestionErreur(element, msg) {
	window.top.entreeOK = "false";
	window.top.elementKO = element.name;
	alerter(msg);
	element.focus();
	if (!estMSIE()) {
		//var timer = setTimeout("document." + element.form.name + "." + element.name + ".focus()", 50);
		var timer = setTimeout("document.getElementById('" + element.name + "').focus()", 50);
	}
}

function finErreur(element) {
	if ((typeof window.top.entreeOK != "undefined" 
		&& window.top.entreeOK == "false" 
		&& window.top.elementKO == element.name)
		|| (typeof window.top.entreeOK == "undefined")) {
		window.top.entreeOK = "true";
	}
}

function annulerEvent(event) {
	// MSIE (non-respect des normes)
	if (estMSIE()) {
		event.returnValue = false;		
	// Normes W3C DOM
	} else {
		event.preventDefault();
	}
}

function arreterPropagationEvent(event) {
	// MSIE (non-respect des normes)
	if (estMSIE()) {
		event.cancelBubble = true;
	// Normes W3C DOM		
	} else {
		event.stopPropagation();
	}
}