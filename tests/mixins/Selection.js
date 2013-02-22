define(["doh", "dojo/_base/declare", "../../mixins/Selection", "../../_WidgetBase"],
	function(doh, declare, Selection, _WidgetBase){
	var C = declare("MyWidget", [_WidgetBase, Selection], {
		updateRenderers: function(){
		},
		getIdentity: function(item){
			return item;
		}
	});
	doh.register("mixins.Selection", [
		function test_SetGet(t){
			var C = declare("MyWidget", [_WidgetBase, Selection], {
				updateRenderers: function(){
				}
			});
			var o = new C();
			o.set("selectedItem", "1");
			t.is("1", o.get("selectedItem"));
			t.is(["1"], o.get("selectedItems"));
			o.set("selectedItems", ["2"]);
			t.is("2", o.get("selectedItem"));
			t.is(["2"], o.get("selectedItems"));
			o = new C({selectedItem: "1"});
			t.is("1", o.get("selectedItem"));
			t.is(["1"], o.get("selectedItems"));
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
