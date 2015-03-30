define([
	"intern!object",
	"intern/chai!assert",
	"deliteful/ResponsiveColumns"
], function (registerSuite, assert, ResponsiveColumns) {
	var container;

	function testLayout(element, targetSize) {
		var elementStyle = function (key) {
			if (key === "flex") {
				var flexAttrs = ["-webkit-box-flex", "-moz-box-flex", "-webkit-flex", "-ms-flex", "flex"];
				for (var i = 0; i < flexAttrs.length; i++) {
					var v = window.getComputedStyle(this.node).getPropertyValue(flexAttrs[i]);
					if (v) {
						return v.charAt(0);
					}
				}
				return "0";
			}

			return window.getComputedStyle(this.node).getPropertyValue(key);
		}.bind({node: element});
		if (targetSize === "hidden") {
			assert.strictEqual(elementStyle("display"), "none");
		} else if (targetSize === "fill") {
			assert.strictEqual(elementStyle("flex"), "1");
			assert.notStrictEqual(elementStyle("display"), "none");
		} else if (targetSize.indexOf("px") !== -1) {
			assert.strictEqual(elementStyle("width"), targetSize);
			assert.notStrictEqual(elementStyle("flex"), "1");
			assert.notStrictEqual(elementStyle("display"), "none");
		} else if (targetSize.indexOf("%") !== -1) {
			var w = parseInt(elementStyle("width").replace("px", ""), 10);
			targetSize = parseInt(targetSize.replace("%", ""), 10);
			var testSize = Math.abs(w - (window.innerWidth * targetSize / 100));
			assert.isTrue(testSize < 3, // 3px tolerance
				"Wrong percent size testSize=" + testSize + " targetSize=" + targetSize +
					" window.innerWidth=" + window.innerWidth + " w=" + w);
			assert.notStrictEqual(elementStyle("flex"), "1");
			assert.notStrictEqual(elementStyle("display"), "none");
		}
	}

	registerSuite({
		name: "ResponsiveColumns",
		setup: function () {
			var nospace = document.createElement("style");
			nospace.innerHTML = "*{padding: 0; margin: 0}";
			window.document.body.appendChild(nospace);

			container = new ResponsiveColumns();

			window.document.body.appendChild(container);
			container.breakpoints = "{'small': '500px', 'medium': '900px', 'large': ''}";
			var child = document.createElement("div");
			child.setAttribute("layout", "{'small': '100%', 'medium': '200px', 'large': '10%'}");
			child.innerHTML = "Child 1";
			container.addChild(child);
			child = document.createElement("div");
			child.setAttribute("layout", "{'small': 'hidden', 'medium': 'fill', 'large': '30%'}");
			child.innerHTML = "Child 2";
			container.addChild(child);
			child = document.createElement("div");
			child.innerHTML = "Child 3";
			child.setAttribute("layout", "{'small': 'hidden', 'medium': 'hidden', 'large': '60%'}");
			container.addChild(child);
			container.attachedCallback();
		},

		"Media Query Test": function () {
			var iw = window.innerWidth;
			var targetClass, w1, w2, w3;
			if (iw < 500) {
				targetClass = "small";
				w1 = "100%";
				w2 = "hidden";
				w3 = "hidden";
			} else if (iw < 900) {
				targetClass = "medium";
				w1 = "200px";
				w2 = "fill";
				w3 = "hidden";
			} else {
				targetClass = "large";
				w1 = "10%";
				w2 = "30%";
				w3 = "60%";
			}

			assert.strictEqual(container.screenClass, targetClass);
			var children = container.getChildren();
			testLayout(children[0], w1);
			testLayout(children[1], w2);
			testLayout(children[2], w3);
		},

		teardown: function () {
			document.body.removeChild(container);
		}
	});
});
