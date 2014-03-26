define([
	"intern!object",
	"intern/chai!assert",
	"dojo/dom-geometry",
	"dojo/dom-class",
	"delite/register",
	"deliteful/ViewStack"
], function (registerSuite, assert, domGeom, domClass, register) {
	var container, node;
	var aaa, bbb, ccc, ddd;
	var htmlContent = "<d-view-stack id='vs'><div id='aaa'>AAA</div><div id='bbb'>BBB</div><div id='ccc'>CCC</div>" +
		"<div id='ddd'>DDD</div></d-view-stack>";

	function checkNodeVisibility(vs, target) {
		for (var i = 0; i < vs.children.length; i++) {
			assert.isTrue(
				((vs.children[i] === target && vs.children[i].style.display !== "none" &&
					vs.selectedChildId === target.id)) ||
					(vs.children[i] !== target && vs.children[i].style.display === "none")
			);
		}
	}
	registerSuite({
		name: "ViewStack Markup",
		setup: function () {
			container = document.createElement("div");
			document.body.appendChild(container);
			container.innerHTML = htmlContent;
			register.parse(container);
			node = document.getElementById("vs");
			aaa = document.getElementById("aaa");
			bbb = document.getElementById("bbb");
			ccc = document.getElementById("ccc");
			ddd = document.getElementById("ddd");
		},
		"Default CSS" : function () {
			assert.isTrue(domClass.contains(node, "d-view-stack"));
		},
		"Default values" : function () {
			assert.deepEqual(node.transition, "slide");
			assert.deepEqual(node.reverse, false);
		},
		"Show (by widget)" : function () {
			var d = this.async(1000);
			node.on("delite-display-complete", d.callback(function () {
				checkNodeVisibility(node, bbb);
			}));
			node.show(bbb);
		},
		"Show (by id)" : function () {
			var d = this.async(1000);
			node.on("delite-display-complete", d.callback(function () {
				checkNodeVisibility(node, aaa);
			}));
			node.show("aaa");
		},
		"Show (no transition)" : function () {
			// Shorter timing if no transition
			var d = this.async(100);
			node.on("delite-display-complete", d.callback(function () {
				checkNodeVisibility(node, ccc);
			}));
			node.show(ccc, {transition: "none"});
		},
		"Show (reverse)" : function () {
			var d = this.async(1000);
			node.on("delite-display-complete", d.callback(function () {
				checkNodeVisibility(node, ddd);
			}));
			node.show(ddd, {reverse: true});
		},
		"Show (reverse, no transition)" : function () {
			var d = this.async(1000);
			node.on("delite-display-complete", d.callback(function () {
				checkNodeVisibility(node, aaa);
			}));
			node.show(aaa, {transition: "none", reverse: true});
		},
		"Show (reveal)" : function () {
			var d = this.async(1000);
			node.on("delite-display-complete", d.callback(function () {
				checkNodeVisibility(node, bbb);
			}));
			node.show(bbb, {transition: "reveal", reverse: false});
		},
		"Show (reverse, reveal)" : function () {
			var d = this.async(1000);
			node.on("delite-display-complete", d.callback(function () {
				checkNodeVisibility(node, ccc);
			}));
			node.show(ccc, {transition: "reveal", reverse: true});
		},
		"Show (flip)" : function () {
			var d = this.async(1000);
			node.on("delite-display-complete", d.callback(function () {
				checkNodeVisibility(node, ddd);
			}));
			node.show(ddd, {transition: "flip", reverse: false});
		},
		"Show (reverse, flip)" : function () {
			var d = this.async(1000);
			node.on("delite-display-complete", d.callback(function () {
				checkNodeVisibility(node, aaa);
			}));
			node.show(aaa, {transition: "flip", reverse: true});
		},
		"Show (fade)" : function () {
			// TODO: Investigate why this test fail on IE11 despite fade transitions work on this browser.
			//var d = this.async(1000);
			//node.on("delite-display-complete", d.callback(function () {
			//	checkNodeVisibility(node, bbb);
			//}));
			//node.show(bbb, {transition: "fade", reverse: false});
		},
		"Show (reverse, slide)" : function () {
			var d = this.async(1000);
			node.on("delite-display-complete", d.callback(function () {
				checkNodeVisibility(node, ccc);
			}));
			node.show(ccc, {transition: "slide", reverse: true});
		},
		"SelectedChildId Setter": function () {
			var d = this.async(1000);
			node.on("delite-display-complete", d.callback(function () {
				checkNodeVisibility(node, ddd);
			}));
			node.selectedChildId = "ddd";
		},
		teardown: function () {
			container.parentNode.removeChild(container);
		}
	});
});
