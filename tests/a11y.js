define([
	"intern!object",
	"intern/chai!assert",
	"../a11y",
	"dojo/sniff",
	"dojo/text!./resources/a11y.html"
], function (registerSuite, assert, a11y, has, html) {
	var container, html;
		registerSuite({
		name: "a11y",
		setup: function () {
			container = document.createElement("div");
			document.body.appendChild(container);
			container.innerHTML = html;
		},
		"isTabNavigable" : function () {
			assert.ok(a11y.isTabNavigable(document.getElementById("a-with-href")), "a-with-href");
			assert.ok(!a11y.isTabNavigable(document.getElementById("a-without-href")), "a-without-href");
			assert.ok(a11y.isTabNavigable(document.getElementById("area")), "area");
			assert.ok(a11y.isTabNavigable(document.getElementById("button")), "button");
			assert.ok(a11y.isTabNavigable(document.getElementById("input")), "input");
			assert.ok(a11y.isTabNavigable(document.getElementById("object")), "object");
			assert.ok(a11y.isTabNavigable(document.getElementById("select")), "select");
			assert.ok(a11y.isTabNavigable(document.getElementById("textarea")), "textarea");
			assert.ok(!a11y.isTabNavigable(document.getElementById("empty")), "empty");
			assert.ok(a11y.isTabNavigable(document.getElementById("zero-tabindex-div")), "zero-tabindex-div");
			assert.ok(!a11y.isTabNavigable(document.getElementById("no-tabindex-div")), "no-tabindex-div");
			assert.ok(!a11y.isTabNavigable(document.getElementById("iframe")), "iframe");
		},
		"findTabNullOnEmpty" : function () {
			assert.equal(null, a11y.getFirstInTabbingOrder("empty"));
			assert.equal(null, a11y.getLastInTabbingOrder("empty"));
		},
		"findTabElements" : function () {
			assert.equal(null, a11y.getFirstInTabbingOrder("div-container"));
			assert.equal(null, a11y.getFirstInTabbingOrder("a-without-href-container"));
			assert.deepEqual("a-with-href", a11y.getFirstInTabbingOrder("a-with-href-container").id);

			// in WebKit area elements are not in the tab order
			// and their display style property is "none";
			// therefore it is expected that this test will fail
			if (!has("webkit")) {
				assert.deepEqual("area", a11y.getFirstInTabbingOrder("area-map").id);
			}

			assert.deepEqual("button", a11y.getFirstInTabbingOrder("button-container").id);
			assert.deepEqual("input", a11y.getFirstInTabbingOrder("input-container").id);
			assert.deepEqual("object", a11y.getFirstInTabbingOrder("object-container").id);
			assert.deepEqual("select", a11y.getFirstInTabbingOrder("select-container").id);
			assert.deepEqual("textarea", a11y.getFirstInTabbingOrder("textarea-container").id);
			assert.equal(null, a11y.getLastInTabbingOrder("div-container"));
			assert.equal(null, a11y.getLastInTabbingOrder("a-without-href-container"));
			assert.deepEqual("a-with-href", a11y.getLastInTabbingOrder("a-with-href-container").id);

			// in WebKit area elements are not in the tab order
			// and their display style property is "none";
			// therefore it is expected that this test will fail
			if (!has("webkit")) {
				assert.deepEqual("area", a11y.getLastInTabbingOrder("area-map").id);
			}

			assert.deepEqual("button", a11y.getLastInTabbingOrder("button-container").id);
			assert.deepEqual("input", a11y.getLastInTabbingOrder("input-container").id);
			assert.deepEqual("object", a11y.getLastInTabbingOrder("object-container").id);
			assert.deepEqual("select", a11y.getLastInTabbingOrder("select-container").id);
			assert.deepEqual("textarea", a11y.getLastInTabbingOrder("textarea-container").id);
		},
		"findTabOnElementRatherThanString" : function () {
			assert.deepEqual("a-with-href", a11y.getFirstInTabbingOrder(document.getElementById("a-with-href-container")).id);
			assert.deepEqual("a-with-href", a11y.getLastInTabbingOrder(document.getElementById("a-with-href-container")).id);
		},
		"findTabSkipDisabled" : function () {
			assert.deepEqual("not-disabled-input", a11y.getFirstInTabbingOrder("skip-disabled").id);
			assert.deepEqual("not-disabled-input", a11y.getLastInTabbingOrder("skip-disabled").id);
		},
		"findTabZeroTabindex" : function () {
			assert.deepEqual("zero-tabindex-div", a11y.getFirstInTabbingOrder("zero-tabindex-div-container").id);
			assert.deepEqual("zero-tabindex-input", a11y.getFirstInTabbingOrder("zero-tabindex-input-container").id);
			assert.deepEqual("zero-tabindex-div", a11y.getLastInTabbingOrder("zero-tabindex-div-container").id);
			assert.deepEqual("zero-tabindex-input", a11y.getLastInTabbingOrder("zero-tabindex-input-container").id);
		},
		"findTabPositiveTabindex" : function () {
			assert.deepEqual("positive-tabindex-input1a", a11y.getFirstInTabbingOrder("positive-tabindex-mixed-with-no-tabindex").id);
			assert.deepEqual("positive-tabindex-input3a", a11y.getFirstInTabbingOrder("positive-tabindex").id);
			assert.deepEqual("no-tabindex-input2", a11y.getLastInTabbingOrder("positive-tabindex-mixed-with-no-tabindex").id);
			assert.deepEqual("positive-tabindex-input4b", a11y.getLastInTabbingOrder("positive-tabindex").id);
		},
		"findTabSkipMinusOneTabindex" : function () {
			assert.deepEqual("not-minus-one-input", a11y.getFirstInTabbingOrder("skip-minus-one").id);
			assert.deepEqual("not-minus-one-input", a11y.getLastInTabbingOrder("skip-minus-one").id);
		},
		"findTabDescend" : function () {
			assert.deepEqual("child-input1", a11y.getFirstInTabbingOrder("descend").id);
			assert.deepEqual("child-input2", a11y.getLastInTabbingOrder("descend").id);
		},
		"findTabOuterInner" : function () {
			assert.deepEqual("outer1", a11y.getFirstInTabbingOrder("outer-inner-container").id);
			assert.deepEqual("inner2", a11y.getLastInTabbingOrder("outer-inner-container").id);
		},

		"skipNotShown" : function () {
			assert.equal(null, a11y.getFirstInTabbingOrder("hidden-element-container"));
			assert.equal(null, a11y.getFirstInTabbingOrder("hidden-container-tabindex-zero"));
			assert.equal(null, a11y.getFirstInTabbingOrder("hidden-container-no-tabindex"));
			assert.equal(null, a11y.getFirstInTabbingOrder("container-with-hidden-containers"));

			assert.equal(null, a11y.getFirstInTabbingOrder("display-none-element-container"));
			assert.equal(null, a11y.getFirstInTabbingOrder("display-none-container-tabindex-zero"));
			assert.equal(null, a11y.getFirstInTabbingOrder("display-none-container-no-tabindex"));
			assert.equal(null, a11y.getFirstInTabbingOrder("container-with-display-none-containers"));
		},
		"multiDigitTabIndex" : function () {
			assert.deepEqual("one", a11y.getFirstInTabbingOrder("multiDigitTabIndex").name, "first");
			assert.deepEqual("eleven", a11y.getLastInTabbingOrder("multiDigitTabIndex").name, "last");
		},
		teardown : function () {
			container.parentNode.removeChild(container);
		}
	});
});
