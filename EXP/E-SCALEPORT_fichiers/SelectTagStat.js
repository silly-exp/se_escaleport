/*************************************************************************
Méthode : synchroniserSelectTagStat
Description : synchronise les champs input avec les champs select
*************************************************************************/
function synchroniserSelectTagStat() {
	var elementsSelectTextTagStat = getElementsByClassName("selectTagStat");
	for ( var i = 0; i < elementsSelectTextTagStat.length; i++) {
		valoriserText(elementsSelectTextTagStat[i].id);
	}
}

/*************************************************************************
Méthode : initialiserSelectTagStat
Description : valorise le chanp text en fonction de la valeur d'un select
     
IN : id du champ
OUT : la valeur dans le champ texte
*************************************************************************/
function initialiserSelectTagStat(idSelect) {
	document.getElementById(idSelect + '_text').value = '';
	document.getElementById(idSelect).selectedIndex = 0;
}

function afficherSelectTagStat(idSelect, visible, garderZone) {
	afficherElement(idSelect + '_text', visible, garderZone);
	afficherElement(idSelect, visible, garderZone);
}

function setModifiableSelectTagStat(idSelect, modifiable) {
	setModifiable(idSelect + '_text', modifiable);
	setModifiable(idSelect, modifiable);
}

/*************************************************************************
Méthode : valoriserText
Description : valorise le chanp text en fonction de la valeur d'un select
     
IN : id du champ
*************************************************************************/
function valoriserText(idSelect) {
	var text = document.getElementById(idSelect + '_text');
	var select = document.getElementById(idSelect)
	var choixSelectionne = select.selectedIndex;
	if (choixSelectionne == 0) {
		text.value = "";
	} else {
		var libelle = select[choixSelectionne].innerHTML;
		var code = libelle.split(" - ");
		text.value = code[0];
	}
}

/*************************************************************************
Méthode : valoriserSelect
Description : valorise le chanp select en fonction de la valeur d'un champ text
     
IN : id du champ
*************************************************************************/
function valoriserSelect(idSelect) {
	var valeurText = document.getElementById(idSelect + '_text').value;
	var select = document.getElementById(idSelect);
	for (i = 0 ; i < select.options.length ; i++) {
		var libelle = select.options[i].innerHTML;
		var code = libelle.split(" - ");
		if (valeurText.toUpperCase() == code[0] || valeurText.toLowerCase() == code[0]) {
			select.selectedIndex = i;
			break;
		} else {
			select.selectedIndex = 0;
		}
	}
}

/*************************************************************************
Méthode : verifierCode
Description : vérifie si le code est valide
     
IN : id du champ
*************************************************************************/
function verifierCode(event, idSelect) {
	var text = document.getElementById(idSelect + '_text');
	var select = document.getElementById(idSelect)
	var choixSelectionne = select.selectedIndex;
	if (text.value != "" && choixSelectionne == 0) {
		text.select();
		gestionErreur(text, "Vous devez remplir un code valide");
		finErreur(text);
	} else {
		fireEvent('change', select);
	}
}
