// get X offset of the map in the page (IE)
function getOffsetX(imgElem) {
	xPos = document.images[imgElem].offsetLeft;
	tempEl = document.images[imgElem].offsetParent;
	while (tempEl != null) {
    	xPos += tempEl.offsetLeft;
	    tempEl = tempEl.offsetParent;
	}
	
	return xPos;
}

// get Y offset of the map in the page (IE)
function getOffsetY(imgElem) {
	yPos = document.images[imgElem].offsetTop;
	tempEl = document.images[imgElem].offsetParent;
	while (tempEl != null) {
		yPos += tempEl.offsetTop;
		tempEl = tempEl.offsetParent;
  	}
  	
	return yPos;
}

oldMenuId = -1;

function switchMenu(id) {
	var menu = document.getElementById("menu"+id);
	if (menu.style.visibility=='visible') {
		hideMenu(id);
	} else {
		showMenu(id);
	}
}

function showMenu(id) {
	if (oldMenuId != -1) {
		hideMenu(oldMenuId)
	}
	oldMenuId = id;
	var menu = document.getElementById('menu'+id);
	menu.style.left = (getOffsetX('action'+id) - 146) + 'px';
	menu.style.top = (getOffsetY('action'+id) + 12) + 'px';
	menu.style.visibility='visible';
}

function hideMenu(id) {
	document.getElementById('menu'+id).style.visibility='hidden';
	oldMenuId = -1;
}

/**
 * Cache le menu actuellement ouvert (s'il y en a un)
 */
function hideCurrentMenu() {
	 if (oldMenuId != -1) {
	   hideMenu(oldMenuId);
	   oldMenuId = -1;
	 }
}
