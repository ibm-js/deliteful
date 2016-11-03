define([
	"dojo/_base/declare",
	"dstore/Request",
	"dojo/Deferred"
], function (declare, Request, Deferred) {

	return declare([Request], {

		items: [
			{ "label": "France", "world-cup-victories": 1, "region": "EU" },
			{ "label": "Germany", "world-cup-victories": 4, "region": "EU" },
			{ "label": "Spain", "world-cup-victories": 1, "region": "EU" },
			{ "label": "Italy", "world-cup-victories": 4, "region": "EU" },
			{ "label": "England", "world-cup-victories": 1, "region": "EU" },
			{ "label": "USA", "world-cup-victories": 0, "region": "America" },
			{ "label": "Canada", "world-cup-victories": 0, "region": "America" },
			{ "label": "Brazil", "world-cup-victories": 5, "region": "America" },
			{ "label": "Argentina", "world-cup-victories": 2, "region": "America" },
			{ "label": "Uruguay", "world-cup-victories": 2, "region": "America" },
			{ "label": "China", "world-cup-victories": 0, "region": "Asia" },
			{ "label": "Japan", "world-cup-victories": 0, "region": "Asia" }
		],

		_queryLog: [],

		_request: function () {
			var data = new Deferred();
			var total = new Deferred();
			var response = new Deferred();

			var query = this.queryLog[0].arguments[0];
			this._queryLog.push(query);
			var matchingItems = [];
			if ("inputText" in query && query.inputText.length > 0) {
				// Escape special chars in search string, see
				// http://stackoverflow.com/questions/3446170/escape-string-for-use-in-javascript-regex.
				var filterTxt = query.inputText.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
				if (query.filterMode === "startsWith") {
					filterTxt = "^" + filterTxt;
				} else if (query.filterMode === "is") {
					filterTxt = "^" + filterTxt + "$";
				}
				var regExp = new RegExp(filterTxt, query.ignoreCase ? "i" : "");
				matchingItems = this.items.filter(function (val) {
					return regExp.test(val.label);
				});
			} else {
				matchingItems = this.items;
			}

			var randomWait = Math.floor(Math.random() * 5000) + 250;
			return {
				data: this.sleepFor(query.beResponsive ? 0 : randomWait, data).then(function (data) {
					return data.resolve(matchingItems);
				}),
				total: total.resolve(matchingItems.length),
				response: response.resolve()
			};
		},

		sleepFor: function (time, k) {
			var d = new Deferred();
			setTimeout(function () {
				d.resolve(k);
			}, time);
			return d.promise;
		}
	});
});