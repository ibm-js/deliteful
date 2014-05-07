define([
	"intern!object",
	"intern/chai!assert",
	"dojo/dom-geometry",
	"dojo/dom-class",
	"deliteful/ViewStack"
], function (registerSuite, assert, domGeom, domClass, ViewStack) {
	var container, node, aaa, bbb, ccc, ddd;
	function checkNodeVisibilityAsync(vs, target, d) {
		setTimeout(d.callback(function () {
			checkNodeVisibility(vs, target);
		}), 1);
	}
	function checkNodeVisibility(vs, target) {

		for (var i = 0; i < vs.children.length; i++) {
			assert.isTrue(
				(vs.children[i] === target && vs.children[i].style.display !== "none") ||
				(vs.children[i] !== target && vs.children[i].style.display === "none")
			);
		}
	}
	registerSuite({
		name: "ViewStack Programmatic",
		setup: function () {
			container = document.createElement("div");
			document.body.appendChild(container);
			node = new ViewStack();
			container.appendChild(node);
			node.startup();
		},
		"Default CSS" : function () {
			assert.isTrue(domClass.contains(node, "d-view-stack"));
		},
		"Default values" : function () {
			assert.deepEqual(node.transition, "slide");
			assert.deepEqual(node.reverse, false);
		},
		"First Child Visibility" : function () {
			var d = this.async(500);
			aaa = document.createElement("div");
			node.appendChild(aaa);
			checkNodeVisibilityAsync(node, aaa, d);
			bbb = document.createElement("div");
			ccc = document.createElement("div");
			ddd = document.createElement("div");
			node.appendChild(bbb);
			checkNodeVisibilityAsync(node, aaa, d);
			node.appendChild(ccc);
			checkNodeVisibilityAsync(node, aaa, d);
			node.appendChild(ddd);
			checkNodeVisibilityAsync(node, aaa, d);
		},
		"Show (default)" : function () {
			var d = this.async(1000);
			node.on("delite-after-show", d.callback(function () {
				checkNodeVisibility(node, bbb);
			}));
			node.show(bbb);
		},
		"Show (no transition)" : function () {
			// Shorter timing if no transition
			var d = this.async(100);
			node.on("delite-after-show", d.callback(function () {
				checkNodeVisibility(node, ccc);
			}));
			node.show(ccc, {transition: "none"});
		},
		"Show (reverse)" : function () {
			var d = this.async(1000);
			node.on("delite-after-show", d.callback(function () {
				checkNodeVisibility(node, ddd);
			}));
			node.show(ddd, {reverse: true});
		},
		"Show (reverse, no transition)" : function () {
			var d = this.async(1000);
			node.on("delite-after-show", d.callback(function () {
				checkNodeVisibility(node, aaa);
			}));
			node.show(aaa, {transition: "none", reverse: true});
		},
		"Show (reveal)" : function () {
			var d = this.async(1000);
			node.on("delite-after-show", d.callback(function () {
				checkNodeVisibility(node, bbb);
			}));
			node.show(bbb, {transition: "reveal", reverse: false});
		},
		"Show (reverse, reveal)" : function () {
			var d = this.async(1000);
			node.on("delite-after-show", d.callback(function () {
				checkNodeVisibility(node, ccc);
			}));
			node.show(ccc, {transition: "reveal", reverse: true});
		},
		"Show (flip)" : function () {
			var d = this.async(1000);
			node.on("delite-after-show", d.callback(function () {
				checkNodeVisibility(node, ddd);
			}));
			node.show(ddd, {transition: "flip", reverse: false});
		},
		"Show (reverse, flip)" : function () {
			var d = this.async(1000);
			node.on("delite-after-show", d.callback(function () {
				checkNodeVisibility(node, aaa);
			}));
			node.show(aaa, {transition: "flip", reverse: true});
		},
		"Show (fade)" : function () {
			// TODO: Investigate why this test fail on IE11 despite fade transitions work on this browser.
			//var d = this.async(1000);
			//node.on("delite-after-show", d.callback(function () {
			//	checkNodeVisibility(node, bbb);
			//}));
			//node.show(bbb, {transition: "fade", reverse: false});
		},
		"Show (reverse, slide)" : function () {
			var d = this.async(1000);
			node.on("delite-after-show", d.callback(function () {
				checkNodeVisibility(node, ccc);
			}));
			node.show(ccc, {transition: "slide", reverse: true});
		},
		teardown: function () {
			container.parentNode.removeChild(container);
		}
	});
});
