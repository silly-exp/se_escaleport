// ==UserScript==
// @name           Nico escaleport Inspect
// @namespace      http://www.developpement-durable.gouv.fr
// @description    Affiche sous forme de dict python la liste des champs visibles du formulaire affcihé pour faciliter la configuration des tests selenium
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// ==/UserScript==

console.log("===== Nico Escaleport Inspect ======");

// Ajout d'une div en bas de page contenant les informations à afficher
var infoDiv = document.createElement('div');
infoDiv.id = 'infoFormulaire';
infoDiv.innerHTML = "bloc d'information<br>";
var corps = $(".corpsDePage")[0].appendChild(infoDiv);

var fieldsInfoArea = document.createElement('textarea');
fieldsInfoArea.id = "zoneCopierColler";
fieldsInfoArea.cols = "120";
fieldsInfoArea.rows = "20";
infoDiv.appendChild(fieldsInfoArea);



var configContent = "{";

var xpathresult_ = document.evaluate("//td[@class='corpsDePage']/form[@name!='MenuForm']", document, null, XPathResult.ANY_TYPE, null);
var formElem = xpathresult_.iterateNext();
var xpathresult = document.evaluate("//input | //select", formElem, null, XPathResult.ANY_TYPE, null);
var field = xpathresult.iterateNext();
while (field) {
    // On ne retient que les champs visibles.
    if (!$(field).is(':visible')) {
        field = xpathresult.iterateNext();
        continue;
    }
    var inputType = "";
    if (field.tagName == "SELECT") {
        inputType = "select";
    } else {
        inputType = field.type;
    }
    //console.log("fieldId\tid\t" + field.id + "\t" + field.tagName );
    configContent += "\"" + field.id + "\": \"<" + inputType + ">\",\n";
    field = xpathresult.iterateNext();
}
configContent = configContent.slice(0, -2) + "}";

$("#zoneCopierColler")[0].textContent = configContent;