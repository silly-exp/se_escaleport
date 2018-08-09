/**********************************************************************************************************************************************

	Nom 			: Tri.js
	Description		: Objet permettant la gestion du taglib de Tri
	Version			: 0.1
	Auteur			: ELG

***********************************************************************************************************************************************/

/**
 *	Contructeur
 */
 
function Tri() {
	// Méthodes	publiques	
	this.trier          	= Tri_trier;
} 

// --------------------- Méthodes Publiques -------------------------------------

/**
 * Tri_tier : fonction de tri
 *
 * entrée 	: 	document 	: document html
 *				win			: le conteneur des autres composant (window.top en général)	
 *   			idEvent		: l'identifiant de l'évènement	
 * 				idTri		: le type de tri
 * 				
 * sortie 	: 	néant
 */
 
function Tri_trier(document, win, idEvent, idTri) {

	try	{
		if (confirmationChangement()) {
			if (getJeton()) {
				// Cas particulier du tableau de positions (Polpeche)
				if (typeof document.forms[3] == "undefined") {
					document.forms[2].idEvent.value	= idEvent;
					document.forms[2].idTri.value	= idTri;
					document.forms[2].submit();
				// Cas particulier du tableau des formateurs (Plaisance OED, module Agrement, onglet Formateur)
				} else if (typeof document.forms[3].idTri == "undefined"){
					document.forms[4].idEvent.value	= idEvent;
					document.forms[4].idTri.value	= idTri;
					document.forms[4].submit();
				// Tous les autres cas
				} else {
					document.forms[3].idEvent.value	= idEvent;
					document.forms[3].idTri.value	= idTri;
					document.forms[3].submit();
				}
			}
		}
	} catch (exception)	{
		alert(exception.message + " dans Tri.trier()");
	}
}