/**********************************************************************************************************************************************

	Nom 			: Pagination.js
	Description		: Objet permettant la gestion du taglib de pagination
	Version			: 0.1
	Auteur			: ELG

***********************************************************************************************************************************************/

/**
 *	Contructeur
 */
 
function Pagination() {
	// Méthodes	publiques	
	this.changerPage            	= Pagination_changerPage;
} 

// --------------------- Méthodes Publiques -------------------------------------

/**
 * Pagination_changerPage : fonction de changement de page
 *
 * entrée 	: 	form	 	: formulaire html
 *				win			: le conteneur des autres composant (window.top en général)		
 * 				numPage		: le numéro de page à afficher	
 * 				idEvent		: l'identifiant de l'évènement
 * 				target		: la target cliente				
 * sortie 	: 	néant
 */
 
function Pagination_changerPage(form, win, numPage, idEvent) {
	try	{
		if (!(typeof confirmationActivee !== 'undefined' && confirmationActivee)
				|| confirmationChangement()) {
			if(getJeton()) {
				form.numPage.value	= numPage;
				form.idEvent.value	= idEvent;
				form.submit();
			}
		}
	} catch (exception)	{
		alert(exception.message + " dans Pagination.changerPage()");
	}
}