define([
	"intern!object",
	"intern/chai!assert",
	"dojo/dom-geometry",
	"requirejs-dplugins/jquery!attributes/classes",
	"delite/register",
	"deliteful/SidePane"
], function (registerSuite, assert, domGeom, $, register, SidePane) {
	var node;
	var origBodyStyle;

	registerSuite({
		name: "SidePane",
		setup: function () {
			origBodyStyle = document.body.style.cssText;
			node = new SidePane();
			document.body.appendChild(node);
			node.show();
		},
		"Default values" : function () {
			assert.strictEqual(node.mode, "push");
			assert.strictEqual(node.position, "start");
			assert.isTrue(node.animate, "node.animate");
			assert.isTrue(node.swipeClosing, "node.swipeClosing");
		},
		"Size Computation" : function () {
			var box = domGeom.getMarginBox(node);
			assert.isTrue(box.w > 0);
			assert.isTrue(box.h > 0);
		},
		"CSS Classes: Push Start (Default)" : function () {
			assert.isTrue($(node).hasClass("d-side-pane"));
			assert.isTrue($(node).hasClass("-d-side-pane-push"));
			assert.isTrue($(node).hasClass("-d-side-pane-start"));
		},
		"CSS Classes: Push End" : function () {
			node.mode = "push";
			node.position = "end";
			node.deliver();
			assert.isTrue($(node).hasClass("-d-side-pane-push"));
			assert.isTrue($(node).hasClass("-d-side-pane-end"));
		},
		"CSS Classes: Overlay Start" : function () {
			node.mode = "overlay";
			node.position = "start";
			node.deliver();
			assert.isTrue($(node).hasClass("-d-side-pane-overlay"));
			assert.isTrue($(node).hasClass("-d-side-pane-start"));
		},
		"CSS Classes: Overlay End" : function () {
			node.mode = "overlay";
			node.position = "end";
			node.deliver();
			assert.isTrue($(node).hasClass("-d-side-pane-overlay"));
			assert.isTrue($(node).hasClass("-d-side-pane-end"));
		},
		"CSS Classes: Reveal Start" : function () {
			node.mode = "reveal";
			node.position = "start";
			node.deliver();
			assert.isTrue($(node).hasClass("-d-side-pane-reveal"));
			assert.isTrue($(node).hasClass("-d-side-pane-start"));
		},
		"CSS Classes: Reveal End" : function () {
			node.mode = "reveal";
			node.position = "end";
			node.deliver();
			assert.isTrue($(node).hasClass("-d-side-pane-reveal"));
			assert.isTrue($(node).hasClass("-d-side-pane-end"));
		},
		teardown: function () {
			node.parentNode.removeChild(node);
			document.body.style.cssText = origBodyStyle;	// so page can scroll again
		}
	});
});
