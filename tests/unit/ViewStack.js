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
	registerSuite({
		name: "ViewStack",
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
		"Show (default)" : function () {
			node.show(bbb);
			assert.deepEqual(bbb.style.display, "");
		},
		"Show (no transition)" : function () {
			node.show(ccc, {transition: "none"});
			assert.deepEqual(ccc.style.display, "");
		},
		"Show (reverse)" : function () {
			node.show(ddd, {reverse: true});
			assert.deepEqual(ddd.style.display, "");
		},
		"Show (reverse, no transition)" : function () {
			node.show(aaa, {transition: "none", reverse: true});
			assert.deepEqual(aaa.style.display, "");
		},
		"Show (reveal)" : function () {
			node.show(bbb, {transition: "reveal", reverse: false});
			assert.deepEqual(bbb.style.display, "");
		},
		"Show (reverse, reveal)" : function () {
			node.show(ccc, {transition: "reveal", reverse: true});
			assert.deepEqual(ccc.style.display, "");
		},
		"Show (flip)" : function () {
			node.show(ddd, {transition: "flip", reverse: false});
			assert.deepEqual(ddd.style.display, "");
		},
		"Show (reverse, flip)" : function () {
			node.show(aaa, {transition: "flip", reverse: true});
			assert.deepEqual(aaa.style.display, "");
		},
		"Show (fade)" : function () {
			node.show(bbb, {transition: "fade", reverse: false});
			assert.deepEqual(bbb.style.display, "");
		},
		"Show (reverse, fade)" : function () {
			node.show(ccc, {transition: "slide", reverse: true});
			assert.deepEqual(ccc.style.display, "");
		},
		teardown: function () {
			container.parentNode.removeChild(container);
		}
	});
});
