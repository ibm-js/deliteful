define([
	"intern!object",
	"intern/chai!assert",
	"dojo/dom-geometry",
	"dojo/dom-class",
	"../register"
], function (registerSuite, assert, domGeom, domClass, register) {
	var node;
	var htmlContent =
		"<d-linear-layout id='dlayout' style='height:500px'><div id='divA' class='fill'>A</div>" +
			"<div id='divB' style='height:30px'>B</div></d-linear-layout>";
	registerSuite({
		name: "Vertical LinearLayout",
		setup: function () {
			document.body.innerHTML = htmlContent;
			register.parse(document.body);
			node = document.getElementById("dlayout");
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
			domClass.add(children[1], "fill");
			var box1 = domGeom.getMarginBox(children[0]);
			var box2 = domGeom.getMarginBox(children[1]);
			assert.deepEqual(box1.h, 250);
			assert.deepEqual(box1.h, box2.h);
		},

		teardown: function () {
			document.body.removeChild(document.body.children[0]);
		}
	});
});
