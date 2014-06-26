/** @module deliteful/Slider */
define([
	"dojo/dom-class",
	"dojo/dom-construct",
	"dojo/dom-style",
	"dojo/keys",
	"dojo/on",
	"dpointer/events",
	"delite/register",
	"delite/FormValueWidget",
	"delite/CssState",
	"delite/theme!./Slider/themes/{{theme}}/Slider_css"
], function (domClass, domConstruct, domStyle, keys, on, dpointer, register, FormValueWidget, CssState) {
	/**
	 * @summary
	 * The Slider widget allows selecting one value or a pair of values, from a range delimited by a minimum (min) and
	 * a maximum (max).
	 *
	 * @description
	 * The selected value depends on the position of the handle and the step, which specifies the value granularity.
	 * Slider can be vertical or horizontal. The position of the minimum and maximum depends on the text direction,
	 * and can be forced using the flip property. Handles can be move using pointers (mouse, touch) or keys
	 * (up, down, home or end).
	 *
	 * A change event is fired after the user select a new value, either by releasing a pointer, or by pressing a 
	 * selection key. Applications can set the intermediateChanges property inherited from FormValueWidget in order 
	 * to be notified of value changes (with a change event) while the user moves the handle.
	 *
	 * When intermediateChanges is true, change events are fired on each value change. Change events define the 
	 * property intermediateChange to allow applications to know if the event resulted from moving a Slider handle, or 
	 * if it resulted from the end of the user selection.
	 *
	 * The Slider Widget supports ARIA attributes aria-valuemin, aria-valuemax, aria-valuenow and aria-orientation.
	 *
	 * Most of the Slider behavior (default values, out of bound values reconciliations...) is similar to the
	 * HTML5.1 input type=range element [1], but it doesn't strictly conform to the specification, in particular for:
	 * - the "multiple" attribute (single/range Slider is directly determined from the content of the value property)
	 * - the "datalist" attribute (currently implemented with deliteful/Rule)
	 *
	 * Like the native input type=range element, this widget can be used in a form. It relies on a hidden input text
	 * element to provide the value to the form.
	 *
	 * [1] http://www.w3.org/TR/html5/forms.html#range-state-%28type=range%29
	 *
	 * @class module:deliteful/Slider
	 * @augments delite/FormValueWidget
	 * @augments delite/CssState
	 */
	return register("d-slider", [HTMLElement, FormValueWidget, CssState],
		//todo: HTML5 introduce the attribute "multiple" to handle multiple values
		/** @lends module:deliteful/Slider# */ {

			/**
			 * Indicates the minimum boundary of the allowed range of values. Must be a valid floating-point number.
			 * Invalid min value is defaulted to 0.
			 * @member {number}
			 * @default 0
			 */
			min: 0,

			/**
			 * Indicates the maximum boundary of the allowed range of values. Must be a valid floating-point number.
			 * Invalid max value is defaulted to 100.
			 * @member {number}
			 * @default 100
			 */
			max: 100,

			/**
			 * Specifies the value granularity. causes the slider handle to snap/jump to the closest possible value.
			 * Must be a positive floating-point number. Invalid step value is defaulted to 1.
			 * @member {number}
			 * @default 1
			 */
			step: 1,

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
			_reversed: null,

			preCreate: function () {
				this.addInvalidatingProperties(
					{ value: "invalidateProperty" },
					{ min: "invalidateProperty" },
					{ max: "invalidateProperty" },
					{ step: "invalidateProperty" },
					"slideRange",
					"name",
					"flip",
					"vertical"
				);
			},

			buildRendering: function () {
				//look for existing child INPUT node under root node
				this.valueNode = this.querySelector("input");
				if (!this.valueNode) {
					this.valueNode = domConstruct.create("input",
						{ "type": "text", readOnly: "true", value: this.value }, this, "last");
				} else {
					//The element property "value" may not reflect the DOM attribute "value" (observed on FF29)
					this.valueNode.value = this.valueNode.getAttribute("value");
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
				//create handle(s)
				var currentValue = this._getValueAsArray();
				if (currentValue.length === 1) {
					this.focusNode = this._buildHandle(this.min, this.max, "last");
					this.tabStops = "focusNode";
				} else {
					this.focusNode = this._buildHandle(currentValue[0], this.max, "last");
					this.handleMin = this._buildHandle(this.min, currentValue[1], "first");
					this.tabStops = "handleMin,focusNode";
				}
				//prevent default browser behavior / accept pointer events
				//todo: use pan-x/pan-y according to this.vertical (once supported by dpointer)
				//https://github.com/ibm-js/dpointer/issues/8
				dpointer.setTouchAction(this, "none");
			},

			/**
			 * Create and set a handle node to the `progressbar`.
			 * @param {Number} ariaValueMin init value for aria attribute `aria-valuemin`
			 * @param {Number} ariaValueMax init value for aria attribute `aria-valuemax`
			 * @param {String} position the insertion position relative to the `progressbar`
			 * @returns {div}
			 * @private
			 */
			_buildHandle: function (ariaValueMin, ariaValueMax, position) {
				var handleNode = domConstruct.create("div", { role: "slider" }, this.progressBar, position);
				//set focus handler
				handleNode._focusHandler = on(handleNode, "focus", this._onFocus.bind(this));
				//ensure focus handler is removed when this instance is destroyed
				this.own(handleNode._focusHandler);
				//set aria min/max attributes
				handleNode.setAttribute("aria-valuemin", ariaValueMin);
				handleNode.setAttribute("aria-valuemax", ariaValueMax);
				return handleNode;
			},

			/**
			 * Update the handle(s) attribute `aria-orientation` to reflect the actual value of the
			 * `vertical` property.
			 * Update _propName with the properties name to use with the current orientation of the Slider.
			 * @private
			 */
			_refreshOrientation: function () {
				this.focusNode.setAttribute("aria-orientation", this.vertical ? "vertical" : "horizontal");
				if (this.handleMin) {
					this.handleMin.setAttribute("aria-orientation", this.vertical ? "vertical" : "horizontal");
				}
				this._propNames = this._orientationNames[this.vertical];
			},

			/**
			 * Sets _reversed according to vertical, flip and the current text direction.
			 * @private
			 */
			_refreshReversed: function () {
				//Complicated since you can have flipped right-to-left and vertical is upside down by default.
				this._reversed = !((!this.vertical && (this.isLeftToRight() !== this.flip))
					|| (this.vertical && this.flip));
			},

			/**
			 * Refresh CSS classes.
			 * @private
			 */
			_refreshCSS: function () {
				var toCSS = function (baseClass, modifier) {
					return baseClass.split(/ /g).map(function (c) {
						return c + modifier;
					}).join(" ");
				};
				// add V or H suffix to baseClass for styling purposes
				var rootBaseClass = toCSS(this.baseClass, this.vertical ? "-v" : "-h");
				var baseClass = this.baseClass + " " + rootBaseClass;
				//root node: do not remove all classes; user may define custom classes; CssState adds classes that
				//we do not want to lose.
				domClass.replace(this, rootBaseClass + " " + toCSS(baseClass, this._reversed ? "-htl" : "-lth"),
					toCSS(this.baseClass + "-v" + " " + this.baseClass + "-h", "-htl") + " " +
						toCSS(this.baseClass + "-v" + " " + this.baseClass + "-h", "-lth") + " " +
						this.baseClass + "-v" + " " + this.baseClass + "-h");
				this.containerNode.className = toCSS(baseClass, "-bar") + " " + toCSS(baseClass, "-remaining-bar");
				this.progressBar.setAttribute("style", "");//reset left/width/height/top
				this.progressBar.className = toCSS(baseClass, "-bar") + " " + toCSS(baseClass, "-progress-bar");
				this.focusNode.className = toCSS(baseClass, "-handle") + " " + toCSS(baseClass, "-handle-max");
				if (this.handleMin) {
					this.handleMin.className = toCSS(baseClass, "-handle") + " " + toCSS(baseClass, "-handle-min");
				}
			},

			/**
			 * pass widget attributes to children (needed when Slider is used in conjunction with deliteful/Rule)
			 * @private
			 */
			_updateChildren: function () {
				this.getChildren().forEach(function (obj) {
					obj.vertical = this.vertical;
					obj.reverse = this._reversed;
				}, this);
			},

			refreshProperties: function (props) {
				if (props.value || props.min || props.max || props.step) {
					var value = this._getValueAsArray(),
						isDual = value.length > 1,
						//convert and set default value(s) as needed
						minValue = this._convert2Float(value[0],
							this._calculateDefaultValue(isDual ? 0.25 : 0.5)),
						maxValue = this._convert2Float(value[value.length - 1],
							this._calculateDefaultValue(isDual ? 0.75 : 0.5)),
						//ensure minValue is less than maxValue
						maxV = Math.max(minValue, maxValue);
					minValue = Math.min(minValue, maxValue);
					maxValue = maxV;
					//correct step mismatch/underflow/overflow
					minValue = this._calculateCorrectValue(minValue, this.min);
					maxValue = this._calculateCorrectValue(maxValue, minValue);
					//set corrected value as needed
					this._updateValue(isDual ? (minValue + "," + maxValue) : String(maxValue), false);
				}
			},

			refreshRendering: function (props) {
				var resetCSS, resetReversed;
				if (props.value) {
					resetCSS = this._refreshValueRendering();
				}
				if (props.vertical) {
					this._refreshOrientation();
					resetReversed = true;
					resetCSS = true;
				}
				if (props.flip) {
					resetReversed = true;
					resetCSS = true;
				}
				if (props.name) {
					var name = this.name;
					this.removeAttribute("name");
					//won't restore after a browser back operation since name changed nodes
					this.valueNode.setAttribute("name", name);
				}
				if (props.max) {
					this.focusNode.setAttribute("aria-valuemax", this.max);
				}
				if (props.min) {
					(this.handleMin || this.focusNode).setAttribute("aria-valuemin", this.min);
				}
				if (resetReversed) {
					this._refreshReversed();
				}
				if (resetCSS) {
					this._refreshCSS();
					this._updateChildren();
				}
				this._positionHandles();
			},

			/**
			 * Set handle(s) position relative to the progress bar.
			 * @private
			 */
			_positionHandles: function () {
				var currentValue = this._getValueAsArray();
				if (currentValue.length === 1) {
					currentValue = [this.min, currentValue[0]];
				}
				var toPercent = (currentValue[1] - this.min) * 100 /
						(this.max < this.min ? this.min : this.max - this.min),
					toPercentMin = (currentValue[0] - this.min) * 100 /
						(this.max < this.min ? this.min : this.max - this.min),
					s = {};
				s[this._propNames.progressBarSize] = (toPercent - toPercentMin) + "%";
				s[this._propNames.progressBarStart] = (this._reversed ? (100 - toPercent) : toPercentMin) + "%";
				domStyle.set(this.progressBar, s);
			},

			/**
			 * Add/remove and set handle as needed.
			 * @returns {Boolean} `true` if CSS classes need  to be refreshed.
			 * @private
			 */
			_refreshValueRendering: function () {
				var resetClasses,
					currentValue = this._getValueAsArray();
				if (!this.handleMin && currentValue.length === 2) {
					//two values: add handle for the second value
					this.handleMin = this._buildHandle(this.min, this.max, "first");
					this.tabStops = "handleMin,focusNode";
					resetClasses = true;
				}
				if (this.handleMin && currentValue.length === 1) {
					//one value: remove the second handle
					this.tabStops = "focusNode";
					this.handleMin._focusHandler.remove();
					this.progressBar.removeChild(this.handleMin);
					delete this.handleMin;
					resetClasses = true;
				}
				//update aria attributes
				if (this.handleMin) {
					this.handleMin.setAttribute("aria-valuenow", currentValue[0]);
					this.handleMin.setAttribute("aria-valuemax", currentValue[1]);
					this.focusNode.setAttribute("aria-valuemin", currentValue[0]);
					this.focusNode.setAttribute("aria-valuenow", currentValue[1]);
				} else {
					this.focusNode.setAttribute("aria-valuenow", currentValue[0]);
				}
				//set input field value.
				this.valueNode.value = String(this.value);
				return resetClasses;
			},

			postCreate: function () {
				this._pointerCtx = {
					offsetValue: 0,
					targetElt: null
				};
				this.own(
					on(this, "pointerdown", this._onPointerDown.bind(this)),
					on(this, "pointermove", this._onPointerMove.bind(this)),
					on(this, "lostpointercapture", this._onLostCapture.bind(this)),
					on(this, "keydown", this._onKeyDown.bind(this)),
					on(this, "keyup", this._onKeyUp.bind(this)), // fire onChange on desktop
					on(this.focusNode, "focus", this._onFocus.bind(this)),
					on(this.handleMin, "focus", this._onFocus.bind(this))
				);
				//ensure CSS are applied
				this.invalidateProperty("vertical");
				//apply default tabIndex in case the default is used.
				this.invalidateProperty("tabIndex");
				if (!isNaN(parseFloat(this.valueNode.value))) { // INPUT value
					//browser back button or value coded on INPUT
					//the valueNode value has precedence over the widget markup value
					this.value = this.valueNode.value;
				}
				//force calculation of the default value in case it is not specified.
				this.invalidateProperty("value");
			},

			startup: function () {
				//force immediate validation, otherwise in certain cases a call to slider.value returns the default
				//value declared in the markup instead of the calculated default value.
				//todo: remove in future when validate() will be called by invalidating.js
				this.validateProperties();
				//ensure input is in sync after default value is calculated
				this.valueNode.value = String(this.value);
				if (this.valueNode.getAttribute("value") === null) {
					this.valueNode.setAttribute("value", this.value);
				}
				//force children (Rule) to refresh their rendering
				this._updateChildren();
				// if the form is reset, then notify the widget to reposition the handles
				if (this.valueNode.form) {
					var self = this;
					this.own(on(this.valueNode.form, "reset", function () {
						self.defer(function () {
							if (this.value !== this.valueNode.value) {
								this.value = this.valueNode.value;
							}
						});
					}));
				}
				//Chrome: avoids text selection of elements when mouse is dragged outside of the Slider.
				this.onmousedown = function (e) {
					e.preventDefault();
				};
				//avoid unnecessary onchange if user just select and release the handle without moving it
				this.previousOnChangeValue = this.value;
				//avoid call to _handleOnChanges until default value is calculated.
				this._startHandlingOnChange = true;
			},

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
			_setMinAttr: function (value) {
				this._set("min", this._convert2Float(value, 0));
			},

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
			_setMaxAttr: function (value) {
				this._set("max", this._convert2Float(value, 100));
			},

			/**
			 * Must be a positive floating-point number. Invalid step value is defaulted to 1.
			 * @param value
			 * @private
			 */
			_setStepAttr: function (value) {
				value = this._convert2Float(value, 1);
				this._set("step", value <= 0 ? 1 : value);
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
			_calculateCorrectValue: function (value, relativeMin) {
				//value = (this.max > this.min) ? Math.min(this.max, value) : value;
				//When the element is suffering from a step mismatch, the user agent must round the element's value to
				//the nearest number for which the element would not suffer from a step mismatch, and which is greater
				//than or equal to the minimum, and, if the maximum is not less than the minimum, which is less than or
				//equal to the maximum, if there is a number that matches these constraints. If two numbers match these
				//constraints, then user agents must use the one nearest to positive infinity.
				if (value % this.step) {
					var x = Math.max(relativeMin, Math.round(value / this.step) * this.step);
					value = (this.max > relativeMin) ? Math.min(this.max, x) : x;
				}
				//When the element is suffering from an underflow, the user agent must set the element's
				//value to a valid floating-point number that represents the minimum. (spec)
				value = Math.max(relativeMin, value);
				//When the element is suffering from an overflow, if the maximum is not less than the minimum,
				//the user agent must set the element's value to a valid floating-point number that represents
				//the maximum. (spec)
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

			//jshint maxcomplexity: 12
			_onPointerDown: function (e) {
				if (this._shouldIgnoreUserInput(e)) {
					return;
				}

				var getContainerBox = function () {
					var ret = this.containerNode.getBoundingClientRect();
					return {x: ret.left, y: ret.top, w: ret.right - ret.left, h: ret.bottom - ret.top};
				}.bind(this);

				var isEligibleToSlideRange = function (currentValue, valueFromPosition, targetNode) {
					return this.slideRange &&
						currentValue[0] <= valueFromPosition &&
						currentValue[1] >= valueFromPosition &&
						targetNode !== this.focusNode && targetNode !== this.handleMin;
				}.bind(this);

				this._pointerCtx.offsetValue = 0;
				this._pointerCtx.targetElt = this.focusNode;
				this._pointerCtx.containerBox = getContainerBox();
				var currentValue = this._getValueAsArray();
				var valueFromPosition = this._calculateValueFromPointerPosition(e, this._pointerCtx.containerBox);
				var slideHandles;
				// Determine the handle targeted by the current pointer
				if (currentValue.length > 1) {
					if (isEligibleToSlideRange(currentValue, valueFromPosition, e.target)) {
						this._pointerCtx.offsetValue = valueFromPosition - currentValue[0];
						this._pointerCtx.targetElt = this.containerNode;
						slideHandles = true;
					} else {
						slideHandles = false;
						//relativePos > 0 ==> handleMin
						var relativePos = Math.abs(valueFromPosition - currentValue[1])
							- Math.abs(valueFromPosition - currentValue[0]);
						if (relativePos === 0 && (e.target === this.focusNode || e.target === this.handleMin)) {
							//same position (and selected): get the one that is above the other
							this._pointerCtx.targetElt = document.elementFromPoint(e.clientX, e.clientY);
						} else {
							if (relativePos === 0) {
								//same position (not selected): get the only one that can move to the pointer position
								relativePos = currentValue[0] -
									Math.min(this.max - this.step, Math.max(this.min + this.step, valueFromPosition));
							}
							//get the closest one
							this._pointerCtx.targetElt = (relativePos > 0) ? this.handleMin : this.focusNode;
						}
					}
				}
				this._pointerCtx.targetElt.focus();

				if (e.target !== this.focusNode && e.target !== this.handleMin) {
					if (slideHandles) {
						//this._pointerCtx.offsetValue = valueFromPosition - currentValue[0];
					} else {
						//the pointer is not above an handle, so we just set the value from the position of the pointer.
						this._setNewValue(valueFromPosition, this._pointerCtx.targetElt, false);
					}
				} else {
					//the pointer is above an handle: retain the offset which depends where the pointer coordinates are
					//the handle area
					if (currentValue.length === 1) {
						this._pointerCtx.offsetValue = valueFromPosition - currentValue[0];
					} else {
						this._pointerCtx.offsetValue = valueFromPosition -
							(this._pointerCtx.targetElt === this.handleMin ? currentValue[0] : currentValue[1]);
					}
				}
				//start capture on the target element
				dpointer.setPointerCapture(this._pointerCtx.targetElt, e.pointerId);
			},

			_onPointerMove: function (e) {
				if (e.target === this._pointerCtx.targetElt) {
					//do not fire change event
					this._setNewValue(this._calculateValueFromPointerPosition(e, this._pointerCtx.containerBox) -
						this._pointerCtx.offsetValue, e.target, false);
				}
			},

			_onLostCapture: function () {
				this._pointerCtx.targetElt = null;
				//fire change event if:
				//- the value has changed
				//- intermediateChange is true
				this._updateValue(this.value, true);
			},

			//jshint maxcomplexity: 13
			_onKeyDown: function (e) {
				if (this._shouldIgnoreUserInput(e)) {
					return;
				}
				var currentValue = this._getValueAsArray(),
					idx = (e.target === this.focusNode) ? currentValue.length - 1 : 0,
					multiplier = 1,
					newValue;
				switch (e.keyCode) {
				case keys.HOME:
					newValue = [this.min, currentValue[0]][idx];
					break;
				case keys.END:
					newValue = (e.target === this.handleMin) ? currentValue[1] : this.max;
					break;
				case keys.RIGHT_ARROW:
					multiplier = -1;
					/* falls through */
				case keys.LEFT_ARROW:
					newValue = parseFloat(currentValue[idx]) +
						multiplier * ((this.flip && !this.vertical) ? this.step : -this.step);
					break;
				case keys.DOWN_ARROW:
					multiplier = -1;
					/* falls through */
				case keys.UP_ARROW:
					newValue = parseFloat(currentValue[idx]) +
						multiplier * ((!this.flip || !this.vertical) ? this.step : -this.step);
					break;
				default:
					return;
				}
				this._setNewValue(newValue, e.target, false); // do not fire change event
				e.preventDefault();
			},

			_onKeyUp: function (e) {
				if (this._shouldIgnoreUserInput(e)) {
					return;
				}
				if (e.target === this.focusNode || e.target === this.handleMin) {
					//fire change event if:
					//- the value has changed
					//- intermediateChange is true
					this._updateValue(this.value, true);
				}
			},

			_onFocus: function (e) {
				if (this.handleMin) {
					//in case there are 2 values, ensure the handle which has the focus is above the other.
					if (e.target === this.focusNode) {
						this.focusNode.style.zIndex = 1;
						this.handleMin.style.zIndex = "auto";
					}
					if (e.target === this.handleMin) {
						this.focusNode.style.zIndex = "auto";
						this.handleMin.style.zIndex = 1;
					}
				}
			},

			/**
			 * Return true if the user input should be ignored.
			 * @param event
			 * @returns {Boolean}
			 * @private
			 */
			_shouldIgnoreUserInput: function (event) {
				return this.disabled || this.readOnly || event.altKey || event.ctrlKey || event.metaKey;
			},

			/**
			 * Read pointer coordinates and calculate the corresponding value, corrected with the step, without
			 * enforcing boundaries to allow user to slide the handle outside the boundaries to set value to min/max.
			 * @param event PointerEvent
			 * @param containerBox
			 * @private
			 */
			_calculateValueFromPointerPosition: function (event, containerBox) {
				function pixel2value(pixelValue, pixelMin, pixelMax, valMin, valMax) {
					return ((pixelValue - pixelMin) * (valMax - valMin)) / (pixelMax - pixelMin) + valMin;
				}

				var pixelMax = containerBox[this._propNames.size];
				var pixelValue = event[this._propNames.clientStart] - containerBox[this._propNames.start];
				return Math.round(pixel2value(pixelValue, this._reversed ? pixelMax : 0, this._reversed ? 0 : pixelMax,
					this.min, this.max) / this.step) * this.step;
			},

			/**
			 * Set a new value, which can be out of min/max boundaries if the handle is released outside of the
			 * widget coordinates.
			 * @param newValue the new selected value
			 * @param sourceNode the node responsible of the new selected value
			 * @param fireOnChange `true` to force change event.
			 * @private
			 */
			_setNewValue: function (newValue, sourceNode, fireOnChange) {
				//set the slider value starting from a new value which can be out of boundaries.
				//newValue: the new value to set
				//targetElt: the reference of the element which provide the new value.
				var currentValue = this._getValueAsArray();
				var updatedValue = null;
				switch (sourceNode) {
				case this.focusNode:
					updatedValue = (currentValue.length === 1) ? String(newValue) :
						Math.min(currentValue[0], newValue) + "," + newValue;
					break;
				case this.handleMin:
					updatedValue = newValue + "," + Math.max(currentValue[1], newValue);
					break;
				case this.containerNode:
					var delta = currentValue[1] - currentValue[0];
					newValue = Math.max(this.min, Math.min(newValue + delta, this.max) - delta);
					updatedValue = newValue + "," + (newValue + delta);
					break;
				}
				if (updatedValue) {
					this._updateValue(updatedValue, fireOnChange);
				}
			},

			/**
			 * Set a new value. Value must be in min/max boundaries and corrected with the step.
			 * @param updatedValue the new value to set
			 * @param fireOnChange set to true to fire a change event in these cases:
			 * - if the value changed since the last change event if intermediateChanges===false
			 * - always, if intermediateChanges===true
			 * @private
			 */
			_updateValue: function (updatedValue, fireOnChange) {
				if (updatedValue !== this.value) {
					this.value = updatedValue;
					this.validateProperties();
				}
				if (this._startHandlingOnChange) {
					//3rd argument: force onchange call if intermediateChanges===true even if value hasn't change
					//since the last change event. In such case event.intermediateChange is false.
					this._handleOnChange(this.value, fireOnChange, fireOnChange);
				}
			}
		});
});
