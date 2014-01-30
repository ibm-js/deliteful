define([
	"dcl/dcl",
	"intern!object",
	"intern/chai!assert",
	"dojo/dom-class",
	"delite/register",
	"delite/Widget",
	"delite/Scrollable",
	"deliteful/ScrollableContainer",
	"delite/tests/Scrollable-shared" // reuse the test cases from the tests of delite/Scrollable
], function (dcl, registerSuite, assert, domClass, register, Widget, 
	Scrollable, ScrollableContainer, ScrollableSharedTests) {
	
	// Note that the actual testing is done in ScrollableContainer-shared.
	
	var container, MyScrollableWidget, MyScrollableContainer;
	/*jshint multistr: true */
	var html = "<d-scrollable-container id='sc1' \
			style='position: absolute; width: 200px; height: 200px;'> \
			<div id='sc1content' style='width: 2000px; height: 2000px;'></div> \
			</d-scrollable-container>\
			<my-scrolable-container id='mysc1'> \
			</my-scrolable-container> \
			<d-scrollable-container scrollDirection='none' id='sc2'> \
			</d-scrollable-container>";

	
	// Markup use-case
	
	var suite = {
		name: "delite/ScrollableContainer: markup",
		setup: function () {
			container = document.createElement("div");
			document.body.appendChild(container);
			container.innerHTML = html;
			register("my-scrolable-container", [ScrollableContainer], {});
			register.parse();
		},
		teardown: function () {
			container.parentNode.removeChild(container);
		}
	};

	ScrollableSharedTests.containerCSSClassName = "d-scrollable-container";
	
	dcl.mix(suite, ScrollableSharedTests.testCases);

	registerSuite(suite);
	
	// Programatic creation 
	
	suite = {
		name: "delite/ScrollableContainer: programatic",
		setup: function () {
			container = document.createElement("div");
			document.body.appendChild(container);
			
			MyScrollableContainer = register("my-sc-prog", [ScrollableContainer], {});

			var w = new ScrollableContainer({ id: "sc1" });
			w.style.position = "absolute";
			w.style.width = "200px";
			w.style.height = "200px";
			container.appendChild(w);
			w.startup();

			var innerContent = document.createElement("div");
			innerContent.id = "sc1content";
			innerContent.style.width = "2000px";
			innerContent.style.height = "2000px";
			w.appendChild(innerContent);
			w.startup();

			w = new MyScrollableContainer({ id: "mysc1" });
			container.appendChild(w);
			w.startup();

			w = new ScrollableContainer({ id: "sc2" });
			w.scrollDirection = "none";
			container.appendChild(w);
			w.startup();
		},
		teardown: function () {
			container.parentNode.removeChild(container);
		}
	};

	dcl.mix(suite, ScrollableSharedTests.testCases);

	registerSuite(suite);
});
