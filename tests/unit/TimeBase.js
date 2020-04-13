define(function (require) {
	"use strict";

	var registerSuite = intern.getPlugin("interface.object").registerSuite;
	var assert = intern.getPlugin("chai").assert;
	var TimeBase = require("deliteful/TimeBase");
	var luxon = require("luxon"),
		DateTime = luxon.DateTime;

	function dateStruct(date) {
		return {
			year: date.year,
			month: date.month,
			day: date.day
		};
	}

	function dateTimeStruct(date) {
		return {
			year: date.year,
			month: date.month,
			day: date.day,
			hours: date.hour,
			minutes: date.minute,
			seconds: date.second
		};
	}

	var tb = new TimeBase();

	registerSuite("TimeBase", {
		isWeekEnd: function () {
			assert.isFalse(tb.isWeekEnd(DateTime.local(2017, 2, 3)), "2017-Feb-3");
			assert.isTrue(tb.isWeekEnd(DateTime.local(2017, 2, 4)), "2017-Feb-4");
			assert.isTrue(tb.isWeekEnd(DateTime.local(2017, 2, 5)), "2017-Feb-5");
			assert.isFalse(tb.isWeekEnd(DateTime.local(2017, 2, 6)), "2017-Feb-6");
		},

		floorToWeek: function () {
			assert.deepEqual(dateStruct(tb.floorToWeek(DateTime.local(2017, 2, 11))), {
				year: 2017,
				month: 2,
				day: 5
			}, "2017-Feb-11");
			assert.deepEqual(dateStruct(tb.floorToWeek(DateTime.local(2017, 2, 5))), {
				year: 2017,
				month: 2,
				day: 5
			}, "2017-Feb-05");
		},

		isToday: function () {
			assert.isTrue(tb.isToday(DateTime.local()), "today");
			assert.isFalse(tb.isToday(DateTime.local(2017, 2, 3, 12, 0, 0)), "2017-Feb-3 noon");
		},

		isStartOfDay: function () {
			assert.isTrue(tb.isStartOfDay(DateTime.local(2017, 2, 3)), "2017-Feb-3 midnight");
			assert.isFalse(tb.isStartOfDay(DateTime.local(2017, 2, 3, 12, 0, 0)), "2017-Feb-3 noon");
		},

		isSameDay: function () {
			assert.isTrue(tb.isSameDay(DateTime.local(2017, 2, 3, 5, 0, 0), DateTime.local(2017, 2, 3, 12, 0, 0)), "#1");
			assert.isFalse(tb.isSameDay(DateTime.local(2017, 2, 3), DateTime.local(2017, 2, 4)), "#2");
		}
	});

});
