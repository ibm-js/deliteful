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
			"<d-linear-layout id='dlayout' vertical='false' style='width:680px'>" +
				"<div id='divA' style='width:40px'>A</div>" +
				"<div id='divB' class='fill'>B</div><div id='divC' style='width:40px'>C</div></d-linear-layout>";
	registerSuite({
		name: " Horizontal LinearLayout Mixed Width",
		setup: function () {
			document.body.innerHTML = htmlContent;
			register.parse(document.body);
			node = document.getElementById("dlayout");
		},
		"Horizontal LinearLayout Various Width" : function () {
			var children = node.getChildren();
			assert.deepEqual(3, children.length);
			var box1 = domGeom.getMarginBox(children[0]);
			var box2 = domGeom.getMarginBox(children[1]);
			var box3 = domGeom.getMarginBox(children[2]);
			assert.deepEqual(box1.w, 40);
			assert.deepEqual(box2.w, 600);
			assert.deepEqual(box3.w, 40);
		},

		teardown: function () {
			document.body.removeChild(document.body.children[0]);
		}
	});
});
