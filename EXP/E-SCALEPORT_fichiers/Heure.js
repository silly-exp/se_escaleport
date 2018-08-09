/**********************************************************************************************************************************************

	Nom		        : Decimal.js
	Description		: Objet permettant la gestion des heures dans les champs de saisie
	Version			   : 0.1
	Auteur			    : EFO

***********************************************************************************************************************************************/

/**
 *	Contructeur
 */
function Heure()
{
	// Constantes
	this.separateur	= ":" ;	// Séparateur netre heures et minutes
	
	// Expression régulière pour les touches pouvant être saisies
	this.regExpToucheSep	  = new RegExp("[\\" + this.separateur + "]") ; 		
	this.regExpToucheHeure	= new RegExp("[0-9\\" + this.separateur + "]") ; 				

	// Méthodes	publiques	
	this.onBlur          = Heure_onBlur;
	this.onKeypress      = Heure_onKeypress;
	this.onFocus         = Heure_onFocus;
	
	// Méthode privées
	this.afficherValeur  = Heure_afficherValeur;
}

// --------------------- Méthodes Publiques -------------------------------------

/**
 * Heure_onFocus : fonction de gestion d'entrée dans le champ
 *
 * entrée 	: 	event : evenement JavaScript
 * sortie 	: 	néant
 */
function Heure_onFocus(event)
{
	var element = getElement(event);
	var espace 	= element.espace;
	var i;
	
	if(element.init != "true")
	{
		element.erreur        = false;	// Gestion element.erreur
		element.init          = "true";
	}
	
	element.select();
	event.returnValue = false;
}

/**
 * Heure_onKeypress : fonction de controle de la validité de la touche frappée
 *
 * entrée 	: 	event : evenement JavaScript
 * sortie 	: 	néant
 */
 
function Heure_onKeypress(event)
{
	var element = getElement(event);
	var keyCode = getKeyCode(event);	
	
	if(keyCode != "13")
	{
		var key = String.fromCharCode(getKeyCode(event)) ;
			
		// Saisie que des [0-9\:] pour une Heure
		if(element.value.indexOf(this.separateur) != -1)  // il y a un : déjà saisi
		{
			if(this.regExpToucheSep.test(key)) 
				return event.returnValue = false;
			else 
				event.returnValue = (this.regExpToucheHeure.test(key)); 
		} 
		else 
		{
			if (this.regExpToucheSep.test(key)) // Saisie du :
				return true;
			else 
				event.returnValue = (this.regExpToucheHeure.test(key));
		}
		
		element.validerEntree = null;
		
	} else {
		element.validerEntree = true;
		element.blur();
		event.cancelBubble = true;
	}
}

/**
 * Heure_onBlur : fonction de gestion de la sortie du champ
 *
 * entrée 	: 	event : evenement JavaScript
 * sortie 	: 	néant
 */
 
function Heure_onBlur(event, saisieRapide)
{
	var element 	= getElement(event);	
	var iErreur		= 0;
	var msgErreur	= "";
		
	if(element.value != "") 
		iErreur = this.afficherValeur(element);

	if(iErreur == 1)
		msgErreur = "Les heures ne doivent pas dépasser 999";
	
	if(iErreur == 2)
		msgErreur = "Les minutes doivent être comprises entre 0 et 59";
	
	if(iErreur > 0)
	{
		event.returnValue = false;
		gestionErreur(element, msgErreur);
		element.select();
	}
	
	event.cancelBubble = true;
	
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
 * Heure_afficherValeur : fonction de mise en forme du format de sortie du champ
 *
 * entrée 	: 	element : element html
 * sortie 	: 	la valeur d'affichage de l'heure
 */
 
function Heure_afficherValeur(element)
{
 var val = element.value.split(this.separateur);
 var hrs = val[0];
 var min = val[1];
 var i;
	
	if (hrs > 999) 
	{
		return 1;
	}
	
 if (min != null && min != "")
 {
 	if (min > 59)
 	{
 		return 2;
 	} 
 	else 
 	{
   for (i = 0; i < (2 - min.length); i++) 
   {
   	element.value += "0";
   }
 	}
 } 
 else 
 {
 	if (element.value.indexOf(this.separateur) == -1)
 	{
 		element.value += ":";
 	}
 	element.value += "00";
 }
	
	return 0;
}