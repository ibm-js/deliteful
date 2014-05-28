define([
	"intern!object",
	"intern/chai!assert",
	"dojo/dom-geometry",
	"dojo/dom-class",
	"delite/register",
	"deliteful/SidePane"
], function (registerSuite, assert, domGeom, domClass, register) {
	var container, sp;
	var htmlContent = "<d-side-pane id='sp'></d-side-pane><div id='content'></div>";
	registerSuite({
		name: "SidePane Show Hide",
		setup: function () {
			container = document.createElement("div");
			document.body.appendChild(container);
			container.innerHTML = htmlContent;
			register.parse(container);
			sp = document.getElementById("sp");
		},
		"show" : function () {
			var d = this.async(1000);
			sp.show("content").then(d.callback(function (value) {
				assert.equal(value.child.id, "content");
				assert.equal(sp.children[0].id, "content");
			}));
		},
		"hide" : function () {
			var d = this.async(1000);
			sp.hide("content").then(d.callback(function (value) {
				assert.equal(value.child.id, "content");
				assert.equal(sp.children.length, 0);
			}));
		},
		teardown: function () {
			container.parentNode.removeChild(container);
		}
	});
});
