define([
	"dcl/dcl",
	"dojo/date",
	"dojo/date/locale",
	"dojo/cldr/supplemental",
	"dojo/date/stamp"
], function (
	dcl,
	ddate,
	locale,
	cldr,
	stamp
) {
	/**
	 * Mixin with time methods.
	 */
	return dcl(null, {
		_calendar: "gregorian",

		/**
		 * Object with same API as native Date class.
		 */
		dateClassObj: Date,

		/**
		 * Object with same API as dojo/date.
		 */
		dateModule: ddate,

		/**
		 * Object with same API as dojo/date/locale.
		 */
		dateLocaleModule: locale,

		/**
		 * First day of the week for current locale.
		 * 0 = Sunday, 1 = Monday, 2 = Tuesday, 3 = Wednesday, 4 = Thursday, 5 = Friday, 6 = Saturday.
		 */
		firstDayOfWeek: cldr.getFirstDayOfWeek(),

		/**
		 * Creates a new Date object.
		 * @param obj
		 *		This object can have several values:
		 *
		 *		- the time in milliseconds since gregorian epoch.
		 *		- a Date instance
		 * @returns {Date}
		 */
		newDate: function (obj) {
			if (obj.toGregorian) {
				obj = obj.toGregorian();
			}

			if (obj.getTime) {
				// obj is a Date.  Standard way to copy a Date is new Date(oldDate.getTime()), but that has problems
				// with timezone-js around DST when dealing with a timezone different than the machine's timezone.
				return new this.dateClassObj(obj.getFullYear(), obj.getMonth(), obj.getDate(),
					obj.getHours(), obj.getMinutes(), obj.getSeconds(), obj.getMilliseconds());
			} else if (typeof obj === "number") {
				// obj is a timestamp.
				return new this.dateClassObj(obj);
			} else if (typeof obj === "string") {
				// obj is an ISO string like "2017-10-20".
				var d = stamp.fromISOString(obj);
				if (d === null) {
					throw new Error("Cannot parse date string (" + obj + ")"); // cannot build date
				}
				if (this.dateClassObj === Date) {
					return d;
				} else {
					return this.newDate(d);   // from Date to this.dateClassObj
				}
			}
		},

		/**
		 * Determines whether the specified date is a week-end.
		 * @param {Date} date
		 * @returns {boolean}
		 */
		isWeekEnd: function (date) {
			return locale.isWeekend(date);
		},

		/**
		 * Returns the week number string from dojo.date.locale.format() method
		 * @param {Date} date
		 * @returns {string}
		 */
		getWeekNumberLabel: function (date) {
			if (date.toGregorian) {
				date = date.toGregorian();
			}
			return locale.format(date, {
				selector: "date",
				datePattern: "w"
			});
		},

		addAndFloor: function (date, unit, steps) {
			// date must be floored!!
			// unit >= day
			var d = this.dateModule.add(date, unit, steps);
			if (d.getHours() === 23) {
				d = this.dateModule.add(d, "hour", 2); // go to 1am
			} else {
				d = this.floorToDay(d);
			}
			return d;
		},

		/**
		 * Floors the specified date to the start of day.
		 * @param {Date} date
		 * @returns {Date}
		 */
		floorToDay: function (date) {
			return new this.dateClassObj(date.getFullYear(), date.getMonth(), date.getDate());
		},

		/**
		 * Floors the specified date to the beginning of week.
		 * @param {Date} date
		 * @returns {Date}
		 */
		floorToWeek: function (date) {
			var fd = this.firstDayOfWeek;
			var day = date.getDay();
			var dayAdjust =  day >= fd ? -day + fd : -day + fd - 7;
			return new this.dateClassObj(date.getFullYear(), date.getMonth(), date.getDate() + dayAdjust);
		},

		/**
		 * Floors the specified date to the start of the date's month.
		 * @param {Date} date
		 * @returns {Date}
		 */
		floorToMonth: function (date) {
			return new this.dateClassObj(date.getFullYear(), date.getMonth(), 1);
		},

		/**
		 * Returns whether the specified date is in the current day.
		 * @param {Date} date
		 * @returns {boolean}
		 */
		isToday: function (date) {
			var today = new this.dateClassObj();
			return date.getFullYear() === today.getFullYear() &&
				date.getMonth() === today.getMonth() &&
				date.getDate() === today.getDate();
		},

		/**
		 * Tests if the specified date represents the start of the day.
		 * @param {Date} date
		 * @returns {boolean}
		 */
		isStartOfDay: function (date) {
			return this.dateModule.compare(this.floorToDay(date), date) === 0;
		},

		/**
		 * Computes if the first time range defined by the start1 and end1 parameters
		 * is overlapping the second time range defined by the start2 and end2 parameters.
		 * @param {Date} start1 - The start time of the first time range.
		 * @param {Date} end1 - The end time of the first time range.
		 * @param {Date} start2 - The start time of the second time range.
		 * @param {Date} end2 - The end time of the second time range.
		 * @param {boolean} includeLimits - Whether include the end time or not.
		 * @returns {boolean}
		 */
		isOverlapping: function (start1, end1, start2, end2, includeLimits) {
			if (start1 === null || start2 === null || end1 === null || end2 === null) {
				return false;
			}

			var cal = this.dateModule;

			if (includeLimits) {
				if (cal.compare(start1, end2) === 1 || cal.compare(start2, end1) === 1) {
					return false;
				}
			} else if (cal.compare(start1, end2) !== -1 || cal.compare(start2, end1) !== -1) {
				return false;
			}

			return true;
		},

		/**
		 * Tests if the specified dates are in the same day.
		 * @param {Date} date1 - The first date.
		 * @param {Date} date2 - The second date.
		 * @returns {boolean}
		 */
		isSameDay: function (date1, date2) {
			if (date1 === null || date2 === null) {
				return false;
			}

			return date1.getFullYear() === date2.getFullYear() &&
				date1.getMonth() === date2.getMonth() &&
				date1.getDate() === date2.getDate();
		}
	});
});
