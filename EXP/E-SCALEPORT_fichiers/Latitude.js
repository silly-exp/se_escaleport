/**********************************************************************************************************************************************

	Nom 			: Longitude.js
	Description		: Objet permettant la gestion des dates dans les champs de saisie
	Version			: 0.1
	Auteur			: ELG

***********************************************************************************************************************************************/


/**
 *	Contructeur
 */

function Latitude()
{
	// Constante

	// Méthodes	publiques
	this.onFocus			= Latitude_onFocus;
	this.onKeypress			= Latitude_onKeypress;
	this.onBlur				= Latitude_onBlur;	
	
	// Méthode privés
	this.initialiser		= Latitude_initialiser;
	this.decomposeValeur	= Latitude_decomposeValeur;
	this.getValeurAffichage = Latitude_getValeurAffichage;
	this.ctrTypageSaisie	= Latitude_ctrTypageSaisie;
	this.ctrValidite		= Latitude_ctrValidite;
	this.ajouterZeros		= Latitude_ajouterZeros;
}

// --------------------- Méthodes Publiques -------------------------------------

/**
 * Latitude_onFocus : fonction de gestion d'entrée dans le champ
 *
 * entrée 	: 	event : evenement JavaScript
 * sortie 	: 	néant
 */
 
function Latitude_onFocus(event)
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
 * Latitude_onKeypress : fonction de controle de la validité de la touche frappée
 *
 * entrée 	: 	event : evenement JavaScript
 * sortie 	: 	néant
 */

function Latitude_onKeypress(event)
{
	var keyCode = getKeyCode(event);
	var element	= getElement(event);
	var caract  = String.fromCharCode(keyCode);
	
	if(keyCode != "13")	{
	
		element.enErreur = false;
				
		var regExp = new RegExp("[0-9,.ns]", "i");
		
		element.validerEntree = null;
		
		if (!regExp.test(caract) && keyCode != 0 && keyCode != 8) {
			event.returnValue = false;
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
 * Latitude_onBlur : fonction de gestion de la sortie du champ
 *
 * entrée 	: 	event : evenement JavaScript
 * sortie 	: 	néant
 */

function Latitude_onBlur(event, saisieRapide)
{
	var element = getElement(event);
	
	var iErreur = 0;

	if (element.focused) {
		element.focused 		= false;
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
	
	// Test de la présence d'une erreur
	if(iErreur > 0)
		element.enErreur = true;
	
	
	if(element.erreur != null)
		element.erreur = iErreur;

	if (iErreur == 1) {
		element.erreur = "Vous devez saisir une latitude au format "
		    + "\"N ou S degrés minutes(,centièmes de minutes)\" (par ex. \"N4532,24\")"
			+ " ou \"degrés minutes(,centièmes de minute) cardinalité\" (par ex. \"4532S\")" 
			+ " ou \"degrés minutes(,centièmes de minute)\" (par ex. \"0234,50\")";
	}
	
	if (iErreur == 2) {
		element.erreur = "Les degrés pour une latitude ne peuvent pas dépasser 90" ;
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
	}
	
	event.cancelBubble = true;
	
	// Suppression de la validation entrée si il y a une erreur
	if(iErreur > 0) {
		element.validerEntree = null;
	} else {
		finErreur(element);
	}
	
	gestionOnBlurSaisieRapide(event, saisieRapide, iErreur);

	return (iErreur == 0);
}

// --------------------- Méthodes Privées -------------------------------------

/**
 * Latitude_initialiser : fonction d'initialisation de la date lors du premier focus
 *
 * entrée 	: 	element : element html
 * sortie 	: 	néant
 */
 
function Latitude_initialiser(element)
{
	element.valeurSaisie 		= "";
	element.focused 			= false;
	element.degre       		= "";
	element.minute       		= "";
	element.centiemeMinute 		= "";
	element.cardinalite    		= "";
	element.init     			= "true";
	element.enErreur	 		= false;

	var valeur;
	
	valeur = element.value.replace(/°/g, '');
	valeur = valeur.replace(/\'/g, '');	
	valeur = valeur.replace(/ /g, '');
	
	element.valeurSaisie = valeur;
}

/**
 * Latitude_decomposeValeur
 *
 * entrée 	: 	element : element html
 * sortie 	: 	néant
 */

function Latitude_decomposeValeur(element)
{
	var lat = element.valeurSaisie;
	
	// format 1 : ADDMM(,dd)
	if (element.format == 1) {

		element.cardinalite		= lat.substr(0, 1);
		element.degre			= lat.substr(1, 2);
		element.minute			= lat.substr(3, 2);
		
		if (lat.length > 5) {
			element.centiemeMinute = lat.substr(6, 2);
		} else {
			element.centiemeMinute = '';
		}
					
	// format 2 : DDMM(,dd)A
	} else if (element.format == 2) {
	
		element.degre			= lat.substr(0, 2);
		element.minute			= lat.substr(2, 2);
		
		if (lat.length > 5) {
			element.centiemeMinute	= lat.substr(5, 2);
			element.cardinalite		= lat.substr(7, 1);
		} else {
			element.centiemeMinute 	= '';
			element.cardinalite		= lat.substr(4, 1);
		}	
		
	// format 3 : DDMM(,dd)
	} else {
	
		element.cardinalite		= 'N';
		element.degre			= lat.substr(0, 2);
		element.minute			= lat.substr(2, 2);
		
		if (lat.length > 5) {
			element.centiemeMinute = lat.substr(5, 2);
		} else {
			element.centiemeMinute = '';
		}
	}
}

/**
 * Latitude_getValeurAffichage : fonction de mise en forme du format de sortie du champ
 *
 * entrée 	: 	element : element html
 * sortie 	: 	la valeur d'affichage de la date
 */
 
function Latitude_getValeurAffichage(element)
{
	var valeurAffichage;

	valeurAffichage	=  this.ajouterZeros(element.degre) + '° ';
	valeurAffichage	+= this.ajouterZeros(element.minute);
	if (element.centiemeMinute != '') {
		valeurAffichage += ',' + this.ajouterZeros(element.centiemeMinute, true);
	}
	valeurAffichage += '\' ' + element.cardinalite.toUpperCase(); 
		
	return valeurAffichage;
}

/**
 * Latitude_ctrTypageSaisie : fonction de contrôle de la validité du typage en sortie du champ
 *
 * entrée 	: 	element : element html
 * sortie 	: 	code erreur
 */

function Latitude_ctrTypageSaisie(element)
{
	var iErreur = 0;
	var regExp;
	var bTest1;
	var bTest2;	
	var bTest3;
	
	//format 1 : ADDMM(,dd)
	regExp = new RegExp("^[ns]\\d{4}(,\\d{2})?$", "gi");
	bTest1 = regExp.test(element.valeurSaisie);

	//format 2 : DDMM(,dd)A
	regExp = new RegExp("^\\d{4}(,\\d{2})?[ns]$", "gi");
	bTest2 = regExp.test(element.valeurSaisie);
	
	//format 3 : DDMM(,dd)
	regExp = new RegExp("^\\d{4}(,\\d{2})?$", "gi");
	bTest3 = regExp.test(element.valeurSaisie);		
	
	if (!bTest1 && !bTest2 && !bTest3) {
		iErreur = 1;
	} else {		
		// Détermination du format de saisie
		if (bTest1) {
			element.format = 1;
		} else if (bTest2) {
			element.format = 2;
		} else {
			element.format = 3;
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

function Latitude_ctrValidite( element )
{
	var iDegre     		= parseInt(element.degre, 10);
	var iMinute      	= parseInt(element.minute, 10);
	var iCentiemeMinute = parseInt(element.centiemeMinute, 10);
	var iErreur			= 0;
	var b90 = false;
	
	
	if (iDegre > 90) {
		iErreur = 2;
	} else if (iDegre == 90) {
		b90 = true;
	}
	
	if (iMinute >= 60) {
		iErreur = 3;
	} else if ((iMinute > 0) && b90) {
		iErreur = 2;
	}
	
	if (iCentiemeMinute > 99) {
		iErreur = 4;
	} else if ((iCentiemeMinute > 0) && b90) {
		 iErreur = 2;
	}

	return iErreur;
}

/**
 * Latitude_ajouterZeros : ajout éventuel de zéro avant ou après un nombre
 *
 * entrée 	: 	chaine : la chaine
 *              apres : true indique que le zéro vient après
 * 
 */
 
function Latitude_ajouterZeros(chaine, apres) 
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