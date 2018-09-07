// ==UserScript==
// @name           Nico escaleport Inspect
// @namespace      http://www.developpement-durable.gouv.fr
// @description    Récupère les informations sur la page pour faciliter la configuration des tests selenium
// @include        http://twitter.com/*
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// ==/UserScript==

console.log("===== Nico Escaleport Inspect ======");


    var infoDiv = document.createElement('div');
    infoDiv.id = 'infoFormulaire';
		//infoDiv.style = "color:'#FF0000'";
    infoDiv.innerHTML = "bloc d'information<br>";
    var corps = $(".corpsDePage")[0].appendChild(infoDiv);


    var xpathresult_ = document.evaluate("//td[@class='corpsDePage']/form[@name!='MenuForm']", document, null, XPathResult.ANY_TYPE, null);
    var formElem = xpathresult_.iterateNext();
    //console.log("Formulaire: " + formElem.name);
		infoDiv.innerHTML += "Formulaire: " + formElem.name +"_fields.csv<br>";


		var fieldsInfoArea = document.createElement('textarea');
		fieldsInfoArea.id = "zoneCopierColler";
		fieldsInfoArea.cols = "120";
		fieldsInfoArea.rows = "20";
		infoDiv.appendChild(fieldsInfoArea);



		var fileContent = "//fieldId\tsearchBy\tsearchValue\tinputType\n";

    console.log("fieldId\tsearchBy\tsearchValue\tinputType");
    var xpathresult = document.evaluate("//input | //select", formElem, null, XPathResult.ANY_TYPE, null);
    var field = xpathresult.iterateNext();
    while (field) {
        if (!$(field).is(':visible')) {
          field = xpathresult.iterateNext();
          continue;
        }
      	var inputType ="";
      	if (field.tagName == "SELECT"){ 
          inputType = "select";
        }else{
          inputType = field.type;
        }
        console.log("fieldId\tid\t" + field.id + "\t" + field.tagName );
        fileContent += field.id +"\tid\t" + field.id + "\t" + inputType+"\n";
        field = xpathresult.iterateNext();
    }

$("#zoneCopierColler")[0].textContent = fileContent;