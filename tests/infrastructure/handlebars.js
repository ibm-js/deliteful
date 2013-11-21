define([
	"intern!object",
	"intern/chai!assert",
	"dui/handlebars",
	"dui/register",
	"dui/Widget",
	"dui/handlebars!dui/tests/infrastructure/templates/SimpleHandleBarsButton.html",
	"dui/handlebars!dui/tests/infrastructure/templates/HandlebarsButton.html"
], function (registerSuite, assert, handlebars, register, Widget, simpleHBTmpl, buttonHBTmpl) {
	var container, myButton;
	registerSuite({
		name: "handlebars",
		setup: function () {
			container = document.createElement("div");
			document.body.appendChild(container);
		},
		"load" : function () {
			// Test that function returned from dui/handlebars! creates the template correctly
			var TestButton = register("test-button", [HTMLButtonElement, Widget], {
				iconClass: "originalClass",
				label: "original label",
				buildRendering: simpleHBTmpl
			});
			myButton = new TestButton();
			assert.deepEqual("button", myButton.tagName.toLowerCase(), "root node exists");
			assert.deepEqual("span", myButton.firstChild.tagName.toLowerCase(), "icon node exists too");
			assert.deepEqual("duiReset originalClass", myButton.firstChild.className, "icon class set");
			assert.deepEqual("original label", myButton.textContent.trim(), "label set");
		},
		"update" : function () {
			myButton.label = "new label";
			assert.deepEqual("new label", myButton.textContent.trim(), "label updated");

			myButton.iconClass = "newClass";
			assert.deepEqual("duiReset newClass", myButton.firstChild.className, "icon class set");

		},
		"branching" : function () {
			var NoLabelButton = register("no-label-button", [HTMLButtonElement, Widget], {
				iconClass: "originalClass",
				showLabel: false,
				label: "original label",
				buildRendering: buttonHBTmpl
			});
			myButton = new NoLabelButton();
			assert.deepEqual("button", myButton.tagName.toLowerCase(), "root node exists");
			assert.deepEqual("span", myButton.firstChild.tagName.toLowerCase(), "icon node exists too");
			assert.deepEqual("duiReset originalClass", myButton.firstChild.className, "icon class set");
			assert.deepEqual("", myButton.textContent.trim(), "no label");
			myButton.label = "new label";
			assert.deepEqual("", myButton.textContent.trim(), "still no label");

			// Test true if condition
			var LabelButton = register("label-button", [HTMLButtonElement, Widget], {
				iconClass: "originalClass",
				showLabel: true,
				label: "original label",
				buildRendering: buttonHBTmpl
			});
			myButton = new LabelButton();
			assert.deepEqual("button", myButton.tagName.toLowerCase(), "root node exists");
			assert.deepEqual("span", myButton.firstChild.tagName.toLowerCase(), "icon node exists too");
			assert.deepEqual("duiReset originalClass", myButton.firstChild.className, "icon class set");
			assert.deepEqual("original label", myButton.textContent.trim(), "label");

			// Make sure that changes still work
			myButton.label = "new label";
			assert.deepEqual("new label", myButton.textContent.trim(), "label updated");

		},
		"Special props" : function () {
			var SpecialPropsWidget = register("special-props", [HTMLElement, Widget], {
				inputClass: "originalClass",	// attribute called "class" but property called "className"
				inputValue: "original value",	// must be set as property
				role: "originalRole",			// must be set as attribute
				buildRendering: handlebars.compile(
					'<special-props><input class="{{inputClass}}" value="{{inputValue}}" role="{{role}}"/></special-props>'
				)
			});
			var mySpecialPropsWidget = new SpecialPropsWidget();
			var input = mySpecialPropsWidget.children[0];

			assert.deepEqual("original value", input.value, "value set as property");
			assert.deepEqual("originalClass", input.className, "class set even though property is called className, not class");
			assert.deepEqual("originalRole", input.getAttribute("role"), "role set as attribute");

			mySpecialPropsWidget.mix({
				inputClass: "newClass",
				inputValue: "new value",
				role: "newRole"
			});
			assert.deepEqual("new value", input.value, "value changed");
			assert.deepEqual("newClass", input.className, "class changed");
			assert.deepEqual("newRole", input.getAttribute("role"), "role changed");

			// TODO: implement and then test reverse binding, from input.value --> widget.value?
		},
		"Widgets in Template" : function () {
			register("simple-heading", [HTMLElement, Widget], {
				text: "",
				buildRendering: handlebars.compile("<simple-heading>{{text}}</simple-heading>")
			});

			// This widget uses sub-widgets test-button (defined in first test) and also simple-heading.
			var ComplexWidget = register("widgets-in-template", [HTMLElement, Widget], {
				heading: "original heading",
				content: "original content",
				buttonLabel: "original button label",
				buildRendering: handlebars.compile(
					'<widgets-in-template>' +
						'<simple-heading text="{{heading}}"></simple-heading>' +
						'<span>{{content}}</span>' +
						'<button is="test-button" label="{{buttonLabel}}"></button>' +
						'</widgets-in-template>'
				)
			});

			var myComplexWidget = new ComplexWidget(),
				headingWidget = myComplexWidget.getElementsByTagName("simple-heading")[0],
				buttonWidget = myComplexWidget.getElementsByTagName("button")[0];
			assert.ok(headingWidget.buildRendering, "heading widget was instantiated");
			assert.deepEqual("original heading", headingWidget.textContent, "heading widget got title from main widget");
			assert.ok(buttonWidget.buildRendering, "button widget was instantiated");
			assert.deepEqual("original button label", buttonWidget.textContent.trim(), "button widget got label from main widget");

			myComplexWidget.mix({
				heading: "new heading",
				buttonLabel: "new button label"
			});
			assert.deepEqual("new heading", headingWidget.textContent, "heading changed");
			assert.deepEqual("new button label", buttonWidget.textContent.trim(), "button changed");

		},

		teardown : function () {
			container.parentNode = null;
		}
	});
});
