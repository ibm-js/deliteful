define(function (require) {
	"use strict";

	var registerSuite = intern.getPlugin("interface.object").registerSuite;
	var register = require("delite/register");
	var ScrollableContainer = require("deliteful/ScrollableContainer");
	var ScrollableSharedTests = require("deliteful/tests/unit/resources/Scrollable-shared");

	// Note that the actual testing is done in ScrollableContainer-shared.

	var container, MyScrollableContainer;
	/*jshint multistr: true */
	var html = "<d-scrollable-container id='sc1' \
			style='position: absolute; width: 200px; height: 200px;'> \
			<div id='sc1content' style='width: 2000px; height: 2000px;'></div> \
			</d-scrollable-container>\
			<my-scrollable-container id='mysc1'> \
			</my-scrollable-container> \
			<d-scrollable-container scrollDirection='none' id='sc2'> \
			</d-scrollable-container>";

	// Markup use-case
	ScrollableSharedTests.containerCSSClassName = "d-scrollable-container";

	registerSuite("deliteful/ScrollableContainer: markup", {
		before: function () {
			register("my-scrollable-container", [ScrollableContainer], {});
		},

		beforeEach: function () {
			container = document.createElement("div");
			document.body.appendChild(container);
			container.innerHTML = html;
			register.deliver();
		},

		afterEach: function () {
			container.parentNode.removeChild(container);
		},

		tests: ScrollableSharedTests.testCases
	});

	// Programatic creation
	registerSuite("deliteful/ScrollableContainer: programatic", {
		before: function () {
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

		after: function () {
			container.parentNode.removeChild(container);
		},

		tests: ScrollableSharedTests.testCases
	});
});
