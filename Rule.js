define([
	"requirejs-dplugins/has",
	"dojo/dom-class",
	"delite/register",
	"delite/Widget",
	"delite/theme!./Rule/css/Rule.css"
], function (has, domClass, register, Widget) {

	function toCSS(baseClass, modifier) {
		return baseClass.split(" ").map(function (c) {
			return c + modifier;
		}).join(" ");
	}

	// module:
	//		deliteful/Rule

	var dRule = register("d-rule", [HTMLElement, Widget], {
		// summary:
		//		Creates and lays out evenly spaced nodes useful for axis or Slider decorations
		//		(e.g. hash marks and labels).

		// baseClass: [const] String
		//		The name of the CSS class of this widget.
		baseClass: "d-rule",

		// count: [const] Integer
		//		Number of nodes to display.
		//		By default, count should be computed from the labels array length.
		count: NaN,

		// labels: [const] String[]?
		//		Array of text labels from which to populate the rendered nodes, evenly spaced from left-to-right or
		//		bottom-to-top.
		//		If labels.length < count, then the labels are repeated beginning with index 0.
		labels: [],

		// vertical: [const] Boolean
		//		The direction of the nodes relative to parent container.
		//		- false: horizontal
		//		- true: vertical
		//		The value can inherit from a Slider parent widget.
		vertical: false,

		// reverse: [const] Boolean
		//		Specifies if the labels array should be reversed.
		//		The value can inherit from a Slider parent widget.
		reverse: false,

		preCreate: function () {
			this.labels = this.labels && this.labels.slice();
		},

		buildRendering: register.after(function () {
			if (this.labels.length === 0) {
				var nodeList = this.querySelectorAll("div");
				for (var i = 0; i < nodeList.length; ++i) {
					this.labels.push(String(nodeList[i].innerHTML));
				}
				this.notifyCurrentValue("labels");
			}
		}),

		/*jshint maxcomplexity: 15*/
		refreshRendering: function (props) {
			// summary:
			//		Slider passes inherited values vertical and flip down to child decoration widgets.
			// tags:
			//		private
			var children = this.querySelectorAll("div"), css, node, i;
			var count = isNaN(this.count) ? this.labels.length : this.count;
			if ("count" in props || "labels" in props) {
				for (i = 0; i < count; i++) {
					if (i < children.length) {
						node = children[i];
					} else {
						node = this.ownerDocument.createElement("div");
						this.placeAt(node, "last");
					}
					css = toCSS(this.baseClass, "-label");
					domClass.add(node, css);
				}
			}
			if ("reverse" in props && this.reverse) {
				this.labels.reverse();
			}
			if ("vertical" in props && count > 0) {
				var pos = 0, label;
				if (count === 1) {
					pos = 50;
				}
				css = toCSS(this.baseClass, this.vertical ? "-v" : "-h");
				domClass.add(this, css);
				css = toCSS(this.baseClass, "-label" + (this.vertical ? "-v" : "-h"));
				children = this.querySelectorAll("div");
				for (i = 0; i < count; i++) {
					node = children[i];
					domClass.add(node, css);
					label = this.labels.length > 0 ? this.labels[i % this.labels.length] :
						(this.vertical ? "\u2014" : "\u007c");
					node.innerHTML = label;
					this._setLabelDirection(node);
					node.style[this.vertical ? "top" : "left"] = pos + "%";
					pos = 100 / ((count - 1) / (i + 1));
				}
			}
		},

		_setLabelDirection: function (/*jshint unused: vars*/node) {
		}
	});

	if (has("bidi")) {

		dRule.prototype._setTextDirAttr = function (textDir) {
			if (this.textDir !== textDir) {
				this._set("textDir", textDir);
				var nodeList = this.querySelectorAll(".d-rule-label");
				for (var i = 0; i < nodeList.length; ++i) {
					this._setLabelDirection(nodeList[i]);
				}
			}
		};

		dRule.prototype._setLabelDirection = function (labelNode) {
			labelNode.style.direction = this.textDir ?
				this.getTextDir(labelNode.innerText || labelNode.textContent || "") : "";
		};
	}

	return dRule;
});
