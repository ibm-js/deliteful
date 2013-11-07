define([
	"dojo/_base/connect",
	"dojo/_base/lang",
	"dojo/_base/window",
	"dojo/sniff",
	"dojo/query",
	"dojo/dom-class",
	"dojo/dom-construct",
	"dojo/dom-geometry",
	"dojo/dom-style",
	"dojo/keys",
	"dojo/touch",
	"dojo/on",
	"./register",
	"./FormValueWidget",
	"./themes/load!common,Slider"	// common for duiInline etc., Slider for duiSlider etc.
], function (connect, lang, win, has, query, domClass, domConstruct, domGeometry, domStyle,
		keys, touch, on, register, FormValueWidget) {

	return register("d-slider", [HTMLElement, FormValueWidget], {
		// summary:
		//		A non-templated Slider widget similar to the HTML5 INPUT type=range.

		// value: String
		//		The current slider value, either String(Number) or String(Number,Number).
		//value: "",

		// min: [const] Number
		//		The first value the slider can be set to.
		min: 0,

		// max: [const] Number
		//		The last value the slider can be set to.
		max: 100,

		// step: [const] Number
		//		The delta from 1 value to another.
		//		This causes the slider handle to snap/jump to the closest possible value.
		//		A value of 0 means continuous (as much as allowed by pixel resolution).
		step: 1,

		// baseClass: [const] String
		//		The name of the CSS class of this widget.
		baseClass: "duiSlider",

		// flip: [const] Boolean
		//		Specifies if the slider should change its default: ascending <--> descending.
		flip: false,

		// orientation: [const] String
		//		The slider direction.
		//
		//		- "H": horizontal
		//		- "V": vertical
		orientation: "H",

		// isRange: [const] Boolean
		//		True if there's both a visible min and max slider handle
		isRange: false,

		tabStops: "handle",

		buildRendering: function () {
			// look for child INPUT node under root node
			this.valueNode = query("> INPUT", this)[0];
			if (!this.valueNode) {
				this.valueNode = domConstruct.create("input", { "type": "text", readOnly: true }, this, "last");
			}

			if (!isNaN(parseFloat(this.valueNode.value))) { // browser back button or value coded on INPUT
				this.value = this.valueNode.value;
			}
			this.containerNode = domConstruct.create("div", {}, this, "last");
			var n = this.firstChild;
			while (n) {
				var next = n.nextSibling;
				if (n !== this.valueNode && n !== this.containerNode) {
					// move all extra markup nodes to the containerNode for relative sizing and placement
					this.containerNode.appendChild(n);
				}
				n = next;
			}
			this.progressBar = domConstruct.create("div", {}, this.containerNode, "last");
			this.handle = domConstruct.create("div", { tabIndex: this.tabIndex }, this.progressBar, "last");

			this.focusNode = this.handle;

			// prevent browser scrolling on IE10 (evt.preventDefault() is not enough)
			if (typeof this.style.msTouchAction !== "undefined") {
				this.style.msTouchAction = "none";
			}
		},

		_refreshState: function (/*Boolean?*/ priorityChange) {
			this.valueNode.value = String(this.value);
			var values = String(this.value).split(",");
			if (values.length === 1) {
				values = [this.min, values[0]];
			}
			if (this.isRange) {
				this.handleMin.setAttribute("aria-valuenow", values[0]);
			}
			this.handle.setAttribute("aria-valuenow", values[1]);
			var	toPercent = (values[1] - this.min) * 100 / (this.max - this.min),
				toPercentMin = (values[0] - this.min) * 100 / (this.max - this.min),
				s = {};
			// now perform visual slide
			domClass.toggle(this.progressBar, "duiSliderTransition", priorityChange);
			s[this._attrs.progressBarSize] = (toPercent - toPercentMin) + "%";
			s[this._attrs.progressBarStart] = (this._reversed ? (100 - toPercent) : toPercentMin) + "%";
			domStyle.set(this.progressBar, s);
		},

		_setValueAttr: function (/*Number or String(Number) or String(Number,Number)*/ value) {
			// summary:
			//		Hook such that set("value", value) works.
			// tags:
			//		private
			this._handleOnChange(value, null);
		},

		_handleOnChange: register.before(function (
			/*Number or String(Number) or String(Number,Number)*/ value,
			/*Boolean?*/ priorityChange) {
			if (this._started) {
				// force the value in bounds
				var values = String(value).split(",");
				if (values.length === 1) {
					values = [this.min, values[0]];
				}
				var	minValue = Math.max(Math.min(Math.min(values[0], values[1]), this.max), this.min),
					maxValue = Math.max(Math.min(Math.max(values[0], values[1]), this.max), this.min);
				// correct value in case the values were outside min/max
				value = this.isRange ? (minValue + "," + maxValue) : maxValue;
			}
			this._set("value", value);
			if (this._started) {
				this._refreshState(priorityChange);
			} else {
				this.valueNode.setAttribute("value", this.value); // set the reset value
			}
		}),

		postCreate: function () {
			var	beginDrag = lang.hitch(this,
				function (e) {
					e.preventDefault();
					var	setValue = lang.hitch(this, function (priorityChange) {
							var values = String(this.value).split(",");
							value -= offsetValue;
							this._handleOnChange(this.isRange
								? (isMax ? (values[0] + "," + value)
								: (value + "," + values[1])) : value, priorityChange);
						}),
						getEventData = lang.hitch(this, function (e) {
							point = isMouse
								? e[this._attrs.pageStart]
								: ((e.touches && e.touches[0])
									? e.touches[0][this._attrs.pageStart]
									: e[this._attrs.clientStart]);
							pixelValue = point - startPixel;
							pixelValue = Math.min(Math.max(pixelValue, 0), maxPixels);
							var discreteValues = this.step ? ((this.max - this.min) / this.step) : maxPixels;
							if (discreteValues <= 1 || discreteValues === Infinity) { discreteValues = maxPixels; }
							var wholeIncrements = Math.round(pixelValue * discreteValues / maxPixels);
							value = (this.max - this.min) * wholeIncrements / discreteValues;
							value = this._reversed ? (this.max - value) : (this.min + value);
						}),
						continueDrag = lang.hitch(this, function (e) {
							e.preventDefault();
							getEventData(e);
							setValue(false);
						}),
						endDrag = lang.hitch(this, function (e) {
							e.preventDefault();
							if (actionHandles) {
								actionHandles.forEach(function (h) { h.remove(); });
							}
							actionHandles = [];
							getEventData(e);
							setValue(true);
							// fire onChange
						}),
						isMouse = e instanceof MouseEvent, // e.type can be MSPointerDown but still be instanceof MouseEvent
						// get the starting position of the content area (dragging region)
						// can't use true since the added docScroll and the returned x are body-zoom incompatibile
						box = domGeometry.position(this.containerNode, false),
						scroll = domGeometry.docScroll(),
						bodyZoom = has("ie") ? 1 : (parseFloat(domStyle.get(win.body(), "zoom")) || 1),
						nodeZoom = has("ie") ? 1 : (parseFloat(domStyle.get(node, "zoom")) || 1),
						root = win.doc.documentElement,
						actionHandles;
					if (this.disabled || this.readOnly) { return; }
					// fix scroll.y in IE10 for incorrect pageYOffset
					// https://connect.microsoft.com/IE/feedback/details/768781/ie10-window-pageyoffset-incorrect-value-when-page-zoomed-breaks-jquery-etc
					scroll.y = Math.min(scroll.y, this.containerNode.ownerDocument.documentElement.scrollTop || scroll.y);
					var startPixel = box[this._attrs.start] * nodeZoom * bodyZoom + scroll[this._attrs.start];
					var maxPixels = box[this._attrs.size] * nodeZoom * bodyZoom;
					var offsetValue = 0;
					getEventData(e);
					var values = String(this.value).split(",");
					var isMax = !this.isRange || (Math.abs(value - values[0]) > Math.abs(value - values[1]));
					if (e.target !== this.handle && e.target !== this.handleMin) {
						setValue(true);
					} else {
						offsetValue = value - ((isMax && this.isRange) ? values[1] : values[0]);
					}
					this[isMax ? "handle" : "handleMin"].focus();
					if (actionHandles) {
						actionHandles.forEach(function (h) { h.remove(); });
					}
					actionHandles = this.own(
						on(root, touch.move, continueDrag),
						on(root, touch.release, endDrag)
					);
				}),

				keyDown = lang.hitch(this, function (e) {
					function handleKeys() {
						var	step = this.step,
							multiplier = 1,
							horizontal = this.orientation !== "V";
						switch (e.keyCode) {
							case keys.HOME:
								values[handleIdx] = [ this.min, values[0] ][handleIdx];
								break;
							case keys.END:
								values[handleIdx] = maxValue;
								break;
							case keys.RIGHT_ARROW:
								multiplier = -1;
								/* falls through */
							case keys.LEFT_ARROW:
								values[handleIdx] = parseFloat(values[handleIdx]) +
									multiplier * ((this.flip && horizontal) ? step : -step);
								break;
							case keys.DOWN_ARROW:
								multiplier = -1;
								/* falls through */
							case keys.UP_ARROW:
								values[handleIdx] = parseFloat(values[handleIdx]) +
									multiplier * ((!this.flip || horizontal) ? step : -step);
								break;
							default:
								return;
						}
						e.preventDefault();
						this._handleOnChange(values.join(","), false);
					}

					if (this.disabled || this.readOnly || e.altKey || e.ctrlKey || e.metaKey) { return; }
					var	handleIdx = 0,
						maxValue = this.max,
						values = String(this.value).split(",");
					if (e.target === this.handle) {
						handleIdx = this.isRange ? 1 : 0;
					} else if (e.target === this.handleMin) {
						maxValue = values[1];
					} else {
						return;
					}
					lang.hitch(this, handleKeys)();
				}),

				keyUp = lang.hitch(this, function (e) {
					if (this.disabled || this.readOnly || e.altKey || e.ctrlKey || e.metaKey) { return; }
					this._handleOnChange(this.value, true);
				}),

				point, pixelValue, value,
				node = this;
			this.own(
				on(this, touch.press, beginDrag),
				on(this, "keydown", keyDown), // for desktop a11y
				on(this.handle, "keyup", keyUp) // fire onChange on desktop
			);
		},

		_setIsRangeAttr: function (/*Boolean*/ value) {
			this._set("isRange", value);
			if (value) {
				this.handleMin = domConstruct.create("div", {
					disabled: this.disabled,
					tabIndex: this.tabIndex
				}, this.progressBar, "first");
				this.tabStops = "handleMin,handle";
			}
		},

		startup: register.before(function () {
			var self = this;

			var toCSS = function (baseClass, modifier) {
				return baseClass.split(" ").map(function (c) {
					return c + modifier;
				}).join(" ");
			};

			// add V or H suffix to baseClass for styling purposes
			var	horizontal = this.orientation !== "V",
				ltr = horizontal ? this.isLeftToRight() : false,
				flip = !!this.flip;
			if (this.name) {
				this.valueNode.name = this.name;
			}
			// if the form is reset, then notify the widget to reposition the handles
			if (this.valueNode.form) {
				this.own(on(this.valueNode.form, "reset", lang.hitch(this, "defer",
					function () {
						if (this.value !== this.valueNode.value) {
							this.value = this.valueNode.value;
						}
					}, 0
				)));
			}
			// _reversed is complicated since you can have flipped right-to-left and vertical is upside down by default
			this._reversed = !((horizontal && ((ltr && !flip) || (!ltr && flip))) || (!horizontal && flip));
			this._attrs = horizontal
				? { start: "x", size: "w", pageStart: "pageX", clientStart: "clientX",
					progressBarStart: "left", progressBarSize: "width" }
				: { start: "y", size: "h", pageStart: "pageY", clientStart: "clientY", progressBarStart: "top",
					progressBarSize: "height" };
			var baseClass = toCSS(this.className, this.orientation);
			domClass.add(this, baseClass);
			baseClass = this.baseClass + " " + baseClass;
			domClass.add(this, toCSS(baseClass, this._reversed ? "HtL" : "LtH"));
			domClass.add(this.containerNode, toCSS(baseClass, "Bar") + " " + toCSS(baseClass, "RemainingBar"));
			domClass.add(this.progressBar, toCSS(baseClass, "Bar") + " " + toCSS(baseClass, "ProgressBar"));
			domClass.add(this.handle, toCSS(baseClass, "Handle") + " " + toCSS(baseClass, "HandleMax"));
			if (this.handleMin) {
				domClass.add(this.handleMin, toCSS(baseClass, "Handle") + " " + toCSS(baseClass, "HandleMin"));
			}

			// pass widget attributes to children
			this.getChildren().forEach(function (obj) {
				if (!obj._started && !obj._destroyed && lang.isFunction(obj._parentInit)) {
					obj._parentInit(self._reversed, self.orientation);
				}
			});

			this._refreshState(null);
		})
	});
});
