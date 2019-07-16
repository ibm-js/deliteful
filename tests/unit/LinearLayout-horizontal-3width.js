define(function (require) {
	"use strict";

	var registerSuite = intern.getPlugin("interface.object").registerSuite;
	var assert = intern.getPlugin("chai").assert;
	var domGeom = require("dojo/dom-geometry");
	var register = require("delite/register");
	require("deliteful/LinearLayout");

	var container, node;
	var htmlContent =
			"<d-linear-layout id='dlayout' vertical='false' style='width:999px'><div id='divA' class='fill'>A</div>" +
				"<div id='divB' class='fill'>B</div><div id='divC' class='fill'>C</div></d-linear-layout>";

	registerSuite("Horizontal LinearLayout 3 Equal Width", {
		before: function () {
			container = document.createElement("div");
			document.body.appendChild(container);
			container.innerHTML = htmlContent;
			register.deliver();
			node = document.getElementById("dlayout");
		},

		tests: {
			"Horizontal LinearLayout 3 Equal Width": function () {
				var children = node.getChildren();
				assert.deepEqual(3, children.length);
				var box1 = domGeom.getMarginBox(children[0]);
				var box2 = domGeom.getMarginBox(children[1]);
				var box3 = domGeom.getMarginBox(children[2]);
				assert.strictEqual(box1.w, 333, "box1.w");
				assert.strictEqual(box2.w, 333, "box2.w");
				assert.strictEqual(box3.w, 333, "box3.w");
			}
		},

		after: function () {
			container.parentNode.removeChild(container);
		}
	});
});
