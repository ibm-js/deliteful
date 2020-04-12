define([
	"dcl/dcl",
	"luxon",
	"delite/register",
	"delite/KeyNav",
	"../TimeBase",
	"delite/handlebars!./DayPicker.html"
], function (
	dcl,
	luxon,
	register,
	KeyNav,
	TimeBase,
	template
) {
	"use strict";

	const DateTime = luxon.DateTime;

	/**
	 * Main view of the DatePicker, used for picking the day or opening the MonthPicker or YearPicker.
	 */
	return register("d-day-picker", [HTMLElement, KeyNav, TimeBase], {
		baseClass: "d-day-picker",

		template: template,

		/**
		 * Selected date.
		 * @member {DateTime}
		 */
		value: null,

		/**
		 * DateTime object containing the currently focused date, or the date that would be focused
		 * if the calendar itself was focused.   Also indicates which year and month to display,
		 * i.e. the current "page" the calendar is on.
		 * @member {DateTime}
		 */
		currentFocus: null,

		/**
		 * Current year number, ex: 2015.
		 * @member {number}
		 * @readonly
		 */
		currentYear: "",

		/**
		 * Current month number, ex: 6.
		 * @member {number}
		 * @readonly
		 */
		currentMonth: "",

		/**
		 * Multi-dimensional array for each date in the calendar grid.  Computed based on `this.currentFocus`.
		 * @member {DateTime[][]}
		 * @readonly
		 */
		dates: null,

		/**
		 * Current year label, ex: "2015".
		 * @member {string}
		 * @readonly
		 */
		currentYearLabel: "",

		/**
		 * Current month label, ex: "March".
		 * @member {string}
		 * @readonly
		 */
		currentMonthLabel: "",

		/**
		 * Aria-label for the grid.
		 * @member {string}
		 */
		gridLabel: "",

		/**
		 * Label for button to go to previous month.
		 * @member {string}
		 * @readonly
		 */
		previousMonthButtonLabel: "",

		/**
		 * Label for button to go to next month.
		 * @member {string}
		 * @readonly
		 */
		nextMonthButtonLabel: "",

		/**
		 * Label for button to go to previous year.
		 * @member {string}
		 * @readonly
		 */
		previousYearButtonLabel: "",

		/**
		 * Label for button to go to next year.
		 * @member {string}
		 * @readonly
		 */
		nextYearButtonLabel: "",

		/**
		 * CSS class for icon to go to previous month or year.
		 */
		previousIconClass: "d-caret-previous",

		/**
		 * CSS class for icon to go to next month or year.
		 */
		nextIconClass: "d-caret-next",

		constructor: function () {
			this.on("click", this.clickHandler.bind(this));
		},

		// Helper function to convert date to a hash key.
		_dateToHashKey: function (date) {
			return date.year + "-" + date.month + "-" + date.day;
		},

		// Helper function to map from DateTime to the table cell representing that DateTime.
		_dateToCell: function (date) {
			return this._dayCells && this._dayCells[this._dateToHashKey(date)];
		},

		computeProperties: function (oldVals) {
			// Start on month containing this.value, or if there's no value set, then the current day.
			if ("value" in oldVals) {
				this.currentFocus = this.value && !isNaN(this.value) ? this.value : DateTime.local();
			}

			// If requested date is not in current month, then switch to month with requested date.
			// Sometimes that's not necessary, since the grid usually displays a few days from the next and
			// previous months, but it keeps us out of trouble with processing clicks of next/previous month
			// buttons.
			if ("currentFocus" in oldVals && this.currentFocus) {
				this.currentMonth = this.currentFocus.month;
				this.currentYear = this.currentFocus.year;
				this.deliverComputing();	// if month/year changed, run next if() block before refreshRendering()
			}

			// If month or year has changed...
			if ("currentMonth" in oldVals || "currentYear" in oldVals) {
				this.currentMonthLabel = this.formatMonthLabel(this.currentFocus);
				this.currentYearLabel = this.formatYearLabel(this.currentFocus);

				// Compute the Sunday for the week that includes the first day
				// of the month.
				var startOfMonth = this.floorToMonth(this.currentFocus);
				var startDate = this.floorToWeek(startOfMonth);

				// Then, compute the number of weeks to display. Will be between 4 (ex: Feb 2015) and 6 (ex: May 2015).
				var endDate = this.floorToWeek(startOfMonth.plus({month: 1, day: 6}));
				var rowCount = endDate.diff(startDate, "weeks").weeks;

				// Finally, compute the array of dates that the calendar should show.
				this.dates = [];
				var d = startDate;
				for (var row = 0; row < rowCount; row++) {
					this.dates.push([]);
					for (var col = 0; col < 7; col++) {
						this.dates[row].push(d);
						d = d.plus({day: 1}).startOf("day");
					}
				}
			}
		},

		initializeRendering: dcl.superCall(function (sup) {
			return function () {
				sup.apply(this, arguments);

				// Create column headers.
				var d = this.floorToWeek(DateTime.local());
				for (var i = 0; i < 7; i++) {
					var cell = this.daysRow.appendChild(this.ownerDocument.createElement("div"));
					cell.id = this.widgetId + "-day-" + i;
					cell.textContent = this.formatColumnHeaderLabel(d);
					cell.setAttribute("role", "rowheader");
					d = d.plus({day: 1});
				}

				// Create table rows.
				this.rows = [];
				for (var row = 0; row < 6; row++) {
					var tr = this.grid.appendChild(this.ownerDocument.createElement("div"));
					tr.setAttribute("role", "row");
					this.rows.push(tr);
					for (var col = 0; col < 7; col++) {
						var td = tr.appendChild(this.ownerDocument.createElement("div"));
						td.setAttribute("role", "gridcell");
						td.col = col;
					}
				}
			};
		}),

		refreshRendering: function (oldVals) {
			// Code to run when month (or year) has changed.
			if ("dates" in oldVals && this.dates) {
				// Fill in the day numbers and create hash mapping from date string to table cell.
				this._dayCells = {};

				// Set properties and attributes on table cells, both the cells containing dates,
				// and the cells that are just for vertical padding.
				this.rows.forEach(function (tr, rowIdx) {
					Array.prototype.forEach.call(tr.children, function (td, colIdx) {
						// Remove old nested <span> or &nbsp; from cell.
						if (td.firstChild) {
							td.removeChild(td.firstChild);
						}

						var d = this.dates[rowIdx] && this.dates[rowIdx][colIdx];
						if (d) {
							// This cell contains a date (i.e. a number from 1 - 31).
							td.setAttribute("role", "gridcell");
							td.setAttribute("aria-label", this.formatDateAriaLabel(d));
							td.setAttribute("tabindex", "-1");
							td.className = "d-date-picker-date";
							this._dayCells[this._dateToHashKey(d)] = td;
							td.value = d;

							// Store text in a nested element so vertical centering works.
							td.appendChild(this.ownerDocument.createElement("span"));
							td.firstChild.textContent = this.formatGridCellLabel(d, rowIdx, colIdx);

							this.styleGridCell(td, d);
						} else {
							// This cell is just for spacing; it doesn't represent a date.
							td.setAttribute("role", "presentation");
							td.removeAttribute("aria-label");
							td.removeAttribute("tabindex");
							td.className = "d-date-picker-blank";
							delete td.value;
							td.innerHTML = "&nbsp;";
						}
					}, this);
				}, this);

				var today = this.grid.querySelector(".d-date-picker-today");
				if (today) {
					today.classList.remove("d-date-picker-today");
				}

				var todayCell = this._dateToCell(DateTime.local());
				if (todayCell) {
					todayCell.classList.add("d-date-picker-today");
				}
			}

			// When this.currentFocus is changed, we handle the actual refocus in refreshRendering().
			if ("currentFocus" in oldVals) {
				this.navigateTo(this._dateToCell(this.currentFocus));
			}

			// Adjust CSS for the selected date whenever the selected date changes or we switch to another month.
			if ("value" in oldVals || "dates" in oldVals) {
				var selected = this.grid.querySelector(".d-date-picker-selected");
				if (selected) {
					selected.classList.remove("d-date-picker-selected");
				}

				if (this.value && !isNaN(this.value)) {
					var selectedCell = this._dateToCell(this.value);
					if (selectedCell) {
						selectedCell.classList.add("d-date-picker-selected");
					}
				}
			}
		},

		//////////////////////////////////////////
		//
		// Formatting functions
		//
		//////////////////////////////////////////

		/**
		 * Computes the column header label for the specified date.
		 * @param {DateTime} d
		 * @returns {string}
		 * @protected
		 */
		formatColumnHeaderLabel: function (d) {
			return d.toLocaleString({ weekday: "narrow" });
		},

		/**
		 * Compute the label for a grid cell.  Should be just the number, ex: 9 not 9日.
		 * @param {DateTime} d - The date to format.
		 * @param {number} row - The row that displays the current date.
		 * @param {number} col - The column that displays the current date.
		 * @returns {string}
		 * @protected
		 */
		formatGridCellLabel: function (d) {
			return d.toLocaleString({ day: "numeric" });
		},

		/**
		 * Styles the CSS classes to the node that displays a cell.
		 * @param {Element} node - The DOM node that displays the cell in the grid.
		 * @param {} date - The date displayed by this cell.
		 */
		styleGridCell: function (node, date) {
			node.classList.toggle("d-date-picker-other-month", date.month !== this.currentFocus.month);
		},

		/**
		 * Convert DateTime to string.  Used to set aria-label of each cell.
		 * @param {DateTime} d
		 * @returns {string}
		 */
		formatDateAriaLabel: function (d) {
			return d.toLocaleString(DateTime.DATE_FULL);
		},

		/**
		 * Formats the given month label.
		 * @param {DateTime} date - DateTime to format.
		 * @returns {string}
		 */
		formatMonthLabel: function (date) {
			return date.toLocaleString({ month: "long" });
		},

		/**
		 * Formats the given year label.
		 * @param {DateTime} date - DateTime to format.
		 * @returns {string}
		 */
		formatYearLabel: function (date) {
			return date.toLocaleString({ year: "numeric" });
		},

		////////////////////////////////////////////
		//
		// Event handling
		//
		///////////////////////////////////////////

		/**
		 * Handler for click of dates in the calendar grid.
		 * @param {Event} event
		 */
		clickHandler: function (event) {
			for (var node = event.target; node !== this; node = node.parentNode) {
				if (node.value) {
					this.currentFocus = node.value;
					this.value = node.value;
					event.preventDefault();
					event.stopPropagation();
					this.emit("change");
					return;
				}
			}
		},

		/**
		 * Handle click of current month.
		 * @param {Event} event
		 */
		currentMonthClickHandler: function () {
			this.emit("current-month-clicked");
		},

		/**
		 * Handle click of arrow to go to next month.
		 * @param {Event} event
		 */
		nextMonthClickHandler: function () {
			this.focus(this.currentFocus.plus({month: 1}));
		},

		/**
		 * Handle click of arrow to go to previous month.
		 * @param {Event} event
		 */
		previousMonthClickHandler: function () {
			this.focus(this.currentFocus.minus({month: 1}));
		},

		/**
		 * Handle click of current year.
		 * @param {Event} event
		 */
		currentYearClickHandler: function () {
			this.emit("current-year-clicked");
		},

		/**
		 * Handle click of arrow to go to next year.
		 * @param {Event} event
		 */
		nextYearClickHandler: function () {
			this.setYear(this.currentFocus.year + 1);
		},

		/**
		 * Handle click of arrow to go to previous year.
		 * @param {Event} event
		 */
		previousYearClickHandler: function () {
			this.setYear(this.currentFocus.year - 1);
		},

		/**
		 * Move to specified month.
		 */
		setMonth: function (month) {
			var newDate = this.currentFocus.set({month: month});
			this.focus(newDate);
		},

		/**
		 * Move to specified year.
		 */
		setYear: function (year) {
			var newDate = this.currentFocus.set({year: year});
			this.focus(newDate);
		},

		////////////////////////////////////////////
		//
		// Keyboard support.
		// See https://www.w3.org/TR/wai-aria-practices/#datepicker
		//
		///////////////////////////////////////////

		// All the dates cells should be navigable, but not the column header cells or the blank <td> for spacing.
		descendantSelector: ".d-date-picker-date",

		previousKeyHandler: function () {
			this.focus(this.currentFocus.minus({day: 1}));
		},

		nextKeyHandler: function () {
			this.focus(this.currentFocus.plus({day: 1}));
		},

		upKeyHandler: function () {
			this.focus(this.currentFocus.minus({week: 1}));
		},

		downKeyHandler: function () {
			this.focus(this.currentFocus.plus({week: 1}));
		},

		pageUpKeyHandler: function (event) {
			this.focus(this.currentFocus.minus(event.ctrlKey || event.shiftKey ? {year: 1} : {month: 1}));
		},

		pageDownKeyHandler: function (event) {
			this.focus(this.currentFocus.plus(event.ctrlKey || event.shiftKey ? {year: 1} : {month: 1}));
		},

		homeKeyHandler: function () {
			this.focus(this.currentFocus.startOf("month"));
		},

		endKeyHandler: function () {
			this.focus(this.currentFocus.endOf("month"));
		},

		enterKeyHandler: function (event) {
			this.clickHandler(event);
		},

		spacebarKeyHandler: function (event) {
			this.clickHandler(event);
		},

		focus: function (date) {
			// Trigger refreshRendering() to navigate to this.currentFocus <td>.
			if (date) {
				this.currentFocus = date;
			}
			this.notifyCurrentValue("currentFocus");	// focus it even if same value as before
			this.deliver();
		}
	});
});
