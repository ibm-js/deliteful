define(["doh/runner", "../register", "../Selection"],
	function (doh, register, Selection) {
		var C = register("test-selection", [HTMLElement, Selection], {
			updateRenderers: function () {
			},
			getIdentity: function (item) {
				return item;
			}
		});
		doh.register("Selection", [
			function testSetGet(t) {
				var o = new C();
				o.selectedItem = "1";
				t.is("1", o.selectedItem);
				t.is(["1"], o.selectedItems);
				o.selectedItems = ["2"];
				t.is("2", o.selectedItem);
				t.is(["2"], o.selectedItems);
				o = new C({selectedItem: "1"});
				t.is("1", o.selectedItem);
				t.is(["1"], o.selectedItems);
			},
			function testEvent(t) {
				var o = new C({selectedItem: "1"});
				var callbackCalled = false;
				o.on("selection-change", function (evt) {
					t.is("1", evt.oldValue);
					t.is("2", evt.newValue);
					callbackCalled = true;
				});
				o.startup();
				o.selectFromEvent({}, "2", null, true);
				t.t(callbackCalled, "selection-change callback");
			}
		]);
	});
