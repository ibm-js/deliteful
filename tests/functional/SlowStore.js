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

		_request: function () {
			var data = new Deferred();
			var total = new Deferred();
			var response = new Deferred();

			var matchingItems = [];
			var query = this.queryLog[0].arguments[0];

			if ("inputText" in query && query.inputText.length > 0) {
				var filterTxt = query.inputText;
				if (query.filterMode === "startsWith") {
					filterTxt = "^" + filterTxt;
				} else if (query.filterMode === "is") {
					filterTxt = "^" + filterTxt + "$";
				}
				var regExp = new RegExp(filterTxt, query.ignoreCase ? "i" : "");

				for (var i = 0; i < this.items.length; i++) {
					if (this.items[i].label.match(regExp)) {
						matchingItems.push(this.items[i]);
					}
				}
			} else {
				matchingItems = this.items;
			}

			var randomWait = Math.floor(Math.random() * 5000) + 250;
			return {
				data: this.sleepFor(randomWait, data).then(function (data) {
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
		},

	});
});