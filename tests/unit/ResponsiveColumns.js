define([
	"intern!object",
	"intern/chai!assert",
	"deliteful/ResponsiveColumns"
], function (registerSuite, assert, ResponsiveColumns) {
	var container;

	function testLayout(element, origTargetSize, tolerance, targetClass) {
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
		if (origTargetSize === "hidden") {
			assert.strictEqual(elementStyle("display"), "none");
		} else if (origTargetSize === "fill") {
			assert.strictEqual(elementStyle("flex"), "1");
			assert.notStrictEqual(elementStyle("display"), "none");
		} else if (origTargetSize.indexOf("px") !== -1) {
			assert.strictEqual(elementStyle("width"), origTargetSize);
			assert.notStrictEqual(elementStyle("flex"), "1");
			assert.notStrictEqual(elementStyle("display"), "none");
		} else if (origTargetSize.indexOf("%") !== -1) {
			var w = parseInt(elementStyle("width").replace("px", ""), 10);
			var targetSize = parseInt(origTargetSize.replace("%", ""), 10);
			var testSize = Math.abs(w - (window.innerWidth * targetSize / 100));
			console.log("TestSize=[" + testSize + "] targetClass=[" + targetClass + "] origTargetSize=[" +
				origTargetSize + "] targetSize=[" + targetSize + "] window.innerWidth=[" + window.innerWidth + "] w=" +
				w);

			assert.notStrictEqual(elementStyle("flex"), "1");
			assert.notStrictEqual(elementStyle("display"), "none");
			assert.isTrue(testSize < tolerance, // pass in the tolerance
				"Wrong percent size testSize=[" + testSize + "] targetClass=[" + targetClass + "] origTargetSize=" +
					origTargetSize + " targetSize=" + targetSize + " window.innerWidth=" + window.innerWidth + " w=" +
					w);
		}
	}

	registerSuite({
		name: "ResponsiveColumns",
		setup: function () {
			var nospace = document.createElement("style");
			nospace.innerHTML = "*{padding: 0; margin: 0}";
			window.document.body.appendChild(nospace);

			//container = new ResponsiveColumns();
			container = new ResponsiveColumns({"breakpoints" : "{'small': '500px', 'medium': '900px', 'large': ''}"});

			//container.breakpoints = "{'small': '500px', 'medium': '900px', 'large': ''}";
			var child = document.createElement("div");
			child.setAttribute("layout", "{'small': '100%', 'medium': '200px', 'large': '10%'}");
			child.innerHTML = "Child 1";
			child.style["background-color"] = "red";
			container.addChild(child);
			child = document.createElement("div");
			child.setAttribute("layout", "{'small': 'hidden', 'medium': 'fill', 'large': '30%'}");
			child.innerHTML = "Child 2";
			child.style["background-color"] = "green";
			container.addChild(child);
			child = document.createElement("div");
			child.innerHTML = "Child 3";
			child.style["background-color"] = "blue";
			child.setAttribute("layout", "{'small': 'hidden', 'medium': 'hidden', 'large': '60%'}");
			container.addChild(child);
			//window.document.body.appendChild(container);
			container.placeAt(window.document.body);
		},

		"Media Query Test 1": function () {
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
			console.log("targetClass =" + targetClass + " w1=" + w1 + " w2=" + w2 + " w3=" + w3);
			assert.strictEqual(container.screenClass, targetClass);
			var children = container.getChildren();
			testLayout(children[0], w1, 3, targetClass);
		},
		"Media Query Test 2": function () {
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
			console.log("targetClass =" + targetClass + " w1=" + w1 + " w2=" + w2 + " w3=" + w3);
			assert.strictEqual(container.screenClass, targetClass);
			var children = container.getChildren();
			testLayout(children[1], w2, 7, targetClass);
		},
		"Media Query Test 3": function () {
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
			console.log("targetClass =" + targetClass + " w1=" + w1 + " w2=" + w2 + " w3=" + w3);
			assert.strictEqual(container.screenClass, targetClass);
			var children = container.getChildren();
			testLayout(children[2], w3, 12, targetClass);
		},

		teardown: function () {
			document.body.removeChild(container);
		}
	});
});
