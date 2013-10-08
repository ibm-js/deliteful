define(["doh", "../../register", "../../mixins/_Invalidating", "../../_WidgetBase"],
	function(doh, register, _Invalidating, _WidgetBase){
	doh.register("mixins._Invalidating", [
		{
			timeout: 2000,
			name: "Simple",
			runTest: function(t){
				var C = register("C", [_WidgetBase, _Invalidating], {
					constructor: function(){
						this.addInvalidatingProperties("a");
						this.addInvalidatingProperties("b");
					},
					a: null,
					b: null,
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
				o.b = "foo";
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
