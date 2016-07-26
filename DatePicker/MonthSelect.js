define([
	"delite/register",
	"delite/HasDropDown",
	"../features",
	"./MonthDropDown",
	"dpointer/events"		// so can just monitor for "pointerdown"
], function (
	register,
	HasDropDown,
	has,
	MonthDropDown
) {
	"use strict";

	/**
	 * Specialized <select> type widget to show month dropdown.  Used by DatePicker.
	 * The innerHTML of the widget (month name and down caret) is controlled by DatePicker.
	 */
	register("d-month-select", [HTMLElement, HasDropDown], {
		baseClass: "d-month-select",

		/**
		 * Array of month names.
		 * @member {string[]}
		 */
		months: [],

		createdCallback: function () {
			if (!has("desktop-like-channel")) {
				// By default, match Combobox behavior.  Subclass can override in its createdCallback().
				this.dropDownPosition = ["center"];
			}

			this.on("pointerdown", function (evt) {
				// When focus is outside the calendar and the user clicks the month, avoid focusing the calendar.
				// It should open the dropdown instead.
				evt.stopPropagation();
				evt.preventDefault();
			});
		},

		loadDropDown: function () {
			if (!this.dropDown) {
				this.dropDown = new MonthDropDown({
					months: this.months
				});
				this.dropDown.on("change", function (evt) {
					this.emit("change", {month: evt.month});
				}.bind(this));
			}
			return this.dropDown;
		}
	});
});
