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
			"<d-linear-layout id='dlayout' vertical='false' style='width:500px'><div id='divA' class='fill'>A</div>" +
			"<div id='divB' style='width:30px'>B</div></d-linear-layout>";

	registerSuite({
		name: "LinearLayout-horizontal",
		setup: function () {
			container = document.createElement("div");
			document.body.appendChild(container);
			container.innerHTML = htmlContent;
			register.deliver();
			node = document.getElementById("dlayout");
		},

		"Horizontal LinearLayout Fill Width" : function () {
			var children = node.getChildren();
			assert.strictEqual(children.length, 2);
			var box1 = domGeom.getMarginBox(children[0]);
			assert.strictEqual(box1.w, 470);
		},

		"Horizontal LinearLayout Resize" : function () {
			node.style.width = "501px";
			var children = node.getChildren();
			var box1 = domGeom.getMarginBox(children[0]);
			assert.strictEqual(box1.w, 471);
		},

		"Horizontal LinearLayout Children Equal Size" : function () {
			var children = node.getChildren();
			node.style.width = "500px";
			children[1].style.width = "";
			$(children[1]).addClass("fill");
			var box1 = domGeom.getMarginBox(children[0]);
			var box2 = domGeom.getMarginBox(children[1]);
			assert.isTrue(box1.w === 250 || box1.w === 249, "box1.w");
			assert.isTrue(Math.abs(box1.w - box2.w) <= 1, "got a " + (box1.w - box2.w) + " difference");
		},

		teardown : function () {
			container.parentNode.removeChild(container);
		}
	});
});
