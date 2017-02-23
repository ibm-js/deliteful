define([
    "intern",
	"intern!object",
	"intern/dojo/node!leadfoot/helpers/pollUntil",
	"intern/chai!assert",
	"intern/dojo/node!leadfoot/keys",
	"require"
], function (intern, registerSuite, pollUntil, assert, keys, require) {

	registerSuite({
		name: "DatePicker - functional",

		setup: function () {
			return this.remote
				.get(require.toUrl("./DatePicker.html"))
				.then(pollUntil("return ready ? true : null;", [],
					intern.config.WAIT_TIMEOUT, intern.config.POLL_INTERVAL));
		},

		"basic mouse navigation": function () {
			return this.remote
				.execute("document.getElementById('calendar1').value = new Date(2000, 1, 1);")

				// Try month back/forward buttons on day view.
				.findByCssSelector(".d-date-picker-header .d-date-picker-button").click().click().end()
				.findByCssSelector(".d-date-picker-header .d-label").getVisibleText().then(function (month) {
					assert.strictEqual(month, "December");
				}).end()
				.findByCssSelector(".d-date-picker-footer .d-label").getVisibleText().then(function (year) {
					assert.strictEqual(year, "1999");
				}).end()
				.findAllByCssSelector("[role=gridcell]").getVisibleText().then(function (days) {
					assert.strictEqual(days[0], "28", "Nov 28");
					assert.strictEqual(days[days.length - 1], "1", "January 1");
				}).end()
				.findByCssSelector(".d-date-picker-header .d-date-picker-button:last-child").click().click().end()
				.findByCssSelector(".d-date-picker-header .d-label").getVisibleText().then(function (month) {
					assert.strictEqual(month, "February");
				}).end()
				.findByCssSelector(".d-date-picker-footer .d-label").getVisibleText().then(function (year) {
					assert.strictEqual(year, "2000");
				}).end()

				// Try year back/forward buttons on day view.
				.findByCssSelector(".d-date-picker-footer .d-date-picker-button").click().click().end()
				.findByCssSelector(".d-date-picker-header .d-label").getVisibleText().then(function (month) {
					assert.strictEqual(month, "February");
				}).end()
				.findByCssSelector(".d-date-picker-footer .d-label").getVisibleText().then(function (year) {
					assert.strictEqual(year, "1998");
				}).end()
				.findAllByCssSelector("[role=gridcell]").getVisibleText().then(function (days) {
					assert.strictEqual(days[0], "1", "Feb 1, 1998");
					assert.strictEqual(days[days.length - 1], "28", "Feb 28, 1998");
				}).end()
				.findByCssSelector(".d-date-picker-footer .d-date-picker-button:last-child").click().end()
				.findByCssSelector(".d-date-picker-header .d-label").getVisibleText().then(function (month) {
					assert.strictEqual(month, "February");
				}).end()
				.findByCssSelector(".d-date-picker-footer .d-label").getVisibleText().then(function (year) {
					assert.strictEqual(year, "1999");
				}).end();
		},

		selection: {
			"current month": function () {
				return this.remote
					.execute("document.getElementById('calendar1').value = new Date(2000, 0, 1);")
					.findByCssSelector("[role=row]:nth-child(3) [role=gridcell]:nth-child(4)")
					.getVisibleText().then(function (day) {
						assert.strictEqual(day, "5", "Jan 5");
					})
					.click()
					.end()
					.findByCssSelector(".d-date-picker-selected").getVisibleText().then(function (day) {
						assert.strictEqual(day, "5");
					}).end()
					.findById("value").getVisibleText().then(function (value) {
						assert.strictEqual(value, "2000-01-05");
					}).end();
			},

			"previous month": function () {
				// Select a day from previous month (and year).
				return this.remote
					.execute("document.getElementById('calendar1').value = new Date(2000, 0, 1);")
					.findByCssSelector("[role=gridcell]:nth-child(1)").getVisibleText().then(function (day) {
						assert.strictEqual(day, "26", "Dec 26");
					})
					.click()
					.end()
					.findByCssSelector(".d-date-picker-selected").getVisibleText().then(function (day) {
						assert.strictEqual(day, "26");
					}).end()
					.findByCssSelector(".d-day-picker .d-date-picker-header .d-label")
					.getVisibleText().then(function (month) {
						assert.strictEqual(month, "December", "selected month");
					})
					.end()
					.findByCssSelector(".d-day-picker .d-date-picker-footer .d-label")
					.getVisibleText().then(function (year) {
						assert.strictEqual(year, "1999", "selected year");
					})
					.end()
					.findById("value").getVisibleText().then(function (value) {
						assert.strictEqual(value, "1999-12-26");
					}).end();
			},

			"next month": function () {
				return this.remote
					.execute("document.getElementById('calendar1').value = new Date(2000, 0, 1);")
					.findByCssSelector("[role=row]:last-child [role=gridcell]:last-child")
					.getVisibleText().then(function (day) {
						assert.strictEqual(day, "5", "Feb 5");
					})
					.click()
					.end()
					.findByCssSelector(".d-date-picker-selected").getVisibleText().then(function (day) {
						assert.strictEqual(day, "5");
					}).end()
					.findByCssSelector(".d-day-picker .d-date-picker-header .d-label")
					.getVisibleText().then(function (month) {
						assert.strictEqual(month, "February", "selected month");
					})
					.end()
					.findByCssSelector(".d-day-picker .d-date-picker-footer .d-label")
					.getVisibleText().then(function (year) {
						assert.strictEqual(year, "2000", "selected year");
					})
					.end()
					.findById("value").getVisibleText().then(function (value) {
						assert.strictEqual(value, "2000-02-05");
					}).end();
			}
		},

		"month picker": {
			"click currently selected month": function () {
				return this.remote
					.execute("document.getElementById('calendar1').value = new Date(2000, 1, 1);")

					// Open the month view.
					.findByCssSelector(".d-day-picker .d-date-picker-header .d-date-picker-button:nth-child(2)")
					.click().end()
					.sleep(500)
					.findByCssSelector(".d-month-picker").isDisplayed().then(function (displayed) {
						assert.isTrue(displayed, "month picker displayed");
					}).end()
					.findByCssSelector(".d-day-picker").isDisplayed().then(function (displayed) {
						assert.isFalse(displayed, "day picker hidden");
					}).end()
					.findAllByCssSelector(".d-month-picker [role=gridcell]").getVisibleText().then(function (months) {
						assert.strictEqual(months.length, 12, "# of cells");
						assert.strictEqual(months[0], "Jan", "first cell");
						assert.strictEqual(months[11], "Dec", "last cell");
					}).end()

					// Try clicking currently selected month.
					.findByCssSelector(".d-month-picker .d-date-picker-selected")
					.getVisibleText().then(function (month) {
						assert.strictEqual(month, "Feb");
					})
					.click()
					.end()
					.sleep(500)
					.findByCssSelector(".d-month-picker").isDisplayed().then(function (displayed) {
						assert.isFalse(displayed, "month picker hidden");
					}).end()
					.findByCssSelector(".d-day-picker").isDisplayed().then(function (displayed) {
						assert.isTrue(displayed, "day picker displayed");
					}).end()
					.findByCssSelector(".d-day-picker .d-date-picker-header .d-label")
					.getVisibleText().then(function (month) {
						assert.strictEqual(month, "February", "selected month");
					})
					.end()
					.findByCssSelector(".d-day-picker .d-date-picker-footer .d-label")
					.getVisibleText().then(function (year) {
						assert.strictEqual(year, "2000", "selected year");
					})
					.end();
			},

			"select first month": function () {
				// Reopen month picker and click first month.
				return this.remote
					.execute("document.getElementById('calendar1').value = new Date(2000, 1, 1);")
					.findByCssSelector(".d-day-picker .d-date-picker-header .d-date-picker-button:nth-child(2)")
					.click().end()
					.sleep(500)
					.findByCssSelector(".d-month-picker").isDisplayed().then(function (displayed) {
						assert.isTrue(displayed, "month picker displayed");
					}).end()
					.findByCssSelector(".d-day-picker").isDisplayed().then(function (displayed) {
						assert.isFalse(displayed, "day picker hidden");
					}).end()
					.findByCssSelector(".d-month-picker [role=gridcell]")
					.getVisibleText().then(function (month) {
						assert.strictEqual(month, "Jan");
					})
					.click()
					.end()
					.sleep(500)
					.findByCssSelector(".d-month-picker").isDisplayed().then(function (displayed) {
						assert.isFalse(displayed, "month picker hidden");
					}).end()
					.findByCssSelector(".d-day-picker").isDisplayed().then(function (displayed) {
						assert.isTrue(displayed, "day picker displayed");
					}).end()
					.findByCssSelector(".d-day-picker .d-date-picker-header .d-label")
					.getVisibleText().then(function (month) {
						assert.strictEqual(month, "January", "selected month");
					})
					.end()
					.findByCssSelector(".d-day-picker .d-date-picker-footer .d-label")
					.getVisibleText().then(function (year) {
						assert.strictEqual(year, "2000", "selected year");
					})
					.end();
			},

			"select last month": function () {
				// Reopen month picker and click last month.
				return this.remote
					.execute("document.getElementById('calendar1').value = new Date(2000, 1, 1);")
					.findByCssSelector(".d-day-picker .d-date-picker-header .d-date-picker-button:nth-child(2)")
					.click().end()
					.sleep(500)
					.findByCssSelector(".d-month-picker").isDisplayed().then(function (displayed) {
						assert.isTrue(displayed, "month picker displayed");
					}).end()
					.findByCssSelector(".d-day-picker").isDisplayed().then(function (displayed) {
						assert.isFalse(displayed, "day picker hidden");
					}).end()
					.findByCssSelector(".d-month-picker [role=row]:last-child [role=gridcell]:last-child")
					.getVisibleText().then(function (month) {
						assert.strictEqual(month, "Dec");
					})
					.click()
					.end()
					.sleep(500)
					.findByCssSelector(".d-month-picker").isDisplayed().then(function (displayed) {
						assert.isFalse(displayed, "month picker hidden");
					}).end()
					.findByCssSelector(".d-day-picker").isDisplayed().then(function (displayed) {
						assert.isTrue(displayed, "day picker displayed");
					}).end()
					.findByCssSelector(".d-day-picker .d-date-picker-header .d-label")
					.getVisibleText().then(function (month) {
						assert.strictEqual(month, "December", "selected month");
					})
					.end()
					.findByCssSelector(".d-day-picker .d-date-picker-footer .d-label")
					.getVisibleText().then(function (year) {
						assert.strictEqual(year, "2000", "selected year");
					})
					.end();
			}
		},

		"year picker": {
			"click currently selected year": function () {
				return this.remote
					.execute("document.getElementById('calendar1').value = new Date(2000, 1, 1);")

					// Open the year view.
					.findByCssSelector(".d-day-picker .d-date-picker-footer .d-date-picker-button:nth-child(2)")
					.click().end()
					.sleep(500)
					.findByCssSelector(".d-year-picker").isDisplayed().then(function (displayed) {
						assert.isTrue(displayed, "year picker displayed");
					}).end()
					.findByCssSelector(".d-day-picker").isDisplayed().then(function (displayed) {
						assert.isFalse(displayed, "day picker hidden");
					}).end()
					.findAllByCssSelector(".d-year-picker [role=gridcell]").getVisibleText().then(function (years) {
						assert.strictEqual(years.length, 25, "# of cells");
						assert.strictEqual(years[0], "1988", "first cell");
						assert.strictEqual(years[24], "2012", "last cell");
					}).end()
					.findByCssSelector(".d-year-picker .d-label").getVisibleText().then(function (label) {
						assert.strictEqual(label, "1988-2012", "label");
					}).end()

					// Try clicking currently selected year.
					.findByCssSelector(".d-year-picker .d-date-picker-selected")
					.getVisibleText().then(function (year) {
						assert.strictEqual(year, "2000");
					})
					.click()
					.end()
					.sleep(500)
					.findByCssSelector(".d-year-picker").isDisplayed().then(function (displayed) {
						assert.isFalse(displayed, "year picker hidden");
					}).end()
					.findByCssSelector(".d-day-picker").isDisplayed().then(function (displayed) {
						assert.isTrue(displayed, "day picker displayed");
					}).end()
					.findByCssSelector(".d-day-picker .d-date-picker-header .d-label")
					.getVisibleText().then(function (month) {
						assert.strictEqual(month, "February", "selected month");
					})
					.end()
					.findByCssSelector(".d-day-picker .d-date-picker-footer .d-label")
					.getVisibleText().then(function (year) {
						assert.strictEqual(year, "2000", "selected year");
					})
					.end();
			},

			navigation: function () {
				return this.remote
					.execute("document.getElementById('calendar1').value = new Date(2000, 1, 1);")

					// Open the year view.
					.findByCssSelector(".d-day-picker .d-date-picker-footer .d-date-picker-button:nth-child(2)")
					.click().end()
					.sleep(500)
					.findByCssSelector(".d-year-picker").isDisplayed().then(function (displayed) {
						assert.isTrue(displayed, "year picker displayed");
					}).end()
					.findByCssSelector(".d-day-picker").isDisplayed().then(function (displayed) {
						assert.isFalse(displayed, "day picker hidden");
					}).end()

					// Advance 25 years.
					.findByCssSelector(".d-year-picker .d-date-picker-footer .d-date-picker-button:nth-child(3)")
					.click().end()
					.sleep(500)
					.findByCssSelector(".d-year-picker").isDisplayed().then(function (displayed) {
						assert.isTrue(displayed, "year picker still displayed");
					}).end()
					.findByCssSelector(".d-day-picker").isDisplayed().then(function (displayed) {
						assert.isFalse(displayed, "day picker still hidden");
					}).end()
					.findAllByCssSelector(".d-year-picker [role=gridcell]").getVisibleText().then(function (years) {
						assert.strictEqual(years.length, 25, "# of cells");
						assert.strictEqual(years[0], "2013", "first cell");
						assert.strictEqual(years[24], "2037", "last cell");
					}).end()
					.findByCssSelector(".d-year-picker .d-label").getVisibleText().then(function (label) {
						assert.strictEqual(label, "2013-2037", "label");
					}).end()

					// Go back 50 years.
					.findByCssSelector(".d-year-picker .d-date-picker-footer .d-date-picker-button:nth-child(1)")
					.click().click().end()
					.sleep(500)
					.findByCssSelector(".d-year-picker").isDisplayed().then(function (displayed) {
						assert.isTrue(displayed, "year picker still displayed #2");
					}).end()
					.findByCssSelector(".d-day-picker").isDisplayed().then(function (displayed) {
						assert.isFalse(displayed, "day picker still hidden #2");
					}).end()
					.findAllByCssSelector(".d-year-picker [role=gridcell]").getVisibleText().then(function (years) {
						assert.strictEqual(years.length, 25, "# of cells");
						assert.strictEqual(years[0], "1963", "first cell");
						assert.strictEqual(years[24], "1987", "last cell");
					}).end()
					.findByCssSelector(".d-year-picker .d-label").getVisibleText().then(function (label) {
						assert.strictEqual(label, "1963-1987", "label");
					}).end()

					// Close by clicking first year.
					.findByCssSelector(".d-year-picker [role=gridcell]")
					.getVisibleText().then(function (year) {
						assert.strictEqual(year, "1963", "first cell (again)");
					})
					.click()
					.end()
					.sleep(500)
					.findByCssSelector(".d-year-picker").isDisplayed().then(function (displayed) {
						assert.isFalse(displayed, "year picker hidden");
					}).end()
					.findByCssSelector(".d-day-picker").isDisplayed().then(function (displayed) {
						assert.isTrue(displayed, "day picker displayed");
					}).end()
					.findByCssSelector(".d-day-picker .d-date-picker-header .d-label")
					.getVisibleText().then(function (month) {
						assert.strictEqual(month, "February", "selected month");
					})
					.end()
					.findByCssSelector(".d-day-picker .d-date-picker-footer .d-label")
					.getVisibleText().then(function (year) {
						assert.strictEqual(year, "1963", "selected year");
					})
					.end();
			}
		},

		keyboard: {
			setup: function () {
				var remote = this.remote;
				if (remote.environmentType.brokenSendKeys || !remote.environmentType.nativeEvents) {
					return this.skip("no keyboard support");
				}
			},

			"arrows and selection": function () {
				return this.remote
					.execute("document.getElementById('calendar1').value = new Date(2000, 0, 22);")
					.findById("before").click().end()
					.pressKeys(keys.TAB) // Press TAB -> DatePicker
					.getActiveElement().getVisibleText().then(function (text) {
						assert.strictEqual(text, "22", "initial focus");
					}).end()
					.findByCssSelector(".d-day-picker .d-date-picker-header .d-label")
					.getVisibleText().then(function (month) {
						assert.strictEqual(month, "January", "selected month");
					})
					.end()
					.findByCssSelector(".d-day-picker .d-date-picker-footer .d-label")
					.getVisibleText().then(function (year) {
						assert.strictEqual(year, "2000", "selected year");
					})
					.end()

					.pressKeys(keys.ARROW_RIGHT)
					.getActiveElement().getVisibleText().then(function (text) {
						assert.strictEqual(text, "23", "right arrow (loops to next row)");
					}).end()

					.pressKeys(keys.ARROW_DOWN)
					.getActiveElement().getVisibleText().then(function (text) {
						assert.strictEqual(text, "30", "down arrow");
					}).end()

					.pressKeys(keys.ARROW_DOWN)
					.getActiveElement().getVisibleText().then(function (text) {
						assert.strictEqual(text, "6", "arrow down to next month");
					}).end()
					.findByCssSelector(".d-day-picker .d-date-picker-header .d-label")
					.getVisibleText().then(function (month) {
						assert.strictEqual(month, "February", "selected month");
					})
					.end()
					.findByCssSelector(".d-day-picker .d-date-picker-footer .d-label")
					.getVisibleText().then(function (year) {
						assert.strictEqual(year, "2000", "selected year");
					})
					.end()

					.pressKeys(keys.ARROW_LEFT)
					.getActiveElement().getVisibleText().then(function (text) {
						assert.strictEqual(text, "5", "arrow left");
					}).end()
					.findByCssSelector(".d-day-picker .d-date-picker-header .d-label")
					.getVisibleText().then(function (month) {
						assert.strictEqual(month, "February", "selected month");
					})
					.end()
					.findByCssSelector(".d-day-picker .d-date-picker-footer .d-label")
					.getVisibleText().then(function (year) {
						assert.strictEqual(year, "2000", "selected year");
					})
					.end()

					.pressKeys(keys.ARROW_UP)
					.getActiveElement().getVisibleText().then(function (text) {
						assert.strictEqual(text, "29", "arrow up to previous month");
					}).end()
					.findByCssSelector(".d-day-picker .d-date-picker-header .d-label")
					.getVisibleText().then(function (month) {
						assert.strictEqual(month, "January", "selected month");
					})
					.end()
					.findByCssSelector(".d-day-picker .d-date-picker-footer .d-label")
					.getVisibleText().then(function (year) {
						assert.strictEqual(year, "2000", "selected year");
					})
					.end()

					.pressKeys(keys.ENTER)
					.findByCssSelector(".d-date-picker-selected").getVisibleText().then(function (day) {
						assert.strictEqual(day, "29");
					}).end()
					.findById("value").getVisibleText().then(function (value) {
						assert.strictEqual(value, "2000-01-29");
					}).end();
			},

			"home and end": function () {
				return this.remote
					.execute("document.getElementById('calendar1').value = new Date(2000, 0, 15);")
					.findById("before").click().end()
					.pressKeys(keys.TAB) // Press TAB -> DatePicker
					.getActiveElement().getVisibleText().then(function (text) {
						assert.strictEqual(text, "15", "initial focus");
					}).end()

					.pressKeys(keys.HOME)
					.getActiveElement().getVisibleText().then(function (text) {
						assert.strictEqual(text, "1", "home");
					}).end()

					.pressKeys(keys.END)
					.getActiveElement().getVisibleText().then(function (text) {
						assert.strictEqual(text, "31", "end");
					}).end();
			},

			"page down / page up": function () {

				if (this.remote.environmentType.browserName === "internet explorer") {
					// Since evt.shiftKey not set (although it works when manually tested).
					return this.skip("shift-page-down getting treated as page-down, spurious test failure");
				}

				return this.remote
					.execute("document.getElementById('calendar1').value = new Date(2000, 0, 31);")
					.findById("before").click().end()
					.pressKeys(keys.TAB) // Press TAB -> DatePicker
					.getActiveElement().getVisibleText().then(function (text) {
						assert.strictEqual(text, "31", "initial focus Jan 15");
					}).end()
					.findByCssSelector(".d-day-picker .d-date-picker-header .d-label")
					.getVisibleText().then(function (month) {
						assert.strictEqual(month, "January", "initial selected month");
					})
					.end()
					.findByCssSelector(".d-day-picker .d-date-picker-footer .d-label")
					.getVisibleText().then(function (year) {
						assert.strictEqual(year, "2000", "initial selected year");
					})
					.end()

					.pressKeys(keys.PAGE_DOWN)
					.getActiveElement().getVisibleText().then(function (text) {
						// There's no Feb 30, so page-down should go from Jan 31 to Feb 29.
						assert.strictEqual(text, "29", "page down to next month");
					}).end()
					.findByCssSelector(".d-day-picker .d-date-picker-header .d-label")
					.getVisibleText().then(function (month) {
						assert.strictEqual(month, "February", "selected month after page-down");
					})
					.end()
					.findByCssSelector(".d-day-picker .d-date-picker-footer .d-label")
					.getVisibleText().then(function (year) {
						assert.strictEqual(year, "2000", "selected year after page-down");
					})
					.end()

					.pressKeys(keys.PAGE_UP)
					.getActiveElement().getVisibleText().then(function (text) {
						assert.strictEqual(text, "29", "page up to previous month");
					}).end()
					.findByCssSelector(".d-day-picker .d-date-picker-header .d-label")
					.getVisibleText().then(function (month) {
						assert.strictEqual(month, "January", "selected month after page-up");
					})
					.end()
					.findByCssSelector(".d-day-picker .d-date-picker-footer .d-label")
					.getVisibleText().then(function (year) {
						assert.strictEqual(year, "2000", "selected year after page-up");
					})
					.end()

					.pressKeys(keys.SHIFT + keys.PAGE_DOWN)
					.pressKeys(keys.SHIFT)
					.getActiveElement().getVisibleText().then(function (text) {
						assert.strictEqual(text, "29", "shift-page down to next year");
					}).end()
					.findByCssSelector(".d-day-picker .d-date-picker-header .d-label")
					.getVisibleText().then(function (month) {
						assert.strictEqual(month, "January", "selected month after shift-page-down");
					})
					.end()
					.findByCssSelector(".d-day-picker .d-date-picker-footer .d-label")
					.getVisibleText().then(function (year) {
						assert.strictEqual(year, "2001", "selected year after shift-page-down");
					})
					.end()

					.pressKeys(keys.SHIFT + keys.PAGE_UP)
					.pressKeys(keys.SHIFT)
					.getActiveElement().getVisibleText().then(function (text) {
						assert.strictEqual(text, "29", "shift-page up to previous year");
					}).end()
					.findByCssSelector(".d-day-picker .d-date-picker-header .d-label")
					.getVisibleText().then(function (month) {
						assert.strictEqual(month, "January", "selected month after shift-page-up");
					})
					.end()
					.findByCssSelector(".d-day-picker .d-date-picker-footer .d-label")
					.getVisibleText().then(function (year) {
						assert.strictEqual(year, "2000", "selected year after shift-page-up");
					})
					.end();
			}
		}
	});
});
