/** @module delite/BoilerplateTextbox */
define([
	"delite/register",
	"delite/Container",
	"delite/FormValueWidget",
	"delite/Widget",
	"delite/handlebars!./BoilerplateTextbox/BoilerplateTextbox.html",
	"requirejs-dplugins/jquery!attributes/classes",
	"delite/activationTracker",
	"delite/uacss",
	"delite/theme!./BoilerplateTextbox/themes/{{theme}}/BoilerplateTextbox.css"
], function (
	register,
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
			return this.placeholder.length / 1.5 + "em";
		}
	});

	/**
	 * Generic number field.
	 */
	var NumberField = register("d-btb-number-field", [Field], {
		/**
		 * Number of characters user has typed into this field since it was focused.
		 */
		charactersTyped: 0,

		createdCallback: function () {
			this.on("focus", this.focusHandler.bind(this));
			this.on("keydown", this.keydownHandler.bind(this));
		},

		focusHandler: function () {
			this.charactersTyped = 0;
			this.selectionStart = this.value.length;		// put caret at end
		},

		/**
		 * Returns true if the input is complete and BoilerplateTextbox should
		 * automatically advance to next field.
		 */
		inputComplete: function () {
			return this.charactersTyped >= this.placeholder.length;
		},

		keydownHandler: function (evt) {
			var char = evt.key;

			if (char === "Tab") {
				// Let tab and shift-tab be handled by the browser.
				return;
			}

			if (char === "Delete" || char === "Backspace") {
				this.value = "";
				this.charactersTyped = 0;
				this.emit("input");
			} else if (/[0-9]/.test(char)) {
				if (this.charactersTyped === 0) {
					// For the first character the user types, replace the boilerplate text (ex: "yyyy")
					// with zeros followed by the character the user typed.
					this.value = (new Array(this.placeholder.length)).join("0") + char;
				} else {
					// Otherwise, slide the other characters over and insert new character at right,
					// for example if the user types "3" then "0002" is changed to "0023".
					this.value = this.value.substr(1) + char;
				}

				this.charactersTyped++;
				this.emit("input");

				// Send "completed" event if focus should automatically move to next field.
				if (this.inputComplete()) {
					this.emit("completed");
				}
			}

			evt.preventDefault();
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

		// Initially set tabStops --> containerNode so that the aria-labelledby attribute gets
		// moved there (courtesy of FormWidget).  Later on it's changed to point to all the
		// nested <input> nodes.
		tabStops: "containerNode",

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
			this.tabStops = tabStops.join(",");
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
		}
	});

	BoilerplateTextbox.Boilerplate = Boilerplate;
	BoilerplateTextbox.Field = Field;
	BoilerplateTextbox.NumberField = NumberField;

	return BoilerplateTextbox;
});
