/**********************************************************************************************************************************************

	Nom 			: Fabrique.js
	Description		: Fabrique des objets JavaScrip
	Version			: 0.1
	Auteur			: ELG

***********************************************************************************************************************************************/

/**
 *	Contructeur
 */
 
function Fabrique()
{
	// Composants
	
	this.date				= null;
	this.longitude			= null;
	this.latitude			= null;
	
	this.entier				= null;
	this.entierPositif		= null;
	this.texteArea			= null;
	this.texte				= null;
	this.majuscule			= null;
	this.decimal			= null;
	this.tel				= null;
	this.alphanumerique 	= null;
	this.hexadecimal 		= null;
	this.heure				= null;
	this.heure2				= null;
	
	this.email				= null;
	
	this.pagination			= null;
	this.tri				= null;
	
	// Méthodes	publiques	
	this.charger    = Fabrique_charger;	
	
	// Attributs publics
	// Mettre à "true" pour gérer la saisie rapide
	this.gestionSaisieRapide	= false;
}


// --------------------- Méthodes Publiques -------------------------------------


/**
 * Fabrique_charger : charger les différents objets 
 *
 * entrée 	: 	
 * sortie 	: 	
 */
 
function Fabrique_charger() {
	try {
	
        // Instanciation des composants graphiques
        this.date 				= new Date2();
		this.entier 			= new Entier();
		this.entierPositif		= new EntierPositif;
		this.tel 				= new Tel();
		this.majuscule 			= new Majuscule();
		this.decimal 			= new Decimal();
		this.texteArea			= new TexteArea();	
		this.texte 				= new Texte();	
		this.longitude			= new Longitude();	
		this.latitude			= new Latitude();	
		this.alphanumerique 	= new Alphanumerique();
		this.hexadecimal 		= new Hexadecimal();
		this.heure 				= new Heure();
		this.heure2				= new Heure2();
		
		this.pagination			= new Pagination();	
		this.tri				= new Tri();
		
		this.email				= new Email();
		this.phone				= new Phone();
			
    } catch( exception ) {
        alert(exception.message + " dans Fabrique.charger()");
    }
}