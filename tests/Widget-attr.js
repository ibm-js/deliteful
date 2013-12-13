define([
	"intern!object",
	"intern/chai!assert",
	"../register",
	"dojo/sniff",
	"dui/Widget",
	"dojo/domReady!"
], function (registerSuite, assert, register, has, Widget) {
	var container;
	registerSuite({
		name: "dui/Widget-attr",
		setup: function () {
			container = document.createElement("div");
			document.body.appendChild(container);
		},
		"declarative" : function () {
			global = 0;		// create intentional global
			global2 = { text: "global var" };
			var Declarative = register("test-declarative", [HTMLElement, Widget], {
				boolProp: false,
				numProp: 0,
				stringProp: "",
				funcProp : function () { },
				objProp1: { },
				objProp2: { }
			});
			container.innerHTML +=
				"<test-declarative id='d' boolProp='boolProp' numProp='5' stringProp='hello' funcProp='global=123;' objProp1='foo:1,bar:2' objProp2='global2'/>";
			var d = document.getElementById("d");
			register.upgrade(d);
			assert.isTrue(d.boolProp, "d.boolProp");

			assert.strictEqual(5, d.numProp, "d.numProp");
			assert.strictEqual("hello", d.stringProp, "d.stringProp");
			d.funcProp();
			assert.strictEqual(123, global, "d.funcProp() executed");
			assert.strictEqual(1, d.objProp1.foo, "d.objProp1.foo");
			assert.strictEqual(2, d.objProp1.bar, "d.objProp1.bar");
			assert.strictEqual("global var", d.objProp2.text, "d.objProp2.text");
		},
		"domMapping" : function () {
			var IndividualMaps = register("individual-maps", [HTMLElement, Widget], {
				// Mapping foo to this.plainTextNode.foo
				foo: "",
				_setFooAttr: "plainTextNode",

				// Mapping bar to this.buttonNode.bar
				bar: "",
				_setBarAttr: "buttonNode",

				// Mapping plainText to this.plainTextNode.innerHTML
				plainText: "",
				_setPlainTextAttr: {node: "plainTextNode", type: "innerText"},

				buildRendering: function () {
					this.className = "class1";

					this.buttonNode = this.focusNode = this.ownerDocument.createElement("button");
					this.buttonNode.textContent = "hi";
					this.appendChild(this.buttonNode);

					this.plainTextNode = this.focusNode = this.ownerDocument.createElement("span");
					this.plainTextNode.textContent = "original plain text";
					this.appendChild(this.plainTextNode);
				}
			});
			container.innerHTML += "<div id='wrapper'></div>";

			var widget = new IndividualMaps({
				foo: "value1",
				bar: "value2",
				className: "class2",
				style: "height: 123px",
				plainText: "hello world <>&;",
				"name-with-dashes": "name with dashes"
			}).placeAt(document.getElementById("wrapper"));

			// test attributes specified to constructor were copied over to DOM
			assert.strictEqual("value1", widget.plainTextNode.foo, "widget.plainTextNode.foo");
			assert.strictEqual("value2", widget.buttonNode.bar, "widget.buttonNode.bar");
			assert.isTrue(widget.classList.contains("class2"), "class2");
			assert.strictEqual("hello world &lt;&gt;&amp;;", widget.plainTextNode.innerHTML, "innerHTML");

		},
		// tabIndex is problematic, see https://github.com/ibm-dojo/dui/issues/34.
		"specialNames" : function () {
			// Test when tabIndex is declared top level, in the props passed to register().
			// TODO: enable when https://github.com/uhop/dcl/issues/9 is fixed
			/*
			var SpecialNames = register("test-special-names", [HTMLElement, Widget], {
				tabIndex: "0",

				postCreate: function () {
					this.watch("tabIndex", function(name, o, n){
						this.watchedTabIndex = n;
					});
				}
			});
			var widget = new SpecialNames({ });
			widget.tabIndex = "3";
			document.body.appendChild(widget);
			widget.startup();
			assert.equal("3", widget.watchedTabIndex, "watch fired on widget");
			*/

			// And test when tabIndex is declared in a mixin.
			var SpecialNamesMixin = register.dcl(Widget, {
				tabIndex: "0",

				postCreate: function () {
					this.watch("tabIndex", function(name, o, n){
						this.watchedTabIndex = n;
					});
				}
			});
			var SpecialExtendedWidget = register("test-special-names-extended", [HTMLElement, SpecialNamesMixin], {
				tabIndex: "0",
				value: "0",
				isrange: false,
				isbool: false,

				postCreate: function () {
					this.watch("tabIndex", function(name, o, n){
						this.watchedTabIndex = n;
					});
				}
			});

			var extended = new SpecialExtendedWidget({ });
			extended.tabIndex = "5";
			document.body.appendChild(extended);
			extended.startup();
			assert.equal("5", extended.watchedTabIndex, "watch fired on extended");

			// And also test for declarative widgets, to make sure the tabIndex property is
			// removed from the root node, to prevent an extra tab stop
			container.innerHTML += "<test-special-names-extended id=specialNames value=5 isrange isbool tabIndex=8/>";
			var declarative = document.getElementById("specialNames");
			register.upgrade(declarative);
			assert.isFalse(declarative.hasAttribute("tabindex"), "tabindex attr removed");
			assert.isTrue(declarative.isrange, "isrange set");
			assert.isTrue(declarative.isbool, "isbool set");
			assert.strictEqual("5", declarative.value, "value");

			// Finally, test when the widget prototype doesn't declare tabIndex at all.
			// Then the widget should just act like a simple <div>, passing tabIndex through to root node.
			var SimpleWidget = register("simple-widget", [HTMLElement, Widget], { });
			var simple = new SimpleWidget({ tabIndex: 5 });
			document.body.appendChild(simple);
			simple.startup();

			// make sure that tabIndex was correctly set
			assert.strictEqual("5", simple.getAttribute("tabindex"), "programmatic set");

			// And also test for declarative widgets, to make sure the tabIndex property is
			// removed from the root node, to prevent an extra tab stop
			container.innerHTML += "<simple-widget id=simple tabIndex=8>";
			var simpleDeclarative = document.getElementById("simple");
			register.upgrade(simpleDeclarative);

			// make sure that tabIndex wasn't unset
			assert.strictEqual("8", simpleDeclarative.getAttribute("tabindex"), "declarative set");
		},
		teardown : function () {
			container.parentNode.removeChild(container);
		}
	});
});
