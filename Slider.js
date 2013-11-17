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

		// min: [const] Number
		//		The first value the slider can be set to.
		min: NaN,

		// max: [const] Number
		//		The last value the slider can be set to.
		max: NaN,

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
		//		The slider direction for ascending values.
		//		- "H": horizontal (dependent on default left-to-right or right-to-left direction)
		//		- "V": vertical
		orientation: "H",

		preCreate: function () {
			this._orientationAttrs = {
				"H": { start: "x", size: "w", pageStart: "pageX", clientStart: "clientX",
						progressBarStart: "left", progressBarSize: "width" },
				"V": { start: "y", size: "h", pageStart: "pageY", clientStart: "clientY", progressBarStart: "top",
						progressBarSize: "height" }
			};

			this.addInvalidatingProperties(
				{ value: "invalidateProperty" },
				{ min: "invalidateProperty" },
				{ max: "invalidateProperty" },
				"name",
				"flip",
				"step",
				"orientation"
			);
		},

		refreshProperties: function (props) {
			if (props.value && !this.handleMin && String(this.value).indexOf(",") > 0) {
				this.handleMin = domConstruct.create("div", { role: "slider" }, this.progressBar, "first");
				this.tabStops = "handleMin,focusNode";
			}
			if (props.value || props.min || props.max) {
				// force the value in bounds
				var values = String(this.value).split(/,/g);
				var	minValue = Math.max(Math.min(values[0], values[values.length-1], this.max), this.min),
					maxValue = Math.min(Math.max(values[0], values[values.length-1], this.min), this.max);
				// correct value in case the values were outside min/max
				var correctedValue = values.length === 1 ? String(maxValue) : (minValue + "," + maxValue);
				if (correctedValue !== this.value) {
					this.value = correctedValue;
					this.validateProperties();
				}
			}
			if (props.value) {
				this.valueNode.value = String(this.value);
			}
		},

		refreshRendering: register.before(function (props) {
			var toCSS = function (baseClass, modifier) {
				return baseClass.split(/ /g).map(function (c) {
					return c + modifier;
				}).join(" ");
			};

			if (props.orientation || props.flip) {
				// add V or H suffix to baseClass for styling purposes
				var	horizontal = this.orientation !== "V",
					ltr = horizontal ? this.isLeftToRight() : false,
					flip = !!this.flip;
				// _reversed is complicated since you can have flipped right-to-left and vertical is upside down by default
				this._reversed = !((horizontal && ((ltr && !flip) || (!ltr && flip))) || (!horizontal && flip));
				this._attrs = this._orientationAttrs[this.orientation];
				var baseClass = toCSS(this.className, this.orientation);
				domClass.add(this, baseClass);
				baseClass = this.baseClass + " " + baseClass;
				domClass.add(this, toCSS(baseClass, this._reversed ? "HtL" : "LtH"));
				domClass.add(this.containerNode, toCSS(baseClass, "Bar") + " " + toCSS(baseClass, "RemainingBar"));
				domClass.add(this.progressBar, toCSS(baseClass, "Bar") + " " + toCSS(baseClass, "ProgressBar"));
				domClass.add(this.focusNode, toCSS(baseClass, "Handle") + " " + toCSS(baseClass, "HandleMax"));
				if (this.handleMin) {
					domClass.add(this.handleMin, toCSS(baseClass, "Handle") + " " + toCSS(baseClass, "HandleMin"));
				}
				// pass widget attributes to children
				var self = this;
				this.getChildren().forEach(function (obj) {
					obj.orientation = self.orientation;
					obj.reverse = self._reversed;
				});
			}
			if (props.name) {
				this.valueNode.name = this.name;
			}
			if (props.max) {
				this.focusNode.setAttribute("aria-valuemax", this.max);
			}
			if (props.min) {
				(this.handleMin || this.focusNode).setAttribute("aria-valuemin", this.min);
			}
			if (props.value || props.min || props.max) {
				this._positionHandles();
			}
		}),

		buildRendering: function () {

			// look for child INPUT node under root node
			this.valueNode = query("> INPUT", this)[0];
			if (!this.valueNode) {
				this.valueNode = domConstruct.create("input", { "type": "text", readOnly: true, value: this.value }, this, "last");
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
			this.focusNode = domConstruct.create("div", { role: "slider" }, this.progressBar, "last");

			// prevent browser scrolling on IE10 (evt.preventDefault() is not enough)
			if (typeof this.style.msTouchAction !== "undefined") {
				this.style.msTouchAction = "none";
			}
		},

		_positionHandles: function () {
			var values = String(this.value).split(/,/g);
			if (values.length === 1) {
				values = [this.min, values[0]];
			} else {
				this.handleMin.setAttribute("aria-valuenow", values[0]);
				this.handleMin.setAttribute("aria-valuemax", values[1]);
			}
			this.focusNode.setAttribute("aria-valuenow", values[1]);
			this.focusNode.setAttribute("aria-valuemin", values[0]);
			var	toPercent = (values[1] - this.min) * 100 / (this.max - this.min),
				toPercentMin = (values[0] - this.min) * 100 / (this.max - this.min),
				s = {};
			s[this._attrs.progressBarSize] = (toPercent - toPercentMin) + "%";
			s[this._attrs.progressBarStart] = (this._reversed ? (100 - toPercent) : toPercentMin) + "%";
			domStyle.set(this.progressBar, s);
		},

		postCreate: function () {
			var	beginDrag = lang.hitch(this,
				function (e) {
					e.preventDefault();
					var	setValue = lang.hitch(this, function (priorityChange) {
							var values = String(this.value).split(/,/g);
							value -= offsetValue;
							// now perform visual slide
							domClass.toggle(this.progressBar, "duiSliderTransition", !!priorityChange);
							this.value = 
								values.length === 1
									? String(value)
									: (isMax
										? (values[0] + "," + value)
										: (value + "," + values[1]));
							this.validateProperties();
							this._handleOnChange(this.value, priorityChange);
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
					var values = String(this.value).split(/,/g);
					var isMax = (values.length === 1) || (Math.abs(value - values[0]) > Math.abs(value - values[1]));
					if (e.target !== this.focusNode && e.target !== this.handleMin) {
						setValue(true);
					} else {
						offsetValue = value - ((isMax && this.handleMin) ? values[1] : values[0]);
					}
					this[isMax ? "focusNode" : "handleMin"].focus();
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
						this.value = values.join(",");
						this.validateProperties();
						this._handleOnChange(this.value, false);
					}

					if (this.disabled || this.readOnly || e.altKey || e.ctrlKey || e.metaKey) { return; }
					var	handleIdx = 0,
						maxValue = this.max,
						values = String(this.value).split(/,/g);
					if (e.target === this.focusNode) {
						handleIdx = values.length - 1;
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
			if (!isNaN(parseFloat(this.valueNode.value))) { // browser back button or value coded on INPUT
				this.value = this.valueNode.value;
			}
			this.own(
				on(this, touch.press, beginDrag),
				on(this, "keydown", keyDown), // for desktop a11y
				on(this.focusNode, "keyup", keyUp) // fire onChange on desktop
			);
			this.invalidateProperty("orientation"); // apply appropriate CSS class names in case the default is used
			this.invalidateProperty("tabIndex"); // apply default tabIndex in case the default is used
		},

		startup: function () {
			this.valueNode.setAttribute("value", this.value); // set the reset value once
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
		}
	});
});
