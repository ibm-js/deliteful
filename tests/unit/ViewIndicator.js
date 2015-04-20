define([
	"intern!object",
	"intern/chai!assert",
	"requirejs-dplugins/jquery!attributes/classes",
	"delite/register",
	"deliteful/SwapView",
	"deliteful/ViewIndicator"
], function (registerSuite, assert, $, register) {
	var container, vs;
	var aaa, bbb, ccc, ddd;
	var vi;
	var asyncHandler;
	var htmlContent = "<d-swap-view id='vs'><div id='aaa'>AAA</div><div id='bbb'>BBB</div><div id='ccc'>CCC</div>" +
		"<div id='ddd'>DDD</div></d-swap-view><d-view-indicator id='vi' viewstack='vs'></d-view-indicator>";

	function checkNodeVisibility(vs, target) {
		for (var i = 0; i < vs.children.length; i++) {
			assert.isTrue(
				((vs.children[i] === target && vs.children[i].style.display !== "none" &&
					vs.selectedChildId === target.id)) ||
					(vs.children[i] !== target && vs.children[i].style.display === "none"),
			"ViewStack child visibility");
		}
	}
	
	function checkSelectedDot(vi, index) {
		for (var i = 0; i < vi.children.length; i++) {
			assert.isTrue($(vi.children[i]).hasClass("-d-view-indicator-dot"), "d-view-indicator-dot class");
			assert[i === index ? "isTrue" : "isFalse"]($(vi.children[i]).hasClass("-d-view-indicator-dot-selected"),
				"-d-view-indicator-dot-selected class");
		}
	}
	
	registerSuite({
		name: "ViewIndicator Markup",
		setup: function () {
			container = document.createElement("div");
			document.body.appendChild(container);
			container.innerHTML = htmlContent;
			register.deliver();
			vs = document.getElementById("vs");
			aaa = document.getElementById("aaa");
			bbb = document.getElementById("bbb");
			ccc = document.getElementById("ccc");
			ddd = document.getElementById("ddd");
			vi = document.getElementById("vi");
		},
		"Default CSS" : function () {
			assert.isTrue($(vi).hasClass("d-view-indicator"), "d-view-indicator class");
			assert.equal(vi.children.length, 4, "number of children in ViewIndicator");
			checkSelectedDot(vi, 0);
		},
		"Default values" : function () {
			assert.deepEqual(vi.viewStack, vs);
		},
		"Update indicator (show by widget)" : function () {
			var d = this.async(1000);
			asyncHandler = vs.on("delite-after-show", d.callback(function () {
				checkNodeVisibility(vs, bbb);
				checkSelectedDot(vi, 1);
			}));
			vs.show(bbb);
		},
		"Update indicator (show by id)" : function () {
			var d = this.async(1000);
			asyncHandler = vs.on("delite-after-show", d.callback(function () {
				checkNodeVisibility(vs, ccc);
				checkSelectedDot(vi, 2);
			}));
			vs.show("ccc");
		},

		teardown: function () {
			container.parentNode.removeChild(container);
		},
		afterEach: function () {
			if (asyncHandler) {
				asyncHandler.remove();
			}
		}
	});
});
