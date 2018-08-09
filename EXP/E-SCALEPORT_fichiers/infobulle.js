function InitBulle(ColTexte,ColFond,ColContour,NbPixel) {
	IB.ColTexte=ColTexte;IB.ColFond=ColFond;IB.ColContour=ColContour;IB.NbPixel=NbPixel;
	if (document.layers) {
		window.captureEvents(Event.MOUSEMOVE);window.onMouseMove=getMousePos;
		document.write("<LAYER name='bulle' top=0 left=0 visibility='hide'></LAYER>");
	}
	if (document.all) {
		document.write("<DIV id='bulle' style='position:absolute;top:0;left:0;width:300;visibility:hidden;'></DIV>");
		document.onmousemove = getMousePos;
	} else if (document.getElementById) {
	        document.onmousemove = getMousePos;
	        document.write("<DIV id='bulle' style='position:absolute;top:0;left:0;width:300;visibility:hidden;'></DIV>");
	}
}

function AffichageBulle(texte) {
  contenu = "<TABLE border=0 cellspacing=0 cellpadding=" + IB.NbPixel ;
  contenu += "><TR bgcolor='"+IB.ColContour+"'><TD><TABLE class='bulle' border=0 cellpadding=2 cellspacing=0 bgcolor='"
  contenu += IB.ColFond+"'><TR><TD>"+texte+"</TD></TR></TABLE></TD></TR></TABLE>";
  var finalPosX = posX - xOffset;
  var finalPosY = posY + yOffset
 
  if (finalPosX < 0) finalPosX = 0;
  if (document.all) {
    bulle.innerHTML = contenu;

    document.all["bulle"].style.top= finalPosY;
    document.all["bulle"].style.left = finalPosX;
    document.all["bulle"].style.visibility = "visible";
  }
    else if (document.getElementById) {
	    document.getElementById("bulle").innerHTML = contenu;
	    document.getElementById("bulle").style.top = finalPosY + "px";
	    document.getElementById("bulle").style.left = finalPosX + "px";
	    document.getElementById("bulle").style.visibility = "visible";
  }
}

function getMousePos(e) {
  if (document.all) {
	  	posX = event.x + document.documentElement.scrollLeft;
  		posY = event.y + document.documentElement.scrollTop;
  } else {
  		posX = e.pageX;
  		posY = e.pageY;
  }
}

function HideBulle() {
	if (document.layers) {document.layers["bulle"].visibility="hide";}
	if (document.all) {document.all["bulle"].style.visibility="hidden";}
	else if (document.getElementById){document.getElementById("bulle").style.visibility="hidden";};
}