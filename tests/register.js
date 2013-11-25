define([
    "intern!object",
    "intern/chai!assert",
    "../register",
	"dui/Stateful",
    "dojo/domReady!"
], function (registerSuite, assert, register, Stateful) {

	// The <div> node where we will put all our DOM nodes
	var container;

	var Mixin, TestWidget, TestButtonWidget, TestExtendedWidget, TestExtendedButtonWidget;

	var nativeButton = document.createElement("button");

    registerSuite({
        name: "dui/register tests",

        setup: function () {
			container = document.createElement("div");
			document.body.appendChild(container);
        },

		// Declare and instantiate a simple widget
        "simple" : function () {
			// Create a mixin for testing purposes.  Note that (currently) Stateful must be in the inheritance chain
			// because register() expects this.introspect() and this._getProps() to be defined.
			Mixin = register.dcl(Stateful, {
				foo: 3,
				fooFunc: function () {
					this._fooCalled = true;
				},

				// Need to redefine Stateful._getProps() because on FF and IE, we get exceptions when accessing props
				// like HTMLElement.title.  We are accessing them in the HTMLElement prototype rather than an object
				// created from the document.createElement() factory.
				_getProps: function () {
					var list = [];
					for (var prop in this) {
						if (!(prop in nativeButton)) {
							list.push(prop);
						}
					}
					return list;
				}
			});
			assert.ok(Mixin, "Mixin created");

            TestWidget = register("test-widget", [HTMLElement, Mixin], {
				barFunc: function () {
					this._barCalled = true;
				}
			});
			assert.ok(TestWidget, "TestWidget created");

			container.innerHTML += "<test-widget id=tw></test-widget>";
			var tw = document.getElementById("tw");
			register.upgrade(tw);

			// property from mixin exists
			assert.ok(tw.foo, "foo");

			// function from mixin exists
			tw.fooFunc();
			assert.ok(tw._fooCalled, "_fooCalled");

			// function from register() call exists
			tw.barFunc();
			assert.ok(tw._barCalled, "_barCalled");

			// properties are enumerable
			var sawFoo;
			for (var key in tw) {
				if (key === "foo") {
					sawFoo = true;
					break;
				}
			}
			assert.ok(sawFoo, "foo enumerable");

			// TODO: test that createdCallback() was called
		},

		"extended": function () {

			// Create extension of another widget
			TestExtendedWidget = register("test-extended-widget", [TestWidget], {
				extFunc: function () {
					this._extCalled = true;
				}
			});
			assert.ok(TestExtendedWidget, "TestExtendedWidget created");

			container.innerHTML += "<test-extended-widget id=tew></test-extended-widget>";
			var tew = document.getElementById("tew");
			register.upgrade(tew);
			assert.ok(tew.foo, "foo");
			tew.fooFunc();
			assert.ok(tew._fooCalled, "_fooCalled");
			tew.barFunc();
			assert.ok(tew._barCalled, "_barCalled");
			tew.extFunc();
			assert.ok(tew._extCalled, "_extCalled");

			// properties are enumerable
			var sawExt;
			for (var key in tew) {
				if (key === "extFunc") {
					sawExt = true;
					break;
				}
			}
			assert.ok(sawExt, "ext enumerable");
		},

		"button": function () {

			// Create a simple widget extending something other than HTMLElement.
			TestButtonWidget = register("test-button-widget", [HTMLButtonElement, Mixin], {
				label: "my label"
			});
			assert.ok(TestButtonWidget, "TestButtonWidget created");

			container.innerHTML += "<button is='test-button-widget' id=tbw></button>";
			var tbw = document.getElementById("tbw");
			register.upgrade(tbw);

			assert.ok(tbw.foo, "foo");
			assert.ok(tbw.label, "label");
		},

		"extended button": function () {

			// Create extension of another widget.
			TestExtendedButtonWidget = register("test-extended-button-widget", [TestButtonWidget], {
				extFunc: function () {
					this._extCalled = true;
				}
			});
			assert.ok(TestExtendedButtonWidget, "TestExtendedButtonWidget created");

			container.innerHTML += "<button is='test-extended-button-widget' id=tebw></button>";
			var tebw = document.getElementById("tebw");
			register.upgrade(tebw);

			assert.ok(tebw.foo, "foo");
			assert.ok(tebw.label, "label");
			tebw.extFunc();
			assert.ok(tebw._extCalled, "_extCalled");
        },

		// Create element is like upgrade() but it also creates the element for you.
        "createElement" : function () {
			var tw = register.createElement("test-widget");
			assert.ok(tw.foo, "TestWidget.foo");

			// Test also that we can create plain elements that are not registered as widgets
            var div = register.createElement("div");
			assert.strictEqual("div", div.nodeName.toLowerCase(), "nodeName of div");
        },

		// Test the new MyWidget() syntactic sugar
        "new" : function () {
			var tw = new TestWidget({});
			assert.ok(tw.foo, "TestWidget.foo");
			assert.strictEqual("test-widget", tw.nodeName.toLowerCase(), "nodeName of TestWidget");
        },

		// Test the parser, which scans the DOM for registered widgets and upgrades them
        "parse" : function () {
			container.innerHTML += "<div>" +
				"<button is='test-extended-button-widget' id=ebw2>hello</button>" +
				"<span>random node</span>" +
				"<test-extended-widget id=ew2></test-extended-widget>" +
				"</div>";

			register.parse(container);
			assert.strictEqual("my label", document.getElementById("ebw2").label, "ebw2.label");
			assert.strictEqual(3, document.getElementById("ew2").foo, "ew2.foo");

			// TODO: test that startup() is called.
        },

		teardown: function () {
			container.parentNode = null;
		}
	});
});
