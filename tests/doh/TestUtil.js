var dom;
var lang;
var has;

require([
	"dojo/dom",
	"dojo/_base/lang",
	"dojo/has",
	"doh/runner"	//doh functions
], function (dojoDom, dojoLang, dojoHas) {
	dom = dojoDom;
	lang = dojoLang;
	has = dojoHas;
});

function fireOnInput(obj) {
	var anchorNode;
	if (typeof obj === "string") {
		var demoWidget = document.getElementById(obj);
		anchorNode = demoWidget;
	} else {
		anchorNode = obj;
	}
	if (has('ie') < 9) {
		anchorNode.fireEvent("onpropertychange");
	} else {
		var e = document.createEvent('Events');
		e.initEvent('input', true, true);
		anchorNode.dispatchEvent(e);
	}
}

function fireOnClick(obj, eventMixin) {
	var anchorNode;
	if (typeof obj === "string") {
		var demoWidget = document.getElementById(obj);
		anchorNode = demoWidget;
	} else {
		anchorNode = obj;
	}
	if (has('ie') < 9) {
		anchorNode.fireEvent("onclick");
	} else {
		var e = document.createEvent('Events');
		e.initEvent('click', true, true);
		anchorNode.dispatchEvent(lang.mixin(e, eventMixin));
	}
}

function fireOnMouseDown(obj, eventMixin) {
	var anchorNode;
	if (typeof obj === "string") {
		var demoWidget = document.getElementById(obj);
		anchorNode = demoWidget;
	} else {
		anchorNode = obj;
	}
	if (has('ie') < 9) {
		anchorNode.fireEvent("onmousedown");
	} else {
		var eventName = "mousedown";
		if (has('ie') >= 10) {
			eventName = "MSPointerDown";
		}
		var e = document.createEvent('Events');
		e.initEvent(eventName, true, true);
		anchorNode.dispatchEvent(lang.mixin(e, eventMixin));
	}
}
function fireOnMouseUp(obj, eventMixin) {
	var anchorNode;
	if (typeof obj === "string") {
		var demoWidget = document.getElementById(obj);
		anchorNode = demoWidget;
	} else {
		anchorNode = obj;
	}
	if (has('ie') < 9) {
		anchorNode.fireEvent("onmouseup");
	} else {
		var eventName = "mouseup";
		if (has('ie') >= 10) {
			eventName = "MSPointerUp";
		}
		var e = document.createEvent('Events');
		e.initEvent(eventName, true, true);
		anchorNode.dispatchEvent(lang.mixin(e, eventMixin));
	}
}

function fireTouchEvent(eventtype, node, x, y) {
	var e;
	if (has('ie') < 9) {
		e = document.createEventObject(window.event);
		e.button = 1;
		e.pageX = x;
		e.pageY = y;
		node.fireEvent("on" + eventtype[1], e);
	} else {
		e = document.createEvent('Events');
		e.initEvent(dojo.has('touch') ? eventtype[0] : eventtype[1], true, true);
		e.touches = [
			{ pageX: x, pageY: y }
		];
		e.pageX = x;
		e.pageY = y;
		e.changedTouches = e.touches;
		node.dispatchEvent(e);
	}
}

/*
 function fireTouchStart(node, x, y){
 fireTouchEvent(["touchstart", "mousedown"], node, x, y);
 }

 function fireTouchEnd(node, x, y){
 fireTouchEvent(["touchend", "mouseup"], node, x, y);
 }

 function fireTouchMove(node, x, y){
 fireTouchEvent(["touchmove", "mousemove"], node, x, y);
 }
 */

function verifyListItem(id, text, rightText, domButtonType, hasIcon, hasRightIcon, hasIcon2, hasVariableHeight, regExp, hasSelected, isSprite) {
	var demoWidget = dom.byId(id);
	doh.assertNotEqual(null, demoWidget, "ListItem: Did not instantiate. id=" + id);
	doh.assertEqual('duiListItem' + (hasVariableHeight ? " duiVariableHeight" : "") + (hasSelected ? " duiListItemSelected" : ""), demoWidget.className, "id=" + id);
	var childNodes = demoWidget.children;
//	doh.assertEqual('duiListItemAnchor' + (hasIcon?'':' duiListItemAnchorNoIcon'), childNodes[0].className);

//	doh.assertEqual('A', childNodes[0].tagName);

//	childNodes = childNodes[0].childNodes;

	var i = 0;
	if (hasIcon) {
		if (!has('ie') && regExp) {
			if (isSprite) {
				doh.assertTrue(childNodes[i].childNodes[0].src.search(regExp) != -1, "search " + regExp.toString());
			} else {
				doh.assertTrue(childNodes[i].src.search(regExp) != -1, "search " + regExp.toString());
			}
		}
		doh.assertTrue(dojo.hasClass(childNodes[i], 'duiListItemIcon'), 'duiListItemIcon id=' + id + " got: " + childNodes[i].className);
		i++;
	}

	if (hasRightIcon) {
		if (domButtonType) {
			doh.assertEqual(domButtonType + ' duiDomButton', childNodes[i].childNodes[0].className, "id=" + id);
		}
		doh.assertTrue(dojo.hasClass(childNodes[i], 'duiListItemRightIcon'), 'duiListItemRightIcon id=' + id + " got: " + childNodes[i].className);
		i++;
	}

	if (hasIcon2) {
		doh.assertTrue(dojo.hasClass(childNodes[i], 'duiListItemRightIcon2'), 'duiListItemRightIcon2 id=' + id + " got: " + childNodes[i].className);
		i++;
	}

	if (rightText) {
		doh.assertEqual(rightText, dojo.isFF == 3.6 ? childNodes[i].childNodes[0].innerHTML : childNodes[i].innerHTML, "id=" + id); //2 0r 3
		doh.assertEqual('duiListItemRightText', childNodes[i++].className, "id=" + id);
	}
	if (!hasVariableHeight) {
		doh.assertEqual('duiListItemLabel', childNodes[i].className, "id=" + id);
		doh.assertEqual('DIV', childNodes[i].tagName, "id=" + id);
	} else {
		doh.assertEqual('duiListItemLabel', childNodes[i + 1].className, "id=" + id);
		doh.assertEqual('DIV', childNodes[i + 1].tagName, "id=" + id);
	}

	try {
		doh.assertEqual(text, childNodes[i].innerHTML.replace(/\r\n|\n|\t/g, "").trim(), "id=" + id);
	} catch (e) {
		if (dojo.isFF == 3.6) {
			doh.assertEqual(text, childNodes[i].childNodes[0].innerHTML.replace(/\r\n|\n|\t/g, "").trim(), "id=" + id);
		} else {
			throw e;
		}
	}

}

function verifyListItemPos(id, rTop, rRight, rBottom, rLeft, sTop, sLeft, isSprite) {
	var demoWidget = dom.byId(id);
	var node;
	if (isSprite) {
		node = demoWidget.childNodes[0].childNodes[0];
	} else {
		node = demoWidget.childNodes[0].childNodes[0].childNodes[0];
	}
	verifyRect(node, rTop, rRight, rBottom, rLeft);

	doh.assertEqual(sTop, node.style.top);
	doh.assertEqual(sLeft, node.style.left);
}

function verifyRect(node, rTop, rRight, rBottom, rLeft) {
	var rectArray = node.style.clip.split(/[, ]+/);
	doh.assertEqual("rect(" + rTop, rectArray[0]);
	doh.assertEqual(rRight, rectArray[1]);
	doh.assertEqual(rBottom, rectArray[2]);
	doh.assertEqual(rLeft + ")", rectArray[3]);
}

function verifyIconItem(id, text, display, regExp, isSprite) {
	var demoWidget = dom.byId(id);
	if (!has('ie') && !dojo.isFF) {
		if (isSprite) {
			doh.assertTrue(demoWidget.childNodes[0].childNodes[0].childNodes[0].childNodes[0].src.search(regExp) != -1, "search " + regExp.toString() + " id=" + id);
		} else {
			doh.assertTrue(demoWidget.childNodes[0].childNodes[0].childNodes[0].src.search(regExp) != -1, "search " + regExp.toString() + " id=" + id);
		}
	}
	doh.assertEqual(text, demoWidget.childNodes[0].childNodes[1].childNodes[0].nodeValue, "id=" + id);
	doh.assertEqual(display, demoWidget.paneWidget.style.display, "id=" + id);
	doh.assertEqual('duiIconItemPaneHeading', demoWidget.paneWidget.childNodes[0].className, "id=" + id);
	doh.assertEqual('duiDomButtonBlueMinus duiDomButton', demoWidget.paneWidget.childNodes[0].childNodes[0].childNodes[0].className, "id=" + id);
	doh.assertEqual(text, demoWidget.paneWidget.childNodes[0].childNodes[1].childNodes[0].nodeValue, "id=" + id);
}

function verifyTabBarButton(id, text, classNames, visibility1, visibility2, regExp1, regExp2, isSprite) {
	var demoWidget = dom.byId(id);
	for (var i = 0; i < classNames.length; i++) {
		doh.assertTrue(dojo.hasClass(demoWidget, classNames[i]), classNames[i] + " id=" + id + " className:" + demoWidget.className);
	}
	doh.assertEqual('duiTabBarButtonIconArea', demoWidget.childNodes[0].className, "id=" + id);
	doh.assertEqual('duiTabBarButtonLabel', demoWidget.childNodes[1].className, "id=" + id);
	if (demoWidget.iconNode1) {
		if (!has('ie')) {
			if (isSprite) {
				doh.assertTrue(demoWidget.iconNode1.childNodes[0].src.search(regExp1) != -1, "search " + regExp1.toString() + " id=" + id);
			} else {
				doh.assertTrue(demoWidget.iconNode1.src.search(regExp1) != -1, "search " + regExp1.toString() + " id=" + id);
			}
		}
//		doh.assertEqual(visibility1, demoWidget.iconNode1.style.visibility, "id=" +id);
	} else {
		console.log("There is no iconNode1. id=" + id);
	}
	if (demoWidget.iconNode2) {
		if (!has('ie')) {
			if (isSprite) {
				doh.assertTrue(demoWidget.iconNode2.childNodes[0].src.search(regExp2) != -1, "search " + regExp2.toString() + " id=" + id);
			} else {
				doh.assertTrue(demoWidget.iconNode2.src.search(regExp2) != -1, "search " + regExp2.toString() + " id=" + id);
			}
		}
		doh.assertEqual(visibility2, demoWidget.iconNode2.style.visibility, "id=" + id);
	} else {
		console.log("There is no iconNode2. id=" + id);
	}
	doh.assertEqual(text, demoWidget.labelNode.innerHTML.trim(), "id=" + id);
}
