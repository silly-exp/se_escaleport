/*************************************************************************
	Methode : 		majLargeurEcran
	Description : 	Récupérer la largeur de l'écran et renseigner
					le champ largeur avec cette valeur
	IN  : 
	OUT : 
*************************************************************************/

function majLargeurEcran() {
	try	{
		// Récupération de la largeur de l'écran
		document.MenuForm.largeur.value = screen.width;
	} catch(exception) {
		alert("Exception dans la fonction majLargeurEcran : " + exception.message);
	}
}

/*************************************************************************
	Methode : 		lancerMenu
	Description : 	Lancer une action de la télécommande
	
	IN  : idEvent 	l'évènement à exécuter
	OUT : 
*************************************************************************/

function lancerMenu(idEvent) {
	try	{
	
		if(idEvent != "") {
		
			if(confirmationChangement()) {
			
				if(getJeton()) {
			
					majLargeurEcran();
					
					document.MenuForm.idEvent.value	= idEvent;
					document.MenuForm.submit();
				}
			}
		} else {
			alert("Action inactive");
		}
		
	} catch(exception) {
		alert("Exception dans la fonction lancerMenu : " + exception.message);
	}
}

/*************************************************************************
Methode : 		lancerSousRubrique
Description : 	Lancer une sous-rubrique de la barre de progression

IN  : actionPre l'actionPre ? appeler
OUT : 
*************************************************************************/

function lancerSousRubrique(numeroActionPre, actionPre) {
try	{	
	if(actionPre != "") {	
		if(confirmationChangement()) {
			if(getJeton()) {
				majLargeurEcran();
				document.MenuForm.actionPre.value	= actionPre;				
				document.MenuForm.numeroActionPre.value	= numeroActionPre;
				document.MenuForm.idEvent.value		= 'sousRubrique';
				document.MenuForm.submit();
			}
		}
	} else {
		alert("Action inactive");
	}
	
} catch(exception) {
	alert("Exception dans la fonction lancerSousRubrique : " + exception.message);
}
}




/******************************************************/

// *****
var lastLIObject  = new Array(null, null);
var classNameOver = new Array("menuOver", "sousMenuOver");
var classNameOut  = new Array("menuOut", "sousMenuOut");

//var currentChildObject;
var lastChildObject = null;

// ****
function buildObjectFromQueryString()
{
	// ****
	var rValue = null;
	
	// ****
	var queryString;
	var re;
	var selectedObject;
	var result;
	var id;
	
	// ****
	queryString    = window.document.location.search.substr(1);
	re             = /menu=[0-9]/gi;
	selectedObject = null; 
	result         = null;
	id             = ""; 
	
	// ****
	if(queryString != "")
	{	
		// ****
		result = queryString.match(re);
		
		// ****
		if( result != null )
		{
			id = result[0].replace("=", "_");
			selectedObject = document.getElementById(id);
			rValue         = selectedObject;
		}
	}
	
	// ****
	return rValue;
}


// ****
function showMainMenu(o)
{
	// ****
	var currentChildObject;
	var string;
	
	
	// ****
	lastLIObject[0]    = ( lastLIObject[0] != null ) ? lastLIObject[0] : o;
	currentChildObject = document.getElementById(o.id + "_");

	var li = document.getElementById(o.id);
	
	// ****
	if( lastChildObject != null )
	{
		lastChildObject.style.display = "none";
	}
	
	// ****
	if( currentChildObject != null )
	{
		// ****
		currentChildObject.style.display = "block";
		currentChildObject.style.left = li.offsetLeft-20+"px";
		var isInternetExplorer = (navigator.userAgent.indexOf("MSIE") != -1);
		if (isInternetExplorer) {
			currentChildObject.style.left = li.offsetLeft-40+"px";
	   	}
	} 

	// ****
	lastChildObject = currentChildObject;
	
	// ****
	lastLIObject[0].className = classNameOut[0];
	o.className               = classNameOver[0];
	
	// ****
	lastLIObject[0] = o;
	
}

// ****
function showSousMenu(o)
{
	// ****
	lastLIObject[1] = ( lastLIObject[1] != null ) ? lastLIObject[1] : o;
	
	// ****		
	lastLIObject[1].className = classNameOut[1];
	o.className               = classNameOver[1];
	
	// ****
	lastLIObject[1] = o;
}

// ****
function raz()
{
	// ****
	var id;
	var o;
	
	// **** Remize à ZERO des styles
	if( lastLIObject[1] != null )
	{
		lastLIObject[1].className = classNameOut[1];
		lastLIObject[1] = null;
	}
	
	// ****
	if( lastLIObject[0] != null )
	{
		// ****
		o = document.getElementById(lastLIObject[0].id + "_");
		
		// ****
		if( o != null )
		{
			o.style.display = "none";
		}
		
		// ****
		lastLIObject[0].className = classNameOut[0];
		lastLIObject[0] = null;
	}
}	

// ****
function initMenu()
{
	// ****
	var i, iMax;
	var j, jMax;
	var c0, c1, c2, o, oo, id;
	var body;
	var index;
	
	// ****
	window.document.onclick = raz;
		
	// ****
	o    = document.getElementById("menu");
	c0   = o.getElementsByTagName("li");// Collection des LI dans le block " menu "
	iMax = c0.length;
	
	// ****
	lastLIObject[0] = buildObjectFromQueryString();
	
	// ****
	for(i = 0; i < iMax; i++)
	{
		// ****
		if( (lastLIObject[0] != null) && (c0[i].id == lastLIObject[0].id) )
		{
			c0[i].className = classNameOver[0];
		}
		
		// ****
		c0[i].onmouseover = function(){showMainMenu(this)};// affecte un gestionnaire d'évènement " onmouseover "
		c0[i].onfocus     = function(){showMainMenu(this)};// affecte un gestionnaire d'évènement " onmouseover "
		
		// **** Pour IE
		if(document.all)
		{
			// ****
			oo = c0[i].getElementsByTagName("a")[0];
			oo.onfocus = function(){ showMainMenu(this.parentElement) };
		}	
		
		// ****
		o = document.getElementById(c0[i].id + "_");
		
		// ****
		if( o != null )
		{	
			// ****
			o.style.display = "none";
			o.style.position = "absolute";
			o.style.top = "1.2em";
			o.style.left = "5px";
			
			// ****
			c1 = o.getElementsByTagName("li");// Collection des LI dans le block " sous-menu "
			c2 = o.getElementsByTagName("span");// Collection des SPAN dans le block " sous-menu "
			jMax = c1.length;
			
			// ****
			for(j = 0; j < jMax; j++)
			{
				// ****
				c1[j].onmouseover = function(){showSousMenu(this)};
				c1[j].onfocus     = function(){showSousMenu(this)};
							
				// **** Pour IE
				if(document.all)
				{
					// ****
					oo = c1[j].getElementsByTagName("a")[0];
					oo.onfocus = function(){ showSousMenu(this.parentElement) };
				}	
			}
			
			// ****
			if( c2.length > 0 )
			{
				c2[0].style.display = "none";// Cache les titre de liste
			}
			
		}
	}
}