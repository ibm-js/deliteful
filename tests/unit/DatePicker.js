define([
	"intern!object",
	"intern/chai!assert",
	"deliteful/DatePicker"
], function (registerSuite, assert, DatePicker) {

	registerSuite({
		name: "DatePicker",

		layout: function () {
			var dp = new DatePicker({
				value: new Date(2000, 1, 1)
			});
			dp.deliver();

			assert.strictEqual(dp.querySelector(".d-date-picker-header .d-label").textContent, "February");
			assert.strictEqual(dp.querySelector(".d-date-picker-footer .d-label").textContent, "2000");

			var headers = dp.querySelectorAll("[role=rowheader]"),
				headerText =  Array.prototype.map.call(headers, function (node) {
					return node.textContent;
				});
			assert.deepEqual(headerText, ["S", "M", "T", "W", "T", "F", "S"]);

			var numberCells = dp.querySelectorAll("[role=gridcell]");

			// Month starts on Tuesday February 1, so the first day shown in Sunday January 30.
			assert.deepEqual(numberCells[0].textContent, "30", "first day January 30");

			// Month ends on Tuesday, February 29, so that should be the last shown week,
			// and that week ends on Saturday, March 4.
			assert.deepEqual(numberCells[numberCells.length - 1].textContent, "4", "March 4");

			assert.strictEqual(dp.querySelector(".d-date-picker-selected").textContent, "1", "selected day");

			// Check that there are always seven rows, including the header (S M T W T F S)
			// even when you can show from the first to the last day of the month using only 4 or 5 rows.
			assert.strictEqual(dp.querySelectorAll("[role=row]").length, 7, "# of rows including header");
		}
	});

});
