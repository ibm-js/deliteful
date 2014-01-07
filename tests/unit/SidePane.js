define([
	"intern!object",
	"intern/chai!assert",
	"dojo/dom-geometry",
	"dojo/dom-class",
	"delite/register",
	"deliteful/SidePane"
], function (registerSuite, assert, domGeom, domClass, register) {
	var container, node;
	var htmlContent = "<d-side-pane id='sp'><div>SidePane</div></d-side-pane>";
	registerSuite({
		name: "SidePane Overlay",
		setup: function () {
			container = document.createElement("div");
			document.body.appendChild(container);
			container.innerHTML = htmlContent;
			register.parse(container);
			node = document.getElementById("sp");
			node.open();
		},
		"Default values" : function () {
			assert.deepEqual(node.mode, "push");
			assert.deepEqual(node.position, "start");
			assert.deepEqual(node.animate, true);
			assert.deepEqual(node.swipeClosing, true);
		},
		"Size Computation" : function () {
			var box = domGeom.getMarginBox(node);
			assert.isTrue(box.w > 0);
			assert.isTrue(box.h > 0);
		},
		"CSS Classes: Push Start (Default)" : function () {
			assert.isTrue(domClass.contains(node, "d-side-pane"));
			assert.isTrue(domClass.contains(node, "-d-side-pane-push"));
			assert.isTrue(domClass.contains(node, "-d-side-pane-start"));
		},
		"CSS Classes: Push End" : function () {
			node.mode = "push";
			node.position = "end";
			node.validateRendering();
			assert.isTrue(domClass.contains(node, "-d-side-pane-push"));
			assert.isTrue(domClass.contains(node, "-d-side-pane-end"));
		},
		"CSS Classes: Overlay Start" : function () {
			node.mode = "overlay";
			node.position = "start";
			node.validateRendering();
			assert.isTrue(domClass.contains(node, "-d-side-pane-overlay"));
			assert.isTrue(domClass.contains(node, "-d-side-pane-start"));
		},
		"CSS Classes: Overlay End" : function () {
			node.mode = "overlay";
			node.position = "end";
			node.validateRendering();
			assert.isTrue(domClass.contains(node, "-d-side-pane-overlay"));
			assert.isTrue(domClass.contains(node, "-d-side-pane-end"));
		},
		"CSS Classes: Reveal Start" : function () {
			node.mode = "reveal";
			node.position = "start";
			node.validateRendering();
			assert.isTrue(domClass.contains(node, "-d-side-pane-reveal"));
			assert.isTrue(domClass.contains(node, "-d-side-pane-start"));
		},
		"CSS Classes: Reveal End" : function () {
			node.mode = "reveal";
			node.position = "end";
			node.validateRendering();
			assert.isTrue(domClass.contains(node, "-d-side-pane-reveal"));
			assert.isTrue(domClass.contains(node, "-d-side-pane-end"));
		},
		teardown: function () {
			container.parentNode.removeChild(container);
		}
	});
});
