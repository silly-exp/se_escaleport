/**********************************************************************************************************************************************

	Nom 			: Decimal.js
	Description		: Objet permettant la gestion des taux dans les champs de saisie
	Version			: 0.1
	Auteur			: ELG

***********************************************************************************************************************************************/

/**
 *	Contructeur
 */
 
function Decimal()
{
	// Constantes
	this.separateurAffichage	= "," ;	// Séparateur pour l'affichage
	this.separateurSaisie 		= "." ;	// Séparateur pour la saisie
	
	// Expression régulière pour les touches pouvant être saisies
	this.regExpToucheVirgule	= new RegExp("[\\,]") ; 		
	this.regExpTouchePoint		= new RegExp("[\\.]") ; 			
	this.regExpToucheDec		= new RegExp("[0-9\\" + this.separateurSaisie + "]") ; 				

	// Méthodes	publiques	
	this.onBlur            		= Decimal_onBlur;
	this.onKeypress        		= Decimal_onKeypress;
	this.onFocus           		= Decimal_onFocus;
	this.afficherValeur     	= Decimal_afficherValeur;
	this.getValeur				= Decimal_getValeur;
	this.controleBorne			= Decimal_controleBorne;
}

// --------------------- Méthodes Publiques -------------------------------------

/**
 * Decimal_onFocus : fonction de gestion d'entrée dans le champ
 *
 * entrée 	: 	event : evenement JavaScript
 * sortie 	: 	néant
 */
 
function Decimal_onFocus(event, min, max, nbEnt, nbDec)
{
	var element = getElement(event);
	var espace 	= element.espace;
	var i;
	
	if(element.init != "true")
	{
		element.valeurSaisie 	= "";		// Valeur stockée
		element.erreur         	= false;	// Gestion element.erreur
		element.init           	= "true";
		element.min				= min;
		element.max				= max;		
		element.nbEnt			= nbEnt;
		element.nbDec			= nbDec;		
		
		if(element.nbDec == null)
			element.nbDec = 2;
		else 
			element.nbDec = element.nbDec * 1;  // Convertir en nombre 
	}
	
	// Récuperation de la valeur décimale (sans l'unite)
	element.valeurSaisie = element.value.toString().replace(this.regExpToucheVirgule,this.separateurSaisie); 
	
	
	// Suppression des espaces
	if(espace == null || (espace != null && espace == "true"))
	{						
		var tab = element.value.split(" ");
		var tmp = "";
	
		for(i=0; i<tab.length;i++) 
		{
			tmp += tab[i];
		}
		element.value = tmp;
	}
	
	element.select();
	event.returnValue = false;
}

/**
 * Decimal_onKeypress : fonction de controle de la validité de la touche frappée
 *
 * entrée 	: 	event : evenement JavaScript
 * sortie 	: 	néant
 */
 
function Decimal_onKeypress(event)
{
	var element = getElement(event);
	var keyCode = getKeyCode(event);	
	var ctrlKey	= getCtrlKey(event);		
	
	if(keyCode != "13")
	{
		var key = String.fromCharCode(getKeyCode(event)) ;
			
		// Conversion de la virgule en point
		if(this.regExpTouchePoint.test(key))   //test du point 
		{
			setKeyCode(event, "44"); // Conversion en virgule
			key = ",";
		}
		
		// Saisie que des [0-9\,] pour un decimal
		if(element.value.indexOf(this.separateurAffichage) != -1)  // il y a une virgule déjà saisie
		{
			if(this.regExpToucheVirgule.test(key)) 
				return event.returnValue = false;
			else 
				event.returnValue = (this.regExpToucheDec.test(key)); 
		} 
		else 
		{
			if (this.regExpToucheVirgule.test(key)) // Saisie de la virgule
				return true;
			else 
				event.returnValue = (this.regExpToucheDec.test(key));
		}
		
		element.validerEntree = null;
		
		if(!event.returnValue && keyCode != 0 && keyCode != 8 && !ctrlKey) {
			return false;
		}
		
	} else {
		element.validerEntree = true;
		element.blur();
		event.cancelBubble = true;
	}
}

/**
 * Decimal_onBlur : fonction de gestion de la sortie du champ
 *
 * entrée 	: 	event : evenement JavaScript
 * sortie 	: 	néant
 */
 
function Decimal_onBlur(event, saisieRapide, quantite)
{
	var element 	= getElement(event);	
	var iErreur		= 0;
	var msgErreur	= "";
	
	// Sauvegarde de la valeur
	element.valeurSaisie = element.value;
	
	if(element.value != "") 
		iErreur = this.afficherValeur(element);
	
	if(iErreur == 1)
		msgErreur = "Vous devez commencer la saisie par un chiffre !";

	if(iErreur == 2)
		msgErreur = "Vous ne devez pas dépasser " + element.nbEnt + " chiffre(s) avant la virgule";

	if(iErreur == 3)
		msgErreur = "La valeur doit être inférieure à " + element.max;
		
	if(iErreur == 4)
		msgErreur = "La valeur doit être supérieure à " + element.min ;	
	
	if(iErreur > 0) {
		event.returnValue = false;
		gestionErreur(element, msgErreur);
		element.select();
	} else {
		window.top.entreeOK = "true";
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


/**
 * Decimal_afficherValeur : fonction de mise en forme du format de sortie du champ
 *
 * entrée 	: 	element : element html
 * sortie 	: 	la valeur d'affichage de la date
 */
 
function Decimal_afficherValeur(element)
{
	if (typeof element == 'string') {
		element = document.getElementById(element);
	}
	var dec      = element.value;
	var espace 	 = element.espace;
	var lg       = -1;
	var aa       = parseFloat(dec.toString().replace(this.regExpToucheVirgule,this.separateurSaisie));
	var bb       = Math.pow(10, parseInt(element.nbDec));
	var cc       = Math.round( aa*bb )/bb;
	var resultat = cc.toString();
	    resultat = resultat.split( "." );
	var ent      = resultat[0];
	var dec	     = resultat[1];
	var result   = "";	
	var nbZero 	 = 0;
	var nbEnt	 = 0;
	var i		 = 0; 
	
	if(dec == null) 
		dec = "";

	if(ent == null || ent == "" || isNaN(ent)) 
		return 1;

	// Récupération du nombre de 0 à ajouter après la virgule
	nbEnt = element.nbEnt - ent.length;
	
	if(nbEnt < 0) 
		return 2;
		
	var iErreur = 0;
	
	iErreur = this.controleBorne(element,cc);
	if(iErreur != 0)
		return iErreur;

	// Ajout des espace 	
	if(espace == null || (espace != null && espace == "true"))
	{
		for(i=0;i<ent.length;i++) 
		{
			if((ent.length-i)%3 == 0) 
			{
				result += " " + ent.substr(i,3);
			}	
		}
		
		result = ent.substr(0,ent.length%3) + result;
	
		if(result.charAt( 0 ) == " ")
			result = result.substr(1);
			
		if( dec != "" & dec != null )
		result = result + "," + dec;
	
		element.value = result;
	}
	else
		element.value = ent + "," + dec;
	
	return 0;
}

/**
 * Decimal_getValeur : fonction de récupération de la valeur au format float
 *
 * entrée 	: 	element : element html
 * sortie 	: 	
 */
 
function Decimal_getValeur(element)
{
	if (typeof element == 'string') {
		element = document.getElementById(element);
	}
	var valeur = element.value;
	valeur = valeur.replace(' ', '').replace(',', '.');
	return valeur == ''? null : parseFloat(valeur);
}

/**
 * Decimal_controleBorne : fonction de contrôle des bornes du champ
 *
 * entrée 	: 	element : element html
 * sortie 	: 	le code erreur
 */
 
function Decimal_controleBorne(element, valeur)
{
	var max 	= null
	var min 	= null;
	
	if(element.max != null)
	{	
		max = parseFloat(element.max);

		if(valeur > max) 
			return 3;
	}
	
	if(element.min != null)
	{	
		min = parseFloat(element.min);

		if(valeur < min) 
			return 4;
	}
	
	return 0;
}
