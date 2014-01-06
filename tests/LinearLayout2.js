define([
	"intern!object",
	"intern/chai!assert",
	"dojo/dom-geometry",
	"dojo/dom-class",
	"../register",
	"../LinearLayout"
], function (registerSuite, assert, domGeom, domClass, register) {
	var node;
	var htmlContent =
			"<d-linear-layout id='dlayout' vertical='false' style='width:500px'><div id='divA' class='fill'>A</div>" +
			"<div id='divB' style='width:30px'>B</div></d-linear-layout>";
	registerSuite({
		name: " Horizontal LinearLayout",
		setup: function () {
			document.body.innerHTML = htmlContent;
			register.parse(document.body);
			node = document.getElementById("dlayout");
		},
		"Horizontal LinearLayout Fill Width" : function () {
			var children = node.getChildren();
			assert.deepEqual(2, children.length);
			var box1 = domGeom.getMarginBox(children[0]);
			assert.deepEqual(box1.w, 470);
		},
		"Horizontal LinearLayout Resize" : function () {
			node.style.width = "501px";
			var children = node.getChildren();
			var box1 = domGeom.getMarginBox(children[0]);
			assert.deepEqual(box1.w, 471);
		},
		"Horizontal LinearLayout Children Equal Size" : function () {
			var children = node.getChildren();
			node.style.width = "500px";
			children[1].style.width = "";
			domClass.add(children[1], "fill");
			var box1 = domGeom.getMarginBox(children[0]);
			var box2 = domGeom.getMarginBox(children[1]);
			assert.deepEqual(box1.w, 250);
			assert.deepEqual(box1.w, box2.w);
		},

		teardown: function () {
			document.body.removeChild(document.body.children[0]);
		}
	});
});
