define([
	"intern!object",
	"intern/chai!assert",
	"deliteful/TimeBase"
], function (registerSuite, assert, TimeBase) {


	function dateStruct(date) {
		return {
			year: date.getFullYear(),
			month: date.getMonth(),
			day: date.getDate()
		};
	}

	function dateTimeStruct(date) {
		return {
			year: date.getFullYear(),
			month: date.getMonth(),
			day: date.getDate(),
			hours: date.getHours(),
			minutes: date.getMinutes(),
			seconds: date.getSeconds()
		};
	}

	var tb = new TimeBase();

	registerSuite({
		name: "TimeBase",

		isWeekEnd: function () {
			assert.isFalse(tb.isWeekEnd(new Date(2017, 1, 3)), "2017-Feb-3");
			assert.isTrue(tb.isWeekEnd(new Date(2017, 1, 4)), "2017-Feb-4");
			assert.isTrue(tb.isWeekEnd(new Date(2017, 1, 5)), "2017-Feb-5");
			assert.isFalse(tb.isWeekEnd(new Date(2017, 1, 6)), "2017-Feb-6");
		},

		addAndFloor: function () {
			assert.deepEqual(dateTimeStruct(tb.addAndFloor(new Date(2017, 1, 3), "day", 1)), {
				year: 2017,
				month: 1,
				day: 4,
				hours: 0,
				minutes: 0,
				seconds: 0
			}, "2017-Feb-3 + 1");
			assert.deepEqual(dateTimeStruct(tb.addAndFloor(new Date(2017, 1, 3), "day", -1)), {
				year: 2017,
				month: 1,
				day: 2,
				hours: 0,
				minutes: 0,
				seconds: 0
			}, "2017-Feb-3 - 1");
			assert.deepEqual(dateTimeStruct(tb.addAndFloor(new Date(2017, 1, 28), "day", 1)), {
				year: 2017,
				month: 2,
				day: 1,
				hours: 0,
				minutes: 0,
				seconds: 0
			}, "2017-Feb-28 + 1");
		},

		floorToDay: function () {
			assert.deepEqual(dateTimeStruct(tb.floorToDay(new Date(2017, 1, 3, 12, 5, 7))), {
				year: 2017,
				month: 1,
				day: 3,
				hours: 0,
				minutes: 0,
				seconds: 0
			}, "2017-Feb-3");
		},

		floorToWeek: function () {
			assert.deepEqual(dateStruct(tb.floorToWeek(new Date(2017, 1, 11))), {
				year: 2017,
				month: 1,
				day: 5
			}, "2017-Feb-11");
			assert.deepEqual(dateStruct(tb.floorToWeek(new Date(2017, 1, 5))), {
				year: 2017,
				month: 1,
				day: 5
			}, "2017-Feb-05");
		},

		floorToMonth: function () {
			assert.deepEqual(dateStruct(tb.floorToMonth(new Date(2017, 1, 28))), {
				year: 2017,
				month: 1,
				day: 1
			}, "2017-Feb-28");
			assert.deepEqual(dateStruct(tb.floorToMonth(new Date(2017, 1, 1))), {
				year: 2017,
				month: 1,
				day: 1
			}, "2017-Feb-01");
		},

		isToday: function () {
			assert.isTrue(tb.isToday(new Date()), "today");
			assert.isFalse(tb.isToday(new Date(2017, 1, 3, 12, 0, 0)), "2017-Feb-3 noon");
		},

		isStartOfDay: function () {
			assert.isTrue(tb.isStartOfDay(new Date(2017, 1, 3)), "2017-Feb-3 midnight");
			assert.isFalse(tb.isStartOfDay(new Date(2017, 1, 3, 12, 0, 0)), "2017-Feb-3 noon");
		},

		isOverlapping: function () {
			assert.isTrue(tb.isOverlapping(new Date(2017, 1, 3), new Date(2017, 1, 5),
				new Date(2017, 1, 4), new Date(2017, 1, 6)), "#1");
			assert.isTrue(tb.isOverlapping(new Date(2017, 1, 3), new Date(2017, 1, 8),
				new Date(2017, 1, 4), new Date(2017, 1, 5)), "#2");
			assert.isTrue(tb.isOverlapping(new Date(2017, 1, 3), new Date(2017, 1, 4),
				new Date(2017, 1, 2), new Date(2017, 1, 7)), "#3");
			assert.isFalse(tb.isOverlapping(new Date(2017, 1, 3), new Date(2017, 1, 4),
				new Date(2017, 1, 5), new Date(2017, 1, 6)), "#4");
			assert.isFalse(tb.isOverlapping(new Date(2017, 1, 3), new Date(2017, 1, 4),
				new Date(2017, 1, 1), new Date(2017, 1, 2)), "#5");
		},

		isSameDay: function () {
			assert.isTrue(tb.isSameDay(new Date(2017, 1, 3, 5, 0, 0), new Date(2017, 1, 3, 12, 0, 0)), "#1");
			assert.isFalse(tb.isSameDay(new Date(2017, 1, 3), new Date(2017, 1, 4)), "#2");
		}
	});

});
