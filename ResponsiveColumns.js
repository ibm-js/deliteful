/** @module deliteful/ResponsiveColumns */
define([
	"requirejs-dplugins/jquery!attributes/classes",
	"delite/register",
	"delite/DisplayContainer",
	"./channelBreakpoints",
	"delite/theme!./ResponsiveColumns/themes/{{theme}}/ResponsiveColumns.css"
], function ($, register, DisplayContainer, channelBreakpoints) {
	/**
	 * A container that lays out its children according to the screen width. This widget relies on CSS media queries
	 * (http://www.w3.org/TR/css3-mediaqueries). You can define any number of screen classes by setting the breakpoints
	 * attribute. Then you must then set the layout attribute on each child to configure a width for each screen class.
	 * The following example defines two screen classes: "phone" and "other" with a breakpoint at 500px. If the "phone"
	 * class is active, the first child width is 100% and the second child is hidden. If the screen is larger than 500px
	 * then the first child width is 20% and the second one fill the remaining space.
	 * @example
	 * <d-responsive-columns breakpoints="{phone: '500px', other: ''}">
	 *     <div layout="{phone: '100%', other: '20%'}">...</div>
	 *     <div layout="{phone: 'hidden', other: 'fill'}">...</div>
	 * </d-responsive-columns>
	 *
	 * When the screen width changes and a new screen class is applied by the container, a "change" event is emitted
	 * with two specific properties: `screenClass` (the new screen class) and `mediaQueryList`
	 * (the MediaQueryList instance at the origin of the change).
	 *
	 * @class module:deliteful/ResponsiveColumns
	 * @augments module:delite/DisplayContainer
	 */
	return register("d-responsive-columns", [HTMLElement, DisplayContainer],
		{
			baseClass: "d-responsive-columns",

			/**
			 * A string containing underlying media queries breakpoints definition. Each breakpoint is made of a
			 * name (which defines the screen size class) and an upper bound in pixels.
			 * The upper bound can be a string like "200px", an empty string or a number. The last breakpoint
			 * which defines the largest screen class is usually set to an empty string to match any size larger
			 * than the penultimate breakpoint bound. This property is parsed internally by `JSON.parse()`.
			 * To facilitate writing markup you can use single quotes when defining this property, single quotes
			 * will be replaced by double quotes before interpreted by `JSON.parse`.
			 *
			 * The default value of `breakpoints` uses three breakpoints: `small`, `medium`, and `large`.
			 * The value of `large` is an empty string. The default values of the breakpoints `small`
			 * and `medium` are determined by the values of properties `smallScreen"` and `"mediumScreen"`
			 * of `deliteful/channelBreakpoints`, and can be configured statically using `require.config()`.
			 * For details, see the documentation of `deliteful/channelBreakpoints`.
			 * @member {string}
			 * @default "{'small': '480px', 'medium': '1024px', 'large': ''}"
			 */
			breakpoints: "{'small': '" + channelBreakpoints.smallScreen +
				"', 'medium': '" + channelBreakpoints.mediumScreen +
				"', 'large': ''}",

			/**
			 * The current screen class currently applied by the container.
			 * It depends on the value of breakpoints attribute and current screen width. This attribute is read-only.
			 * When this attribute is modified, a "change" event is emitted which contains the new `screenClass` value.
			 * @readonly
			 * @member {string}
			 */
			screenClass: "",

			preRender: function () {
				this._breakpoints = {};
				this._layouts = [];
				// A set of MediaQueryList
				this._mqls = [];
				// Unique class for this widget
				$(this).addClass(this.widgetId);
			},

			_removeListeners: function () {
				for (var i = 0; i < this._mqls.length; i++) {
					this._mqls[i].mql.removeListener(this._mqls[i].listener);
				}
				this._mqls = [];
			},

			_checkConfiguration: function () {
				var result = true;
				for (var sc in this._breakpoints) {
					for (var i = 0; i < this._layouts.length; i++) {
						if (!this._layouts[i][sc]) {
							result = false;
							console.error("SyntaxError - Warning: ResponsiveColumns, the 'layout' attribute " +
								"of the child at index " + i + " must define a value for the key '" + sc + "'.");
						}
					}
				}
				return result;
			},

			_parseJSONAttrs: function () {
				var result = true;
				this._breakpoints = {};
				this._layouts = [];
				this._breakpoints = JSON.parse(this.breakpoints.replace(/\'/g, "\""));

				var children = this.getChildren();
				var layout;
				for (var i = 0; i < children.length; i++) {
					layout = children[i].getAttribute("layout");
					if (!layout) {
						result = false;
						console.error("SyntaxError - Warning: ResponsiveColumns child at index " + i +
							", 'layout' is not defined.");
					} else {
						layout = JSON.parse(layout.replace(/\'/g, "\""));
					}
					if (!layout) {
						result = false;
						console.error("SyntaxError - Warning: ResponsiveColumns child at index " + i +
							", 'layout' parsing failed.");
					} else {
						this._layouts.push(layout);
					}
				}
				return result;
			},

			_genCSS: function () {
				this._removeListeners();
				var thresholds = [0];
				var sizeClasses = [];
				var thr, i;
				for (var t in this._breakpoints) {
					sizeClasses.push(t);
					thr = parseInt(this._breakpoints[t].replace(/px/g, ""), 10);
					if (thr) {
						thresholds.push(thr);
					}
				}

				var children = this.getChildren();
				var content = "";
				var mqHeader = "";
				var val;
				var mediaPart = "@media screen and ";
				var minPart = "(min-width: A)";
				var maxPart = " and (max-width: B)";
				var mql;
				var listener;
				// Generates media queries blocks with columns layout definition inside
				for (i = 0; i < thresholds.length; i++) {
					mqHeader = minPart.replace("A", (thresholds[i] + 1) + "px");
					if (thresholds[i + 1]) {
						mqHeader += maxPart.replace("B", (thresholds[i + 1]) + "px");
					} else {
						// No upper bounds
						mqHeader = mqHeader.replace(" and (max-width: B)", "");
					}
					content += mediaPart + mqHeader + "{";
					for (var j = 0; j < children.length; j++) {
						content += "." + this.widgetId + " > *:nth-child(" + (j + 1) + "){";
						val = this._layouts[j][sizeClasses[i]];
						if (val === "hidden") {
							content += "display: none;";
						} else if (val === "fill") {
							content += "-webkit-box-flex: 1;";
							content += "-moz-box-flex: 1;";
							content += "-webkit-flex: 1;";
							content += "-ms-flex: 1;";
							content += "flex: 1;";
						} else {
							content += "width: " + val + ";";
						}
						content += "}";
					}
					content += "}";

					// Listen for breakpoint triggers
					mql = window.matchMedia(mqHeader);
					listener = function (a) {
						if (a.matches) {
							this.target.screenClass = this.class;
							this.target.emit("change", {screenClass: this.class, mediaQueryList: mql});
						}
					}.bind({class: sizeClasses[i], mql: mql, target: this});
					mql.addListener(listener);
					this._mqls.push({mql: mql, listener: listener});
					// Initialization of screenClass
					if (mql.matches) {
						this.screenClass = sizeClasses[i];
					}
				}
				var styleBlockId = "d-responsive-columns-generated-style-" + this.widgetId;
				var styleBlock = this.ownerDocument.getElementById(styleBlockId);
				if (!styleBlock) {
					styleBlock = this.ownerDocument.createElement("style");
					styleBlock.id = styleBlockId;
					this.ownerDocument.head.appendChild(styleBlock);
				}
				styleBlock.innerHTML = content;

			},

			onAddChild: function (/*jshint unused: vars */node) {
				this.notifyCurrentValue("breakpoints");
			},

			refreshRendering: function (oldValues) {
				if ("breakpoints" in oldValues) {
					if (this._parseJSONAttrs() && this._checkConfiguration()) {
						this._genCSS();
					}
				}
			}
		});
});
