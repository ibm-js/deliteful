define([
	"dcl/dcl",
	"intern!object",
	"intern/chai!assert",
	"delite/register",
	"deliteful/ScrollableContainer",
	"deliteful/tests/unit/resources/Scrollable-shared" // same test cases as for the tests of delite/Scrollable
], function (dcl, registerSuite, assert, register,
	ScrollableContainer, ScrollableSharedTests) {
	
	// Note that the actual testing is done in ScrollableContainer-shared.

	function mix(a, b) {
		for (var n in b) {
			a[n] = b[n];
		}
	}

	var container, MyScrollableContainer;
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
		name: "deliteful/ScrollableContainer: markup",
		setup: function () {
			register("my-scrolable-container", [ScrollableContainer], {});
		},
		beforeEach: function () {
			container = document.createElement("div");
			document.body.appendChild(container);
			container.innerHTML = html;
			register.deliver();
		},
		afterEach: function () {
			container.parentNode.removeChild(container);
		}
	};

	ScrollableSharedTests.containerCSSClassName = "d-scrollable-container";
	
	mix(suite, ScrollableSharedTests.testCases);

	registerSuite(suite);
	
	// Programatic creation 
	
	suite = {
		name: "deliteful/ScrollableContainer: programatic",
		setup: function () {
			container = document.createElement("div");
			document.body.appendChild(container);
			
			MyScrollableContainer = register("my-sc-prog", [ScrollableContainer], {});

			var w = new ScrollableContainer({ id: "sc1" });
			w.style.position = "absolute";
			w.style.width = "200px";
			w.style.height = "200px";
			w.placeAt(container);

			var innerContent = document.createElement("div");
			innerContent.id = "sc1content";
			innerContent.style.width = "2000px";
			innerContent.style.height = "2000px";
			w.appendChild(innerContent);

			w = new MyScrollableContainer({ id: "mysc1" });
			container.appendChild(w);

			w = new ScrollableContainer({ id: "sc2" });
			w.scrollDirection = "none";
			container.appendChild(w);
		},
		teardown: function () {
			container.parentNode.removeChild(container);
		}
	};

	mix(suite, ScrollableSharedTests.testCases);

	registerSuite(suite);
});
