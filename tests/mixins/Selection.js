define(["doh", "../../register", "../../mixins/Selection", "../../_WidgetBase"],
	function(doh, register, Selection, _WidgetBase){
	var C = register("C", [_WidgetBase, Selection], {
		updateRenderers: function(){
		},
		getIdentity: function(item){
			return item;
		}
	});
	doh.register("mixins.Selection", [
		function test_SetGet(t){
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
		function test_Event(t){
			var d = new doh.Deferred();
			var o = new C({selectedItem : "1"});
			var callbackCalled = false;
			o.on("selection-change", function(evt){
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
