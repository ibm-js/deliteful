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
				assert.strictEqual(value.child.id, "content", "show() promise resolved value is incorrect");
				assert.strictEqual(sp.children[0].id, "content", "SidePane content is incorrect");
			}));
		},
		"hide" : function () {
			var d = this.async(1000);
			sp.hide().then(function () {
				assert.strictEqual(sp.children[0].id, "content", "Plain hide() removed the children");
				sp.show().then(function () {
					sp.hide("content").then(d.callback(function (value) {
						assert.strictEqual(value.child.id, "content", "show() promise resolved value is incorrect");
						assert.strictEqual(sp.children.length, 0, "SidePane content is incorrect");
					}));
				});
			});
		},
		teardown: function () {
			container.parentNode.removeChild(container);
		}
	});
});
