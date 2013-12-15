define([
	"intern!object",
	"intern/chai!assert",
	"../Stateful",
	"dcl/dcl"
], function (registerSuite, assert, Stateful, dcl) {
	registerSuite({
		name: "dui/Stateful",
		"getSetWatch" : function () {
			var clz = dcl(Stateful, {
					foo: 3
				}),
				s = new clz;
			assert.deepEqual(3, s.foo);
			var watching = s.watch("foo", function (name, oldValue, value) {
				assert.deepEqual("foo", name);
				assert.deepEqual(3, oldValue);
				assert.deepEqual(4, value);
				assert.deepEqual(4, s.foo);
			});
			s.foo = 4;
			assert.deepEqual(4, s.foo);
			watching.remove();
			s.foo = 5;
			assert.deepEqual(5, s.foo);
		},
		"removeWatchHandle" : function () {
			var clz = dcl(Stateful, {
					foo: 3
				}),
				s = new clz,
				watched = false;

			var watching = s.watch("foo", function () {
				assert.isFalse(watched);
				watched = true;
			});
			s.foo = 4;
			watching.remove();
			s.foo = 5;
		},
		"removeWatchHandleTwice" : function () {
			var clz = dcl(Stateful, {
					foo: 3
				}),
				s = new clz,
				assertions = 0;

			var watching = s.watch("foo", function () {
				assertions++;
			});
			var watching2 = s.watch("foo", function () {
				assertions++;
			});
			s.foo = 4;
			watching.remove();
			watching.remove();
			s.foo = 5;

			assert.deepEqual(3, assertions, "assertions");

		},
		"setHash" : function () {
			var clz = dcl(Stateful, {
					foo: 0,
					bar: 0
				}),
				s = new clz(),
				fooCount = 0,
				handle = s.watch('foo', function () {
					fooCount++;
				});
			s.mix({
				foo: 3,
				bar: 5
			});
			assert.deepEqual(3, s.foo);
			assert.deepEqual(5, s.bar);
			assert.deepEqual(1, fooCount);

			var clz2 = dcl(Stateful, {
					foo: 0,
					bar: 0
				}),
				s2 = new clz2();
			s2.mix(s);
			assert.deepEqual(3, s2.foo);
			assert.deepEqual(5, s2.bar);
			// s watchers should not be copied to s2
			assert.deepEqual(1, fooCount);
		},
		"wildcard" : function () {
			var clz = dcl(Stateful, {
					foo: 0,
					bar: 0
				}),
				s = new clz();
			s.mix({
				foo: 3,
				bar: 5
			});
			var wildcard = 0;
			var foo = 0;
			s.watch(function () {
				wildcard++;
			});
			s.watch("foo", function () {
				foo++;
			});
			s.foo = 4;
			s.bar = 6;
			assert.deepEqual(2, wildcard);
			assert.deepEqual(1, foo);
		},
		"accessors" : function () {
			var StatefulClass1 = dcl(Stateful, {
				foo: 0,
				bar: 0,
				baz: "",

				_getFooAttr: function () {
					return this._fooAttr - 1;
				},

				_setBarAttr: function (value) {
					this._set("bar", value + 1);
				}
			});

			var attr1 = new StatefulClass1();
			attr1.foo = 4;
			attr1.bar = 2;
			attr1.baz = "bar";

			assert.deepEqual(3, attr1.foo, "attr1.foo getter works");
			assert.deepEqual(3, attr1.bar, "attr1.bar setter works");
			assert.deepEqual("bar", attr1.baz, "attribute set properly");
		},
		"paramHandling" : function () {
			var StatefulClass2 = dcl(Stateful, {
				foo: null,
				bar: 5,

				_setFooAttr: function (value) {
					this._set("foo", value);
				},
				_setBarAttr: function (value) {
					this._set("bar", value);
				}
			});

			var attr2 = new StatefulClass2({
				foo: function () {
					return "baz";
				},
				bar: 4
			});

			assert.deepEqual("function", typeof attr2.foo, "function attribute set");
			assert.deepEqual("baz", attr2.foo(), "function has proper return value");
			assert.deepEqual(4, attr2.bar, "attribute has proper value");
		},
		"_set" : function () {
			var output = [];
			var StatefulClass4 = dcl(Stateful, {
				foo: null,
				bar: null,

				_setFooAttr: function (value) {
					this._set("bar", value);
					this._set("foo", value);
				},
				_setBarAttr: function (value) {
					this._set("foo", value);
					this._set("bar", value);
				}
			});

			var attr4 = new StatefulClass4();
			attr4.watch("foo", function (name, oldValue, value) {
				output.push(name, oldValue, value);
			});
			attr4.watch("bar", function (name, oldValue, value) {
				output.push(name, oldValue, value);
			});
			attr4.foo = 3;
			assert.deepEqual(3, attr4.bar, "value set properly");
			attr4.bar = 4;
			assert.deepEqual(4, attr4.foo, "value set properly");
			assert.deepEqual(["bar", null, 3, "foo", null, 3, "foo", 3, 4, "bar", 3, 4], output);
		},
		"_get" : function () {
			var output = [];
			var StatefulClass5 = dcl(Stateful, {
				foo: "",
				_getFooAttr: function (value) {
					return this._get("foo") + "modified";
				}
			});

			var attr5 = new StatefulClass5();
			assert.deepEqual("modified", attr5.foo, "value get properly");
			attr5.foo = "further";
			assert.deepEqual("furthermodified", attr5.foo, "");
		},
		"moreCorrelatedProperties" : function () {
			var Widget = dcl(Stateful, {
				foo: 10,
				_setFooAttr: function (val) {
					this._set("foo", val);
					this._set("bar", val + 1);
				},

				bar: 11,
				_setBarAttr: function (val) {
					this._set("bar", val);
					this._set("foo", val - 1);
				}
			});

			var w1 = new Widget({foo: 30});
			assert.deepEqual(30, w1.foo, "w1.foo");
			assert.deepEqual(31, w1.bar, "w1.bar");

			var w2 = new Widget({bar: 30});
			assert.deepEqual(30, w2.bar, "w2.bar");
			assert.deepEqual(29, w2.foo, "w2.foo");

			var w3 = new Widget({});
			assert.deepEqual(10, w3.foo, "w3.foo");
			assert.deepEqual(11, w3.bar, "w3.bar");
		},
		"subclasses1" : function () {
			// Test when superclass and subclass are declared first, and afterwards instantiated
			var SuperClass = dcl(Stateful, {
				foo: null,
				bar: null
			});
			var SubClass = dcl(SuperClass, {
				bar: 5
			});

			var sub = new SubClass();
			var fooWatchedVal;
			sub.watch("foo", function (prop, o, n) {
				fooWatchedVal = n;
			});
			var barWatchedVal;
			sub.watch("bar", function (prop, o, n) {
				barWatchedVal = n;
			});
			sub.foo = 3;
			assert.deepEqual(3, fooWatchedVal, "foo watch() on SubClass");
			sub.bar = 4;
			assert.deepEqual(4, barWatchedVal, "bar watch() on SubClass");

			var sup = new SuperClass();
			var superFooWatchedVal;
			sup.watch("foo", function (prop, o, n) {
				superFooWatchedVal = n;
			});
			var superBarWatchedVal;
			sup.watch("bar", function (prop, o, n) {
				superBarWatchedVal = n;
			});
			sup.foo = 5;
			assert.deepEqual(5, superFooWatchedVal, "foo watch() on SuperClass");
			sup.bar = 6;
			assert.deepEqual(6, superBarWatchedVal, "bar watch() on SuperClass");
			assert.deepEqual(3, fooWatchedVal, "SubClass listener on foo not called");
			assert.deepEqual(4, barWatchedVal, "SubClass listener on bar not called");
		},
		"subclasses2" : function () {
			// Test when superclass is declared and instantiated, then subclass is declared and use later
			var output = [];
			var SuperClass = dcl(Stateful, {
				foo: null,
				bar: null
			});
			var sup = new SuperClass();
			var superFooWatchedVal;
			sup.watch("foo", function (prop, o, n) {
				superFooWatchedVal = n;
			});
			var superBarWatchedVal;
			sup.watch("bar", function (prop, o, n) {
				superBarWatchedVal = n;
			});
			sup.foo = 5;
			assert.deepEqual(5, superFooWatchedVal, "foo watch() on SuperClass");
			sup.bar = 6;
			assert.deepEqual(6, superBarWatchedVal, "bar watch() on SuperClass");

			var customSetterCalled;
			var SubClass = dcl(SuperClass, {
				bar: 5,
				_setBarAttr: function (val) {
					// this should get called even though SuperClass doesn't have a custom setter for "bar"
					customSetterCalled = true;
					this._set("bar", val);
				}
			});
			var sub = new SubClass();
			var fooWatchedVal;
			sub.watch("foo", function (prop, o, n) {
				fooWatchedVal = n;
			});
			var barWatchedVal;
			sub.watch("bar", function (prop, o, n) {
				barWatchedVal = n;
			});
			sub.foo = 3;
			assert.deepEqual(3, fooWatchedVal, "foo watch() on SubClass");
			sub.bar = 4;
			assert.deepEqual(4, barWatchedVal, "bar watch() on SubClass");
			assert.ok(customSetterCalled, "SubClass custom setter called");

			assert.deepEqual(5, superFooWatchedVal, "SuperClass listener on foo not called");
			sup.bar = 6;
			assert.deepEqual(6, superBarWatchedVal, "SuperClass listener on bar not called");
		},
		teardown : function () {
			//container.parentNode.removeChild(container);
		}
	});
});

