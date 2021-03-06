define(function (require) {
	"use strict";

	var registerSuite = intern.getPlugin("interface.object").registerSuite;
	var assert = intern.getPlugin("chai").assert;
	var register = require("delite/register");
	require("deliteful/SidePane");

	var container, sp, origBodyStyle;
	var htmlContent = "<d-side-pane id='sp'></d-side-pane><div id='content'></div>";

	registerSuite("SidePane Show Hide", {
		before: function () {
			origBodyStyle = document.body.style.cssText;
			container = document.createElement("div");
			document.body.appendChild(container);
			container.innerHTML = htmlContent;
			register.deliver();
			sp = document.getElementById("sp");
		},

		tests: {
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
					assert.isTrue(sp.classList.contains("-d-side-pane-visible"));
					assert.isFalse(sp.classList.contains("-d-side-pane-hidden"));
				});
			},

			"toggle after show": function () {
				return sp.show().then(function () {
					return sp.toggle();
				}).then(function () {
					assert.isTrue(sp.classList.contains("-d-side-pane-hidden"));
					assert.isFalse(sp.classList.contains("-d-side-pane-visible"));
				});
			}
		},

		after: function () {
			container.parentNode.removeChild(container);
			document.body.style.cssText = origBodyStyle;	// so page can scroll again
		}
	});
});
