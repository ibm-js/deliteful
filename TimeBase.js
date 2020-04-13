define([
	"dcl/dcl",
	"luxon"
], function (
	dcl,
	luxon
) {
	var DateTime = luxon.DateTime;

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
		 * @param {DateTime} date
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
		 * Floors the specified date to the beginning of week, according to this.firstDayOfWeek.
		 * Call this instead of startOf("week") because startOf("week") always uses Monday.
		 * @param {DateTime} date
		 * @returns {DateTime}
		 */
		floorToWeek: function (date) {
			const fd = this.firstDayOfWeek;
			const day = date.weekday % 7;	// convert to 0=sunday .. 6=saturday
			const dayAdjust =  day >= fd ? -day + fd : -day + fd - 7;
			return date.plus({days: dayAdjust});
		},

		/**
		 * Returns whether the specified date is in the current day.
		 * @param {DateTime} date
		 * @returns {boolean}
		 */
		isToday: function (date) {
			let today = DateTime.local();
			return date.year === today.year &&
				date.month === today.month &&
				date.day === today.day;
		},

		/**
		 * Tests if the specified date represents the start of the day.
		 * @param {DateTime} date
		 * @returns {boolean}
		 */
		isStartOfDay: function (date) {
			return +date === +date.startOf("day");
		},

		/**
		 * Tests if the specified dates are in the same day.
		 * @param {DateTime} date1 - The first date.
		 * @param {DateTime} date2 - The second date.
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
