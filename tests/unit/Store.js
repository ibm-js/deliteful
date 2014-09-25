define([
	"intern!object",
	"intern/chai!assert",
	"delite/register",
	"deliteful/Store"
], function (registerSuite, assert, register) {
	var container, node;
	var htmlContent =
		"<d-store id='store'>" +
		"{ \"label\": \"France\", \"sales\": 500, \"profit\": 50, \"region\": \"EU\" }," +
		"{ \"label\": \"Germany\", \"sales\": 450, \"profit\": 48, \"region\": \"EU\" }," +
		"{ \"label\": \"UK\", \"sales\": 700, \"profit\": 60, \"region\": \"EU\" }" +
		"</d-store>";
	function check(node) {
		var store = node;
		assert.isNotNull(store, "store is null");
		var data = store.fetchSync();
		assert.strictEqual(data.totalLength, 3, "incorrect data length");
		var i = 0;
		data.forEach(function (item) {
			delete item[store.idProperty];
			switch (i) {
			case 0:
				assert.deepEqual(item, { "label": "France", "sales": 500, "profit": 50, "region": "EU" });
				break;
			case 1:
				assert.deepEqual(item, { "label": "Germany", "sales": 450, "profit": 48, "region": "EU" });
				break;
			case 2:
				assert.deepEqual(item, { "label": "UK", "sales": 700, "profit": 60, "region": "EU" });
			}
			i++;
		});
	}
	registerSuite({
		name: "Store",
		setup: function () {
			container = document.createElement("div");
			document.body.appendChild(container);
			container.innerHTML = htmlContent;
			register.parse(container);
			node = document.getElementById("store");
		},
		"markup" : function () {
			check(node);
		},
		teardown : function () {
			container.parentNode.removeChild(container);
		}

	});
});
