/**********************************************************************************************************************************************

	Nom 			: Date.js
	Description		: Objet permettant la gestion des dates dans les champs de saisie
	Version			: 0.1
	Auteur			: ELG

***********************************************************************************************************************************************/


/**
 *	Contructeur
 */

function Date2()
{
	// Constante
	this.CstNbrCar_JMAHMS	= 14;
	this.CstNbrCar_JMAHM	= 12;
	this.CstNbrCar_JMA 		= 8;		
	this.CstNbrCar_MA 		= 6;
	this.CstNbrCar_JM  		= 4;
	this.CstNbrCar_J   		= 2;	
	
	// Maxlength (comprend les /, espaces et :)
	this.CstMax_JMAHMS	= 19;
	this.CstMax_JMAHM	= 16;
	this.CstMax_JMA 	= 10;		
	this.CstMax_MA 		= 7;
	this.CstMax_JM  	= 5;
	this.CstMax_J   	= 2;	

	var msgFormat = new Array();
	msgFormat["JMAHMS"] = "JJMM(AA)AA(HHMMSS)";
	msgFormat["JMAHM"] = "JJMM(AA)AA(HHMM)";
	msgFormat["JMA"] = "JJMM(AA)AA";
	msgFormat["MA"] = "MM(AA)AA";
	msgFormat["JM"] = "JJMM";	
	msgFormat["J"] = "JJ";		
	this.msgFormat = msgFormat;

	// Méthodes	publiques
	this.onFocus			= Date2_onFocus;
	this.onKeypress			= Date2_onKeypress;
	this.onBlur				= Date2_onBlur;	
	
	// Méthode privés
	this.initialiser		= Date2_initialiser;
	this.decomposeValeur	= Date2_decomposeValeur;
	this.getValeurAffichage = Date2_getValeurAffichage;
	this.ctrTypageSaisie	= Date2_ctrTypageSaisie;
	this.ctrValidite		= Date2_ctrValidite;
	this.testDate			= Date2_testDate;
	
}

// --------------------- Méthodes Publiques -------------------------------------

/**
 * Date2_onFocus : fonction de gestion d'entrée dans le champ
 *
 * entrée 	: 	event : evenement JavaScript
 * sortie 	: 	néant
 */
 
function Date2_onFocus(event, format)
{
	var element = getElement(event);

	if (element.init != "true" ) {
		element.format = format;
		this.initialiser(element);
	}
	
	element.changement	= "false";
	element.oldValue	= element.value;
	element.focused 	= true;
	element.value   	= element.valeurSaisie;
	element.select();
	
	element.maxLength = element.nbCarac;
	
	event.returnValue 	= false;
}

/**
 * Date2_onKeypress : fonction de controle de la validité de la touche frappée
 *
 * entrée 	: 	event : evenement JavaScript
 * sortie 	: 	néant
 */

function Date2_onKeypress(event)
{
	var keyCode = getKeyCode(event);
	var element	= getElement(event);
	
	if(keyCode != "13") {		
		var regExp = new RegExp("[0-9]");
						
		element.validerEntree = null;
		
		if (regExp.test(String.fromCharCode(keyCode)) || keyCode == 0 || keyCode == 8 || event.ctrlKey) {
			event.returnValue = true;
			return true;
		} else {
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
 * Date2_onBlur : fonction de gestion de la sortie du champ
 *
 * entrée 	: 	event : evenement JavaScript
 * sortie 	: 	néant
 */

function Date2_onBlur(event, saisieRapide)
{

	event.returnValue = true;
	var element = getElement(event);
	var iErreur = 0;	

	if (element.focused) {
		element.focused 		= false;
		element.valeurSaisie	= "";
		iErreur 				= 0;
		// Suppression des '/'
		element.valeurSaisie 	= element.value.replace(/\//g, '');
	}
	
	if (element.valeurSaisie.length != 0) {
		iErreur = this.ctrTypageSaisie(element);
		if (iErreur == 0) {
			this.decomposeValeur(element);
			iErreur = this.ctrValidite(element);
			if (iErreur == 0) {
				element.maxLength = element.tailleMax;
				element.value = this.getValeurAffichage(element);
				if (element.value == element.oldValue) {
					element.changement = "false";
				} else {
					element.changement = null;
				}
			}				
		}
	} else {
		element.dateJour  = "";
		element.dateMois  = "";
		element.dateAnnee = "";
	}
	
	if(element.erreur != null) {
		element.erreur = iErreur;
	}

	if (iErreur == 1) {
		element.dateErreur = "Vous devez saisir une date au format MM(AA)AA" ;
	} 
	if (iErreur == 2) {
		element.dateErreur = "Vous devez saisir une date au format JJMM" ;
	}
	if (iErreur == 3) {
		element.dateErreur = "Vous devez saisir une date au format JJMM(AA)AA" ;
	}
	if (iErreur == 4) {
		element.dateErreur = "Vous devez saisir un jour (entre 01 et 31)" ;
	}
	if (iErreur == 5) {
		element.dateErreur = "Vous devez saisir une date au format JJMMAAAA(HHMM)" ;
	}
	if (iErreur == 6) {
		element.dateErreur = "Vous devez saisir une date au format JJMMAAAA(HHMMSS)" ;
	}
	if (iErreur == 7) {
		element.dateErreur = "Le format de la date ou de l'heure n'est pas valide " ;
	}
	if (iErreur == 10) {
		element.dateErreur  = "La date n'est pas valide. Le format attendu est : ";
		element.dateErreur += this.msgFormat[element.format];
	}
	if (iErreur == 11) {
		element.dateErreur = "La date doit être postérieure au 01 janvier 1800" ;
	}
	

	
	if (iErreur > 0) {
		event.returnValue = false;
		gestionErreur(element, element.dateErreur);
		this.onFocus(event);		
	} else {
		finErreur(element);
	}

	event.cancelBubble = true ;
	
	// Suppression de la validation entrée si il y a une erreur
	if (iErreur > 0) {
		element.validerEntree = null;
	} else {
		finErreur(element);
	}
	
	gestionOnBlurSaisieRapide(event, saisieRapide, iErreur);

	return (iErreur == 0 && event.returnValue);
}

// --------------------- Méthodes Privées -------------------------------------


/**
 * Date2_initialiser : fonction d'initialisation de la date lors du premier focus
 *
 * entrée 	: 	element : element html
 * sortie 	: 	néant
 */
 
function Date2_initialiser( element )
{
	element.valeurSaisie 			= "" ;
	element.focused 				= false ;
	element.dateJour       			= "" ;
	element.dateMois       			= "" ;
	element.dateAnnee      			= "" ;
	element.dateSeparateur 			= "/" ;
	element.dateSeparateurHeure		= ":" ;
	element.dateSeparateurDateHeure = " " ;
	element.init    				= "true" ;
	now 							= new Date() ;
	element.anNow          			= now.getYear() ;
	
	if(element.format != null && element.format != "") 
		element.format = element.format.toUpperCase();
	
	try
	{
		if ((element.format == null) || (element.format == "")) {
			element.format = "JMA" ;				
		}
			
		if ( element.format == "MA" ) { 
			element.tailleMax	= this.CstMax_MA;
			element.nbCarac		= this.CstNbrCar_MA;
			
		} else if (element.format == "JM") {
		
			element.tailleMax 	= this.CstMax_JM;
			element.nbCarac		= this.CstNbrCar_JM;			
			
		} else if (element.format == "J") {
		
			element.tailleMax 	= this.CstMax_J;
			element.nbCarac		= this.CstNbrCar_J;			
			
		} else if (element.format == "JMAHM") {
		
			element.tailleMax 	= this.CstMax_JMAHM;
			element.nbCarac		= this.CstNbrCar_JMAHM;			
			
		} else if (element.format == "JMAHMS") {
		
			element.tailleMax 	= this.CstMax_JMAHMS;
			element.nbCarac		= this.CstNbrCar_JMAHMS;			
		
		} else {
			element.tailleMax 	= this.CstMax_JMA;
			element.nbCarac		= this.CstNbrCar_JMA;			
		}
	}
	catch (exception)
	{
	}

	if ( element.format == "JMAHMS" ) 
	{
		element.valeurSaisie = element.value.substr(0,2) + 
								   element.value.substr(3,2) + 
								   element.value.substr(6,4) + 
								   element.value.substr(11,2) + 
								   element.value.substr(14,2) + 
								   element.value.substr(17,2) ;
	}
	if ( element.format == "JMAHM" ) 
	{
		element.valeurSaisie = element.value.substr(0,2) + 
								   element.value.substr(3,2) + 
								   element.value.substr(6,4) + 
								   element.value.substr(11,2) + 
								   element.value.substr(14,2);
	}
	if ( element.format == "JMA" ) 
	{
		element.valeurSaisie = element.value.substr(0,2) + element.value.substr(3,2) + element.value.substr(6,4) ;
	}
	if ( element.format == "MA" )
	{
		element.valeurSaisie = element.value.substr(0,2) + element.value.substr(3,4) ;
	}
	if ( element.format == "JM" ) 
	{
		element.valeurSaisie = element.value.substr(0,2) + element.value.substr(3,2) ;
	}
	if ( element.format == "J" ) 
	{
		element.valeurSaisie = element.value ;
	}
}

/**
 * Date2_decomposeValeur : fonction de récupération de l'année, du mois, et du jour
 *
 * entrée 	: 	element : element html
 * sortie 	: 	néant
 */

function Date2_decomposeValeur( element )
{	
	if ( element.format == "JMAHMS" ) 	{
	
		element.dateJour  	= element.valeurSaisie.substr(0,2) ;
		element.dateMois  	= element.valeurSaisie.substr(2,2) ;
		element.dateAnnee 	= element.valeurSaisie.substr(4,4) ;
		element.dateHeure 	= element.valeurSaisie.substr(8,2) ;
		element.dateMinute 	= element.valeurSaisie.substr(10,2) ;
		element.dateSeconde	= element.valeurSaisie.substr(12,2) ;
			
		if (element.dateHeure == null || element.dateHeure == '') {
			element.dateHeure = "00";
		}
		
		if(element.dateHeure.length == 1) {
			element.dateHeure = element.dateHeure + "0";
		}
		
		if (element.dateMinute == null || element.dateMinute == '') {
			element.dateMinute = "00";
		}
		
		if(element.dateMinute.length == 1) {
			element.dateMinute = element.dateMinute + "0";
		}
		
		if (element.dateSeconde == null || element.dateSeconde == '') {
			element.dateSeconde = "00";
		}
		
		if(element.dateSeconde.length == 1) {
			element.dateSeconde = element.dateSeconde + "0";
		}
		
		element.valeurSaisie = 	element.dateJour + 
									element.dateMois +
									element.dateAnnee + 
									element.dateHeure + 
									element.dateMinute + 
									element.dateSeconde;
									
	} else 	if ( element.format == "JMAHM" ) 	{

		element.dateJour  	= element.valeurSaisie.substr(0,2) ;
		element.dateMois  	= element.valeurSaisie.substr(2,2) ;
		element.dateAnnee 	= element.valeurSaisie.substr(4,4) ;
		element.dateHeure 	= element.valeurSaisie.substr(8,2) ;
		element.dateMinute 	= element.valeurSaisie.substr(10,2) ;
			
		// si les heures sont renseignées
		if (element.dateHeure != null && element.dateHeure != '') {
			
			// si les heures ne sont pas complètes -> ajout d'un 0
			if (element.dateHeure.length == 1) {
				element.dateHeure = element.dateHeure + "0";
			}
				
			// si les minutes ne sont pas renseignées -> 00
			if (element.dateMinute == null || element.dateMinute == '') {
				element.dateMinute = "00";
			
			// si les minute ne sont pas complètes -> ajout d'un 0
			} else if(element.dateMinute.length == 1) {
				element.dateMinute = element.dateMinute + "0";
			}	
		} else {
			if (element.heureDefaut != null && element.minuteDefaut != null) {
				element.dateHeure = element.heureDefaut;			
				element.dateMinute = element.minuteDefaut;
			} else {
				element.dateHeure 	= null;
				element.dateMinute	= null;
			}
		}

		element.valeurSaisie = 	element.dateJour + element.dateMois + element.dateAnnee
		
		if (element.dateHeure != null && element.dateMinute != null) {
			element.valeurSaisie += element.dateHeure + element.dateMinute;
		}
									
	} else if ( element.format == "JMA" ){
	
		element.dateJour  = element.valeurSaisie.substr(0,2) ;
		element.dateMois  = element.valeurSaisie.substr(2,2) ;
		element.dateAnnee = element.valeurSaisie.substr(4,4) ;
		
		if ( element.dateAnnee.length == 2 )
		{
			element.dateAnnee = "20" + element.dateAnnee ;
		} 
		
	} else if ( element.format == "MA" ){
	
		element.dateJour  = "01";
		element.dateMois  = element.valeurSaisie.substr(0,2);
		element.dateAnnee = element.valeurSaisie.substr(2,4);
		
		if ( element.dateAnnee.length == 2 )
		{
			element.dateAnnee = "20" + element.dateAnnee ;
		} 		
		
	} else if( element.format == "J" ) {
	
		element.dateJour  = element.valeurSaisie ;
		element.dateMois  = "01" ;
		element.dateAnnee = "0000" ;	
					
	} else if ( element.format == "JM" ) {
	
		element.dateJour  = element.valeurSaisie.substr(0,2) ;
		element.dateMois  = element.valeurSaisie.substr(2,2) ;
		element.dateAnnee = "0000" ;
		
	} else	{
	
		element.dateJour  = "01" ;
		element.dateMois  = element.valeurSaisie.substr(0,2) ;
		element.dateAnnee = element.valeurSaisie.substr(2,4) ;
		
		if ( element.dateAnnee.length == 2 ) 
		{
			element.dateAnnee = "20" + element.dateAnnee ;
		} 
	}
}

/**
 * Date2_getValeurAffichage : fonction de mise en forme du format de sortie du champ
 *
 * entrée 	: 	element : element html
 * sortie 	: 	la valeur d'affichage de la date
 */
 
function Date2_getValeurAffichage( element )
{
	var affichage = null;
	
	if ( element.valeurSaisie != "" )
	{
		if ( element.format == "MA" ) {
			
			return ( element.dateMois + element.dateSeparateur + element.dateAnnee ) ;
			
		} else if ( element.format == "J" ) {
			
			return ( element.dateJour ) ;
			
		} else if ( element.format == "JM" ) {
			
			return ( element.dateJour + element.dateSeparateur + element.dateMois ) ;
			
 		} else if ( element.format == "JMAHM" ) {
			
			affichage = element.dateJour 	+ element.dateSeparateur + 
						element.dateMois 	+ element.dateSeparateur + 
						element.dateAnnee;
						
			if (element.dateHeure != null && element.dateMinute != null) {
				affichage += element.dateSeparateurDateHeure + 
							 element.dateHeure 	+ element.dateSeparateurHeure + 
							 element.dateMinute;
			}
			
			return affichage;			
			
		} else if ( element.format == "JMAHMS" ) {
			
			return ( 	element.dateJour 	+ element.dateSeparateur + 
						element.dateMois 	+ element.dateSeparateur + 
						element.dateAnnee 	+ element.dateSeparateurDateHeure + 
						element.dateHeure 	+ element.dateSeparateurHeure + 
						element.dateMinute 	+ element.dateSeparateurHeure + 
						element.dateSeconde ) ;
			
		} else {
			
			return ( element.dateJour + element.dateSeparateur + element.dateMois + element.dateSeparateur + element.dateAnnee ) ;
		}
	}
	else {
		return element.valeurSaisie ;
	}		
}

/**
 * Date2_ctrTypageSaisie : fonction de contrôle de la validité du typage en sortie du champ
 *
 * entrée 	: 	element : element html
 * sortie 	: 	code erreur
 */

function Date2_ctrTypageSaisie(element)
{
	var iErreur ;
	var bTest ;
	var regExp ;
	
	if (element.format == "MA" )
	{
		regExp = new RegExp( "[0-9]{4,6}" ) ;
		bTest = ( regExp.test(element.valeurSaisie) ) ;
		
		if ( !bTest )
		{
			iErreur = 1 ;
		}
		
	} else if ( element.format == "JM" ) {
	
		regExp = new RegExp("[0-9]{4}") ;
		bTest  = ( regExp.test(element.valeurSaisie) ) ;
		
		if ( !bTest )
		{
			iErreur = 2 ;
		}
		
	} else if ( element.format == "J" ) {
	
		regExp = new RegExp("[0-9]{2}") ;
		bTest  = ( regExp.test(element.valeurSaisie) ) ;
		
		if ( !bTest )
		{
			iErreur = 4 ;
		}

 } else if ( element.format == "JMAHM" ) {
	
		regExp = new RegExp("[0-9]{8}([0-9]{4})?") ;
		bTest  = ( regExp.test(element.valeurSaisie) ) ;
		
		if ( !bTest )
		{
			iErreur = 5 ;
		}		
		
	} else if ( element.format == "JMAHMS" ) {
	
		regExp = new RegExp("[0-9]{8}([0-9]{6})?") ;
		bTest  = ( regExp.test(element.valeurSaisie) ) ;
		
		if ( !bTest )
		{
			iErreur = 6 ;
		}
		
	} else {
	
		regExp = new RegExp("[0-9]{6,8}") ;
		bTest  = ( regExp.test(element.valeurSaisie) ) ;
		
		if ( !bTest )
		{
			iErreur = 3 ;
		}
	}
	
	if ( bTest )
	{
		return 0 ;
	}		
	else
	{
		return iErreur ;
	}	
}

/**
 * Date2_ctrValidite : fonction de contrôle de la validité de la saisie en sortie du champ
 *
 * entrée 	: 	element : element html
 * sortie 	: 	le code erreur
 */

function Date2_ctrValidite( element )
{
	var iJour      = parseInt(element.dateJour, 10) ;
	var iMois      = parseInt(element.dateMois, 10) ;
	var iAnnee     = parseInt(element.dateAnnee, 10) ;
	var bJourAnnee = ( (iJour>0) && ((iAnnee>0) || (element.format == "JM") || (element.format == "J")) ) ; 
	var bTest      = true ;
	var bLimite    = true ;

	if ( (iMois == 1) || (iMois == 3) || (iMois == 5) || (iMois == 7) || (iMois == 8) || (iMois == 10) || (iMois == 12) )
	{
		bTest = ( iJour < 32 ) ;		//mois à 31 jours
	}		
	else if ( (iMois == 4) || (iMois == 6) || (iMois == 9) || (iMois == 11) )
	{
		bTest = ( iJour < 31 ) ;		//mois à 30 jours
	}		
	else if (iMois==2)
	{
		if ( ((iAnnee % 4) == 0) &&  (   ((iAnnee % 100) != 0) || ((iAnnee % 400) == 0)) )
		{
			bTest = ( iJour < 30 ) ;	//mois à 29 jours
		}			
		else
		{
			bTest = ( iJour < 29 ) ;	//mois à 28 jours
		}
	}		
	else
	{
		bTest = false ;
	}	

	bLimite = ( (iAnnee >= 1800) || (element.format == "JM")  || (element.format == "J") ) ;
	
	
	if(element.format == "JMAHM") {
	
		var iHeure      = parseInt(element.dateHeure, 10) ;
		var iMinute     = parseInt(element.dateMinute, 10) ;
		
		if ( iHeure > 23) {
			bTest = false;
		}
		
		if ( iMinute > 59) {
			bTest = false;
		}		
	}
	
	if(element.format == "JMAHMS") {
	
		var iHeure      = parseInt(element.dateHeure, 10) ;
		var iMinute     = parseInt(element.dateMinute, 10) ;
		var iSeconde    = parseInt(element.dateSeconde, 10) ;
		
		if ( iHeure > 23) {
			bTest = false;
		}
		
		if ( iMinute > 59) {
			bTest = false;
		}
		
		if ( iSeconde > 59) {
			bTest = false;
		}
	}

	if ( (bTest) && (bJourAnnee) && (bLimite) )
	{
		return 0 ;
	}
	else	
	{
				if(element.format == "J") 		return 4;
		else 	if(element.format == "JMAHMS" || element.format == "JMAHM") 	return 7;
		else	return 10 ;
	}	
}

/**
 * Date2_testDate : MAJ à la date du jour
 *
 * entrée 	: 	
 * sortie 	: 	
 */

function Date2_testDate(ident)
{
	var element 	= document.getElementById(ident) ;
	var retour  	= true ;
	var tabDate 	= element.value.split('/') ;
	var dateDeb 	= new Date(tabDate[2],tabDate[1]-1,tabDate[0]) ;
	var dateDuJour 	= new Date() ;
	   
	dateDuJour.setHours(0) ;
	dateDuJour.setMilliseconds(0) ;
	dateDuJour.setSeconds(0) ;
	dateDuJour.setMinutes(0) ;

	if( dateDuJour > dateDeb )
	{
		if ( confirm("Date de début d'application antérieure à la date du jour :\nVoulez-vous la remplacer par la date du jour ?") )
		{
			var jj = dateDuJour.getDate().toString() ;
			var mm = (dateDuJour.getMonth()+1).toString() ;
			var aa = dateDuJour.getFullYear().toString() ;
			if(jj.length < 2) jj = "0" + jj ;
			if(mm.length < 2) mm = "0" + mm ;
			element.value=jj + "/" + mm + "/" + aa ;
		}
		else retour = false ;
	}
	
	return retour ;
}