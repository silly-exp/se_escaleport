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
	// M�thodes	publiques	
	this.changerPage            	= Pagination_changerPage;
} 

// --------------------- M�thodes Publiques -------------------------------------

/**
 * Pagination_changerPage : fonction de changement de page
 *
 * entr�e 	: 	form	 	: formulaire html
 *				win			: le conteneur des autres composant (window.top en g�n�ral)		
 * 				numPage		: le num�ro de page � afficher	
 * 				idEvent		: l'identifiant de l'�v�nement
 * 				target		: la target cliente				
 * sortie 	: 	n�ant
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