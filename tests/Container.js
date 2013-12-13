define([
	"intern!object",
	"intern/chai!assert",
	"../a11y",
	"../focus",
	"../register",
	"../Widget",
	"../Container",
	"../Contained",
], function (registerSuite, assert, a11y, focus, register, Widget, Container, Contained) {
	var container, PlainWidget, TestContainer, TestContained, html, zero, two, four;
	/*jshint multistr: true */
	html = "<label for='input'>before:</label><input id='input'/> \
		<test-container id='container'> \
			<!-- comment just to make sure that numbering isn't thrown off --> \
			<test-contained id='zero'></test-contained> \
			<test-contained id='one'></test-contained> \
			<test-contained id='two'></test-contained> \
			<plain-widget id='three'></plain-widget> \
			<!-- at least for now it needs to have a widget ID to be returned by getChildren() --> \
			<div id='four' widgetId='four'></div> \
		</test-container> \
		<plain-widget id='outside'></plain-widget> \
		<test-contained id='outsideCont'></test-contained>";

	registerSuite({
		name: "dui/Container",
		setup: function () {
			container = document.createElement("div");
			document.body.appendChild(container);
			container.innerHTML = html;
			PlainWidget = register("plain-widget", [HTMLElement, Widget], {});
			TestContainer = register("test-container", [HTMLElement, Widget, Container], {});
			TestContained = register("test-contained", [HTMLElement, Widget, Contained], {});
		},
		"parse" : function () {
			register.parse(container);
		},
		"basic tests getChildren" : function () {
			var c = document.getElementById("container");
			var children = c.getChildren();
			assert.deepEqual(5, children.length);
			assert.deepEqual("zero", children[0].id);
			assert.deepEqual("one", children[1].id);
			assert.deepEqual("two", children[2].id);
			assert.deepEqual("three", children[3].id);
			assert.deepEqual("four", children[4].id);
		},
		"basic tests getIndexOfChild" : function () {
			var c = document.getElementById("container");
			assert.deepEqual(0, c.getIndexOfChild(document.getElementById("zero")), "zero test");
			assert.deepEqual(1, c.getIndexOfChild(document.getElementById("one")), "one test");
			assert.deepEqual(2, c.getIndexOfChild(document.getElementById("two")), "two test");
			assert.deepEqual(3, c.getIndexOfChild(document.getElementById("three")), "threetest");
			assert.deepEqual(4, c.getIndexOfChild(document.getElementById("four")), "four test");
			assert.deepEqual(-1, c.getIndexOfChild(document.getElementById("outside")), "outside test");
			assert.deepEqual(-1, c.getIndexOfChild(document.getElementById("outsideCont")), "outsideCont test");

		},
		"basic tests getIndexInParent" : function () {
			assert.deepEqual(0, document.getElementById("zero").getIndexInParent(), "zero test");
			assert.deepEqual(1, document.getElementById("one").getIndexInParent(), "one test");
			assert.deepEqual(2, document.getElementById("two").getIndexInParent(), "two test");
			assert.deepEqual(-1, document.getElementById("outsideCont").getIndexInParent(), "- one test");
		},
		"basic tests removeChild" : function () {
			var c = document.getElementById("container");
			var children = c.getChildren();
			assert.deepEqual(5, children.length);
			zero = document.getElementById("zero");
			c.removeChild(zero);
			two = document.getElementById("two");
			c.removeChild(1); // should remove "two" - because zero is already removed
			four = document.getElementById("four");
			c.removeChild(four);
			children = c.getChildren();
			assert.deepEqual(2, children.length);
			assert.deepEqual("one", children[0].id);
			assert.deepEqual("three", children[1].id);
		},
		"basic tests addChild" : function () {
			var c = document.getElementById("container");
			// Add child at beginning
			c.addChild(zero, 0);
			var children = c.getChildren();
			assert.deepEqual(3, children.length);
			assert.deepEqual("zero", children[0].id, "after addChild(zero), zero");
			assert.deepEqual("one", children[1].id, "after addChild(zero), one");
			assert.deepEqual("three", children[2].id, "after addChild(zero), three");

			// Add child in middle
			c.addChild(two, 2);
			children = c.getChildren();
			assert.deepEqual(4, children.length);
			assert.deepEqual("zero", children[0].id, "after addChild(two), zero");
			assert.deepEqual("one", children[1].id, "after addChild(two), one");
			assert.deepEqual("two", children[2].id, "after addChild(two), two");
			assert.deepEqual("three", children[3].id, "after addChild(two), three");

			// Add a DOMNode at the end
			c.addChild(four);
			children = c.getChildren();
			assert.deepEqual(5, children.length);
			assert.deepEqual("zero", children[0].id, "after addChild(four), zero");
			assert.deepEqual("one", children[1].id, "after addChild(four), one");
			assert.deepEqual("two", children[2].id, "after addChild(four), two");
			assert.deepEqual("three", children[3].id, "after addChild(four), three");
			assert.deepEqual("four", children[4].id, "after addChild(four), four");

			// Add child at end
			c.addChild(new TestContained({id: "five"}));
			children = c.getChildren();
			assert.deepEqual(6, children.length);
			assert.deepEqual("zero", children[0].id, "after addChild(five), zero");
			assert.deepEqual("one", children[1].id, "after addChild(five), one");
			assert.deepEqual("two", children[2].id, "after addChild(five), two");
			assert.deepEqual("three", children[3].id, "after addChild(five), three");
			assert.deepEqual("four", children[4].id, "after addChild(five), four");
			assert.deepEqual("five", children[5].id, "after addChild(five), five");

			// Add child at end with explicit position specified
			c.addChild(new TestContained({id: "six"}), 6);
			children = c.getChildren();
			assert.deepEqual(7, children.length);
			assert.deepEqual("zero", children[0].id, "after addChild(six), zero");
			assert.deepEqual("one", children[1].id, "after addChild(six), one");
			assert.deepEqual("two", children[2].id, "after addChild(six), two");
			assert.deepEqual("three", children[3].id, "after addChild(six), three");
			assert.deepEqual("four", children[4].id, "after addChild(six), four");
			assert.deepEqual("five", children[5].id, "after addChild(six), five");
			assert.deepEqual("six", children[6].id, "after addChild(six), five");
		},
		teardown: function () {
			container.parentNode.removeChild(container);
		}
	});
});
