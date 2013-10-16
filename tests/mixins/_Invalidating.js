define(["doh/runner", "../../register", "../../mixins/_Invalidating", "../../_WidgetBase"],
	function (doh, register, _Invalidating, _WidgetBase) {
	doh.register("mixins._Invalidating", [
		{
			timeout: 2000,
			name: "PostCreation",
			runTest: function (t) {
				var C = register("test-invalidating-post", [HTMLElement, _WidgetBase, _Invalidating], {
					preCreate: function () {
						this.addInvalidatingProperties("a");
						this.addInvalidatingProperties("b");
					},
					a: null,
					b: null,
					refreshProperties: function () {
						t.is(true, false, "refreshProperties should not be called");
					},
					refreshRendering: function () {
						t.is({"b": true}, this.invalidatedProperties);
					}
				});
				var d = new doh.Deferred();
				var o = new C();
				var afterPropsR, beforePropsR;
				o.on("refresh-properties-complete", function () {
					t.is(true, false, "refreshProperties should not be called");
				});
				o.on("refresh-rendering-complete", function (e) {
					afterPropsR = o.invalidatedProperties;
					beforePropsR = e.invalidatedProperties;
				});
				o.startup();
				t.is({ "a": "invalidateRendering", "b": "invalidateRendering" }, o._invalidatingProperties);
				o.b = "foo";
				// we need to check before the timeout that refresh-complete was called
				setTimeout(d.getTestCallback(function () {
					t.is({}, afterPropsR);
					t.is({"b": true}, beforePropsR);
				}), 1000);
				return d;
			}
		},
		{
			timeout: 2000,
			name: "InCreation",
			runTest: function (t) {
				var C = register("test-invalidating-in", [HTMLElement, _WidgetBase, _Invalidating], {
					preCreate: function () {
						this.addInvalidatingProperties("a", "b");
					},
					a: null,
					b: null,
					refreshProperties: function () {
						t.is(true, false, "refreshProperties should not be called");
					},
					refreshRendering: function () {
						t.is({"b": true}, this.invalidatedProperties);
					}
				});
				var d = new doh.Deferred();
				var o = new C({b: "foo"});
				var afterPropsR, beforePropsR;
				o.on("refresh-properties-complete", function () {
					t.is(true, false, "refreshProperties should not be called");
				});
				o.on("refresh-rendering-complete", function (e) {
					afterPropsR = o.invalidatedProperties;
					beforePropsR = e.invalidatedProperties;
				});
				o.startup();
				t.is({ "a": "invalidateRendering", "b": "invalidateRendering" }, o._invalidatingProperties);
				// we need to check before the timeout that refresh-complete was called
				setTimeout(d.getTestCallback(function () {
					t.is({}, afterPropsR);
					t.is({"b": true}, beforePropsR);
				}), 1000);
				return d;
			}
		},
		{
			timeout: 2000,
			name: "OnlyRefreshProperty",
			runTest: function (t) {
				var C = register("test-invalidating-only-refresh-props", [HTMLElement, _WidgetBase, _Invalidating], {
					preCreate: function () {
						this.addInvalidatingProperties({"a": "invalidateProperty"});
						this.addInvalidatingProperties({"b": "invalidateProperty"});
					},
					a: null,
					b: null,
					refreshProperties: function () {
						t.is({"a": true, "b": true}, this.invalidatedProperties);
						// only a should lead to a refreshRendering
						delete this.invalidatedProperties.b;

					},
					refreshRendering: function () {
						t.is({"a": true}, o.invalidatedProperties);
					}
				});
				var d = new doh.Deferred();
				var o = new C();
				var afterPropsR, beforePropsR, afterPropsP, beforePropsP;
				o.on("refresh-properties-complete", function (e) {
					afterPropsP = o.invalidatedProperties;
					beforePropsP = e.invalidatedProperties;
				});
				o.on("refresh-rendering-complete", function (e) {
					afterPropsR = o.invalidatedProperties;
					beforePropsR = e.invalidatedProperties;
				});
				o.startup();
				t.is({ "a": "invalidateProperty", "b": "invalidateProperty" }, o._invalidatingProperties);
				o.b = "foo";
				o.a = "bar";
				// we need to check before the timeout that refresh-complete was called
				setTimeout(d.getTestCallback(function () {
					t.is({"a" : true}, afterPropsP);
					t.is({"a" : true, "b": true}, beforePropsP);
					t.is({}, afterPropsR);
					t.is({"a": true}, beforePropsR);
				}), 1000);
				return d;
			}
		},
		{
			timeout: 2000,
			name: "Manual",
			runTest: function (t) {
				var C = register("test-invalidating-manual", [HTMLElement, _WidgetBase, _Invalidating], {
					a: null,
					b: null,
					refreshProperties: function () {
						t.is({"b": true}, this.invalidatedProperties);
					},
					refreshRendering: function () {
						t.is({"b": true}, this.invalidatedProperties);
					}
				});
				var d = new doh.Deferred();
				var o = new C();
				var afterPropsR, beforePropsR, afterPropsP, beforePropsP;
				o.on("refresh-properties-complete", function (e) {
					afterPropsP = o.invalidatedProperties;
					beforePropsP = e.invalidatedProperties;
				});
				o.on("refresh-rendering-complete", function (e) {
					afterPropsR = o.invalidatedProperties;
					beforePropsR = e.invalidatedProperties;
				});
				o.startup();
				t.is(null, o._invalidatingProperties);
				o.b = "foo";
				o.invalidateProperty("b");
				// we need to check before the timeout that refresh-complete was called
				setTimeout(d.getTestCallback(function () {
					t.is({"b": true}, afterPropsP);
					t.is({"b": true}, beforePropsP);
					t.is({}, afterPropsR);
					t.is({"b": true}, beforePropsR);
				}), 1000);
				return d;
			}
		},
		{
			timeout: 2000,
			name: "PropertyAndRendering",
			runTest: function (t) {
				var C = register("test-invalidating-prop-rendering", [HTMLElement, _WidgetBase, _Invalidating], {
					preCreate: function () {
						this.addInvalidatingProperties({"a": "invalidateProperty", "b": "invalidateProperty"});
					},
					a: null,
					b: null,
					refreshProperties: function () {
						t.is({"b": true}, this.invalidatedProperties);
					},
					refreshRendering: function () {
						t.is({"b": true}, this.invalidatedProperties);
					}
				});
				var d = new doh.Deferred();
				var o = new C();
				var afterPropsR, beforePropsR, afterPropsP, beforePropsP;
				o.on("refresh-properties-complete", function (e) {
					afterPropsP = o.invalidatedProperties;
					beforePropsP = e.invalidatedProperties;
				});
				o.on("refresh-rendering-complete", function (e) {
					afterPropsR = o.invalidatedProperties;
					beforePropsR = e.invalidatedProperties;
				});
				o.startup();
				t.is({ "a": "invalidateProperty", "b": "invalidateProperty" }, o._invalidatingProperties);
				o.b = "foo";
				// we need to check before the timeout that refresh-complete was called
				setTimeout(d.getTestCallback(function () {
					t.is({"b": true}, afterPropsP);
					t.is({"b": true}, beforePropsP);
					t.is({}, afterPropsR);
					t.is({"b": true}, beforePropsR);
				}), 1000);
				return d;
			}
		}
	]);
});
