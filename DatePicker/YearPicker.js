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
		 */
		year: 0,

		/**
		 *  First year displayed in grid
		 */
		firstYear: 0,

		/**
		 * CSS class for icon to go to previous month or year.
		 */
		previousIconClass: "d-caret-previous",

		/**
		 * CSS class for icon to go to next month or year.
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
		 */
		rows: 5,

		/**
		 * Number of columns
		 */
		cols: 5,

		/**
		 * Computed text at the bottom of the screen between the arrows.
		 */
		currentYearsLabel: "",

		/**
		 * Handler when user click button to step back 25 years.
		 */
		previousYearsClickHandler: function () {
			this.firstYear -= this.rows * this.cols;
		},

		/**
		 * Handler when user click button to step forward 25 years.
		 */
		nextYearsClickHandler: function () {
			this.firstYear += this.rows * this.cols;
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

		computeProperties: function (oldVals) {
			// If necessary, adjust years shown in grid so that YearPicker#year is visible.
			if ("year" in oldVals &&
					(this.year < this.firstYear || this.year >= this.firstYear + this.rows * this.cols)) {
				this.firstYear = this.year - Math.floor(this.rows * this.cols / 2);
			}

			if ("firstYear" in oldVals) {
				// Display something like "2000 - 2025" in between the arrows.
				this.currentYearsLabel = this.formatYearRange(this.firstYear, this.firstYear +
					this.rows * this.cols);
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
			if ("rows" in oldVals || "cols" in oldVals || "firstYear" in oldVals || "year" in oldVals) {
				this.cells.forEach(function (cell, idx) {
					cell.year = this.firstYear + idx;
					cell.firstChild.textContent = this.formatYearLabel(cell.year);
					cell.className = cell.year === this.year ? "d-date-picker-selected" : "";
				}, this);
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
