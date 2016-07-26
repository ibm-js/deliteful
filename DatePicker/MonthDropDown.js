define([
	"delite/register",
	"delite/Widget"
], function (
	register,
	Widget
) {
	"use strict";

	/**
	 * Drop down with names of months.
	 */
	return register("d-month-drop-down", [HTMLElement, Widget], {
		baseClass: "d-month-drop-down",

		/**
		 * Array of month names.
		 * @member {string[]}
		 */
		months: [],

		render: function () {
			this.months.forEach(function (month, idx) {
				var item = this.ownerDocument.createElement("div");
				item.tabIndex = "-1";
				item.index = idx;
				item.textContent = month;
				this.appendChild(item);
			}, this);

			this.on("click", function (evt) {
				evt.stopPropagation();
				this.emit("change", {
					month: evt.target.index
				});
			});
		}
	});
});
