define([
	"delite/a11yclick",
	"delite/register",
	"delite/KeyNav"
], function (
	a11yclick,
	register,
	KeyNav
) {
	"use strict";

	/**
	 * Drop down with names of months.
	 * In future, could be promoted to a top level menu widget (simpler than List).
	 * Emits "change" event on month selection, where event.month is the index of the month (0 based).
	 * Note that this extends KeyNav even though the user can't open the dropdown without using the mouse/touch.
	 */
	return register("d-month-drop-down", [HTMLElement, KeyNav], {
		baseClass: "d-month-drop-down",

		/**
		 * Array of month names.
		 * @member {string[]}
		 */
		months: [],

		postRender: function () {
			// With help of delite/a11yclick, convert SPACE/ENTER key to click event.
			a11yclick(this);

			this.on("click", function (evt) {
				evt.stopPropagation();
				this.emit("change", {
					month: evt.target.index
				});
			});
		},

		refreshRendering: function (oldVals) {
			if ("months" in oldVals) {
				this.innerHTML = "";
				this.months.forEach(function (month, idx) {
					var item = this.ownerDocument.createElement("div");
					item.tabIndex = "-1";
					item.index = idx;
					item.textContent = month;
					this.appendChild(item);
				}, this);
			}
		},

		descendantSelector: function (child) {
			return child !== this;
		},

		downKeyHandler: function () {
			var nextChild = this.getNext(this.navigatedDescendant, 1);
			if (nextChild) {
				this.navigateTo(nextChild);
			}
		},

		upKeyHandler: function () {
			var previousChild = this.getNext(this.navigatedDescendant, -1);
			if (previousChild) {
				this.navigateTo(previousChild);
			}
		}
	});
});
