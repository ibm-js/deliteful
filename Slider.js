/** @module deliteful/Slider */
define([
	"dcl/dcl",
	"requirejs-dplugins/jquery!attributes/classes",
	"dpointer/events",
	"delite/register",
	"delite/FormValueWidget",
	"delite/CssState",
	"delite/handlebars!./Slider/Slider.html",
	"delite/theme!./Slider/themes/{{theme}}/Slider.css"
], function (
	dcl,
	$,
	dpointer,
	register,
	FormValueWidget,
	CssState,
	template
) {
	/**
	 * @private
	 */
	function boxFromElement(domElt) {
		var ret = domElt.getBoundingClientRect();
		return {x: ret.left, y: ret.top, w: ret.right - ret.left, h: ret.bottom - ret.top};
	}

	/**
	 * The Slider widget allows selecting one value or a pair of values, from a range delimited by a minimum (min) and
	 * a maximum (max).
	 *
	 * The selected value depends on the position of the handle and the step, which specifies the value granularity.
	 * Slider can be vertical or horizontal. The position of the minimum and maximum depends on the text direction,
	 * and can be forced using the flip property. Handles can be move using pointers (mouse, touch) or keys
	 * (up, down, home or end).
	 *
	 * A change event is fired after the user select a new value, either by releasing a pointer, or by pressing a
	 * selection key. Before a change event, input events are fired while the user moves the Slider handle.
	 *
	 * The Slider Widget supports ARIA attributes aria-valuemin, aria-valuemax, aria-valuenow and aria-orientation.
	 *
	 * Most of the Slider behavior (default values, out of bound values reconciliations...) is similar to the
	 * HTML5.1 input type=range element [1], but it doesn't strictly conform to the specification, in particular for:
	 * - the "multiple" attribute (single/range Slider is directly determined from the content of the value property)
	 * - the "datalist" attribute (see https://github.com/ibm-js/deliteful/issues/252)
	 *
	 * Like the native input type=range element, this widget can be used in a form. It relies on a hidden input text
	 * element to provide the value to the form.
	 *
	 * [1] http://www.w3.org/TR/html5/forms.html#range-state-%28type=range%29
	 *
	 * @class module:deliteful/Slider
	 * @augments module:delite/FormValueWidget
	 * @augments module:delite/CssState
	 */
	return register("d-slider", [HTMLElement, FormValueWidget, CssState],
		// todo: HTML5 introduce the attribute "multiple" to handle multiple values
		/** @lends module:deliteful/Slider# */ {

			/**
			 * Indicates the minimum boundary of the allowed range of values. Must be a valid floating-point number.
			 * Invalid min value is defaulted to 0.
			 * @member {number}
			 * @default 0
			 */
			min: dcl.prop({
				/**
				 * HTML 5.1 input range spec:
				 * The min attribute, if specified, must have a value that is a valid floating-point number.
				 * The default minimum is 0.
				 * If the element has a min attribute, and the result of applying the algorithm to convert a
				 * string to a number to the value of the min attribute is a number, then that number is the element's
				 * minimum; otherwise, if the type attribute's current state defines a default minimum, then
				 * that is the minimum.
				 * @param value
				 * @private
				 */
				set: function (value) {
					this._set("min", this._convert2Float(value, 0));
				},
				get: function () {
					return this._get("min") || 0;
				},
				enumerable: true,
				configurable: true
			}),

			/**
			 * Indicates the maximum boundary of the allowed range of values. Must be a valid floating-point number.
			 * Invalid max value is defaulted to 100.
			 * @member {number}
			 * @default 100
			 */
			max: dcl.prop({
				/**
				 * HTML 5.1 input range spec:
				 * The max attribute, if specified, must have a value that is a valid floating-point number.
				 * The default maximum is 100.
				 * If the element has a max attribute, and the result of applying the algorithm to convert a
				 * string to a number to the value of the max attribute is a number, then that number is the element's
				 * maximum; otherwise, if the type attribute's current state defines a default maximum,
				 * then that is the maximum;
				 * @param value
				 * @private
				 */
				set: function (value) {
					this._set("max", this._convert2Float(value, 100));
				},
				get: function () {
					return this._get("max") || 100;
				},
				enumerable: true,
				configurable: true
			}),

			/**
			 * Specifies the value granularity. causes the slider handle to snap/jump to the closest possible value.
			 * Must be a positive floating-point number. Invalid step value is defaulted to 1.
			 * @member {number}
			 * @default 1
			 */
			step: dcl.prop({
				/**
				 * Must be a positive floating-point number. Invalid step value is defaulted to 1.
				 * @param value
				 * @private
				 */
				set: function (value) {
					value = this._convert2Float(value, 1);
					this._set("step", value <= 0 ? 1 : value);
				},
				get: function () {
					return this._get("step") || 1;
				},
				enumerable: true,
				configurable: true
			}),

			/**
			 * Applies only when the slider has two values. Allow sliding the area between the handles to change both
			 * values at the same time.
			 * @member {boolean}
			 * @default true
			 */
			slideRange: true,

			/**
			 * The slider direction:
			 * - false: horizontal
			 * - true: vertical
			 * @member {boolean}
			 * @default false
			 */
			vertical: false,

			/**
			 * Specifies if the slider should change its default: ascending <--> descending.
			 * @member {boolean}
			 * @default false
			 */
			flip: false,

			/**
			 * The name of the CSS class of this widget.
			 * @member {string}
			 * @default "d-slider"
			 */
			baseClass: "d-slider",

			/**
			 * Names of events and CSS properties whose values depend on the orientation of the Slider.
			 * `_orientationNames[true]` to get names when orientation is vertical.
			 * `_orientationNames[false]` to get names when orientation is horizontal.
			 * @private
			 */
			_orientationNames: {
				false: {
					start: "x",
					size: "w",
					clientStart: "clientX",
					progressBarStart: "left",
					progressBarSize: "width"
				},
				true: {
					start: "y",
					size: "h",
					clientStart: "clientY",
					progressBarStart: "top",
					progressBarSize: "height"
				}
			},

			/**
			 * Names of event and CSS properties to use with the current orientation of the Slider.
			 * _orientation.start = "x|y"
			 * _orientation.size = "w|h"
			 * _orientation.clientStart = "clientX|clientY"
			 * _orientation.progressBarSize = "width|height"
			 * @private
			 */
			_propNames: null,

			/**
			 * Used for various calculations: Indicates if current direction must be/is reversed.
			 * @private
			 */
			_reversed: false,

			template: template,

			render: dcl.superCall(function (sup) {
				return function () {
					sup.call(this);
					if (!this.valueNode.parentNode) {
						this.appendChild(this.valueNode);
					}
					this.handleMin.setAttribute("aria-valuemin", this.min);
					this.focusNode.setAttribute("aria-valuemax", this.max);
					this.tabStops = ["handleMin", "focusNode"];
					this.handleMin._isActive = true;
					// prevent default browser behavior / accept pointer events
					// todo: use pan-x/pan-y according to this.vertical (once supported by dpointer)
					// https://github.com/ibm-js/dpointer/issues/8
					dpointer.setTouchAction(this, "none");
				};
			}),

			/**
			 * Update the handle(s) attribute `aria-orientation` to reflect the actual value of the
			 * `vertical` property.
			 * Update _propName with the properties name to use with the current orientation of the Slider.
			 * @private
			 */
			_refreshOrientation: function () {
				this.focusNode.setAttribute("aria-orientation", this.vertical ? "vertical" : "horizontal");
				if (this.handleMin._isActive) {
					this.handleMin.setAttribute("aria-orientation", this.vertical ? "vertical" : "horizontal");
				}
				this._propNames = this._orientationNames[this.vertical];
			},

			/**
			 * Refresh CSS classes.
			 * @private
			 */
			_refreshCSS: function () {
				function toCSS(baseClass, modifier) {
					return baseClass.split(/ /).map(function (c) {
						return c + modifier;
					}).join(" ");
				}
				// add V or H suffix to baseClass for styling purposes
				var rootBaseClass = toCSS(this.baseClass, this.vertical ? "-v" : "-h");
				var baseClass = this.baseClass + " " + rootBaseClass;
				// root node: do not remove all classes; user may define custom classes; CssState adds classes that
				// we do not want to lose.
				$(this).removeClass(toCSS(this.baseClass + "-v" + " " + this.baseClass + "-h", "-htl") + " " +
					toCSS(this.baseClass + "-v" + " " + this.baseClass + "-h", "-lth") + " " +
					this.baseClass + "-v" + " " + this.baseClass + "-h");
				$(this).addClass(rootBaseClass + " " + toCSS(baseClass, this._reversed ? "-htl" : "-lth"));
				this.wrapperNode.className = toCSS(baseClass, "-bar") + " " + toCSS(baseClass, "-container");
				this.progressBar.setAttribute("style", "");// reset left/width/height/top
				this.progressBar.className = toCSS(baseClass, "-bar") + " " + toCSS(baseClass, "-progress-bar");
				this.focusNode.className = toCSS(baseClass, "-handle") + " " + toCSS(baseClass, "-handle-max");
				if (this.handleMin._isActive) {
					this.handleMin.className = toCSS(baseClass, "-handle") + " " + toCSS(baseClass, "-handle-min");
				}
			},

			/* jshint maxcomplexity: 12 */
			computeProperties: function (props) {
				if ("value" in props || "min" in props || "max" in props || "step" in props) {
					var value = this._getValueAsArray(),
						isDual = value.length > 1,
						// convert and set default value(s) as needed
						minValue = this._convert2Float(value[0],
							this._calculateDefaultValue(isDual ? 0.25 : 0.5)),
						maxValue = this._convert2Float(value[value.length - 1],
							this._calculateDefaultValue(isDual ? 0.75 : 0.5)),
						// ensure minValue is less than maxValue
						maxV = Math.max(minValue, maxValue);
					minValue = Math.min(minValue, maxValue);
					maxValue = maxV;
					// correct step mismatch/underflow/overflow
					minValue = this._adjustValue(minValue, this.min);
					maxValue = this._adjustValue(maxValue, minValue);
					// set corrected value as needed
					this.value = isDual ? (minValue + "," + maxValue) : String(maxValue);
				}

				// Complicated since you can have flipped right-to-left and vertical is upside down by default.
				if ("vertical" in props || "flip" in props || "effectiveDir" in props) {
					var ltr = this.effectiveDir === "ltr";
					this._reversed = !((!this.vertical && (ltr !== this.flip)) || (this.vertical && this.flip));
				}
			},
			/* jshint maxcomplexity: 10 */

			refreshRendering: function (props) {
				if ("value" in props) {
					this._refreshValueRendering();
				}
				if ("vertical" in props) {
					this._refreshOrientation();
				}
				if ("name" in props) {
					var name = this.name;
					this.removeAttribute("name");
					// won't restore after a browser back operation since name changed nodes
					this.valueNode.setAttribute("name", name);
				}
				if ("max" in props) {
					this.focusNode.setAttribute("aria-valuemax", this.max);
				}
				if ("min" in props) {
					(this.handleMin._isActive ? this.handleMin : this.focusNode)
						.setAttribute("aria-valuemin", this.min);
				}
				if ("baseClass" in props || "vertical" in props || "_reversed" in props) {
					this._refreshCSS();
				}
				this._positionHandles();
			},

			/**
			 * Set handle(s) position relative to the progress bar.
			 * @private
			 */
			_positionHandles: function () {
				var currentVal = this._getValueAsArray();
				if (currentVal.length === 1) {
					currentVal = [this.min, currentVal[0]];
				}
				var toPercent = (currentVal[1] - this.min) * 100 /
						(this.max < this.min ? this.min : this.max - this.min),
					toPercentMin = (currentVal[0] - this.min) * 100 /
						(this.max < this.min ? this.min : this.max - this.min);
				this.progressBar.style[this._propNames.progressBarSize] = (toPercent - toPercentMin) + "%";
				this.progressBar.style[this._propNames.progressBarStart] =
					(this._reversed ? (100 - toPercent) : toPercentMin) + "%";
			},

			/**
			 * Add/remove and set handle as needed.
			 * @private
			 */
			_refreshValueRendering: function () {
				var currentVal = this._getValueAsArray();
				if (!this.handleMin._isActive && currentVal.length === 2) {
					this.handleMin.className = "";
					this.handleMin.setAttribute("aria-valuemin", this.min);
					this.focusNode.setAttribute("aria-valuemax", this.max);
					this.tabStops = ["handleMin", "focusNode"];
					this.handleMin._isActive = true;
				}
				if (this.handleMin._isActive && currentVal.length === 1) {
					this.handleMin.className = "d-hidden";
					this.handleMin.removeAttribute("aria-valuemin");
					this.focusNode.setAttribute("aria-valuemin", this.min);
					this.focusNode.setAttribute("aria-valuemax", this.max);
					this.handleMin._isActive = false;
				}
				// update aria attributes
				if (this.handleMin._isActive) {
					this.handleMin.setAttribute("aria-valuenow", currentVal[0]);
					this.handleMin.setAttribute("aria-valuemax", currentVal[1]);
					this.focusNode.setAttribute("aria-valuemin", currentVal[0]);
					this.focusNode.setAttribute("aria-valuenow", currentVal[1]);
				} else {
					this.focusNode.setAttribute("aria-valuenow", currentVal[0]);
				}
				// set input field value.
				this.valueNode.value = String(this.value);
			},

			constructor: function () {
				this._pointerCtx = {
					target: null, // the element that has focus when user manipulate a pointer
					offsetVal: 0, // Offset value when use points and drag a handle
					containerBox: null // to avoid recalculations when moving the slider with a pointer
				};

				this.on("pointerdown", this.pointerDownHandler.bind(this));
				this.on("pointermove", this.pointerMoveHandler.bind(this));
				this.on("lostpointercapture", this.lostCaptureHandler.bind(this));
				this.on("keydown", this.keyDownHandler.bind(this));
				this.on("keyup", this.keyUpHandler.bind(this));
			},

			postRender: function () {
				if (this.valueNode.value) { // INPUT value
					// browser back button or value coded on INPUT
					// the valueNode value has precedence over the widget markup value
					this.value = this.valueNode.value;
				}
			},

			connectedCallback: function () {
				// Chrome: avoids text selection of elements when mouse is dragged outside of the Slider.
				this.onmousedown = function (e) {
					e.preventDefault();
				};
			},

			/**
			 * HTML 5.1 spec (input range attributes):
			 * The Infinity and Not-a-Number (NaN) values are not valid floating-point numbers.
			 * @param value
			 * @param defaultValue
			 * @returns {Number|*}
			 * @private
			 */
			_convert2Float: function (value, defaultValue) {
				var v = parseFloat(value);
				return (isNaN(v) || v === Infinity) ? defaultValue : v;
			},

			/**
			 * HTML 5.1 input range spec:
			 * The default value is the minimum plus half the difference between the minimum and the
			 * maximum, unless the maximum is less than the minimum, in which case the default value
			 * is the minimum.
			 * @param ratio For a single handle, ratio is 0.5 ("half the difference between the minimum and the
			 * maximum"). For dual handle, it is 0.25 or 0.75.
			 * @private
			 */
			_calculateDefaultValue: function (ratio) {
				return this.max < this.min ? this.min : this.min + (this.max - this.min) * ratio;
			},

			/**
			 * Correct the value according to the HTML 5.1 input range spec.
			 * @param value the actual value to correct
			 * @param relativeMin the minimum value relative to the current value.
			 * @returns {Number|*}
			 * @private
			 */
			_adjustValue: function (value, relativeMin) {
				// value = (this.max > this.min) ? Math.min(this.max, value) : value;
				// When the element is suffering from a step mismatch, the user agent must round the element's value to
				// the nearest number for which the element would not suffer from a step mismatch, and which is greater
				// than or equal to the minimum, and, if the maximum is not less than the minimum, which is less than or
				// equal to the maximum, if there is a number that matches these constraints. If two numbers match these
				// constraints, then user agents must use the one nearest to positive infinity.
				if (value % this.step) {
					var x = Math.max(relativeMin, Math.round(value / this.step) * this.step);
					value = (this.max > relativeMin) ? Math.min(this.max, x) : x;
				}
				// When the element is suffering from an underflow, the user agent must set the element's
				// value to a valid floating-point number that represents the minimum. (spec)
				value = Math.max(relativeMin, value);
				// When the element is suffering from an overflow, if the maximum is not less than the minimum,
				// the user agent must set the element's value to a valid floating-point number that represents
				// the maximum. (spec)
				value = Math.min(this.max > this.min ? this.max : this.min, value);
				return value;
			},

			/**
			 * Convenience method to get the value as an array.
			 * @returns {Array}
			 * @private
			 */
			_getValueAsArray: function () {
				return String(this.value).split(/,/g);
			},

			/* jshint maxcomplexity: 11 */
			pointerDownHandler: function (e) {
				if (this._ignoreUserInput(e)) {
					return;
				}

				this._pointerCtx.target = null;
				this._pointerCtx.offsetVal = 0;
				this._pointerCtx.containerBox = boxFromElement(this.wrapperNode);
				var currentVal = this._getValueAsArray();
				var selectedVal = this._selectedValue(e, this._pointerCtx.containerBox);

				if (this._startSlideRange(e)) {
					// user is about to slide a range of values
					this._pointerCtx.target = this.progressBar;
					this._pointerCtx.offsetVal = selectedVal - currentVal[0];
				} else {
					// relativePos allow to determine which handle should get the focus and move, according to the
					// selected value:
					// relativePos > 0 => handleMin
					// relativePos < 0 => focusNode
					// relativePos = 0 => must be decided 
					var relativePos = Math.abs(selectedVal - currentVal[1]) - Math.abs(selectedVal - currentVal[0]);
					if (relativePos === 0 && (e.target === this.focusNode || e.target === this.handleMin)) {
						this._pointerCtx.target = document.elementFromPoint(e.clientX, e.clientY);
					} else {
						if (relativePos === 0) {
							// determine which handle can move to the position of the selected value.
							relativePos = currentVal[0] -
								Math.min(this.max - this.step, Math.max(this.min + this.step, selectedVal));
						}
						// get the handle which is closest from the selected value.
						this._pointerCtx.target = (relativePos > 0) ? this.handleMin : this.focusNode;
					}
					this._pointerCtx.target.focus();
					if (e.target !== this.focusNode && e.target !== this.handleMin) {
						this.handleOnInput(this._formatSelection(selectedVal, this._pointerCtx.target));
					}

				}
				if (e.target === this.focusNode || e.target === this.handleMin) {
					// track offset between current and selected value 
					this._pointerCtx.offsetVal = selectedVal -
						currentVal[(this.handleMin._isActive && (this._pointerCtx.target === this.focusNode)) ? 1 : 0];
				}
				// start capture on the target element
				dpointer.setPointerCapture(this._pointerCtx.target, e.pointerId);
				e.stopPropagation();
			},

			pointerMoveHandler: function (e) {
				if (e.target === this._pointerCtx.target) {
					this.handleOnInput(this._formatSelection(this._selectedValue(e, this._pointerCtx.containerBox) -
						this._pointerCtx.offsetVal, e.target));
					e.stopPropagation();
				}
			},

			lostCaptureHandler: function () {
				this._pointerCtx.target = null;
				this.handleOnChange(this.value);
			},

			/* jshint maxcomplexity: 13 */
			keyDownHandler: function (e) {
				if (this._ignoreUserInput(e)) {
					return;
				}
				var currentVal = this._getValueAsArray(),
					idx = (e.target === this.focusNode) ? currentVal.length - 1 : 0,
					multiplier = 1,
					newValue;
				switch (e.key) {
				case "Home":
					newValue = [this.min, currentVal[0]][idx];
					break;
				case "End":
					newValue = (e.target === this.handleMin) ? currentVal[1] : this.max;
					break;
				case "ArrowRight":
					multiplier = -1;
					/* falls through */
				case "ArrowLeft":
					newValue = parseFloat(currentVal[idx]) +
						multiplier * ((this.flip && !this.vertical) ? this.step : -this.step);
					break;
				case "ArrowDown":
					multiplier = -1;
					/* falls through */
				case "ArrowUp":
					newValue = parseFloat(currentVal[idx]) +
						multiplier * ((!this.flip || !this.vertical) ? this.step : -this.step);
					break;
				default:
					return;
				}
				this.handleOnInput(this._formatSelection(newValue, e.target));
				e.preventDefault();
			},

			keyUpHandler: function (e) {
				if (this._ignoreUserInput(e)) {
					return;
				}
				if (e.target === this.focusNode || e.target === this.handleMin) {
					this.handleOnChange(this.value);
				}
			},

			/**
			 * Return true if the user input should be ignored.
			 * @param event
			 * @returns {Boolean}
			 * @private
			 */
			_ignoreUserInput: function (event) {
				return this.disabled || this.readOnly || event.altKey || event.ctrlKey || event.metaKey;
			},

			/**
			 * Return true if all conditions required to slide a range of value are fulfilled.
			 * @param uiEvent
			 * @returns {boolean}
			 * @private
			 */
			_startSlideRange: function (uiEvent) {
				if (!(this.slideRange && this.handleMin._isActive) ||
					uiEvent.target === this.focusNode || uiEvent.target === this.handleMin) {
					return false;
				}
				var progressBarBox = boxFromElement(this.progressBar);
				var currentPos = uiEvent[this._propNames.clientStart] - progressBarBox[this._propNames.start];
				var maxPos = progressBarBox[this._propNames.size];
				return (currentPos >= 0 && currentPos <= maxPos);
			},

			/**
			 * Read UI Event coordinates and calculate the corresponding value, corrected with the step, without
			 * enforcing boundaries to allow user to slide the handle outside the boundaries to set value to min/max.
			 * @param uiEvent a UI event
			 * @param containerBox
			 * @private
			 */
			_selectedValue: function (uiEvent, containerBox) {
				function pixel2value(pixelValue, pixelMin, pixelMax, valMin, valMax) {
					return ((pixelValue - pixelMin) * (valMax - valMin)) / (pixelMax - pixelMin) + valMin;
				}

				var pixelMax = containerBox[this._propNames.size];
				var pixelValue = uiEvent[this._propNames.clientStart] - containerBox[this._propNames.start];
				return Math.round(pixel2value(pixelValue, this._reversed ? pixelMax : 0, this._reversed ? 0 : pixelMax,
					this.min, this.max) / this.step) * this.step;
			},

			/**
			 * format and return the selected value corrected from min/max boundaries in case the handle is released
			 * outside of the widget coordinates.
			 * @param newValue the new selected value
			 * @param sourceNode the node responsible of the new selected value
			 * @private
			 */
			_formatSelection: function (newValue, sourceNode) {
				var currentVal = this._getValueAsArray();
				var updatedValue = newValue;
				switch (sourceNode) {
				case this.focusNode:
					updatedValue = (currentVal.length === 1) ? String(newValue) :
						Math.min(currentVal[0], newValue) + "," + newValue;
					break;
				case this.handleMin:
					updatedValue = newValue + "," + Math.max(currentVal[1], newValue);
					break;
				case this.progressBar:
					var delta = currentVal[1] - currentVal[0];
					newValue = Math.max(this.min, Math.min(newValue + delta, this.max) - delta);
					updatedValue = newValue + "," + (newValue + delta);
					break;
				}
				return updatedValue;
			}
		});
});
