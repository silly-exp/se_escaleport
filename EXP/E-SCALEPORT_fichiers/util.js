/*******************************************************************************
 * 
 * Nom : util.js Description : Contient les m�thodes offrant diverses
 * fonctionnalit�s aux pages JSP
 * 
 ******************************************************************************/

var erreurDetectee = false;
/*******************************************************************************
 * Methode : activerChangement Description : Positionne un flag indiquant q'un
 * champ de saisie a �t� modifi�. IN : event : l'�v�nement onchange
 ******************************************************************************/

function activerChangement(event) {
	try {
		var changement = document.getElementById("changement");
		if (changement != null) {
			var element = getElement(event);

			// Si jamais l'�l�ment nous indique que rien n'a chang�, on ne
			// change rien
			if (element.changement == null || element.changement != "false") {
				changement.value = "true";
			}
		}
	} catch (exception) {
		alert(exception.message
				+ " dans la m�thode activerChangement de util.js");
	}
}

/*******************************************************************************
 * Methode : activerChangement sans param�tre Description : Positionne un flag
 * indiquant q'un champ de saisie a �t� modifi�. IN : N�ant OUT : N�ant
 ******************************************************************************/

function activerChangementSansEvent() {
	try {
		var changement = document.getElementById("changement");

		if (changement != null) {

			changement.value = "true";
		}
	} catch (exception) {
		alert(exception.message
				+ " dans la m�thode activerChangementSansEvent de util.js");
	}
}

/*******************************************************************************
 * Methode : annulerChangement Description : Annule le flag indiquant qu'un
 * champ de saisie a �t� modifi�. IN : N�ant OUT : N�ant
 ******************************************************************************/

function annulerChangement() {
	try {
		var changement = document.getElementById("changement");

		if (changement != null) {
			changement.value = "false";
		}
	} catch (exception) {
		alert(exception.message
				+ " dans la m�thode annulerChangement de util.js");
	}
}

/*******************************************************************************
 * Methode : changement Description : Indique s'il a eu un changement IN : N�ant
 * OUT : bool�en indiquant le changement
 ******************************************************************************/

function changement() {
	try {
		var retour = false;
		var changement = document.getElementById("changement");

		if (changement != null && changement.value == "true") {
			retour = true;
		}
		return retour;
	} catch (exception) {
		alert(exception.message
				+ " dans la m�thode activerChangement de util.js");
	}
}

/*******************************************************************************
 * Methode : confirmationChangement Description : demande une confirmation s'il
 * y a un changement en cours et renvoie le r�sultat de la confirmation IN :
 * N�ant OUT : bool�en indiquant le r�sultat de la confirmation
 ******************************************************************************/

function confirmationChangement() {
	try {
		var confirmation = true;

		if (changement()) {
			if (!confirmer("Vous allez perdre les modifications en cours.\nVoulez-vous vraiment effectuer cette action ?")) {
				confirmation = false;
			}
		}

		return confirmation;
	} catch (exception) {
		alert(exception.message
				+ " dans la m�thode confirmationChangement de util.js "
				+ exception.message);
	}
}

/*******************************************************************************
 * Methode : quitter Description : G�re la sortie d'une activit�. Invoque le
 * portail et lance le sablier. cette m�thode d�tecte si la page est en
 * modification et/ou si des modifications sont encours depuis le chargement de
 * la page.
 * 
 * IN : modification : le booleen indiquant l'�tat de modification de la page au
 * chargement si ce booleen n'est pas renseign�, la page est consid� comme
 * n'�tant pas en modification. OUT : N�ant
 ******************************************************************************/

// function quitter(modification)
// {
// try
// {
// // Initialisation des booleens
// var confirmationChangement = false;
// var quitter = false;
//		
// // Initialisation du booleen "modification" si il est null il est initialis�
// � false
// if(modification == null)
// modification = false;
//	
// // Test si la page necessite un enregistrement d�s le chargement
// if(modification)
// confirmationChangement = true
// else
// {
//			
// // Test si des changements sont en encours depuis le chargement
// var changement = document.getElementById("changement");
//						
// if(changement != null && changement.value == "true")
// confirmationChangement = true
// }
//		
// if(confirmationChangement)
// {
// if(confirm("Vous n'avez pas enregistr� vos modifications. Voulez-vous
// vraiment quitter ?"))
// quitter = true;
// }
// else
// {
// if(confirm("Voulez-vous vraiment quitter ?"))
// quitter = true;
// }
//		
// if(quitter)
// {
//									
// }
// }
// catch (exception) {
// alert(exception.message + " dans la m�thode quitter de la page TableauBord");
// }
// }
/*******************************************************************************
 * Methode : annuleAutoSubmit Description : Annule le submit automatique sur un
 * champs quand le champs est unique sur l'�cran : pb li� � IE.
 * 
 * IN : N�ant OUT : N�ant
 ******************************************************************************/

function annuleAutoSubmit(event) {
	var keyCode = getKeyCode(event);
	if (keyCode == 13) {
		event.returnValue = false;
		return false;
	} else {
		return true;
	}
}

/*******************************************************************************
 * Methode : setFocus Description : Methode qui permet de mettre le focus sur le
 * champ modifiable indiqu�
 * 
 * IN : l'id du champ modifiable OUT : N�ant
 ******************************************************************************/

function setFocus(input) {
	try {
		var inputFocus = document.getElementById(input);
		var retour = false;

		if (inputFocus != null && !inputFocus.readOnly) {

			try {
				inputFocus.focus();
			} catch (exception) {
				// Focus KO
				retour = false;
			}
			// focus OK
			retour = true;

			// Focus impossible
		} else {
			retour = false;
		}
		return retour;
	} catch (exception) {
		alert(exception.message + " dans la m�thode setFocus");
	}
}

/*******************************************************************************
 * Methode : getJeton Description : R�cup�re le jeton de soumission IN : N�ant
 * OUT : bool�en indiquant si le token est pris
 ******************************************************************************/

function getJeton() {
	try {
		var jeton = document.getElementById("jeton"), msg = null, retour = false;

		if (typeof jeton !== 'undefined' && jeton !== null
				&& jeton.value === 'true') {

			if (getTokenGuard() === "")
			{
				msg = "La page est en cours de chargement\n";
				msg += "Veuillez patienter";

				alerter(msg);
				retour = false;
			}
			// On v�rifie que tout est OK au niveau des champs de saisie
			else if (typeof window.top.entreeOK == "undefined"
					|| window.top.entreeOK == "true") {
				jeton.value = false;// Consommation du jeton
				retour = true;
			}
		} else {

			msg = "Une requ�te a d�j� �t� soumise\n";
			msg += "Veuillez attendre la r�ponse ou rafra�chissez l\'�cran\n";
			msg += "par l\'interm�diaire du bouton rafra�chir du navigateur (ou F5)";

			alerter(msg);
			retour = false;
		}
		return retour;
	} catch (exception) {
		alerter(msg);
	}

}

/*******************************************************************************
 * Methode : libererJeton Description : libere le jeton IN : N�ant
 ******************************************************************************/
function libererJeton() {

	var jeton = document.getElementById("jeton");
	jeton.value = "true";

}

/*******************************************************************************
 * Methode : estJetonLibre Description : indique si le jeton de soumission est
 * pris IN : N�ant OUT : bool�en indiquant si le token est pris
 ******************************************************************************/
function estJetonLibre() {
	try {
		var jeton = document.getElementById("jeton");
		var msg = null;
		var retour = false;

		if (jeton != null && jeton.value == "true") {

			// On v�rifie que tout est OK au niveau des champs de saisie
			if (typeof window.top.entreeOK == "undefined"
					|| window.top.entreeOK == "true") {

				retour = true;
			}

		} else {

			retour = false;
		}

		return retour;
	} catch (exception) {
		alert(exception.message + " dans la m�thode estJetonLibre de util.js");
	}
}

/*******************************************************************************
 * Methode : init Description : Initialisation de la page IN : N�ant OUT : N�ant
 ******************************************************************************/

function init() {
	// R�initialisation du jeton
	var jeton = document.getElementById("jeton");
	jeton.value = "true";

	// M�thode d'initialisation dans le corps des pages jsp
	if (typeof initBody == "undefined") {
		alert("M�thode initBody() inexistante");
	}
	initMenu();
	initBody();
}

/*******************************************************************************
 * Methode : estIE5plus Description : Tester si le navigateur est IE 5 ou plus
 * IN : OUT :
 ******************************************************************************/

function estIE5plus() {

	var isOpera = (navigator.userAgent.indexOf("Opera") != -1) ? true : false, isMac = (navigator.userAgent
			.indexOf("Mac") != -1), isIE = (navigator.appVersion
			.indexOf("MSIE") != -1) ? true : false, isIE5plus = (document.all
			&& !isOpera && !isMac && isIE && navigator.appVersion
			.indexOf("MSIE 4") == -1) ? true : false;

	return isIE5plus;
}

/*******************************************************************************
 * Methode : estNavigateurAuthorise Description : Test sur le navigateur �
 * "Mozilla / Firefox" en version 1.0 et au dessus. � "Internet Explorer" en
 * version 5.5 et au-dessus.
 ******************************************************************************/

function estNavigateurAuthorise() {

	var idValidBrowser = false, isFireFox = false, isValidFireFoxVersion = false, isInternetExplorer = false, isValidInternetExplorerVersion = false, isChrome = false, isValidChromeVersion = false;

	isFireFox = (navigator.userAgent.indexOf("Firefox") != -1);
	if (isFireFox) {
		isValidFireFoxVersion = (navigator.userAgent.indexOf("Firefox/0") == -1);
	}
	isInternetExplorer = (navigator.userAgent.indexOf("MSIE") != -1);
	if (isInternetExplorer) {
		isValidInternetExplorerVersion = (navigator.userAgent.indexOf("MSIE 4") == -1);
	}
	isChrome = (navigator.userAgent.indexOf("Chrome") != -1);
	if (isChrome) {
		isValidChromeVersion = (navigator.userAgent.indexOf("Chrome/0") == -1);
	}

	idValidBrowser = (isValidFireFoxVersion || isValidInternetExplorerVersion || isValidChromeVersion);
	return idValidBrowser;
}

/*******************************************************************************
 * Methode : selectionnerTous Description : (D�)S�lectionne tous les checkboxes
 * d'une liste IN : pNomCB : le nom de la checkbox servant � tout
 * (d�)s�lectionner pFormulaire : le formulaire contenant les checkboxes (par
 * exemple : document.RechercheNavireForm) pPrefixe : le pr�fixe utilis� dans le
 * nom des checkboxes (par exemple : 'nav')
 * 
 * OUT : N�ant
 ******************************************************************************/

function selectionnerTous(pNomCB, pFormulaire, pPrefixe) {
	try {
		var elements = pFormulaire.elements;
		var taillePref = pPrefixe.length;
		var cb = document.getElementById(pNomCB);

		for (i = 0; i < elements.length; i++) {
			if (elements[i].type == "checkbox"
					&& elements[i].name.substr(0, taillePref) == pPrefixe
					&& !elements[i].disabled) {

				elements[i].checked = cb.checked;
			}
		}

	} catch (exception) {
		alert("Exception dans selectionnerTous : " + exception.message);
	}
}

/*******************************************************************************
 * Methode : getSelectionnes Description : Retourne les �l�ments s�lectionn�s
 * dans une liste de checkboxes IN : pFormulaire : le formulaire contenant les
 * checkboxes (par exemple : document.RechercheNavireForm) pPrefixe : le pr�fixe
 * utilis� dans le nom des checkboxes (par exemple : 'nav') pSeparateur :
 * (optionnel) le s�parateur � placer entre chaque id (" " par d�faut)
 * 
 * OUT : cha�ne contenant les ids
 ******************************************************************************/

function getSelectionnes(pFormulaire, pPrefixe, pSeparateur) {
	var retour = null;

	try {
		var elements = pFormulaire.elements;
		var taillePref = pPrefixe.length;

		if (pSeparateur == null) {
			pSeparateur = " ";
		}

		retour = pSeparateur;

		for (i = 0; i < elements.length; i++) {
			if (elements[i].type == "checkbox" && elements[i].checked
					&& elements[i].name.substr(0, taillePref) == pPrefixe) {
				retour = retour + elements[i].name.substr(taillePref)
						+ pSeparateur;
			}
		}
	} catch (exception) {
		alert("Exception dans getSelectionnes : " + exception.message);
		retour = null;
	}

	return retour;
}

/*******************************************************************************
 * Methode : getNbSelectionnes Description : Retourne le nombre d'�l�ments
 * s�lectionn�s dans une liste de checkboxes IN : pFormulaire : le formulaire
 * contenant les checkboxes (par exemple : document.RechercheNavireForm)
 * pPrefixe : le pr�fixe utilis� dans le nom des checkboxes (par exemple :
 * 'nav')
 * 
 * OUT : nombre de checkboxes coch�es
 ******************************************************************************/

function getNbSelectionnes(pFormulaire, pPrefixe) {
	var retour = 0;

	try {
		var elements = pFormulaire.elements;
		var taillePref = pPrefixe.length;

		for (i = 0; i < elements.length; i++) {
			if (elements[i].type == "checkbox" && elements[i].checked
					&& elements[i].name.substr(0, taillePref) == pPrefixe) {
				retour++;
			}
		}
	} catch (exception) {
		alert("Exception dans getNbSelectionnes : " + exception.message);
		retour = 0;
	}

	return retour;
}

/*******************************************************************************
 * Methode : gestionToucheEntree Description : IN : OUT :
 ******************************************************************************/

function gestionToucheEntree(event) {

	var element = null;
	var form = null;
	var trouve = false;
	var elements = null;
	var i = 0;
	var index = 0;
	var debut = false;
	var arret = false;

	try {

		if (event.keyCode == 13) {

			element = event.srcElement;

			if (element.tagName != "TEXTAREA") {

				form = element.form;

				if (form != null) {
					elements = form.elements;

					if (elements != null) {

						while (i < elements.length && !trouve) {
							if (elements[i] == element) {
								trouve = true;
								index = i;
							} else {
								i++;
							}
						}

						// chercher le suivant non cach�
						trouve = false;
						i++;

						while (!trouve && !arret) {

							if (i == elements.length) {
								i = 0;
								if (!debut)
									debut = true;
								else
									arret = true;
							}

							element = elements[i];

							if (element.type == "hidden" || element.readOnly
									|| element.disabled) {
								i++;
							} else {
								trouve = true;

								// tentative de focus
								// exception possible si le champ est invisible
								try {
									element.focus();
								} catch (exception) {
									i++;
									trouve = false;
								}
							}
						}
					}
				}
			}
		}

	} catch (exception) {
		alert(exception.message
				+ " dans la m�thode gestionToucheEntree de util.js");
	}
}

/*******************************************************************************
 * M�thode : keydown Description : Filtre les touches press�s. D�sative les
 * touches backspace et alt + fl�che gauche afin d'�viter l'action "pr�c�dent"
 * 
 * IN : event l'�v�nement keydown OUT : N�ant
 ******************************************************************************/

function keydown(event) {
	var element = getElement(event);
	var keyCode = getKeyCode(event);

	// d�sactivation de backspace
	if (keyCode == 8) {

		if (element == null || (element.form == null)
				|| (element.tagName === "SELECT")
				|| (element.type === "checkbox") || (element.type === "radio")
				|| (!element.isContentEditable) || (element.isDisabled)) {
			event.preventDefault ? event.preventDefault()
					: event.returnValue = false;
		}

		// d�sactivation de alt + <- et alt + ->
	} else if (event.altLeft && (keyCode == 37 || keyCode == 39)) {
		event.preventDefault ? event.preventDefault()
				: event.returnValue = false;

		// d�sactivation de ctrl+h et ctrl+n
	} else if (event.ctrlKey && (keyCode == 72 || keyCode == 78)) {
		event.preventDefault ? event.preventDefault()
				: event.returnValue = false;

		// prise en compte de F2
	} else if (keyCode == 113) {
		if (typeof fonctionF2 != "undefined") {
			fonctionF2();
			event.preventDefault ? event.preventDefault()
					: event.returnValue = false;
			setKeyCode(0);
		}
	}
}

/*******************************************************************************
 * M�thode : keyup Description : Filtre les touches press�s.
 * 
 * IN : event l'�v�nement keyup OUT : N�ant
 ******************************************************************************/

function keyup(event) {
	try {

		if (estJetonLibre()) {
			var element = getElement(event);
			var keyCode = getKeyCode(event);

			if (keyCode === 13) {
				var id = element.id;
				var tag = element.tagName;

				if (tag != "TEXTAREA") {
					if (typeof window.top.entreeOK == "undefined"
							|| window.top.entreeOK == "true") {
						if (typeof validerEntree != "undefined") {
							if (!erreurDetectee) {
								validerEntree();
								event.preventDefault ? event.preventDefault()
										: event.returnValue = false;
								setKeyCode(event, 0);
							}
						}
					}
				}
			}

			if (typeof (erreurDetectee) != "undefined" && erreurDetectee) {
				setTimeout("erreurDetectee = false;", 100);
			}

		}
	} catch (exception) {
		alert("Exception dans la fonction keyup : " + exception.message);
	}
}

/*******************************************************************************
 * M�thode : trim Description : Supprime les espaces au d�but et � la fin d'une
 * cha�ne, et remplace les espaces multiples dans la cha�ne par des espaces
 * simples.
 * 
 * IN : la cha�ne � traiter OUT : la cha�ne transform�e
 ******************************************************************************/
function trim(value) {
	var temp = value;
	var obj = /^(\s*)([\W\w]*)(\b\s*$)/;

	// y a-t-il des espaces avant et/ou apr�s la cha�ne?
	if (obj.test(temp)) {
		// si oui on les supprime
		temp = temp.replace(obj, '$2');
	}

	// on remplace les espaces multiples par des espaces simples
	var obj = / +/g;
	temp = temp.replace(obj, " ");

	// si la cha�ne ne contient plus qu'un espace, on la vide
	if (temp == " ") {
		temp = "";
	}

	return temp;
}

/*******************************************************************************
 * Methode : trimTous Description : Applique trim tous les champs de saisie de
 * type text IN : pFormulaire : le formulaire contenant les champs (par exemple :
 * document.RechercheNavireForm)
 * 
 * OUT : N�ant
 ******************************************************************************/

function trimTous(pFormulaire) {
	try {
		var elements = pFormulaire.elements;

		if (elements != null) {

			for (i = 0; i < elements.length; i++) {
				if (elements[i].type == "text") {
					elements[i].value = trim(elements[i].value);
				}
			}
		}

	} catch (exception) {
		alert("Exception dans trimTous : " + exception.message);
	}
}

/*******************************************************************************
 * Methode : afficheSelectionne Description : Change le style d'un tr pour qu'il
 * apparaisse comme "s�lectionn�" IN : pObj : objet enfant du tr (td ou th)
 * 
 * OUT : N�ant
 ******************************************************************************/

function afficheSelectionne(pObj) {
	pObj.parentNode.className = pObj.parentNode.className
			+ 'CliquableSelectionne';
}

/*******************************************************************************
 * Methode : afficheDeselectionne Description : Change le style d'un tr pour
 * qu'il apparaisse comme "d�s�lectionn�" IN : pObj : objet enfant du tr (td ou
 * th)
 * 
 * OUT : N�ant
 ******************************************************************************/

function afficheDeselectionne(pObj) {
	pObj.parentNode.className = pObj.parentNode.className.replace(
			'CliquableSelectionne', '');
}

/*******************************************************************************
 * Methode : mouseup Description : Permet de faire dispara�tre un menu en
 * cliquant en dehors.
 * 
 * IN : event OUT : N�ant
 ******************************************************************************/

function mouseup(event) {
	var button = getButton(event);

	if (button == 1) {
		hideCurrentMenu();
	}
}

/*******************************************************************************
 * M�thode : pause Description : methode qui permet de faire une pause
 * 
 * IN : delai : nombre de milliseconde OUT :
 ******************************************************************************/

function pause(delai) {
	// la date du jour
	d = new Date();
	while (1) {
		// Date maintenant
		mill = new Date();

		// difference en millisecondes
		diff = mill - d

		if (diff > delai) {
			break;
		}
	}
}

/*******************************************************************************
 * Methode : effacerChamp Description : Effacer la valeur d'un champ
 * 
 * IN : elt l'id du champ OUT :
 ******************************************************************************/

function effacerChamp(elt) {
	try {

		if (typeof elt == 'string') {
			elt = document.getElementById(elt);
		}
		elt.value = "";

	} catch (exception) {
		alert("Exception dans effacerChamp : " + exception.message);
	}
}

/*******************************************************************************
 * M�thode : activerChamp Description : methode qui permet d'activer un champ
 * 
 * IN : champ : le champ � activer OUT :
 ******************************************************************************/

function activerChamp(champ) {
	champ.disabled = false;
	champ.className = "";
}

/*******************************************************************************
 * M�thode : desactiverChamp Description : methode qui permet de d�sactiver un
 * champ
 * 
 * IN : champ : le champ � d�sactiver OUT :
 ******************************************************************************/

function desactiverChamp(champ) {
	champ.disabled = true;
	champ.className = "champDesactive";
}

/*******************************************************************************
 * M�thode : setNonModifiable Description : methode qui permet de passer un
 * champs en lecture seule
 * 
 * IN : champ : le champ � mettre en lecture seule OUT :
 ******************************************************************************/

function setNonModifiable(champ) {
	setModifiable(champ, false);
}

/*******************************************************************************
 * M�thode : desactiverChamp Description : methode qui permet de passer un champ
 * en modification
 * 
 * IN : champ : le champ � mettre en modification OUT :
 ******************************************************************************/

function setModifiable(champ, modifiable) {
	if (typeof champ == 'string') {
		champ = document.getElementById(champ);
	}
	modifiable = (typeof modifiable == 'undefined') || modifiable;
	champ.readOnly = !modifiable;
	if (modifiable) {
		if (typeof champ.classNameBak == 'undefined') {
			if (champ.className == 'champDesactive') {
				champ.className = '';
			}
		} else {
			champ.className = champ.classNameBak;
		}
		champ.removeAttribute('disabled');
	} else {
		champ.classNameBak = champ.className;
		champ.className = "champDesactive";
		champ.setAttribute('disabled', 'disabled');
	}
}

/*******************************************************************************
 * M�thode : debug Description : affiche des infos de debug js dnas la div
 * "divDebug"
 * 
 * IN : msg : le message de debug � afficher OUT :
 ******************************************************************************/

function debug(msg) {
	try {
		var divDebug = document.getElementById('divDebug');
		divDebug.innerHTML += msg + "<br/>";
		divDebug.style.visibility = 'visible';
	} catch (exception) {
		// Rien ici, �a reste du debug...
	}
}

/*******************************************************************************
 * M�thode : afficher Description : affiche un �l�ment cach�
 * 
 * IN : element : l'�l�ment � afficher OUT :
 ******************************************************************************/

function afficher(element, garderZone) {
	if (element != undefined) {
		if (!garderZone) {
			element.style.display = "";
		} else {
			element.style.visibility = "visible";
		}
		element.removeAttribute('disabled');
	}
}

/*******************************************************************************
 * M�thode : cacher Description : cache un �l�ment affich�
 * 
 * IN : element : l'�l�ment � cacher OUT :
 ******************************************************************************/

function cacher(element, garderZone) {
	if (element != undefined) {
		if (!garderZone) {
			element.style.display = "none";
		} else {
			element.style.visibility = "hidden";
		}
		element.setAttribute('disabled', 'disabled');
	}
}

/*******************************************************************************
 * M�thode : afficherElement Description : affiche un �l�ment cach�
 * 
 * IN : nom : l'id de l'�l�ment � afficher visible : indique si on doit afficher
 * ou non (true par d�faut) garderZone : indique si l'espace doit �tre conserv�
 * (false par d�faut) traitementIE : indique si on est dans le traitement
 * it�ratif IE (false par d�faut) OUT :
 ******************************************************************************/

function afficherElement(element, visible, garderZone) {
	try {
		if (typeof element == 'string') { //Dans le cas o� element correspond � l'id de l'objet DOM 
			element = document.getElementById(element);
		}
		if (typeof visible === 'undefined' || visible) {
			afficher(element, garderZone);
		} else {
			cacher(element, garderZone);
		}

		// if (estIE5plus()) { // Pour IE, il faut forcer l'affichage des fils
		// // notamment pour les select
		// var childNodes = element.childNodes;
		// if (typeof childNodes != 'undefined') {
		// for (var i = 0; i < childNodes.length; i++) {
		// afficherElement(childNodes[i], visible, garderZone, true);
		// }
		// }
		// }
	} catch (exception) {
	} // on ne fait rien, l'�l�ment a le droit de ne pas exister
}

/*******************************************************************************
 * M�thode : afficherEtInitElement Description : modifie l'affichage ou non d'un
 * �l�ment et r�initialise sa valeur
 * 
 * IN : nom : l'id de l'�l�ment � afficher visible : indique si on doit afficher
 * ou non (true par d�faut) OUT :
 ******************************************************************************/

function afficherEtInitElement(nom, visible, garderZone) {
	effacerChamp(nom);
	afficherElement(nom, visible, garderZone);
}

/*******************************************************************************
 * M�thode : cacherElement Description : cache un �l�ment affich�
 * 
 * IN : element : l'id de l'�l�ment � cacher OUT :
 ******************************************************************************/

function cacherElement(nom, garderZone) {
	afficherElement(nom, false, garderZone);
}

/*******************************************************************************
 * M�thode : estRenseigne Description : teste si une valeur est renseign�e (non
 * nulle et pas une cha�ne vide)
 * 
 * IN : valeur : la valeur � tester OUT :
 ******************************************************************************/

function estRenseigne(valeur) {
	return (valeur != null && valeur != '');
}

/*******************************************************************************
 * M�thode : validateLength Description : teste si le message ne d�passe pas
 * maxlength (Pour chaque retour � la ligne, on compte 2 caract�res, comme pour
 * un Varchar2 sous Oracle)
 * 
 * IN : maxlength : le nombre maximal de caract�res d�sir� OUT : true si ca ne
 * d�passe pas, false sinon
 ******************************************************************************/

function validateLength(maxlength, message) {

	var cpt = 0; // Compteur de retour � la ligne
	// On va compter le nombre de caract�res \n (javascript considere cela comme
	// 1 car et oracle 2)
	var indexOcc = message.indexOf("\n", indexOcc);
	while (indexOcc != -1) {
		cpt = cpt + 1;
		indexOcc = message.indexOf("\n", indexOcc + 1);
	}
	// On ajoute a la longueur le nombre de retour a la ligne
	var lenthTextArea = message.length + cpt;

	if (lenthTextArea > maxlength) {
		alert('Le message doit faire ' + maxlength
				+ ' carect�res ou moins, il fait : ' + lenthTextArea);
		// message.focus();
		return false;
	} else {
		return true;
	}
}

/*******************************************************************************
 * M�thode : confirmer Description : rajoute la gestion de la touche entr�e � la
 * boite de confirmation
 * 
 * IN : message de confirmation OUT : true si on a confirm�, false sinon
 ******************************************************************************/
function confirmer(message) {
	erreurDetectee = true;
	var retour = confirm(message);
	setTimeout("erreurDetectee = false;", 100);
	return retour;
}

/*******************************************************************************
 * M�thode : alerter Description : rajoute la gestion de la touche entr�e � la
 * boite d'alerte
 * 
 * IN : message d'alerte OUT :
 ******************************************************************************/
function alerter(message) {
	erreurDetectee = true;
	alert(message);
	setTimeout("erreurDetectee = false;", 100);
}

/*******************************************************************************
 * M�thode : addOption Description : ajoute une option � un select
 * 
 * IN : Select, value � rendre et texte � afficher de l'option OUT :
 ******************************************************************************/
function addOption(champSelect, value, text) {
	var newOption = new Option(text, value);
	var champSelectLength = champSelect.length;
	champSelect.options[champSelectLength] = newOption;
}

/*******************************************************************************
 * M�thode : gererAffichageListe Description : remplit un select � partir d'une
 * liste
 * 
 * IN : Select, liste OUT :
 ******************************************************************************/
function gererAffichageListe(pListe, pChamp, pIdentifiant, pLibelle) {
	try {
		if (typeof pChamp == 'string') {
			pChamp = document.getElementById(pChamp);
		}
		var i = 0;
		initSelect(pChamp);
		if (pListe != null) {
			var libelles = pLibelle.split('+');
			var libelle;
			for (i = 0; i < pListe.length; i++) {
				libelle = pListe[i][libelles[0]];
				for ( var j = 1; j < libelles.length; j++) {
					libelle += ' - ' + pListe[i][libelles[j]];
				}
				addOption(pChamp, pListe[i][pIdentifiant], libelle);
			}
		}
	} catch (exception) {
		alert("Exception dans la fonction gererAffichageListe : "
				+ exception.message);
	}
}

function initSelect(champ) {
	if (typeof champ == 'string') {
		champ = document.getElementById(champ);
	}
	champ.value = '';
	champ.options.length = 0;
	addOption(champ, '', '...');
}

/*******************************************************************************
 * M�thode : no_accent Description : remplace les accents dans la chaine par le
 * caract�re equivalent
 * 
 * IN : chaine : la chaine de caract�res � traiter OUT : la chaine traitee
 ******************************************************************************/
function no_accent(chaine) {
	var temp = chaine.replace(/[������]/gi, "A");
	temp = temp.replace(/[������]/gi, "a");
	temp = temp.replace(/[������]/gi, "O");
	temp = temp.replace(/[������]/gi, "o");
	temp = temp.replace(/[����]/gi, "E");
	temp = temp.replace(/[����]/gi, "e");
	temp = temp.replace(/[�]/gi, "C");
	temp = temp.replace(/[�]/gi, "c");
	temp = temp.replace(/[����]/gi, "I");
	temp = temp.replace(/[����]/gi, "i");
	temp = temp.replace(/[����]/gi, "U");
	temp = temp.replace(/[����]/gi, "u");
	temp = temp.replace(/[��]/gi, "y");
	temp = temp.replace(/[�]/gi, "Y");
	temp = temp.replace(/[�]/gi, "N");
	temp = temp.replace(/[�]/gi, "n");
	temp = temp.replace(/[�]/gi, "s");
	temp = temp.replace(/[�]/gi, "S");
	temp = temp.replace(/[�]/gi, "OE");
	temp = temp.replace(/[�]/gi, "oe");
	temp = temp.replace(/[�]/gi, "AE");
	temp = temp.replace(/[�]/gi, "ae");

	return temp;
}

/*******************************************************************************
 * M�thode : trim Description : suppression des espaces en debut et en fin de
 * cjaine
 * 
 * IN : chaine : la chaine de caract�res � traiter OUT : la chaine traitee
 ******************************************************************************/
function trim(string) {
	return string.replace(/(^\s*)|(\s*$)/g, '');
}

/**
 * permet d'obtenir la liste des �lements d'une certaine classe
 * 
 * @param className
 *            nom de la classe cherch�e
 * @param tag
 *            (optionnel) type des balises cherch�es
 * @param elm
 *            (optionnel) �l�ment parent contenant les �l�ments
 * @return tableau contenant les �l�ments trouv�s
 */
function getElementsByClassName(className, tag, elm) {
	var testClass = new RegExp("(^|s)" + className + "(s|$)");
	var tag = tag || "*";
	var elm = elm || document;
	var elements = (tag == "*" && elm.all) ? elm.all : elm
			.getElementsByTagName(tag);
	var returnElements = [];
	var current;
	var length = elements.length;
	for ( var i = 0; i < length; i++) {
		current = elements[i];
		if (testClass.test(current.className)) {
			returnElements.push(current);
		}
	}
	return returnElements;
}

function putFrame(pDivCachee) {
	var f = document.getElementById("theFrame");
	if (!f) {
		f = document.createElement("iframe");
		f.id = "theFrame";
		document.body.appendChild(f);
	}
	var d = document.getElementById(pDivCachee);

	f.style.position = "absolute";
	f.style.width = d.offsetWidth + "px";
	f.style.height = d.offsetHeight + "px";
	;
	f.style.top = d.offsetTop + "px";
	f.style.left = d.offsetLeft + "px";
	f.style.zIndex = "1";

}

function removeFrame() {
	var f = document.getElementById("theFrame");
	if (f) {
		f.parentNode.removeChild(f);
	}
}

/**
 * Fait disparaitre le bloc anomalies et remet le style "normal" pour les
 * libelles rouges
 */
function razChamps() {
	var blocErreurs = getElementsByClassName("anomalies");
	blocErreurs[0].style.display = "none";

	var elementsRouge = getElementsByClassName("errorLibelle");
	for ( var i = 0; i < elementsRouge.length; i++) {
		elementsRouge[i].removeAttribute("class");
	}
}

/**
 * Rend l'id action courant
 */
function getIdAction() {
	var idAction = document.getElementsByName('idAction')[0];
	if (typeof idAction == 'undefined') {
		idAction = 0;
	} else {
		idAction = idAction.value;
	}
	return idAction;
}

/*
 * Affecte la valeur d'un champ
 */
function setValue(champ, valeur) {
	if (typeof champ == 'string') {
		champ = document.getElementById(champ);
	}
	champ.value = (typeof valeur == 'undefined' || valeur == null) ? ''
			: valeur;
}

function getValue(champ) {
	if (typeof champ == 'string') {
		champ = document.getElementById(champ);
	}
	return champ.value;
}

/**
 * Acc�s au noeud pr�c�dent
 * 
 * @param node
 *            node courant
 * @param nodeName
 *            nom de la balise recherch�e
 */
function getNoeudPrecedent(node, nodeName) {
	if (typeof node == 'string') {
		node = document.getElementById(node);
	}
	var nodePrec = node.previousSibling;
	while (nodePrec != null && nodePrec.nodeName != nodeName) {
		nodePrec = nodePrec.previousSibling;
	}
	return nodePrec;
}

/**
 * Acc�s au noeud suivant
 * 
 * @param node
 *            node courant
 * @param nodeName
 *            nom de la balise recherch�e
 */
function getNoeudSuivant(node, nodeName) {
	if (typeof node == 'string') {
		node = document.getElementById(node);
	}
	var nodeSuiv = node.nextSibling;
	while (nodeSuiv != null && nodeSuiv.nodeName != nodeName) {
		nodeSuiv = nodeSuiv.previousSibling;
	}
	return nodeSuiv;
}

function getNoeudParent(node, nodeName) {
	if (typeof node == 'string') {
		node = document.getElementById(node);
	}
	var nodeParent = node.parentNode;
	while (nodeParent != null && nodeParent.nodeName != nodeName) {
		nodeParent = nodeParent.parentNode;
	}
	return nodeParent;
}

function getNoeudsEnfants(node, nodeName) {
	if (typeof node == 'string') {
		node = document.getElementById(node);
	}
	var nodesEnfants = node.childNodes;
	var result = [];
	for ( var i = 0; i < nodesEnfants.length; i++) {
		if (nodesEnfants[i].nodeName == nodeName) {
			result.push(nodesEnfants[i]);
		}
	}
	return result;
}

/**
 * Acc�s � la ligne d'un champ (Tr correspondant)
 * 
 * @param champ
 *            champ
 */
function getTrChamp(champ) {
	return getNoeudParent(champ, 'TR');
}

/**
 * Acc�s au td d'un champ
 * 
 * @param champ
 *            champ
 */
function getTdChamp(champ) {
	return getNoeudParent(champ, 'TD');
}

/**
 * Acc�s au th d'un champ
 * 
 * @param champ
 *            champ
 */
function getThChamp(champ) {
	return getNoeudPrecedent(getTdChamp(champ), 'TH');
}

/**
 * L�ve un �v�nement
 * 
 * @param eventName
 *            non de l'�v�nement (sans le 'on')
 * @param elt
 *            �lement sur lequel on l�ve l'�v�nement
 */
function fireEvent(eventName, elt) {
	if (typeof elt == 'string') {
		elt = document.getElementById(elt);
	}
	if (elt.fireEvent) {
		elt.fireEvent('on' + eventName);
	} else if (document.createEvent) {
		var evt = document.createEvent('HTMLEvents');
		if (evt.initEvent) {
			evt.initEvent(eventName, true, true);
		}
		if (elt.dispatchEvent) {
			elt.dispatchEvent(evt);
		}
	}
}

/**
 * Affiche ou non un bouton
 * 
 * @param idBouton
 *            identifiant du bouton
 * @param visible
 *            true si le bouton doit �tre affich�
 */
function afficherBouton(idBouton, visible) {
	afficherElement(idBouton, visible);
	afficherElement(getNoeudSuivant(idBouton, 'A'), visible);
}

/**
 * Retourne l'�l�ment suivant A utiliser pour assurer la compatibilit� IE
 * 
 * @param el
 *            Element r�f�rence
 * @returns le prochain �l�ment
 */
function nextElementSibling(el) {
	var returnEl = null;
	if ((returnEl = el.nextElementSibling) != null) {
		return returnEl;
	} else {
		do {
			el = el.nextSibling
		} while (el && el.nodeType !== 1);
		return el;
	}
}

/**
 * Retourne le token genere
 * 
 * @returns le token
 */
function getTokenGuard() {
	var token = "";
	var tokens = document.getElementsByName('tokenGuard');
	if (tokens != null && tokens.length) {
		token = '&tokenGuard=' + tokens[0].value;
	}
	return token;
}

/**
 * D�finition de la m�thode contains pour les Array
 * 
 * @param obj
 *            l'objet de r�ference
 * @return <code>true</code> si l'objet est pr�sent, <code>false</code>
 *         sinon
 */
Array.prototype.contains = function(obj) {
	if (obj != null) {
		var i = this.length;
		while (i--) {
			if (this[i] === obj) {
				return true;
			}
		}
	}
	return false;
}