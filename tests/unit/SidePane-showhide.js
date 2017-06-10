define([
	"intern!object",
	"intern/chai!assert",
	"requirejs-dplugins/jquery!attributes/classes",
	"delite/register",
	"deliteful/SidePane"
], function (registerSuite, assert, $, register) {
	var container, sp, origBodyStyle;
	var htmlContent = "<d-side-pane id='sp'></d-side-pane><div id='content'></div>";

	registerSuite({
		name: "SidePane Show Hide",
		setup: function () {
			origBodyStyle = document.body.style.cssText;
			container = document.createElement("div");
			document.body.appendChild(container);
			container.innerHTML = htmlContent;
			register.deliver();
			sp = document.getElementById("sp");
		},

		"show": function () {
			var shownEvent;
			sp.on("sidepane-after-show", function () {
				shownEvent = true;
			});
			return sp.show("content").then(function (value) {
				assert.strictEqual(value.child.id, "content", "show() promise resolved value is incorrect");
				assert.strictEqual(sp.children[0].id, "content", "SidePane child");
				assert(shownEvent, "fired sidepane-after-show");
			});
		},

		"hide": function () {
			return sp.hide().then(function () {
				assert.strictEqual(sp.children[0].id, "content", "Plain hide() didn't remove child");
			}).then(function () {
				return sp.show();
			}).then(function () {
				return sp.hide("content");
			}).then(function (value) {
				assert.strictEqual(value.child.id, "content", "show() promise resolved value");
				assert.strictEqual(sp.children.length, 1, "# of children");
			});
		},

		"toggle after hide": function () {
			return sp.hide().then(function () {
				return sp.toggle();
			}).then(function () {
				assert.isTrue($(sp).hasClass("-d-side-pane-visible"));
				assert.isFalse($(sp).hasClass("-d-side-pane-hidden"));
			});
		},

		"toggle after show": function () {
			return sp.show().then(function () {
				return sp.toggle();
			}).then(function () {
				assert.isTrue($(sp).hasClass("-d-side-pane-hidden"));
				assert.isFalse($(sp).hasClass("-d-side-pane-visible"));
			});
		},

		teardown: function () {
			container.parentNode.removeChild(container);
			document.body.style.cssText = origBodyStyle;	// so page can scroll again
		}
	});
});
