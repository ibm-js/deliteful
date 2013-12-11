define([
	"dojo/_base/lang",
	"dojo/has",
	"dojo/query",
	"dojo/dom-construct",
	"dojo/dom-style",
	"dojo/dom-class",
	"./register",
	"./Widget",
	"./Invalidating",
	"./themes/load!./themes/{{theme}}/common,./themes/{{theme}}/Rule"
], function (lang, has, query, domConstruct, domStyle, domClass, register, Widget, Invalidating) {

	function toCSS(baseClass, modifier) {
		return baseClass.split(" ").map(function (c) {
			return c + modifier;
		}).join(" ");
	}

	// module:
	//		dui/Rule

	var duiRule = register("d-rule", [HTMLElement, Widget, Invalidating], {
		// summary:
		//		Creates and lays out evenly spaced nodes useful for axis or Slider decorations (e.g. hash marks and labels).

		// baseClass: [const] String
		//		The name of the CSS class of this widget.
		baseClass: "duiRule",

		// count: [const] Integer
		//		Number of nodes to display.
		//		By default, count should be computed from the labels array length.
		count: NaN,

		// labels: [const] String[]?
		//		Array of text labels from which to populate the rendered nodes, evenly spaced from left-to-right or bottom-to-top.
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
			this.labels = lang.clone(this.labels);
			this.addInvalidatingProperties(
				"labels",
				"count",
				"reverse",
				"vertical"
			);
		},

		buildRendering: register.after(function () {
			var children = query("> div", this);
			if (this.labels.length == 0 && children.length > 0) {
				this.labels = children.map(function (node) {
					return String(node.innerHTML);
				});
			}
		}),

		refreshRendering: function (props) {
			// summary:
			//		Slider passes inherited values vertical and flip down to child decoration widgets.
			// tags:
			//		private
			var children = query("> div", this);
			var count = isNaN(this.count) ? this.labels.length : this.count;
			if (props.count || props.labels) {
				for (var i = 0; i < count; i++) {
					var node;
					if (i < children.length) {
						node = children[i];
					} else {
						node = domConstruct.create("div", {}, this, "last");
					}
					var css = toCSS(this.baseClass, "Label");
					domClass.add(node, css);
				}
			}
			if (props.reverse) {
				if (this.reverse) {
					this.labels.reverse();
				}
			}
			if (props.vertical) {
				if (count > 0) {
					var pos = 0;
					if (count === 1) {
						pos = 50;
					}
					var css = toCSS(this.baseClass, this.vertical ? "V" : "H");
					domClass.add(this, css);
					var css = toCSS(this.baseClass, "Label" + (this.vertical ? "V" : "H"));
					var children = query("> div", this);
					for (var i = 0; i < count; i++) {
						var node = children[i];
						domClass.add(node, css);
						var label = this.labels.length > 0 ? this.labels[i % this.labels.length] : (this.vertical ? "\u2014" : "\u007c");
						node.innerHTML = label;
						this._setLabelDirection(node);
						domStyle.set(node, this.vertical ? "top" : "left", pos + "%");
						pos = 100 / ((count - 1) / (i + 1));
					}
				}
			}
		},

		_setLabelDirection: function (node) {
		}
	});

	if (has("dojo-bidi")) {

		duiRule.prototype._setTextDirAttr = function (textDir) {
			if (this.textDir !== textDir) {
				this._set("textDir", textDir);
				query(".duiRuleLabel", this).forEach(
					lang.hitch(this, function (labelNode) {
						this._setLabelDirection(labelNode);
					})
				);
			}
		};

		duiRule.prototype._setLabelDirection = function (labelNode) {
			domStyle.set(labelNode, "direction", this.textDir ? this.getTextDir(labelNode.innerText || labelNode.textContent || "") : "");
		};
	}

	return duiRule;
});
