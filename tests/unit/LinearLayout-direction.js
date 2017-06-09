define([
	"intern!object",
	"intern/chai!assert",
	"dojo/dom-geometry",
	"delite/register",
	"delite/uacss",
	"deliteful/LinearLayout"
], function (registerSuite, assert, domGeom, register, has) {
	var container, node;
	var htmlContent =
		"<d-linear-layout id='dlayout' vertical='false' style='width:999px; height:999px'>" +
			"<div id='divA' class='fill'>A</div><div id='divB' class='fill'>B</div>" +
			"<div id='divC' class='fill'>C</div></d-linear-layout>";
	registerSuite({
		name: "LinearLayout-direction",

		setup: function () {
			container = document.createElement("div");
			document.body.appendChild(container);
			container.innerHTML = htmlContent;
			register.deliver();
			node = document.getElementById("dlayout");
		},

		"Horizontal LinearLayout 3 Equal Width" : function () {
			var children = node.getChildren();
			assert.strictEqual(children.length, 3);
			var box1 = domGeom.getMarginBox(children[0]);
			var box2 = domGeom.getMarginBox(children[1]);
			var box3 = domGeom.getMarginBox(children[2]);
			assert.strictEqual(box1.w, 333, "box1.w");
			assert.strictEqual(box2.w, 333, "box2.w");
			assert.strictEqual(box3.w, 333, "box3.w");
		},

		"Vertical LinearLayout 3 Equal Height" : function () {
			if (has("safari")) {
				return this.skip("Changing vertical broken on safari, see " +
					"https://github.com/ibm-js/deliteful/issues/701");
			}
			node.vertical = true;
			node.deliver();
			var children = node.getChildren();
			assert.strictEqual(children.length, 3);
			var box1 = domGeom.getMarginBox(children[0]);
			var box2 = domGeom.getMarginBox(children[1]);
			var box3 = domGeom.getMarginBox(children[2]);
			assert.strictEqual(box1.h, 333, "box1.h");
			assert.strictEqual(box2.h, 333, "box2.h");
			assert.strictEqual(box3.h, 333, "box3.h");
		},

		teardown : function () {
			container.parentNode.removeChild(container);
		}

	});
});
