define([
	"intern!object",
	"intern/chai!assert",
	"../register",
	"../Widget"
], function (registerSuite, assert, register, Widget) {
	var container, html;
	/*jshint multistr: true */
	html = "<test-foo id='one' name='bob' attr1=10 attr2=10></test-foo> \
		<test-foo id='two' name='is' attr1=5 attr2=10></test-foo> \
		<div id='threeWrapper'> \
		<test-bar id='three' name='your' attr1=5 attr2=5> \
		<div id='three.one'> \
		<div id='three.one.one'></div> \
		<test-bar id='four' name='uncle' attr1=10 attr2=5></test-bar> \
		</div> \
		</test-bar> \
		</div> \
		<div id='not-a-widget'></div>";

		registerSuite({
		name: "dui/Widget-utility",
		setup: function () {
			container = document.createElement("div");
			document.body.appendChild(container);
			register("test-foo", [HTMLElement, Widget], {
				name: "",
				attr1: 0,
				attr2: 0
			});
			register("test-bar", [HTMLElement, Widget], {
				name: "",
				attr1: 0,
				attr2: 0
			});
			register("test-baz", [HTMLElement, Widget], {
				name: "",
				attr1: 1,
				attr2: 1
			});
			container.innerHTML = html;
			register.parse(container);
		},
		"getEnclosingWidget" : function () {
			assert.deepEqual(null, Widget.prototype.getEnclosingWidget(document.getElementById("not-a-widget")), "not-a-widget");
			assert.deepEqual("your", Widget.prototype.getEnclosingWidget(document.getElementById("three")).name, "three");
			assert.deepEqual("your", Widget.prototype.getEnclosingWidget(document.getElementById("three.one")).name, "three.one");
			assert.deepEqual("your", Widget.prototype.getEnclosingWidget(document.getElementById("three.one.one")).name, "three.one.one");
		},
		"findWidgets" : function () {
			assert.deepEqual(3, Widget.prototype.findWidgets(container).length);
			assert.deepEqual(1, Widget.prototype.findWidgets(document.getElementById("threeWrapper")).length);
		},
		teardown : function () {
			container.parentNode.removeChild(container);
		}
	});
});
