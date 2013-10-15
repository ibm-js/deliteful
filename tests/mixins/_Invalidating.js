define(["doh/runner", "../../register", "../../mixins/_Invalidating", "../../_WidgetBase"],
	function(doh, register, _Invalidating, _WidgetBase){
	doh.register("mixins._Invalidating", [
		{
			timeout: 2000,
			name: "PostCreation",
			runTest: function(t){
				var C = register("test-invalidating-post", [HTMLElement, _WidgetBase, _Invalidating], {
					preCreate: function(){
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
		},
		{
			timeout: 2000,
			name: "InCreation",
			runTest: function(t){
				var C = register("test-invalidating-in", [HTMLElement, _WidgetBase, _Invalidating], {
					preCreate: function(){
						this.addInvalidatingProperties("a", "b");
					},
					a: null,
					b: null,
					refreshRendering: function(){
						t.is({"b": true}, o.invalidatedProperties);
					}
				});
				var d = new doh.Deferred();
				var o = new C({b: "foo"});
				var afterProps, beforeProps;
				o.on("refresh-complete", function(e){
					afterProps = o.invalidatedProperties;
					beforeProps = e.invalidatedProperties;
				});
				o.startup();
				t.is(["a", "b"], o._invalidatingProperties);
				// we need to check before the timeout that refresh-complete was called
				setTimeout(d.getTestCallback(function(){
					t.is({}, afterProps);
					t.is({"b": true}, beforeProps);
				}), 1000);
				return d;
			}
		},
	]);
});
