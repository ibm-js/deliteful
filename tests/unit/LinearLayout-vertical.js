define([
	"intern!object",
	"intern/chai!assert",
	"dojo/dom-geometry",
	"requirejs-dplugins/jquery!attributes/classes",
	"delite/register",
	"deliteful/LinearLayout"
], function (registerSuite, assert, domGeom, $, register) {
	var container, node1, node2;
	var htmlContent =
		"<d-linear-layout id='dlayout1' style='height:500px'>" +
			"<div id='divA' class='fill'>A</div>" +
			"<div id='divB' style='height:30px'>B</div>" +
		"</d-linear-layout>" +
		"<d-linear-layout id='dlayout2' style='height:500px'>" +
			"<div id='divC' class='fill'>C</div>" +
			"<div id='divD' class='fill'>D</div>" +
		"</d-linear-layout>";

	registerSuite({
		name: "Vertical LinearLayout",
		setup: function () {
			container = document.createElement("div");
			document.body.appendChild(container);
			container.innerHTML = htmlContent;
			register.deliver();
			node1 = document.getElementById("dlayout1");
			node2 = document.getElementById("dlayout2");
		},

		"Vertical LinearLayout Fill Height": function () {
			var children = node1.getChildren();
			assert.strictEqual(2, children.length);
			var box1 = domGeom.getMarginBox(children[0]);
			assert.strictEqual(box1.h, 470);
		},

		"Vertical LinearLayout Resize": function () {
			node1.style.height = "501px";
			var children = node1.getChildren();
			var box1 = domGeom.getMarginBox(children[0]);
			assert.strictEqual(box1.h, 471);
		},

		"Vertical LinearLayout Children Equal Size": function () {
			var children = node2.getChildren();
			var box1 = domGeom.getMarginBox(children[0]);
			var box2 = domGeom.getMarginBox(children[1]);
			assert.strictEqual(box1.h, 250, "box1");
			assert.strictEqual(box2.h, 250, "box2");
		},

		teardown: function () {
			container.parentNode.removeChild(container);
		}
	});
});
