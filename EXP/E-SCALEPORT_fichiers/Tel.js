/**********************************************************************************************************************************************

	Nom 			: Tel.js
	Description		: Objet permettant la gestion des numéro de téléphone dans les 
					  champs de saisie
	Version			: 0.1
	Auteur			: ELG

***********************************************************************************************************************************************/

/**
 *	Contructeur
 */
 
function Tel()
{
	// Méthodes	publiques	
	this.onBlur            	= Tel_onBlur;
	this.onKeypress        	= Tel_onKeypress;
	this.onFocus           	= Tel_onFocus;
	
	// Méthode privés
	this.formatValeur   	= Tel_formatValeur;
	this.ctrTypage   		= Tel_ctrTypage;
	
	// constante
	this.separateur 		= " " ;
}

// --------------------- Méthodes Publiques -------------------------------------

/**
 * Tel_onFocus : fonction de gestion d'entrée dans le champ
 *
 * entrée 	: 	event : evenement JavaScript
 * sortie 	: 	néant
 */
 
function Tel_onFocus(event)
{
	var element = getElement(event) ;
	var val ;
	
	element.maxLength = 13 ;
	
	if (element.value.length == 14)	{
		element.nbTel = 10 ;
	} else if(element.value.length == 18) {
		element.nbTel = 13 ;		
	} 
	
	if ( element.init != "true" ) {
		if (element.nbTel == 10 ) {
			val = element.value.substr(0,2) + element.value.substr(3,2) + element.value.substr(6,2) + element.value.substr(9,2) + element.value.substr(12,2) ;
		} else {
			val = element.value.substr(0,3) + element.value.substr(4,2) + element.value.substr(7,2) + element.value.substr(10,2) + element.value.substr(13,2) + element.value.substr(16,2) ;
		}
		
		element.iErreur    		= 0 ;
		element.init    		= "true" ;
		element.valeurSaisie   	= val ;
	}
	
	element.value = element.valeurSaisie ;
	element.select() ;
	event.returnValue = false ;
}

/**
 * Tel_onKeypress : fonction de controle de la validité de la touche frappée
 *
 * entrée 	: 	event : evenement JavaScript
 * sortie 	: 	néant
 */
 
function Tel_onKeypress(event)
{
	var element	= getElement(event);
	var keyCode = getKeyCode(event);
	
	if(keyCode != "13")	{
		var regExp = new RegExp("[0-9]") ;
		
		if (!(regExp.test(String.fromCharCode(keyCode)))) {	
			event.returnValue = false ;
		}	
		
		element.validerEntree = null;
			
	} else {
		element.validerEntree = true;
		element.blur();
		event.cancelBubble = true;
	}	
}

/**
 * Tel_onBlur : fonction de gestion de la sortie du champ
 *
 * entrée 	: 	event : evenement JavaScript
 * sortie 	: 	néant
 */
 
function Tel_onBlur(event, saisieRapide)
{
	var element = getElement(event) ;
	var iErreur = 0;
	
	iErreur 				= 0 ;
	element.valeurSaisie  	= element.value;
	
	if (element.value.length != 0)	{
	
		iErreur = this.ctrTypage(element) ;
		
		if (iErreur == 0) {
			element.value = this.formatValeur(element) ;
		}
	}

	if (iErreur == 1)	{
		event.returnValue = false ;
		gestionErreur(element, "Vous devez saisir un numéro de téléphone à 10 ou 13 chiffres") ;		
		element.select() ;	
	}
	
	event.cancelBubble = true ;
	
	// Suppression de la validation entrée si il y a une erreur
	if(iErreur > 0) {
		element.validerEntree = null;
	} else {
		window.top.entreeOK = "true";
	}
	
	gestionOnBlurSaisieRapide(event, saisieRapide, iErreur);

	return (iErreur == 0);
}

// --------------------- Méthodes Privées -------------------------------------

/**
 * Tel_formatValeur : fonction de mise en forme du format de sortie du champ
 *
 * entrée 	: 	element : element html
 * sortie 	: 	néant
 */


function Tel_formatValeur( element )
{
	var telChaine = "" ;
	var o         = element.value ;
	
	if ( o.length == element.maxLength )
	{
		if (o.length == 10)
		{
			telChaine = o.substring(0,2) 
						+ this.separateur 
						+ o.substring(2,4)
						+ this.separateur  
						+ o.substring(4,6) 
						+ this.separateur  
						+ o.substring(6,8) 
						+ this.separateur   
						+ o.substring(8,10) ;
		}
		else
		{
			telChaine = o.substring(0,3) 
						+ this.separateur   
						+ o.substring(3,5) 
						+ this.separateur   
						+ o.substring(5,7)
						+ this.separateur  
						+ o.substring(7,9) 
						+ this.separateur  
						+ o.substring(9,11) 
						+ this.separateur   
						+ o.substring(11,13) ;
		}
	}
	else
	{
		telChaine = o;
	}
	
	return telChaine ;
}


/**
 * Tel_ctrTypage : fonction de contrôle de la validité du typage en sortie du champ
 *
 * entrée 	: 	element : element html
 * sortie 	: 	le code erreur
 */

function Tel_ctrTypage( element )
{
	var bTest ;
	var regExp_Tel ;
	
	if ( (element.value.length == 10) || (element.value.length == 13) ) 
	{
		element.nbTel 		= element.value.length ;
		regExp_Tel 			= new RegExp( "[0-9]{"+element.nbTel+"}" ) ;
		element.maxLength   = element.nbTel ;
		bTest 				= true ;
	}
	else
	{
		bTest = false ;
	}
	
	if(bTest)
		bTest = regExp_Tel.test(element.value);
	
	if(!bTest)
		element.iErreur = 1 ;

	if(bTest)
		return 0 ;
	else
		return element.iErreur ;
}