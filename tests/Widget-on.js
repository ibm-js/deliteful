define([
	"intern!object",
	"intern/chai!assert",
	"../register",
	"dui/Widget"
], function (registerSuite, assert, register, Widget) {
	var container, html;
	/*jshint multistr: true */
	html = '<my-widget-on id="myWidget" onclick="globalClicked++;" oncustom="globalCustom++;">hi</my-widget-on>';

	registerSuite({
		name: "dui/Widget-on",
		setup: function () {
			container = document.createElement("div");
			document.body.appendChild(container);
			container.innerHTML = html;
		},
		"declarative" : function () {
			// Test that declarative instantiation (onfoo=...) works,
			// and also that widget.on() works.

			// Define a widget that emits two events, "click" and "custom".
			// You can catch the events via either on("click", ...) or oncustom=... syntax.
			// Note that the HTMLElement prototype already defines onclick() so we don't need to.
			MyWidget = register("my-widget-on", [HTMLElement, Widget], {
				emitCustomEvent: function () {
					this.emit("custom");
				},
				emitClickEvent: function () {
					this.emit("click");
				},
				oncustom: function () {
					// summary:
					//		User can set oncustom=... rather than using on("custom", ...)
				}
			});

			// Create variables accessed from the declarative widget (see definition in <body>)
			globalClicked = 0;
			globalCustom = 0;

			register.parse();

			var myWidget = document.getElementById("myWidget");

			var clicked = 0;
			myWidget.on("click", function () {
				clicked++;
			});
			myWidget.emitClickEvent();
			assert.deepEqual(1, clicked, ".on('clicked', ...)");
			assert.deepEqual(1, globalClicked, "onclick='...'");

			var custom = 0;
			myWidget.on("custom", function () {
				custom++;
			});
			myWidget.emitCustomEvent();
			assert.deepEqual(1, custom, ".on('custom', ...)");
			assert.deepEqual(1, globalCustom, "oncustom='...'");

		},
		"programmatic" : function () {
			// Create a widget with a custom "show" event, plus the standard "click" event.
			var MyWidget = register("my-widget2-on", [HTMLElement, Widget], {
				show: function () {
					return this.emit('show');
				},
				onshow: function(){ },
				click: function () {
					this.emit("click");
				}
			});

			var evt = null, clicked = 0;
			var w = new MyWidget({
				onshow: function (e) {
					evt = e;
				},
				onclick: function (e) {
					clicked++;
				}
			});
			w.placeAt(document.body);
			w.startup();

			w.show();
			assert.isNotNull(evt, "onshow was called with event object");

			w.click();
			assert.deepEqual(1, clicked, "one click event");
		},
		teardown : function () {
			container.parentNode.removeChild(container);
		}
	});
});
