define([
	"intern!object",
	"intern/chai!assert",
	"dojo/aspect",
	"dojo/dom",
	"dui/register",
	"dui/Widget"], function (registerSuite, assert, aspect, dom, register, Widget) {
	var container, TestWidget, w;
	var obj = {
		foo: function () {
			// summary: empty function that we connect to
		}
	};

	// Number of times foo was called while TestWidget existed
	var calls = 0;
	registerSuite({
		name: "create and destroy",
		setup: function () {
			TestWidget = register("test-lifecycle-widget", [HTMLElement, Widget], {
				postCreate: function () {
					// Rather odd call to this.own() for testing the connections are dropped on destroy()
					this.own(aspect.after(obj, "foo", function () {
						calls++;
					}, true));
				}
			});
			container = document.createElement("div");
			document.body.appendChild(container);
			container.innerHTML +=
				"<test-lifecycle-widget id='w1'></test-lifecycle-widget><test-lifecycle-widget id='w2'></test-lifecycle-widget>";
		},
		"upgrade plain DOMNode" : function () {
			w = document.getElementById("w1");
			register.upgrade(w);

			// test the connection
			assert.deepEqual(0, calls, "foo() not called yet");
			obj.foo();
			assert.deepEqual(1, calls, "foo() called");
		},
		"destroy" : function () {
			w.destroy();
			assert.ok(!document.getElementById("w1"), "widget no longer exists");

			// test the connection was destroyed
			calls = 0;
			obj.foo();
			assert.deepEqual(0, calls, "connection was deleted");

			// test the DOM node was removed
			assert.ok(!document.getElementById("w1"), "DOM Node removed");
		},
		"destroy(true)  (preserving DOM node)" : function () {
			w = document.getElementById("w2");
			register.upgrade(w);
			w.destroy(true);
			// test the DOM node *wasn't* removed
			assert.ok(dom.byId("w2"), "DOM Node left");

		},
		"create with undefined id" : function () {
			// If id is "specified" as undefined, generate a new one
			w = new TestWidget({id: undefined});
			assert.notDeepEqual(undefined, w.id);
		},
		"setter not called on creation" : function () {
			// Setters are no longer called on creation except for parameters sent to new Foo(...)
			var fooSetterCalled = false;
			var MyWidget = register("my-widget", [HTMLElement, Widget], {
				foo: 345,
				_setFooAttr: function (val) {
					fooSetterCalled = val;
					this._set("foo", val);
				}
			});
			new MyWidget();
			assert.deepEqual(false, fooSetterCalled, "fooSetterCalled");
		},
		teardown : function () {
			container.parentNode = null;
		}
	});
});
