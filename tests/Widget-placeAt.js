define([
	"intern!object",
	"intern/chai!assert",
	"dojo/aspect",
	"../register",
	"../Widget",
	"../Button"
], function (registerSuite, assert, aspect, register, Widget, Button) {
	var container, SimpleWidget, simple, pane1, pane2, pane3, pane4;
	registerSuite({
		name: "dui/Widget-placeAt",
		setup: function () {
			container = document.createElement("div");
			document.body.appendChild(container);
			SimpleWidget = register("simple-widget-place-at", [HTMLElement, Widget], {
				buildRendering: function () {
					this.containerNode = document.createElement("div");
					this.appendChild(this.containerNode);
				}
			});
		},
		"Place a child" : function () {
			// create a SimpleWidget
			simple = (new SimpleWidget({id: "simple-place-at-id"})).placeAt(container);
			assert.deepEqual(container, simple.parentNode, "simple is child of container");
		},
		"Place as widget child" : function () {
			// add the child to the SimpleWidget now
			pane1 = (new SimpleWidget({ title: "pane1" })).placeAt("simple-place-at-id");
			assert.deepEqual(pane1, simple.getChildren()[0], "pane1 is child of SimpleWidget");
			assert.deepEqual(simple.containerNode, pane1.parentNode, "pane1 added to simple.containerNode not simple");
		},
		"Place as widget child ordered" : function () {
			// add this child (created second) as the new first child
			pane2 = (new SimpleWidget({ title: "pane2" })).placeAt("simple-place-at-id", 0);
			assert.deepEqual(simple.containerNode, pane2.parentNode, "pane2 added to simple.containerNode not simple");
			assert.deepEqual(pane2, simple.getChildren()[0], "pane2 is new first child of SimpleWidget");
			assert.deepEqual(pane1, simple.getChildren()[1], "pane1 is now second child of SimpleWidget");
		},
		"Place before" : function () {
			var button = (new Button({})).placeAt(container, "before");
			assert.deepEqual(container, button.nextSibling, "button is before tab container");
		},
		"Place before id" : function () {
			var button = (new Button({})).placeAt(container, "before");
			assert.deepEqual(container, button.nextSibling, "button is before tab container");
		},
		"Place first widget" : function () {
			simple.startup();
			pane3 = (new SimpleWidget({ title: "pane3" })).placeAt("simple-place-at-id", "first");
			assert.deepEqual(simple.containerNode, pane3.parentNode, "pane3 added to simple.containerNode not simple")
			assert.deepEqual(pane3, simple.getChildren()[0], "pane3 is new first child of SimpleWidget");
			assert.ok(pane3._started, "pane3 was automatically started because simple was already started");
		},
		"Place last widget" : function () {
			pane4 = (new SimpleWidget({ title: "pane4" })).placeAt(simple.containerNode, "last");
			assert.deepEqual(pane4, simple.getChildren()[simple.getChildren().length - 1], "pane4 is new last child of SimpleWidget");
			assert.ok(pane4._started, "pane4 was automatically started because simple was already started");
		},
		teardown : function () {
			container.parentNode.removeChild(container);
		}
	});
});
