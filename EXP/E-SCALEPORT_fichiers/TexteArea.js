/**********************************************************************************************************************************************

	Nom 			: Texte.js
	Description		: Objet permettant la gestion du texte dans les champs de saisie
	Version			: 0.1
	Auteur			: ELG

***********************************************************************************************************************************************/

/**
 *	Contructeur
 */
 
function TexteArea()
{
	// Méthodes	publiques	
	this.onBlur            	= TexteArea_onBlur;
	this.onKeypress        	= TexteArea_onKeypress;
	this.onFocus           	= TexteArea_onFocus;
	this.onPaste 			= TexteArea_onPaste;
}
 
// --------------------- Méthodes Publiques -------------------------------------


/**
 * TexteArea_onFocus : fonction de gestion d'entrée dans le champ
 *
 * entrée 	: 	event : evenement JavaScript
 * sortie 	: 	néant
 */
 
function TexteArea_onFocus(event, maxlength) 
{
	var element	= getElement(event);
	
	element.maxlength = maxlength;
	
	element.select();
}

/**
 * TexteArea_onKeypress : fonction de controle de la validité de la touche frappée
 *
 * entrée 	: 	event : evenement JavaScript
 * sortie 	: 	néant
 */
 
function TexteArea_onKeypress(event) 
{
	var element	= getElement(event);
	var keyCode = getKeyCode(event);	
	var texteSelectionne = "";
	
	if (estMSIE()) {
		texteSelectionne = document.selection.createRange().text;
	} else {
		texteSelectionne = window.getSelection().toString();
	}
	
	if (keyCode == 0 || keyCode == 8) {
		return true;
	}
	
	if (element.maxlength != "undefined") {
		if (element.value.length >= element.maxlength) {
			 // si du texte est sélectionné, on a le droit de le remplacer
			 if (texteSelectionne != null && texteSelectionne != '') {
			 	event.returnValue = true;
			 } else {
	  			event.returnValue = false;
	  			return false;
			 }
		} else {
			return true;
		}
	}	
}

/**
 * TexteArea_onBlur : fonction de gestion de la sortie du champ
 *
 * entrée 	: 	event : evenement JavaScript
 * sortie 	: 	néant
 */
 
function TexteArea_onBlur(event, saisieRapide)
{
	var element	= getElement(event);
	
	// Pour Firefox, comme "onPaste" n'est pas géré, on coupe en sortie de champ
	if (element.maxlength != "undefined") {
		if (element.value.length > element.maxlength) {
			element.value = element.value.substr(0, element.maxlength);
		}
	}
	
	event.cancelBubble = true;
	
	if(element.iErreur == 0 && saisieRapide) {
		validerRecherche();
	}
}

/**
 * TexteArea_onPaste : fonction de gestion du coller
 *
 * entrée  :  event : evenement JavaScript
 * sortie  :  néant
 */
function TexteArea_onPaste(event) {

	var element	= getElement(event);
	var texteSelectionne = document.selection.createRange().text;

	if (element.maxlength != undefined) {	
		event.returnValue = false;
 	
		if ((element.value.length < element.maxlength) || (texteSelectionne != null && texteSelectionne != '')) {
		
			var txt    = window.clipboardData.getData("Text");
			var taille = Math.min(element.maxlength - element.value.length + texteSelectionne.length, txt.length);
			
			window.clipboardData.setData("Text", txt.substr(0, taille));
			event.returnValue = true;
		}
	}
}