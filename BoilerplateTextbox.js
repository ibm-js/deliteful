/** @module delite/BoilerplateTextbox */
define([
	"delite/register",
	"delite/uacss",
	"delite/Container",
	"delite/FormValueWidget",
	"delite/Widget",
	"delite/handlebars!./BoilerplateTextbox/BoilerplateTextbox.html",
	"requirejs-dplugins/jquery!attributes/classes",
	"delite/activationTracker",
	"delite/theme!./BoilerplateTextbox/themes/{{theme}}/BoilerplateTextbox.css"
], function (
	register,
	has,
	Container,
	FormValueWidget,
	Widget,
	template,
	$
) {
	"use strict";

	/**
	 * Non-editable section, boilerplate text.
	 *
	 * Creator should set:
	 *
	 * - textContent
	 */
	var Boilerplate = register("d-btb-boilerplate", [HTMLElement, Widget], {});

	/**
	 * Base class for editable fields in a BoilerplateTextbox.
	 *
	 * Creator should set the following properties/attributes:
	 *
	 * - value
	 * - placeholder
	 * - aria-label
	 *
	 * Emits "completed" event if caret should automatically move to next element.
	 */
	var Field = register("d-btb-field", [HTMLInputElement, Widget], {
		refreshRendering: function (oldVals) {
			if ("placeholder" in oldVals) {
				var computedWidth = this.computeWidth();
				if (computedWidth) {
					this.style.width = computedWidth;
				}
			}
		},

		/**
		 * Figure out the width of this field based on the placeholder.
		 * If width is specified in CSS then override this method to return null.
		 */
		computeWidth: function () {
			return this.placeholder.length + "em";
		}
	});

	/**
	 * Generic number field.  Set placeholder, min, and max properties.
	 */
	var NumberField = register("d-btb-number-field", [Field], {
		/**
		 * Number of characters user has typed into this field since it was focused.
		 */
		charactersTyped: 0,

		createdCallback: function () {
			this.on("focus", this.focusHandler.bind(this));
			this.on("keydown", this.keydownHandler.bind(this));

			// Set properties so that:
			// 1. When editing field, numeric virtual keyboard appears on mobile devices.
			// 2. Up/down spinner *doesn't* appear on Webkit and Firefox desktop (there's no room for it).
			//    It appears with type=number although it can be hidden with CSS.
			// 3. Firefox allows display of leading zeros. (It's not allowed for type=number, see
			//    http://stackoverflow.com/questions/8437529/html5-input-type-number-removes-leading-zero.)
			// 4. Chrome allows us to move the caret to the end of the text.  (It's not allowed for type=number,
			//    see https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/setSelectionRange.)
			// 5. Avoid Android behavior where evt.key = 229 instead of the actual digit typed, see
			//    http://stackoverflow.com/questions/30743490/
			//    capture-keys-typed-on-android-virtual-keyboard-using-javascript.
			//
			// I know setting type="tel" is weird.  It might only be needed for older browsers,
			// otherwise setting pattern should be sufficient.
			this.type = "tel";
			this.pattern = "[0-9]*";
			this.autocomplete = "off";
		},

		focusHandler: function () {
			this.charactersTyped = 0;
			this.selectionStart = this.value.length;		// put caret at end
		},

		/**
		 * Returns true if the input is complete and BoilerplateTextbox should
		 * automatically advance to next field.  Input is considered complete if:
		 *
		 * 1. User has typed the maximum number of digits.
		 * 2. Typing another digit (any digit) would make the value exceed this.max.
		 */
		inputComplete: function () {
			return this.charactersTyped >= this.placeholder.length || parseInt(this.value + "0", 10) > this.max;
		},

		keydownHandler: function (evt) {
			var char = evt.key;

			// Let the browser handle tab and shift-tab.
			if (char === "Tab") {
				return;
			}

			// Handle all other keys programatically, don't let the browser insert the character directly.
			evt.preventDefault();

			if (char === "Delete" || char === "Backspace") {
				this.value = "";
				this.charactersTyped = 0;
				this.emit("input");
			} else if (this.charactersTyped >= this.placeholder.length) {
				return;
			} else if (/[0-9]/.test(char)) {
				var newValue;
				if (this.charactersTyped === 0) {
					// For the first character the user types, replace the boilerplate text (ex: "yyyy")
					// with zeros followed by the character the user typed.
					newValue = (new Array(this.placeholder.length)).join("0") + char;
				} else {
					// Otherwise, slide the other characters over and insert new character at right,
					// for example if the user types "3" then "0002" is changed to "0023".
					newValue = this.value.substr(1) + char;
				}

				// If the new value exceeds the maximum value, then ignore the keystroke.
				if (this.max && parseInt(newValue, 10) > parseInt(this.max, 10)) {
					return;
				}

				// If the new digit makes it impossible to meet the minimum value, ignore the
				// keystroke.  For example, if the field is two characters with a min of
				// 50 and the first character the user types is 4.
				var maxPossibleFutureVal = newValue +
					(new Array(this.placeholder.length - this.charactersTyped)).join("9");
				if (this.min && parseInt(maxPossibleFutureVal, 10) < parseInt(this.min, 10)) {
					return;
				}

				this.value = newValue;
				this.charactersTyped++;

				this.emit("input");

				// Send "completed" event if focus should automatically move to next field.
				if (this.inputComplete()) {
					this.emit("completed");
				}
			}
		}
	});

	/**
	 * A replacement for an `<input>` that enforces a certain pattern by having editable areas separated
	 * by boilerplate text.
	 *
	 * The editable areas and boilerplate text are children of this widget and must exist by the time
	 * `render()` completes.
	 */
	var BoilerplateTextbox = register("d-boilerplate-textbox", [HTMLElement, Container, FormValueWidget], {
		baseClass: "d-boilerplate-textbox",

		template: template,

		createdCallback: function () {
			this.on("delite-activated", this.activatedHandler.bind(this));
			this.on("delite-deactivated", this.deactivatedHandler.bind(this));
		},

		postRender: function () {
			this.on("input", this.nestedInputHandler.bind(this), this.containerNode);
			this.on("change", this.nestedChangeHandler.bind(this), this.containerNode);
			this.on("completed", this.completedHandler.bind(this), this.containerNode);

			// Change tabStops to point to all the <input> nodes so that FormWidget#refreshRendering()
			// sets tabIndex, disabled, and readonly properties on those <input> nodes.
			var inputs = [].slice.call(this.containerNode.querySelectorAll("input"));
			var tabStops = [];
			inputs.forEach(function (input) {
				this["field" + tabStops.length] = input;
				tabStops.push("field" + tabStops.length);
			}, this);
			this.tabStops = tabStops;
		},

		/**
		 * Set values of `<input>` nodes according to specified value.
		 * String must exactly match formatting of `<input>` placeholder text
		 * combined with boilerplate text.
		 * @param value
		 */
		setInputValues: function (value) {
			var start = 0;
			Array.prototype.forEach.call(this.containerNode.children, function (section) {
				var length = (section.placeholder || section.textContent).length;
				if ("value" in section) {
					section.value = value ? value.substr(start, length) : "";
				}
				start += length;
			});
		},

		refreshRendering: function (oldVals) {
			if ("value" in oldVals && !this.processingUserInput) {
				this.setInputValues(this.value);
			}
		},

		activatedHandler: function () {
			// When the BoilerplateTextbox gets focus, focus the first <input>.
			this.defer(function () {
				this.containerNode.querySelector("input").focus();
			});
			$(this).addClass("d-focused");
		},

		deactivatedHandler: function () {
			// When the BoilerplateTextbox loses focus, fire the "change" event.
			this.handleOnChange(this.value);
			$(this).removeClass("d-focused");
		},

		/**
		 * Get value of widget according to values of nested `<input>` nodes.
		 * @returns {*}
		 */
		getValue: function () {
			// Return concatenated values of fields.
			// If any of the fields are unset then return "".
			var sections = [].slice.call(this.containerNode.children);
			if (sections.every(function (section) { return section.value || section.textContent; })) {
				return sections.map(function (section) {
					return section.value || section.textContent;
				}).join("");
			} else {
				return "";
			}
		},

		/**
		 * Handler for when user types into one of the nested `<input>`'s.
		 * @param evt
		 */
		nestedInputHandler: function (evt) {
			evt.stopPropagation();

			this.processingUserInput = true;
			this.defer(function () {
				this.processingUserInput = false;
			}, 1);

			this.handleOnInput(this.getValue());
		},

		/**
		 * Handler for when nested `<input>` emits a "change" event.
		 * @param evt
		 */
		nestedChangeHandler: function (evt) {
			evt.stopPropagation();
		},

		/**
		 * Handler for when a nested `<input>` declares that user has finished setting the value.
		 * Advances to the next `<input>` if there is one.
		 */
		completedHandler: function (evt) {
			var inputs = [].slice.call(this.containerNode.querySelectorAll("input"));
			var nextIdx = inputs.indexOf(evt.target) + 1;
			if (nextIdx < inputs.length) {
				inputs[nextIdx].focus();
			}
		},

		setAttribute: register.superCall(function (sup) {
			return function (name, value) {
				sup.apply(this, arguments);

				// Workaround iOS limitation where VoiceOver doesn't announce label of container.
				if (has("ios")) {
					var label;
					if (name === "aria-label") {
						label = value;
					} else if (name === "aria-labelledby") {
						var labelNode = this.ownerDocument.getElementById(value);
						label = labelNode && labelNode.textContent;
					}
					if (label) {
						var inputs = [].slice.call(this.containerNode.querySelectorAll("input"));
						inputs.forEach(function (field) {
							if (!field.origAriaLabel) {
								field.origAriaLabel = field.getAttribute("aria-label");
							}
							field.setAttribute("aria-label", label + " " + field.origAriaLabel);
						});
					}
				}
			};
		})
	});

	BoilerplateTextbox.Boilerplate = Boilerplate;
	BoilerplateTextbox.Field = Field;
	BoilerplateTextbox.NumberField = NumberField;

	return BoilerplateTextbox;
});
