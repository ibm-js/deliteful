define([
	"intern!object",
	"intern/chai!assert",
	"dojo/dom-geometry",
	"dojo/dom-class",
	"../register",
	"dojo/text!../widgetTests/test_ViewStack.html",
	"dui/css!../themes/defaultapp.css",
	"dui/ViewStack"
], function (registerSuite, assert, domGeom, domClass, register, html) {
	var node;
	registerSuite({
		name: "ViewStack",
		setup: function () {
			document.body.innerHTML = html;
			register.parse(document.body);
			node = document.getElementById("vs");
		},
		"Default CSS" : function () {
			assert.isTrue(domClass.contains(node, "d-view-stack"));
		},
		"Default values" : function () {
			assert.deepEqual(node.transition, "slide");
			assert.deepEqual(node.reverse, false);
		},
		"Show (default)" : function () {
			node.show(bbb);
			assert.deepEqual(bbb.style.display, "");
		},
		"Show (no transition)" : function () {
			node.show(ccc, {transition:"none"});
			assert.deepEqual(ccc.style.display, "");
		},
		"Show (reverse)" : function () {
			node.show(ddd, {reverse:true});
			assert.deepEqual(ddd.style.display, "");
		},
		"Show (reverse, no transition)" : function () {
			node.show(aaa, {transition:"none", reverse: true});
			assert.deepEqual(aaa.style.display, "");
		},
		"Show (reveal)" : function () {
			node.show(bbb, {transition:"reveal", reverse: false});
			assert.deepEqual(bbb.style.display, "");
		},
		"Show (reverse, reveal)" : function () {
			node.show(ccc, {transition:"reveal", reverse:true});
			assert.deepEqual(ccc.style.display, "");
		},
		"Show (flip)" : function () {
			node.show(ddd, {transition:"flip", reverse: false});
			assert.deepEqual(ddd.style.display, "");
		},
		"Show (reverse, flip)" : function () {
			node.show(aaa, {transition:"flip", reverse:true});
			assert.deepEqual(aaa.style.display, "");
		},
		"Show (fade)" : function () {
			node.show(bbb, {transition:"fade", reverse: false});
			assert.deepEqual(bbb.style.display, "");
		},
		"Show (reverse, fade)" : function () {
			node.show(ccc, {transition:"slide", reverse:true});
			assert.deepEqual(ccc.style.display, "");
		},
		teardown: function () {
			document.body.innerHTML = "";
		}
	});
});
