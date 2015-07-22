define([
	"dcl/dcl",
	"intern!object",
	"intern/chai!assert",
	"requirejs-dplugins/jquery!attributes/classes",
	"delite/register",
	"deliteful/Panel",
	"dojo/domReady!"
], function (dcl, registerSuite, assert, $, register, Panel) {

	var container, html = "<d-panel id='p1'></d-panel>" +
		"<d-panel id='p2' iconClass='ic1' label='foo'></d-panel>" +
		"<d-panel id='p3' label='label'></d-panel>" +
		"<d-panel id='p2' iconClass='ic1'></d-panel>";

	var commonSuite = {
		"Default CSS": function () {
			var panel = document.getElementById("p1");
			assert.isTrue($(panel).hasClass("d-panel"));
			assert.isTrue($(panel.headerNode).hasClass("d-panel-header"));
			assert.isTrue($(panel.containerNode).hasClass("d-panel-content"));
		},
		"Default values": function () {
			var p1 = document.getElementById("p1");
			assert.strictEqual(p1.label, "", "label doesn't have a default value");
			assert.strictEqual(p1.iconClass, "", "iconClass doesn't have a default value");
			assert.strictEqual(p1.getAttribute("role"), "presentation");
			assert.strictEqual(p1.headerNode.getAttribute("role"), "heading");
			assert.strictEqual(p1.containerNode.getAttribute("role"), "region");
			assert.strictEqual(p1.containerNode.getAttribute("aria-labelledby"), p1.headerNode.id);

			var p2 = document.getElementById("p2");
			assert.strictEqual(p2.label, "foo", "Unexpected value for label");
			assert.strictEqual(p2.iconClass, "ic1", "Unexpected value for iconClass");
			assert.isTrue($(p2.iconNode).hasClass("ic1"));
			assert.strictEqual(p2.getAttribute("role"), "presentation");
			assert.strictEqual(p2.headerNode.getAttribute("role"), "heading");
			assert.strictEqual(p2.containerNode.getAttribute("role"), "region");
			assert.strictEqual(p2.containerNode.getAttribute("aria-labelledby"), p2.headerNode.id);
		},
		"label": function () {
			var p3 = document.getElementById("p3");
			assert.strictEqual(p3.label, "label", "Unexpected value for label");
			p3.label = "title";
			p3.deliver();
			assert.strictEqual(p3.label, "title", "Unexpected value for label");
		},
		"iconClass": function () {
			var p4 = document.getElementById("p2");
			assert.strictEqual(p4.iconClass, "ic1", "Unexpected value for iconClass");
			assert.isTrue($(p4.iconNode).hasClass("ic1"));
			p4.iconClass = "ic2";
			p4.deliver();
			assert.strictEqual(p4.iconClass, "ic2", "Unexpected value for iconClass");
			assert.isTrue($(p4.iconNode).hasClass("ic2"));
		}
	};

	//Markup
	var suite = {
		name: "Panel: Markup",
		setup: function () {
			container = document.createElement("div");
			document.body.appendChild(container);
			container.innerHTML = html;
			register.deliver();
		},
		teardown: function () {
			container.parentNode.removeChild(container);
		}
	};

	dcl.mix(suite, commonSuite);
	registerSuite(suite);

	//Programmatic
	suite = {
		name: "Panel: Programmatic",
		setup: function () {
			container = document.createElement("div");
			document.body.appendChild(container);
			var panel = new Panel({id: "p1"});
			panel.placeAt(container);
			panel = new Panel({id: "p2", label: "foo", iconClass: "ic1"});
			panel.placeAt(container);
			panel = new Panel({id: "p3", label: "label"});
			panel.placeAt(container);
			panel = new Panel({id: "p4", iconClass: "ic1"});
			panel.placeAt(container);
		},
		teardown: function () {
			container.parentNode.removeChild(container);
		}
	};

	dcl.mix(suite, commonSuite);
	registerSuite(suite);

});