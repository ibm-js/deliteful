define([
	"dcl/dcl",
	"luxon"
], function (
	dcl,
	luxon
) {
	/**
	 * Mixin with time methods.
	 */
	return dcl(null, {
		/**
		 * First day of the week.
		 * 0 = Sunday, 1 = Monday, 2 = Tuesday, 3 = Wednesday, 4 = Thursday, 5 = Friday, 6 = Saturday.
		 */
		firstDayOfWeek: 0,

		/**
		 * Creates a new Date object.
		 * @param obj
		 *		This object can have several values:
		 *
		 *		- the time in milliseconds since gregorian epoch.
		 *		- a Date instance
		 * @returns {luxon.DateTime}
		 */
		newDate: function (obj) {
			if (obj instanceof luxon.DateTime) {
				return obj;
			} else if (obj.getTime) {
				return luxon.DateTime.fromJSDate(obj);
			} else if (typeof obj === "number") {
				return  luxon.DateTime.fromMillis(obj);
			} else if (typeof obj === "string") {
				return  luxon.DateTime.fromIso(obj);
			}
		},

		/**
		 * Returns a hash containing the start and end days of the weekend in the specified locale,
		 * where 0 = Sunday, 1 = Monday, ... and 6 = Saturday.
		 * e.g. {start:6, end:0}
		 * @param locale
		 * @returns {{start, end}}
		 */
		getWeekend: function (/*String?*/locale) {
			var weekendStart = {/*default is 6=Saturday*/
					"in": 0,
					"af": 4,
					"dz": 4,
					"ir": 4,
					"om": 4,
					"sa": 4,
					"ye": 4,
					"ae": 5,
					"bh": 5,
					"eg": 5,
					"il": 5,
					"iq": 5,
					"jo": 5,
					"kw": 5,
					"ly": 5,
					"ma": 5,
					"qa": 5,
					"sd": 5,
					"sy": 5,
					"tn": 5
				},

				weekendEnd = {/*default is 0=Sunday*/
					af: 5,
					dz: 5,
					ir: 5,
					om: 5,
					sa: 5,
					ye: 5,
					ae: 6,
					bh: 5,
					eg: 6,
					il: 6,
					iq: 6,
					jo: 6,
					kw: 6,
					ly: 6,
					ma: 6,
					qa: 6,
					sd: 6,
					sy: 6,
					tn: 6
				},

				country = locale.split("-")[1].toLowerCase(),
				start = weekendStart[country],
				end = weekendEnd[country];

			if (start === undefined) {
				start = 6;
			}
			if (end === undefined) {
				end = 0;
			}

			return { start: start, end: end };
		},

		/**
		 * Determines whether the specified date is a week-end.
		 * @param {luxon.DateTime} date
		 * @returns {boolean}
		 */
		isWeekEnd: function (date) {
			var weekend = this.getWeekend(date.locale),
				day = date.weekday;
			if (weekend.end < weekend.start) {
				weekend.end += 7;
				if (day < weekend.start) {
					day += 7;
				}
			}
			return day >= weekend.start && day <= weekend.end;
		},

		/**
		 * Returns the week number string.
		 * @param {luxon.DateTime} date
		 * @returns {string}
		 */
		getWeekNumberLabel: function (date) {
			return luxon.DateTime.fromJSDate(date).weekNumber;
		},

		// TODO: remove usages of this method, use  .plus({"week", 1}).startOf("day")
		addAndFloor: function (date, unit, steps) {
			let offset = {};
			offset[unit] = steps;
			return date.plus(offset).startOf("day");
		},

		// TODO: just use .startOf("day")
		/**
		 * Floors the specified date to the start of day.
		 * @param {luxon.DateTime} date
		 * @returns {luxon.DateTime}
		 */
		floorToDay: function (date) {
			return date.startOf("day");
		},

		/**
		 * Floors the specified date to the beginning of week, according to this.firstDayOfWeek.
		 * Call this instead of startOf("week") because startOf("week") always uses Monday.
		 * @param {luxon.DateTime} date
		 * @returns {luxon.DateTime}
		 */
		floorToWeek: function (date) {
			const fd = this.firstDayOfWeek;
			const day = date.weekday % 7;	// convert to 0=sunday .. 6=saturday
			const dayAdjust =  day >= fd ? -day + fd : -day + fd - 7;
			return date.plus({days: dayAdjust});
		},

		// TODO: just use startOf("month")
		/**
		 * Floors the specified date to the start of the date's month.
		 * @param {luxon.DateTime} date
		 * @returns {luxon.DateTime}
		 */
		floorToMonth: function (date) {
			return date.startOf("month");
		},

		/**
		 * Returns whether the specified date is in the current day.
		 * @param {luxon.DateTime} date
		 * @returns {boolean}
		 */
		isToday: function (date) {
			let today = luxon.DateTime.fromObject({zone: date.zone});
			return date.year === today.year &&
				date.month === today.month &&
				date.day === today.day;
		},

		// TODO: where is this used?
		/**
		 * Tests if the specified date represents the start of the day.
		 * @param {luxon.DateTime} date
		 * @returns {boolean}
		 */
		isStartOfDay: function (date) {
			return +date === +date.startOf("day");
		},

		// TODO: Update code to use Intervals directly, or at leats, inline the checks below.
		/**
		 * Computes if the first time range defined by the start1 and end1 parameters
		 * is overlapping the second time range defined by the start2 and end2 parameters.
		 * @param {luxon.DateTime} start1 - The start time of the first time range.
		 * @param {luxon.DateTime} end1 - The end time of the first time range.
		 * @param {luxon.DateTime} start2 - The start time of the second time range.
		 * @param {luxon.DateTime} end2 - The end time of the second time range.
		 * @returns {boolean}
		 */
		isOverlapping: function (start1, end1, start2, end2, includeLimits) {
			if (start1 === null || start2 === null || end1 === null || end2 === null) {
				return false;
			}

			const interval1 = luxon.Interval.fromDateTimes(start1, end1);
			const interval2 = luxon.Interval.fromDateTimes(start2, end2);

			return interval1.overlaps(interval2) ||
				(includeLimits && (interval1.abutsStart(interval2)) || interval2.abutsStart(interval1));
		},

		/**
		 * Tests if the specified dates are in the same day.
		 * @param {luxon.DateTime} date1 - The first date.
		 * @param {luxon.DateTime} date2 - The second date.
		 * @returns {boolean}
		 */
		isSameDay: function (date1, date2) {
			if (date1 === null || date2 === null) {
				return false;
			}

			return date1.year === date2.year &&
				date1.month === date2.month &&
				date1.day === date2.day;
		}
	});
});
