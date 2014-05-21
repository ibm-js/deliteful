define([
	"intern!object",
	"intern/chai!assert",
	"dojo/dom-geometry",
	"dojo/dom-class",
	"delite/register",
	"deliteful/LinearLayout"
], function (registerSuite, assert, domGeom, domClass, register) {
	var container, node;
	var htmlContent =
		"<d-linear-layout id='dlayout' vertical='false' style='width:999px; height:999px'>" +
			"<div id='divA' class='fill'>A</div><div id='divB' class='fill'>B</div>" +
			"<div id='divC' class='fill'>C</div></d-linear-layout>";
	registerSuite({
		name: " Direction Switch",
		setup: function () {
			container = document.createElement("div");
			document.body.appendChild(container);
			container.innerHTML = htmlContent;
			register.parse(container);
			node = document.getElementById("dlayout");
			node.validateRendering();
		},
		"Horizontal LinearLayout 3 Equal Width" : function () {
			var children = node.getChildren();
			assert.deepEqual(3, children.length);
			var box1 = domGeom.getMarginBox(children[0]);
			var box2 = domGeom.getMarginBox(children[1]);
			var box3 = domGeom.getMarginBox(children[2]);
			assert.isTrue(box1.w === 333 || box1.w === 332);
			assert.isTrue(box2.w === 333 || box2.w === 332);
			assert.isTrue(box3.w === 333 || box3.w === 332);
		},

		"Vertical LinearLayout 3 Equal Height" : function () {
			node.vertical = true;
			node.validateRendering();
			var children = node.getChildren();
			assert.deepEqual(3, children.length);
			var box1 = domGeom.getMarginBox(children[0]);
			var box2 = domGeom.getMarginBox(children[1]);
			var box3 = domGeom.getMarginBox(children[2]);
			assert.isTrue(box1.h === 333 || box1.h === 332);
			assert.isTrue(box2.h === 333 || box2.h === 332);
			assert.isTrue(box3.h === 333 || box3.h === 332);
		},
		teardown : function () {
			container.parentNode.removeChild(container);
		}

	});
});
