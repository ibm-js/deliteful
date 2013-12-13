define([
	"intern!object",
	"intern/chai!assert",
	"dojo/keys",
	"dojo/on",
	"../register",
	"../HasDropDown",
	"../Widget",
	"./helpers"
], function (registerSuite, assert, keys, on, register, HasDropDown, Widget, helpers) {
	var container, SimplePopup, SimpleDropDownButton, NonFocusableDropDownButton, popup, dd, ndd;

	function key(node, key) {
		on.emit(node, "keydown", {
			keyCode: key,
			bubbles: true
		});
		on.emit(node, "keyup", {
			keyCode: key,
			bubbles: true
		});
	}

	function click(node) {
		on.emit(node, navigator.msPointerEnabled ? "MSPointerDown" : "mousedown", {
			button: 0,	// left button (except on IE quirks mode, when it's 1)
			bubbles: true
		});
		on.emit(node, navigator.msPointerEnabled ? "MSPointerUp" : "mouseup", {
			button: 0,	// left button (except on IE quirks mode, when it's 1)
			bubbles: true
		});
		on.emit(node, "click", {
			bubbles: true
		});
	}

	registerSuite({
		name: "dui/HasDropDown",
		setup: function () {
			container = document.createElement("div");
			document.body.appendChild(container);
			SimplePopup = register("simple-popup", [HTMLElement, Widget], {
				// summary:
				//		A trivial popup widget
				label: "i'm a popup",
				_setLabelAttr: { type: "innerText" }
			});

			SimpleDropDownButton = register("simple-drop-down-button", [HTMLButtonElement, Widget, HasDropDown], {
				// summary:
				//		A button that shows a popup.
				label: "show popup",
				_setLabelAttr: { type: "innerText" },
				popupLabel: "i'm a popup",
				orient: ["below"],

				postCreate: register.after(function () {
					this.dropDown = new SimplePopup({
						id: this.id + "_popup",
						label: this.popupLabel
					});
				})
			});

			NonFocusableDropDownButton = register("non-focusable-drop-down-button", [HTMLElement, Widget, HasDropDown], {
				// summary:
				//		A non-focusable "button" that shows a popup.   Should work for mouse, although not for keyboard.
				label: "show popup (non-focusable)",
				_setLabelAttr: { type: "innerText" },
				orient: ["below"],

				postCreate: register.after(function () {
					this.dropDown = new SimplePopup({
						id: this.id + "_popup",
						label: "popup from non-focusable"
					});
				})
			});

		},
		"basic setup" : function () {
			dd = new SimpleDropDownButton({id: "dd"}).placeAt(container);
			popup = dd.dropDown;
			assert.ok(!!popup, "popup exists");
		},
		"basic open" : function () {
			click(dd);
			assert.ok(helpers.isVisible(popup), "popup visible");
		},
		"basic close" : function () {
			dd.closeDropDown();
			assert.ok(helpers.isHidden(popup), "popup hidden");
		},
		"basic openBySpace" : function () {
			key(dd, keys.SPACE);
			assert.ok(!!popup, "popup exists");
			assert.ok(helpers.isVisible(popup), "popup visible again");
		},
		"basic close2" : function () {
			dd.closeDropDown();
			assert.ok(helpers.isHidden(popup), "popup hidden again");
		},
		"non focusable setup" : function () {
			ndd = new NonFocusableDropDownButton({id: "ndd"}).placeAt(container);
			popup = ndd.dropDown;
			assert.ok(!!popup, "popup exists");
		},
		"non focusable open" : function () {
			click(ndd);
			assert.ok(helpers.isVisible(popup), "popup visible");
		},
		"non focusable close" : function () {
			ndd.closeDropDown();
		},

		"destroy setup" : function () {
			dd = new SimpleDropDownButton({id: "dd2"}).placeAt(container);
			popup = dd.dropDown;
			assert.ok(!!popup, "popup exists");
		},
		"destroy open" : function () {
			click(dd);
			assert.ok(helpers.isVisible(popup), "popup visible");
			assert.deepEqual(1, require("dui/popup")._stack.length, "in popup manager stack");
		},
		"destroy destroy" : function () {
			dd.destroy();
			assert.deepEqual(0, require("dui/popup")._stack.length, "popup was closed");
		},

		teardown : function () {
			container.parentNode.removeChild(container);
		}
	});
});
