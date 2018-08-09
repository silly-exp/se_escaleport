/**********************************************************************************************************************************************

	Nom		        : Decimal.js
	Description		: Objet permettant la gestion des heures dans les champs de saisie
	Version			   : 0.1
	Auteur			    : EFO

 ***********************************************************************************************************************************************/

/**
 *	Contructeur
 */
function Heure2()
{
	// Constantes
	this.separateur	= ":" ;	// S�parateur netre heures et minutes

	// Expression r�guli�re pour les touches pouvant �tre saisies
	this.regExpToucheSep	  = new RegExp("[\\" + this.separateur + "]") ; 		
	this.regExpToucheHeure	= new RegExp("[0-9\\" + this.separateur + "]") ; 				

	// M�thodes	publiques	
	this.onBlur          = Heure2_onBlur;
	this.onKeypress      = Heure2_onKeypress;
	this.onFocus         = Heure2_onFocus;

	// M�thode priv�es
	this.splitDate  = Heure2_splitDate;
	this.verifdate 	= Heure2_verifdate;
	this.formatDate	= Heure2_formatDate;
}

//--------------------- M�thodes Publiques -------------------------------------

/**
 * Heure_onFocus : fonction de gestion d'entr�e dans le champ
 *
 * entr�e 	: 	event : evenement JavaScript
 * sortie 	: 	n�ant
 */
function Heure2_onFocus(event)
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
 * Heure_onKeypress : fonction de controle de la validit� de la touche frapp�e
 *
 * entr�e 	: 	event : evenement JavaScript
 * sortie 	: 	n�ant
 */

function Heure2_onKeypress(event)
{
	var element = getElement(event);
	var keyCode = getKeyCode(event);	
	if(keyCode != 13 )
	{
		var key = String.fromCharCode(getKeyCode(event)) ;

		// Saisie que des [0-9\:] pour une Heure

		if(element.value.indexOf(this.separateur) != -1 && this.regExpToucheSep.test(key)) // il y a un : d�j� saisi
		{
			return event.returnValue = false;
		}
		else if( this.regExpToucheSep.test(key) ) 
		{
			return true;
		}
		else if ( keyCode == 8 || keyCode == 0)
		{
			return true;
		}
		else
		{
			return event.returnValue = (this.regExpToucheHeure.test(key)); 
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
 * entr�e 	: 	event : evenement JavaScript
 * sortie 	: 	n�ant
 */
function Heure2_onBlur(event, saisieRapide)
{
	var element 	= getElement(event);	
	var dateTab		;
	var msgErreur	= "";
	var iErreur		;
	if(element.value != ""){
	
		dateTab = this.splitDate(element);
		iErreur = this.verifdate(dateTab);
	}
	if(iErreur === 1)
		msgErreur = "Format du champs incorrecte. \n Le format de l'heure est hh:mm.";
	else if(iErreur === 2)
		msgErreur = "Les heures ne doivent pas d�passer 23. \n Le format de l'heure est hh:mm.";
	else if(iErreur === 3)
		msgErreur = "Les minutes doivent �tre comprises entre 0 et 59. \n Le format de l'heure est hh:mm.";

	if(iErreur > 0)
	{
		event.returnValue = false;
		gestionErreur(element, msgErreur);
		element.select();
	}else {
		element.value = this.formatDate(dateTab);
	}
	
	event.cancelBubble = true;

	// Suppression de la validation entr�e si il y a une erreur
	if(iErreur > 0) {
		element.validerEntree = null;
	} else {
		window.top.entreeOK = "true";
	}

	gestionOnBlurSaisieRapide(event, saisieRapide, iErreur);

	return (iErreur == 0);
}


//--------------------- M�thodes Priv�es -------------------------------------

/**
 * Heure2_splitDate : Recupere l'heure et la minute introduite
 *
 * entr�e 	: 	element : element html
 * sortie 	: 	Tableau[heure, minute]
 */
function Heure2_splitDate(element)
{

	var date = element.value;
	var hrs;
	var min;
	var result;
	if(date.indexOf(':')!==-1){
		var val = element.value.split(this.separateur);
		hrs = val[0];
		min = val[1];
	}else{

		var length = date.length;
		if(length==2 || length ==1){
			hrs = date;
			min = "00";
		}else if(length>=3 && length<=4){

			min = date.slice(-2);
			hrs = date.replace(min,"");
		}
	}

	result = [hrs,min];
	return result;
}

/**
 * Heure2_verifdate : Verifie la coh�rance de l'heure introduite
 * 
 * entr�e 	: 	element : Tab[heure, minute]
 * sortie 	: 	code erreur
 * 
 */
function Heure2_verifdate(dateTab){

	var hrs = dateTab[0];
	var min = dateTab[1];

	if(hrs==null&&min==null){
		return 1;
	}else if(hrs>23){
		return 2;
	}else if (min>59) {
		return 3;
	}
	return 0;
}

/**
 * Heure2_formatDate : fonction de mise en forme du format de sortie du champ
 * 
 * entr�e 	: 	element : Tab[heure, minute]
 * sortie 	: 	la valeur d'affichage de l'heure
 * 
 */
function Heure2_formatDate(dateTab){
	
	var hrs = dateTab[0];
	var min = dateTab[1];

	if(hrs.length <2) 
	{
		hrs = "0" + hrs;
	}
	
	return (hrs+":"+min);
}