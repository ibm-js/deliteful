define(["doh", "dojo/_base/declare", "../../mixins/_Invalidating", "../../_WidgetBase"],
	function(doh, declare, _Invalidating, _WidgetBase){
	doh.register("mixins._Invalidating", [
		{
			timeout: 2000,
			name: "Simple",
			runTest: function(t){
				var C = declare("MyWidget", [_WidgetBase, _Invalidating], {
					constructor: function(){
						this.addInvalidatingProperties(["a"]);
						this.addInvalidatingProperties(["b"]);
					},
					refreshRendering: function(){
						t.is({"b": true}, o.invalidatedProperties);
					}
				});
				var d = new doh.Deferred();
				var o = new C();
				var afterProps, beforeProps;
				o.on("refresh-complete", function(e){
					afterProps = o.invalidatedProperties;
					beforeProps = e.invalidatedProperties;
				});
				o.startup();
				t.is(["a", "b"], o._invalidatingProperties);
				o.set("b", "foo");
				// we need to check before the timeout that refresh-complete was called
				setTimeout(d.getTestCallback(function(){
					t.is({}, afterProps);
					t.is({"b": true}, beforeProps);
				}), 1000);
				return d;
			}
		}
	]);
});
