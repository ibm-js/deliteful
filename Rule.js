define([
	"dojo/_base/lang",
	"dojo/has",
	"dojo/query",
	"dojo/dom-construct",
	"dojo/dom-style",
	"dojo/dom-class",
	"./register",
	"./Widget",
	"./themes/load!common,Rule"
], function (lang, has, query, domConstruct, domStyle, domClass, register, Widget) {

	function toCSS(baseClass, modifier) {
		return baseClass.split(" ").map(function (c) {
			return c + modifier;
		}).join(" ");
	}

	// module:
	//		dui/Rule

	var duiRule = register("d-rule", [HTMLElement, Widget], {
		// summary:
		//		Creates and lays out evenly spaced nodes useful for axis or Slider decorations (e.g. hash marks and labels).

		// baseClass: [const] String
		//		The name of the CSS class of this widget.
		baseClass: "duiRule",

		// count: [const] Integer
		//		Number of nodes to generate.
		//		-1 indicates count should be computed from the available labels.
		count: -1,

		// labels: [const] String[]?
		//		Array of text labels from which to populate the rendered nodes, evenly spaced from left-to-right or bottom-to-top.
		//		If labels.length < count, then the labels are repeated beginning with index 0.
		labels: [],

		// orientation: [const] String
		//		The direction of the nodes relative to parent container.
		//		- "H": horizontal
		//		- "V": vertical
		//		The value can inherit from a Slider parent widget during startup().
		orientation: "H",

		preCreate: function () {
			this.labels = [];
		},

		_parentInit: function (/*Boolean*/ reversed, /*String*/ orientation) {
			// summary:
			//		Hook so that a parent widget like Slider can pass inherited values down to children decoration widgets.
			// tags:
			//		private
			this.orientation = orientation;
			var children = query("> div", this);
			if (this.labels.length == 0) {
				this.labels = children.map(function (node) {
					return String(node.innerHTML);
				});
			}
			if (this.count < 0) {
				this.count = this.labels.length || 1;
			}
			for (var i = 0; i < this.count; i++) {
				var node;
				if (i < children.length) {
					node = children[i];
				} else {
					node = domConstruct.create("div", {}, this, "last");
				}
				var css = toCSS(this.baseClass, "Label");
				domClass.add(node, css);
			}
			if (this.labels.length == 0) {
				this.labels.push({ H: "\u007c", V: "\u2014" }[this.orientation]);
			}
			while (this.labels.length < this.count) {
				this.labels = this.labels.concat(this.labels);
			}
			if (reversed) {
				this.labels.reverse();
			}
		},

		_setLabelDirection: function (node) {
		},

		startup: function () {
			if (this.labels.length < this.count) {
				this._parentInit(false, this.orientation);
			}
			var pos = 0;
			if (this.count == 1) {
				pos = 50;
			}
			var css = toCSS(this.baseClass, this.orientation);
			domClass.add(this, css);
			var css = toCSS(this.baseClass, "Label" + this.orientation);
			var children = query("> div", this);
			for (var i = 0; i < this.count; i++) {
				var node = children[i];
				domClass.add(node, css);
				node.innerHTML = this.labels[i];
				this._setLabelDirection(node);
				domStyle.set(node, { H: "left", V: "top" }[this.orientation], pos + "%");
				pos = 100 / ((this.count - 1) / (i + 1));
			}
		}
	});

	if (has("dojo-bidi")) {

		duiRule.prototype._setTextDirAttr = function (textDir) {
			if (this.textDir != textDir) {
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
