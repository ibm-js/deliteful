define([
	"intern!object",
	"intern/chai!assert",
	"dojo/dom-geometry",
	"delite/register",
	"deliteful/LinearLayout"
], function (registerSuite, assert, domGeom, register) {
	var container, node;
	var htmlContent =
			"<d-linear-layout id='dlayout' vertical='false' style='width:999px'><div id='divA' class='fill'>A</div>" +
				"<div id='divB' class='fill'>B</div><div id='divC' class='fill'>C</div></d-linear-layout>";
	registerSuite({
		name: " Horizontal LinearLayout 3 Equal Width",
		setup: function () {
			container = document.createElement("div");
			document.body.appendChild(container);
			container.innerHTML = htmlContent;
			register.parse(container);
			node = document.getElementById("dlayout");
		},
		"Horizontal LinearLayout 3 Equal Width" : function () {
			var children = node.getChildren();
			assert.deepEqual(3, children.length);
			var box1 = domGeom.getMarginBox(children[0]);
			var box2 = domGeom.getMarginBox(children[1]);
			var box3 = domGeom.getMarginBox(children[2]);
			assert.isTrue(box1.w === 333, "got " + box1.w + " for box 1");
			assert.isTrue(box2.w === 333, "got " + box2.w + " for box 2");
			assert.isTrue(box3.w === 333, "got " + box3.w + " for box 3");
		},
		teardown : function () {
			container.parentNode.removeChild(container);
		}
	});
});
