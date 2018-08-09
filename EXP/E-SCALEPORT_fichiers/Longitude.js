/**********************************************************************************************************************************************

	Nom 			: Longitude.js
	Description		: Objet permettant la gestion des dates dans les champs de saisie
	Version			: 0.1
	Auteur			: ELG

***********************************************************************************************************************************************/


/**
 *	Contructeur
 */

function Longitude()
{
	// Constante

	// Méthodes	publiques
	this.onFocus			= Longitude_onFocus;
	this.onKeypress			= Longitude_onKeypress;
	this.onBlur				= Longitude_onBlur;	
	
	// Méthode privés
	this.initialiser		= Longitude_initialiser;
	this.decomposeValeur	= Longitude_decomposeValeur;
	this.getValeurAffichage = Longitude_getValeurAffichage;
	this.ctrTypageSaisie	= Longitude_ctrTypageSaisie;
	this.ctrValidite		= Longitude_ctrValidite;
	this.ajouterZeros		= Longitude_ajouterZeros;
	this.ajouterZeros3		= Longitude_ajouterZeros3;
}

// --------------------- Méthodes Publiques -------------------------------------

/**
 * Longitude_onFocus : fonction de gestion d'entrée dans le champ
 *
 * entrée 	: 	event : evenement JavaScript
 * sortie 	: 	néant
 */
 
function Longitude_onFocus(event)
{	
	var element = getElement(event);
	
	if (element.init != "true")	{
		this.initialiser(element);
	}
	
	element.focused 	= true;
	element.value   	= element.valeurSaisie;
	element.select();
	
	event.returnValue 	= false;
}

/**
 * Longitude_onKeypress : fonction de controle de la validité de la touche frappée
 *
 * entrée 	: 	event : evenement JavaScript
 * sortie 	: 	néant
 */

function Longitude_onKeypress(event)
{
	var keyCode = getKeyCode(event);
	var element	= getElement(event);
	var caract  = String.fromCharCode(keyCode);
	
	if(keyCode != "13") {		
		var regExp = new RegExp("[0-9,.we]", "i");
		
		element.validerEntree = null;
		
		if (!regExp.test(caract) && keyCode != 0 && keyCode != 8)	{
			event.returnValue = false ;
			return false;
		} else if (caract == '.') {
   			getKeyCode(event) = "44";
		}
		
	} else {
		element.validerEntree = true;
		element.blur();
		event.cancelBubble = true;
	}	
}

/**
 * Longitude_onBlur : fonction de gestion de la sortie du champ
 *
 * entrée 	: 	event : evenement JavaScript
 * sortie 	: 	néant
 */

function Longitude_onBlur(event, saisieRapide)
{
	var element = getElement(event);
	var iErreur = 0;
	
	if (element.focused) {
		element.focused 		= false;
		element.valeurSaisie 	= "";
		iErreur 				= 0;
		element.valeurSaisie 	= element.value;
	}
		
	if (element.valeurSaisie.length != 0) {
	
		iErreur = this.ctrTypageSaisie(element);
				
		if (iErreur == 0) {
		
			this.decomposeValeur(element);
			iErreur = this.ctrValidite(element);			

			if (iErreur == 0) {
				element.value = this.getValeurAffichage(element);
			}			
		}
	}
	else
	{
		element.degree  		= "" ;
		element.minute  		= "" ;
		element.dixiemeMinute 	= "" ;
		element.cardinalite		= "" ;
	}
	
	if(element.erreur != null)
		element.erreur = iErreur;

	if (iErreur == 1) {
				element.erreur = "Vous devez saisir une longitude au format "
					+ "\"cardinalité degrés minutes(,centièmes de minutes)\" (par ex. \"E12332\")"
					+ " ou \"degrés minutes(,centièmes de minutes) cardinalité\" (par ex. \"00234,05E\")";
	}
	
	if (iErreur == 2) {
		element.erreur = "Les degrés pour une longitude ne peuvent pas dépasser 180" ;
	}
	
	if (iErreur == 3) {
		element.erreur = "Les minutes ne peuvent pas dépasser 59" ;
	}
	
	if (iErreur == 4) {
		element.erreur = "Les centièmes de minutes ne peuvent pas dépasser 99" ;
	}
	
	if (iErreur > 0)
	{
		event.returnValue = false;
		gestionErreur(element, element.erreur);
		this.onFocus(event);			
	} else {
		window.top.entreeOK = "true";
	}
	
	event.cancelBubble = true;
	
	// Suppression de la validation entrée si il y a une erreur
	if(iErreur > 0) {
		element.validerEntree = null;
	}
	
	gestionOnBlurSaisieRapide(event, saisieRapide, iErreur);
	
	return (iErreur == 0);
}

// --------------------- Méthodes Privées -------------------------------------


/**
 * Longitude_initialiser : fonction d'initialisation de la date lors du premier focus
 *
 * entrée 	: 	element : element html
 * sortie 	: 	néant
 */
 
function Longitude_initialiser(element)
{
	element.valeurSaisie 		= "";
	element.focused 			= false;
	element.degre       		= "";
	element.minute       		= "";
	element.centiemeMinute  	= "";
	element.cardinalite    		= "";
	element.init     			= "true";

	var valeur;
	
	valeur = element.value.replace(/°/g, '');
	valeur = valeur.replace(/\'/g, '');
	valeur = valeur.replace(/ /g, '');
	
	element.valeurSaisie = valeur;
}

/**
 * Longitude_decomposeValeur
 *
 * entrée 	: 	element : element html
 * sortie 	: 	néant
 */

function Longitude_decomposeValeur(element)
{
	var longitude = element.valeurSaisie;
	
	// format 1 : ADDDMM(,dd)
	if (element.format == 1) {

		element.cardinalite		= longitude.substr(0, 1);
		element.degre			= longitude.substr(1, 3);
		element.minute			= longitude.substr(4, 2);
		
		if (longitude.length > 6) {
			element.centiemeMinute = longitude.substr(7, 2);
		} else {
			element.centiemeMinute = '';
		}
					
	// format 2 : DDDMM(,dd)A
	} else if (element.format == 2) {
	
		element.degre			= longitude.substr(0, 3);
		element.minute			= longitude.substr(3, 2);
		
		if (longitude.length > 6) {
			element.centiemeMinute	= longitude.substr(6, 2);
			element.cardinalite		= longitude.substr(8, 1);
		} else {
			element.centiemeMinute 	= '';
			element.cardinalite		= longitude.substr(5, 1);
		}	
	}
}

/**
 * Longitude_getValeurAffichage : fonction de mise en forme du format de sortie du champ
 *
 * entrée 	: 	element : element html
 * sortie 	: 	la valeur d'affichage de la date
 */
 
function Longitude_getValeurAffichage( element )
{
	var valeurAffichage;

	valeurAffichage	=  this.ajouterZeros3(element.degre, false, 3) + '° ';
	valeurAffichage	+= this.ajouterZeros(element.minute);
	if (element.centiemeMinute != '') {
		valeurAffichage += ',' + this.ajouterZeros(element.centiemeMinute, true);
	}
	valeurAffichage += '\' ' + element.cardinalite.toUpperCase(); 
		
	return valeurAffichage;
}

/**
 * Longitude_ctrTypageSaisie : fonction de contrôle de la validité du typage en sortie du champ
 *
 * entrée 	: 	element : element html
 * sortie 	: 	code erreur
 */

function Longitude_ctrTypageSaisie(element)
{
	var iErreur = 0;
	var regExp;
	var bTest1;
	var bTest2;	
	
	//format 1 : ADDDMM(,dd)
	regExp = new RegExp("^[ew]\\d{5}(,\\d{2})?$", "gi");
	bTest1 = regExp.test(element.valeurSaisie);

	//format 2 : DDDMM(,dd)A
	regExp = new RegExp("^\\d{5}(,\\d{2})?[ew]$", "gi");
	bTest2 = regExp.test(element.valeurSaisie);
	
	if (!bTest1 && !bTest2) {
		iErreur = 1;
	} else {		
		// Détermination du format de saisie
		if (bTest1) {
			element.format = 1;
		} else {
			element.format = 2;
		}
	}
		
	return iErreur;	
}

/**
 * Date2_ctrValidite : fonction de contrôle de la validité de la saisie en sortie du champ
 *
 * entrée 	: 	element : element html
 * sortie 	: 	le code erreur
 */

function Longitude_ctrValidite( element )
{
	var iDegre     		= parseInt(element.degre, 10);
	var iMinute      	= parseInt(element.minute, 10);
	var iCentiemeMinute = parseInt(element.centiemeMinute, 10);
	var iErreur			= 0;
	var b180 = false;
	
	
	if (iDegre > 180) {
		iErreur = 2;
	} else if (iDegre == 180) {
		b180 = true;
	}
	
	
	if (iMinute >= 60) {
		iErreur = 3;
	} else if ((iMinute > 0) && b180) {
		iErreur = 2;
	}
	
	if (iCentiemeMinute > 99) {
		iErreur = 4;
	} else if ((iCentiemeMinute > 0) && b180) {
		iErreur = 2;
	}

	return iErreur;
}

/**
 * Longitude_ajouterZeros : ajout éventuel de zéro avant ou après un nombre
 *
 * entrée 	: 	chaine : la chaine
 *              apres : true indique que le zéro vient après
 * 
 */
 
function Longitude_ajouterZeros(chaine, apres) 
{
	var retour;
	
	if (chaine < 9) {
		if (apres == true) {
			retour = chaine + '0';
		} else {
			retour = '0' + chaine;
		}
	} else {
		retour = chaine;
	}
	
	return chaine;
}

/**
 * Longitude_ajouterZeros : ajout éventuel de zéro avant ou après un nombre
 *
 * entrée 	: 	chaine : la chaine
 * 
 */
 
function Longitude_ajouterZeros3(chaine) 
{
	var retour;
	
	if (chaine < 9) {
		retour = '00' + chaine;
	} else if (chaine < 99) {
		retour = '0' + chaine;
	} else {
		retour = chaine;
	}
	
	return chaine;
}