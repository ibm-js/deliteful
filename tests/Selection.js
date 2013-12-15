define([
	"intern!object",
	"intern/chai!assert",
	"../register",
	"../Selection"
], function (registerSuite, assert, register, Selection) {
	var C = register("test-selection", [HTMLElement, Selection], {
		updateRenderers: function () {
		},
		getIdentity: function (item) {
			return item;
		}
	});
	registerSuite({
		name: "dui/Selection",
		"testSetGet" : function () {
			var o = new C();
			o.selectedItem = "1";
			assert.deepEqual("1", o.selectedItem);
			assert.deepEqual(["1"], o.selectedItems);
			o.selectedItems = ["2"];
			assert.deepEqual("2", o.selectedItem);
			assert.deepEqual(["2"], o.selectedItems);
			o = new C({selectedItem: "1"});
			assert.deepEqual("1", o.selectedItem);
			assert.deepEqual(["1"], o.selectedItems);
		},
		"testEvent" : function () {
			var o = new C({selectedItem: "1"});
			var callbackCalled = false;
			o.on("selection-change", function (evt) {
				assert.deepEqual("1", evt.oldValue);
				assert.deepEqual("2", evt.newValue);
				callbackCalled = true;
			});
			o.startup();
			o.selectFromEvent({}, "2", null, true);
			assert.isTrue(callbackCalled, "selection-change callback");
		},
		teardown : function () {
			//container.parentNode.removeChild(container);
		}
	});
});

