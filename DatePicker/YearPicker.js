define([
	"dojo/_base/kernel",
	"delite/register",
	"delite/Widget",
	"../TimeBase",
	"delite/handlebars!./YearPicker.html"
], function (
	dojo,
	register,
	Widget,
	TimeBase,
	template
) {
	"use strict";

	/**
	 * Dispatched when user clicks a year (even if it's the currently selected year).
	 * @example
	 * document.addEventListener("year-selected", function (evt) {
	 *      console.log("selected year", evt.year);
	 * });
	 * @event module:deliteful/DatePicker/YearPicker#year-selected
	 * @property {number} year - Year selected
	 */

	/**
	 * DatePicker's view with list of years.
	 */
	return register("d-year-picker", [HTMLElement, Widget, TimeBase], {
		baseClass: "d-year-picker",

		/**
		 * Aria-label for the grid.
		 * @member {string}
		 */
		gridLabel: "",

		/**
		 * The selected year.
		 * @member {number}
		 */
		year: null,

		/**
		 *  Year displayed in center of grid.
		 * @member {number}
		 */
		centeredYear: 0,

		/**
		 * CSS class for icon to go to previous month or year.
		 * @member {string}
		 */
		previousIconClass: "d-caret-previous",

		/**
		 * CSS class for icon to go to next month or year.
		 * @member {string}
		 */
		nextIconClass: "d-caret-next",

		/**
		 * Label for button to go to previous set of years.
		 * @member {string}
		 * @readonly
		 */
		previousYearRangeButtonLabel: "",

		/**
		 * Label for button to go to next set of years.
		 * @member {string}
		 * @readonly
		 */
		nextYearRangeButtonLabel: "",

		template: template,

		/**
		 * Number of rows.
		 * @member {number}
		 */
		rows: 5,

		/**
		 * Number of columns
		 * @member {number}
		 */
		cols: 5,

		/**
		 * Handler when user clicks button to step back 25 years.
		 */
		previousYearsClickHandler: function () {
			this.centeredYear -= this.rows * this.cols;
		},

		/**
		 * Handler when user clicks button to step forward 25 years.
		 */
		nextYearsClickHandler: function () {
			this.centeredYear += this.rows * this.cols;
		},

		/**
		 * Handler when user clicks a year to select it.
		 */
		yearClickHandler: function (event) {
			event.stopPropagation();
			for (var node = event.target; node !== this; node = node.parentNode) {
				if ("year" in node) {
					// Highlight selected year to give feedback to the user.
					this.year = node.year;

					this.emit("year-selected", {
						year: node.year
					});

					return;
				}
			}
		},

		refreshRendering: function (oldVals) {
			// Make 5x5 grid to hold year names.
			if ("rows" in oldVals || "cols" in oldVals) {
				this.grid.innerHTML = "";
				this.cells = [];
				for (var r = 0; r < this.rows; r++) {
					var row = this.grid.appendChild(this.ownerDocument.createElement("div"));
					row.setAttribute("role", "row");
					for (var c = 0; c < this.cols; c++) {
						var cell = row.appendChild(this.ownerDocument.createElement("div"));
						cell.setAttribute("role", "gridcell");

						// Create nested element for text so vertical centering works.
						cell.appendChild(this.ownerDocument.createElement("span"));
						this.cells.push(cell);
					}
				}
			}

			// Fill in text for each grid cell.
			if ("rows" in oldVals || "cols" in oldVals || "centeredYear" in oldVals || "year" in oldVals) {
				var firstYear = this.centeredYear - Math.floor(this.rows * this.cols / 2);
				var presentYear = (new this.dateClassObj()).getFullYear();
				this.cells.forEach(function (cell, idx) {
					cell.year = firstYear + idx;
					cell.firstChild.textContent = cell.year;

					if (cell.year === this.year) {
						cell.className = "d-date-picker-selected";
					} else if (this.year === null && cell.year === presentYear) {
						// If there's no selected year, then show the indicator for the present year.
						cell.className = "d-date-picker-today";
					} else {
						// Erase possible previous value.
						cell.className = "";
					}
				}, this);
				this.currentYearsLabel.textContent = this.formatYearRange(firstYear, firstYear +
					this.cells.length - 1);
			}
		},

		/**
		 * Formats the given year label, i.e. in Japanese 2016年 not just 2016.
		 * @param {number} year - Year to format.
		 * @returns {string}
		 */
		formatYearLabel: function (year) {
			var bundle = this.dateLocaleModule._getGregorianBundle();

			// Create a date Object for specified year avoiding timezone issues and also handling
			// dates from 0-99AD.  Note that "new Date(80, 1, 0)" maps to 1980, not 80.
			var date = new Date(2000, 5, 0);
			date.setFullYear(year);

			return this.dateLocaleModule.format(date, {
				selector: "date",
				datePattern: bundle["dateFormatItem-y"]
			});
		},

		/**
		 * Formats the given year range.
		 * @param {number} startYear - Start of year range.
		 *		Range starts on this date.
		 * @param {number} endYear - End of year range.
		 *		Range ends on this date.
		 */
		formatYearRange: function (startYear, endYear) {
			// Hardcode patterns for year ranges, since they are not available from the CLDR data.
			var pattern;
			switch (dojo.locale) {
			case "ja":
				pattern = "{{1}}～{{2}}";
				break;
			default:
				pattern = "{{1}}-{{2}}";
			}

			return pattern.replace("{{1}}", this.formatYearLabel(startYear))
				.replace("{{2}}", this.formatYearLabel(endYear));
		}
	});
});
