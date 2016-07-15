define([
	"requirejs-dplugins/jquery!attributes/classes",
	"dojo/date",
	"dojo/date/locale",
	"dojo/i18n",
	"delite/register",
	"delite/KeyNav",
	"./TimeBase",
	"delite/handlebars!./DatePicker/DatePicker.html",
	"delite/theme!./DatePicker/themes/{{theme}}/DatePicker.css",
	"delite/uacss"	// CSS has workaround for IE11
], function (
	$,
	ddate,
	locale,
	i18n,
	register,
	KeyNav,
	TimeBase,
	template
) {
	"use strict";

	/**
	 * Small calendar to be used as a dropdown, designed for picking a date.
	 */
	return register("d-date-picker", [HTMLElement, KeyNav, TimeBase], {
		baseClass: "d-date-picker",

		template: template,

		/**
		 * Selected date.
		 * @member {Date}
		 */
		value: null,

		/**
		 * Date object containing the currently focused date, or the date that would be focused
		 * if the calendar itself was focused.   Also indicates which year and month to display,
		 * i.e. the current "page" the calendar is on.
		 * @member {Date}
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
		 * @member {Date[][]}
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
		 * Current year and month label, ex: "March 2015".
		 * @member {string}
		 * @readonly
		 */
		currentMonthYearLabel: "",

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
		previousIconClass: "d-chevron-previous",

		/**
		 * CSS class for icon to go to next month or year.
		 */
		nextIconClass: "d-chevron-next",

		createdCallback: function () {
			this.on("click", this.clickHandler.bind(this));

			if (!this.value) {
				this.value = new this.dateClassObj();
			}

			// Set button labels.  This isn't quite right because it says "last month" and "last year"
			// rather than "previous month" and "previous year", but it will do for now.
			var bundle = locale._getGregorianBundle();
			this.previousMonthButtonLabel = bundle["field-month-relative+-1"];
			this.nextMonthButtonLabel = bundle["field-month-relative+1"];
			this.previousYearButtonLabel = bundle["field-year-relative+-1"];
			this.nextYearButtonLabel = bundle["field-year-relative+1"];
		},

		// Helper function to convert date to a hash key.
		_dateToHashKey: function (date) {
			return date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate();
		},

		// Helper function to map from Date to the table cell representing that date.
		_dateToCell: function (date) {
			return this._dayCells && this._dayCells[this._dateToHashKey(date)];
		},

		computeProperties: function (oldVals) {
			// Start on month containing this.value.
			if ("value" in oldVals) {
				this.currentFocus = this.value;
			}

			// If requested date is not in current month, then switch to month with requested date.
			// Sometimes that's not necessary, since the grid usually displays a few days from the next and
			// previous months, but it keeps us out of trouble with processing clicks of next/previous month
			// buttons.
			if ("currentFocus" in oldVals && this.currentFocus) {
				this.currentMonth = this.currentFocus.getMonth();
				this.currentYear = this.currentFocus.getYear();
				this.deliverComputing();	// if month/year changed, run next if() block before refreshRendering()
			}

			// If month or year has changed...
			if ("currentMonth" in oldVals || "currentYear" in oldVals) {
				this.currentMonthLabel = this.formatMonthLabel(this.currentFocus);
				this.currentYearLabel = this.formatYearLabel(this.currentFocus);
				this.currentMonthYearLabel = this.formatMonthYearAriaLabel(this.currentFocus);

				// Compute the Sunday for the week that includes the first day
				// of the month.
				var startOfMonth = this.floorToMonth(this.currentFocus);
				var startDate = this.floorToWeek(startOfMonth);

				// Then, compute the number of weeks to display. Will be between 4 (ex: Feb 2015) and 6 (ex: May 2015).
				var endDate = ddate.add(startOfMonth, "month", 1);
				endDate = ddate.add(endDate, "day", 6);
				endDate = this.floorToWeek(endDate);
				var rowCount = ddate.difference(startDate, endDate, "week");

				// Finally, compute the array of dates that the calendar should show.
				this.dates = [];
				var d = startDate;
				for (var row = 0; row < rowCount; row++) {
					this.dates.push([]);
					for (var col = 0; col < 7; col++) {
						this.dates[row].push(d);
						d = this.addAndFloor(d, "day", 1);
					}
				}
			}
		},

		render: register.superCall(function (sup) {
			return function () {
				sup.apply(this, arguments);

				// Create column headers.
				var d = this.floorToWeek(new this.dateClassObj());
				for (var i = 0; i < 7; i++) {
					var cell = this.headerRow.appendChild(this.ownerDocument.createElement("th"));
					cell.textContent = this.formatColumnHeaderLabel(d);
					d = ddate.add(d, "day", 1);
				}

				// Create template for normal table rows.
				var tr = this.rowTemplate = this.ownerDocument.createElement("tr");
				for (var j = 0; j < 7; j++) {
					var td = tr.insertCell();
					td.setAttribute("tabIndex", "-1");
				}
			};
		}),

		refreshRendering: function (oldVals) {
			// Code to run when month (or year) has changed.
			if ("dates" in oldVals && this.dates) {
				// Adjust number of rows to equal this.dates.length
				var delta = this.dates.length - this.tbody.children.length;
				while (delta > 0) {
					this.tbody.appendChild(this.rowTemplate.cloneNode(true));
					delta--;
				}
				while (delta < 0) {
					this.tbody.removeChild(this.tbody.lastElementChild);
					delta++;
				}

				// Fill in the day numbers and create hash mapping from date string to table cell.
				this._dayCells = {};

				Array.prototype.forEach.call(this.tbody.children, function (tr, rowIdx) {
					Array.prototype.forEach.call(tr.children, function (td, colIdx) {
						var d = this.dates[rowIdx][colIdx];
						td.setAttribute("aria-label", this.formatDateAriaLabel(d));
						td.col = colIdx;
						this._dayCells[this._dateToHashKey(d)] = td;
						td.value = d;
						td.innerText = this.formatGridCellLabel(d, rowIdx, colIdx);
						this.styleGridCell(td, d);
					}, this);
				}, this);
			}

			// When this.currentFocus is changed, we handle the actual refocus in refreshRendering().
			if ("currentFocus" in oldVals) {
				this.navigateTo(this._dateToCell(this.currentFocus));
			}

			// Adjust CSS for the selected date whenever the selected date changes or we switch to another month.
			if ("value" in oldVals || "dates" in oldVals) {
				$(".d-date-picker-selected", this.tbody).removeClass("d-date-picker-selected");
				var newSelectedCell = this._dateToCell(this.value);
				if (newSelectedCell) {
					$(newSelectedCell).addClass("d-date-picker-selected");
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
		 * @param {Date} d
		 * @returns {string}
		 * @protected
		 */
		formatColumnHeaderLabel: function (d) {
			return this.dateLocaleModule.getNames("days", "narrow", "standAlone")[d.getDay()];
		},

		/**
		 * Compute the label for a grid cell.
		 * @param {Date} d - The date to format.
		 * @param {number} row - The row that displays the current date.
		 * @param {number} col - The column that displays the current date.
		 * @returns {string}
		 * @protected
		 */
		formatGridCellLabel: function (d) {
			var rb = i18n.getLocalization("dojo.cldr", this._calendar);
			return this.dateLocaleModule.format(d, {
				selector: "date",
				datePattern: rb["dateFormatItem-d"]
			});
		},

		/**
		 * Styles the CSS classes to the node that displays a cell.
		 * @param {Element} node - The DOM node that displays the cell in the grid.
		 * @param {Date} date - The date displayed by this cell.
		 */
		styleGridCell: function (node, date) {
			$(node).toggleClass("d-date-picker-today", this.isToday(date))
				.toggleClass("d-date-picker-other-month", date.getMonth() !== this.currentFocus.getMonth());
		},

		/**
		 * Convert Date to string.  Used to set aria-label of each cell.
		 * @param {Date} d
		 * @returns {string}
		 */
		formatDateAriaLabel: function (d) {
			return locale.format(d, {
				selector: "date",
				formatLength: "long"
			});
		},

		/**
		 * Formats the given month/year combo for an aria-label for the calendar grid.
		 * @param {Date} date - Date to format.
		 * @returns {string}
		 */
		formatMonthYearAriaLabel: function (date) {
			var bundle = locale._getGregorianBundle();
			var monthYearPattern = bundle["dateFormatItem-yMMM"];
			monthYearPattern = monthYearPattern.replace("MMM", "MMMM");	// March not Mar
			return locale.format(date, {
				selector: "date",
				datePattern: monthYearPattern
			});
		},

		/**
		 * Formats the given month label.
		 * @param {Date} date - Date to format.
		 * @returns {string}
		 */
		formatMonthLabel: function (date) {
			return locale.format(date, {
				selector: "date",
				datePattern: "MMMM"
			});
		},

		/**
		 * Formats the given year label.
		 * @param {Date} date - Date to format.
		 * @returns {string}
		 */
		formatYearLabel: function (date) {
			return locale.format(date, {
				selector: "date",
				datePattern: "yyyy"
			});
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
		 * Handle click of arrow to go to next month.
		 * @param {Event} event
		 */
		nextMonthClickHandler: function () {
			this.focus(this.dateModule.add(this.currentFocus, "month", 1));
		},

		/**
		 * Handle click of arrow to go to previous month.
		 * @param {Event} event
		 */
		previousMonthClickHandler: function () {
			this.focus(this.dateModule.add(this.currentFocus, "month", -1));
		},

		/**
		 * Handle click of arrow to go to next year.
		 * @param {Event} event
		 */
		nextYearClickHandler: function () {
			this.focus(this.dateModule.add(this.currentFocus, "year", 1));
		},

		/**
		 * Handle click of arrow to go to previous year.
		 * @param {Event} event
		 */
		previousYearClickHandler: function () {
			this.focus(this.dateModule.add(this.currentFocus, "year", -1));
		},

		////////////////////////////////////////////
		//
		// Keyboard support
		//
		///////////////////////////////////////////

		// All the dates cells should be navigable, but not the column header cells.
		descendantSelector: "td",

		previousKeyHandler: function () {
			var row = this.navigatedDescendant.parentNode;
			var cell = this.navigatedDescendant.previousElementSibling || row.lastElementChild;
			this.focus(cell.value);
		},

		nextKeyHandler: function () {
			var row = this.navigatedDescendant.parentNode;
			var cell = this.navigatedDescendant.nextElementSibling || row.firstElementChild;
			this.focus(cell.value);
		},

		upKeyHandler: function () {
			this.focus(this.dateModule.add(this.currentFocus, "week", -1));
		},

		downKeyHandler: function () {
			this.focus(this.dateModule.add(this.currentFocus, "week", 1));
		},

		pageUpKeyHandler: function (event) {
			this.focus(this.dateModule.add(this.currentFocus, event.shiftKey ? "year" : "month", -1));
		},

		pageDownKeyHandler: function (event) {
			this.focus(this.dateModule.add(this.currentFocus, event.shiftKey ? "year" : "month", 1));
		},

		homeKeyHandler: function () {
			// Go to first day of current month.
			this.currentFocus.setDate(1);
			this.focus(this.currentFocus);
		},

		endKeyHandler: function () {
			// Go to last day of current month.
			this.currentFocus.setMonth(this.currentFocus.getMonth() + 1);
			this.currentFocus.setDate(0);
			this.focus(this.currentFocus);
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
