define([
	"intern!object",
	"intern/chai!assert",
	"dojo/dom-geometry",
	"requirejs-dplugins/jquery!attributes/classes",
	"delite/register",
	"deliteful/LinearLayout"
], function (registerSuite, assert, domGeom, $, register) {
	var container, node;
	var htmlContent =
		"<d-linear-layout id='dlayout' style='height:500px'><div id='divA' class='fill'>A</div>" +
			"<div id='divB' style='height:30px'>B</div></d-linear-layout>";
	registerSuite({
		name: "Vertical LinearLayout",
		setup: function () {
			container = document.createElement("div");
			document.body.appendChild(container);
			container.innerHTML = htmlContent;
			register.parse(container);
			node = document.getElementById("dlayout");
			node.deliver();
		},
		"Vertical LinearLayout Fill Height" : function () {
			var children = node.getChildren();
			assert.deepEqual(2, children.length);
			var box1 = domGeom.getMarginBox(children[0]);
			assert.deepEqual(box1.h, 470);
		},
		"Vertical LinearLayout Resize" : function () {
			node.style.height = "501px";
			var children = node.getChildren();
			var box1 = domGeom.getMarginBox(children[0]);
			assert.deepEqual(box1.h, 471);
		},
		"Vertical LinearLayout Children Equal Size" : function () {
			var children = node.getChildren();
			node.style.height = "500px";
			children[1].style.height = "";
			$(children[1]).addClass("fill");
			var box1 = domGeom.getMarginBox(children[0]);
			var box2 = domGeom.getMarginBox(children[1]);
			assert.deepEqual(box1.h, 250);
			assert.deepEqual(box1.h, box2.h);
		},
		teardown : function () {
			container.parentNode.removeChild(container);
		}
	});
});
