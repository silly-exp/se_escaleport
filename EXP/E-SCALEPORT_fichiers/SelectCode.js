
/**********************************************************************************************************************************************

	Nom 			: SelectCode.js
	Description		: Objet permettant la gestion des saisies de code
	Version			: 0.1
	Auteur			: JHO

***********************************************************************************************************************************************/


/**
 *	Contructeur
 */

function SelectCode() {
	
	this.timeout = null;

	this.onFocus						= SelectCode_onFocus;
	this.onKeypress						= SelectCode_onKeypress;
	this.onKeyup						= SelectCode_onKeyup;
	this.onBlur							= SelectCode_onBlur;
	this.init							= SelectCode_init;
	this.gererAffichageListeChoix		= SelectCode_gererAffichageListeChoix;
	this.addChoix						= SelectCode_addChoix;
	this.choisirCode					= SelectCode_choisirCode;
	this.fermerListeChoix				= SelectCode_fermerListeChoix;
	this.verifierInputSelectionne		= SelectCode_verifierInputSelectionne
	this.recupValeurParam				= SelectCode_recupValeurParam
}


/**
 * SelectCode_onFocus : fonction de gestion d'entrée dans le champ
 *
 * entrée 	: 	event : evenement JavaScript
 * sortie 	: 	néant
 */
 
function SelectCode_onFocus(event) {
	var element = getElement(event);
	element.select();
	event.returnValue 	= false;
}

/**
 * SelectCode_onKeypress : fonction de controle de la validité de la touche frappée
 *
 * entrée 	: 	event : evenement JavaScript
 * sortie 	: 	néant
 */

function SelectCode_onKeypress(event) {
	var keyCode = getKeyCode(event);
	var element	= getElement(event);
	
	if (keyCode != "13") {		
		event.returnValue = true;
		
	} else {
		element.validerEntree = true;
		element.blur();
		
		if (event.stopPropagation) {
			  event.stopPropagation();
		}
		event.cancelBubble = true;
		return false;
	}	
}

/*************************************************************************
Méthode : SelectCode_onKeyup
Description : remplit un select de locode
*************************************************************************/
function SelectCode_onKeyup(event, pCollection, pNbItems, pNbCar, pRecherche, pTypeRecherche, pAffichage, pChamp, pParam1, pParam2, pParam3, pParam4, pParam5) {
    try {
    	var keyCode = getKeyCode(event);
    	var element = getElement(event);
    	
    	var champHidden = pChamp;
    	var champInput = pChamp + '_input';
    	var divCachee = pChamp + '_div';
    	if (keyCode != "13") {
    		var fleches = keyCode >= 37 && keyCode <= 40;
	    	var shftCtrlAlt = keyCode >= 16 && keyCode <= 18;
	    	var tab = keyCode == 9;
    		var caractereSpecial = event.ctrlKey || fleches || shftCtrlAlt || tab;
	    	if (!caractereSpecial) {
		    	var value = document.getElementById(champInput).value;
		    	document.getElementById(champHidden).value = "";
		    	if (value.length >= pNbCar) {
		    		var obj = this;
		    		pParam1 = this.recupValeurParam(pParam1);
		    		pParam2 = this.recupValeurParam(pParam2);
		    		pParam3 = this.recupValeurParam(pParam3);
		    		pParam4 = this.recupValeurParam(pParam4);
		    		pParam5 = this.recupValeurParam(pParam5);
					DwrSIPort.rechercherSelectCodeTag(pCollection, pNbItems, value.toUpperCase(), pRecherche, pTypeRecherche, [pParam1, pParam2, pParam3, pParam4, pParam5],
						function gererRetourSelectCodeTag(pListe) {
						    try {
						    	if (pListe == null) {
						    		obj.fermerListeChoix(champInput, divCachee);
						    	} else {
						    		obj.gererAffichageListeChoix(pListe, champHidden, champInput, divCachee, pAffichage);	 	
						    	}
						    } catch (exception) {
								alert("Exception dans la fonction gererRetourSelectCodeTag : " + exception.message);	
							}
						}  
					);
				} else {
					document.getElementById(divCachee).style.visibility = "hidden";
					this.fermerListeChoix(champInput, divCachee);
				}
	    	}	
	    	
    	}
    	
    	event.returnValue = true;
    	
    	if (event.stopPropagation) {
    		  event.stopPropagation();
    		}
    	event.cancelBubble = true;
    	return true;
	} catch (exception) {
		alert("Exception dans la fonction SelectCode_onKeyup : " + exception.message);	
	}
}

/*************************************************************************
Méthode : SelectCode_init
Description : initialisation d'un champ
*************************************************************************/
function SelectCode_init(pChamp, pValue, pLibelle) {
    try {
    	var champHidden = pChamp;
    	var champInput = pChamp + '_input';
    	document.getElementById(champHidden).value = pValue;
		document.getElementById(champInput).value = pLibelle;
	} catch (exception) {
		alert("Exception dans la fonction SelectCode_init : " + exception.message);	
	}
}

/*************************************************************************
Méthode : SelectCode_gererAffichageListeChoix
Description : remplit un select à partir d'une liste
*************************************************************************/
function SelectCode_gererAffichageListeChoix(pListe, pChampHidden, pChampInput, pDivCachee, pAffichage) {
    try {
      	var i = 0;
      	var champ = document.getElementById(pDivCachee);
      	var liste = "";
      	if (pListe.length > 0) {
      		champ.style.visibility = "visible";
      	}
      	
      	if (pAffichage != "") {
	      	for (i = 0; i < pListe.length; i++) {
	      		if (pAffichage != null) {
	      			var affichages = pAffichage.split('+');
	      			var valAAfficher = '';
	      			for (var j = 0; j < affichages.length; j++) {
	      				valAAfficher += ' - ' + pListe[i][affichages[j]];
	      			}
	      			valAAfficher = valAAfficher.substring(3, valAAfficher.length);
	      			liste += this.addChoix(pChampHidden, pChampInput, pDivCachee, pListe[i]['idc'], valAAfficher);
	      		}
	      	}	 
	      	champ.innerHTML = liste;
      	}

      	if (pListe.length > 0 && estIE5plus()) {
      		putFrame(pDivCachee);
      	}
	} catch (exception) {
		alert("Exception dans la fonction SelectCode_gererAffichageListeChoix : " + exception.message);	
	}
}


/*************************************************************************
Méthode : SelectCode_addChoix
Description : ajoute une option à un champ
*************************************************************************/
function SelectCode_addChoix(pChampHidden, pChampInput, pDivCachee, pId, pText) {
	return "<div><a href=\"#\" id=\""+pId+"_text\" onmousedown=\"return window.top.code.choisirCode('event', '"+pChampHidden+"', '"+pChampInput+"', '"+pDivCachee+"', '"+pId+"');\">" + pText + "</a></div>";
}

/*************************************************************************
Méthode : SelectCode_choisirCode
Description : ajoute une option à un champ
*************************************************************************/
function SelectCode_choisirCode(pEvent, pChampHidden, pChampInput, pDivCachee, pId) {
	 var value = document.getElementById(pId + "_text").firstChild.nodeValue;
	 document.getElementById(pChampInput).value = value;
	 document.getElementById(pDivCachee).style.visibility = "hidden";
	 document.getElementById(pChampHidden).value = pId;
	 setFocus(pChampInput);
	 document.getElementById(pChampInput).select();
	 if (pEvent.originalTarget===pEvent.explicitOriginalTarget) {
		 if (estIE5plus()) {
			 removeFrame();
			 document.getElementById(pChampInput).fireEvent('onchange');
			 document.getElementById(pChampHidden).fireEvent('onchange');
		 } else {
			 var event = document.createEvent("HTMLEvents");
			 event.initEvent("change",true,false); //event.initEvent(type, bubbles, cancelable) 
			 document.getElementById(pChampInput).dispatchEvent(event);
			 document.getElementById(pChampHidden).dispatchEvent(event);
		 }
	 }
}

/*************************************************************************
Méthode : addChampSelectcodeTag
Description : ajoute une option à un champ
*************************************************************************/
function SelectCode_fermerListeChoix(pChampInput, pDivCachee) {
	if (this.timeout != null) {
		clearTimeout(this.timeout);
		this.timeout = null;
	}
	document.getElementById(pDivCachee).style.visibility = "hidden";
	document.getElementById(pDivCachee).innerHTML = "";
	if (estIE5plus()) {
		removeFrame();
	}
}

/*************************************************************************
Méthode : SelectCode_onBlur
Description : vérifie si le code est valide
     
IN : id du champ
OUT : la valeur dans le champ texte
*************************************************************************/
function SelectCode_onBlur(event, pChamp) {
	erreurDetectee = true;
	event.stopPropagation();
	var champHidden = pChamp;
	var champInput = pChamp + '_input';
	var divCachee = pChamp + '_div';
	
	var estChoisirCode = true;
	if (estIE5plus() && !document.getElementById("theFrame")) {
		estChoisirCode = false;
	}
	
	if (estChoisirCode && document.getElementById(divCachee).childNodes.length == 1) {
		var firstChildDivCachee = document.getElementById(divCachee).firstChild;
		if (firstChildDivCachee != null) {
			var id = firstChildDivCachee.firstChild.id;
			var ids = id.split("_text");
			window.top.code.choisirCode(event, champHidden, champInput, divCachee, ids[0]);
		}	
	}
	var timeoutValeur = "window.top.code.verifierInputSelectionne('" + champInput + "','" + champHidden + "','" + divCachee + "');";
	this.timeout = setTimeout(timeoutValeur, 150);

	return true;
}

function SelectCode_verifierInputSelectionne(pChampInput, pChampHidden, pDivCachee) {
	
	var element = document.getElementById(pChampInput);
	var champHidden = document.getElementById(pChampHidden).value;
	var valueText = element.value;
	var divStyle = document.getElementById(pDivCachee).style.visibility;
	var saisieErronee = valueText != "" && champHidden == "";
	if (saisieErronee) {
		gestionErreur(element, 'Vous devez saisir un code ou un libellé valide');
		element.select();
	} else {
		finErreur(element);
	}
	if (!saisieErronee) {
		finErreur(element);
	}
	this.fermerListeChoix(pChampInput, pDivCachee);
	erreurDetectee = false;
	return !saisieErronee;
}

function SelectCode_recupValeurParam(pNomChamp) {
	if (typeof pNomChamp == 'undefined') {
		return pNomChamp;
	} else {
		var valeur = null;
		var elts = document.forms[3].elements[pNomChamp];
		if (typeof elts.length != 'undefined' && elts.nodeName != 'SELECT') {
			for (var i = 0; i < elts.length && valeur == null; i++) {
				if (elts[i].checked) {
					valeur = elts[i].value;
				}
			}
		} else {
			valeur = elts.value;
		}
		return valeur;
	}
}

//Initialisation de l'objet
window.top.code = new SelectCode();