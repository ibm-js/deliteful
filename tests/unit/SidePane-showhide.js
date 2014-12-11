define([
	"intern!object",
	"intern/chai!assert",
	"requirejs-dplugins/jquery!attributes/classes",
	"delite/register",
	"deliteful/SidePane"
], function (registerSuite, assert, $, register) {
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
			var d = this.async(3000);
			sp.hide().then(d.rejectOnError(function () {
				assert.strictEqual(sp.children[0].id, "content", "Plain hide() removed the children");
				sp.show().then(d.callback(function () {
					sp.hide("content").then(d.callback(function (value) {
						assert.strictEqual(value.child.id, "content", "show() promise resolved value is incorrect");
						assert.strictEqual(sp.children.length, 0, "SidePane content is incorrect");
					}));
				}));
			}));
		},
		"toggle after hide" : function () {
			var d = this.async(5000);
			sp.hide().then(function () {
				sp.toggle().then(d.callback(function () {
					assert.isTrue($(sp).hasClass("-d-side-pane-visible"));
					assert.isFalse($(sp).hasClass("-d-side-pane-hidden"));
				}));
			});
		},
		"toggle after show" : function () {
			var d = this.async(5000);
			sp.show().then(function () {
				sp.toggle().then(d.callback(function () {
					assert.isTrue($(sp).hasClass("-d-side-pane-hidden"));
					assert.isFalse($(sp).hasClass("-d-side-pane-visible"));
				}));
			});
		},
		teardown: function () {
			container.parentNode.removeChild(container);
		}
	});
});
