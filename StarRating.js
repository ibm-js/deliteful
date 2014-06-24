/** @module deliteful/StarRating */
define([
    "dcl/dcl",
	"dojo/string",
	"requirejs-dplugins/has",
	"dojo/on",
	"dpointer/events",
	"dojo/keys",
	"dojo/dom-construct",
	"dojo/dom-class",
	"dojo/dom-geometry",
	"delite/register",
	"delite/Widget",
	"delite/Invalidating",
	"requirejs-dplugins/has!bidi?./StarRating/bidi/StarRating",
	"requirejs-dplugins/i18n!./StarRating/nls/StarRating",
	"delite/uacss", // to use dedicated CSS styles in IE9
	"delite/theme!./StarRating/themes/{{theme}}/StarRating_css",
	"requirejs-dplugins/has!bidi?delite/theme!./StarRating/themes/{{theme}}/StarRating_rtl_css"
], function (dcl, string, has, on, pointer, keys, domConstruct, domClass, domGeometry,
			register, Widget, Invalidating, BidiStarRating, messages) {

	/**
	 * A widget that displays a rating, usually with stars, and that allows setting a different rating value
	 * by touching the stars.
	 * 
	 * This widget shows the rating using an image sprite that contains full stars, half stars and
	 * empty stars.
	 * The star displayed can be fully customized by redefining the following css classes in
	 * your application:
	 * ``` css
	 * .d-star-rating-star-icon:before {content: url(url_to_the_stars_sprite);}
	 * .d-star-rating-disabled .d-star-rating-star-icon:before {content: url(url_to_the_disabled_stars_sprite);}
	 * ```
	 * 
	 * If the custom stars are not 40px height and width images, you also have to redefine the
	 * following CSS classes:
	 * ``` css
	 * .d-star-rating-star-icon {height: iconSize; width: iconSize;}
	 * .d-star-rating-empty-star:before {margin-left: -iconSize}
	 * .d-star-rating-half-star:before {margin-left: -2*iconSize}
	 * .d-star-rating.d-rtl .d-star-rating-full-star:before {margin-left: 0px; margin-right: -3*iconSize}
	 * .d-star-rating.d-rtl .d-star-rating-empty-star:before {margin-left: 0px; margin-right: -2*iconSize}
	 * .d-star-rating.d-rtl .d-star-rating-half-star:before {margin-left: 0px;}
	 * .d-star-rating-zero {height: iconSize; width: iconSize/2;}
	 * ```
	 * 
	 * The widget can be used in read-only or in editable mode. In editable mode, the widget allows
	 * to set the rating to 0 stars or not using the allowZero property. In this mode, it also allows
	 * to set half values or not using the editHalfValues property.
	 * 
	 * This widget supports right to left direction.
	 * 
	 * @class module:deliteful/StarRating
	 * @augments delite/Widget
	 * @augments delite/Invalidating
	 */
	var StarRating = dcl([Widget, Invalidating], /** @lends module:deliteful/StarRating# */ {

		/**
		 * The name of the CSS class of this widget.
		 * @member {string}
		 */
		baseClass: "d-star-rating",

		/**
		 * The maximum rating, that is also the number of stars to show.
		 * @member {number}
		 */
		max: 5,

		/**
		 * The current value of the Rating.
		 * @member {number}
		 */
		value: 0,

		/**
		 * If false, the widget is editable and allows editing the value of the Rating
		 * by touching / clicking the stars
		 * @member {boolean}
		 */
		readOnly: false,

		/**
		 * Mandatory if using the star rating widget in a form, in order to have its value submitted
		 * @member {string}
		 */
		name: "",

		/**
		 * if true, the widget is disabled (its value will not be submitted if it is included in a form).
		 * @member {boolean}
		 */
		disabled: false,

		/**
		 * If the Rating is not read only, define if the user allowed to edit half values (0.5, 1.5, ...)
		 * @member {boolean}
		 */
		editHalfValues: false,

		/**
		 * True to allow setting a value of zero, false otherwise
		 * @member {boolean}
		 */
		allowZero: true,

		/* internal properties */

		/*=====
		_zeroAreaWidth: 1,
		_enterValue: null,
		_hoveredValue: null,
		_startHandles: null,
		_keyDownHandle: null,
		=====*/
		_hovering: false,
		_otherEventsHandles: [],
		_incrementKeyCodes: [keys.RIGHT_ARROW, keys.UP_ARROW, keys.NUMPAD_PLUS], // keys to press to increment value
		_decrementKeyCodes: [keys.LEFT_ARROW, keys.DOWN_ARROW, keys.NUMPAD_MINUS], // keys to press to decrement value

		preCreate: function () {
			this.addInvalidatingProperties("max",
					"name",
					"value",
					"readOnly",
					"disabled",
					"editHalfValues",
					"allowZero");
		},

		createdCallback: dcl.after(function () {
			pointer.setTouchAction(this, "none");
			var inputs = this.getElementsByTagName("INPUT");
			if (inputs.length) {
				this.valueNode = inputs[0];
				if (!isNaN(parseFloat(this.valueNode.value))) {
					this.value = this.valueNode.value;
				}
				this.valueNode.style.display = "none";
			} else {
				this.valueNode = domConstruct.create("input",
						{type: "number",
						 name: this.name,
						 value: this.value,
						 readOnly: this.readOnly,
						 disabled: this.disabled,
						 style: "display: none;"},
						this, "last");
			}

			// init WAI-ARIA attributes
			this.setAttribute("role", "slider");
			this.setAttribute("aria-valuemin", 0);
			// init tabIndex if not explicitly set
			if (!this.hasAttribute("tabindex")) {
				this.setAttribute("tabindex", "0");
			}

			this.refreshRendering(this);
		}),

		/* jshint maxcomplexity: 13 */
		refreshRendering: function (props) {
			if (props.disabled !== undefined) {
				this._refreshDisabledClass();
			}
			if (props.max !== undefined) {
				this.setAttribute("aria-valuemax", this.max);
			}
			if (props.max !== undefined || props.value !== undefined) {
				this._refreshStarsRendering();
			}
			if (props.value !== undefined) {
				this.setAttribute("aria-valuenow", this.value);
				this.setAttribute("aria-valuetext", string.substitute(messages["aria-valuetext"], this));
				this.valueNode.value = this.value;
			}
			if (props.name !== undefined && this.name) {
				this.valueNode.name = this.name;
			}
			if (props.readOnly !== undefined || props.disabled !== undefined) {
				var passive = this.disabled || this.readOnly;
				this.setAttribute("aria-disabled", passive);
				this._refreshEditionEventHandlers();
				this.valueNode.readOnly = this.readOnly;
				this.valueNode.disabled = this.disabled;
			}
			if (props.readOnly !== undefined || props.disabled !== undefined || props.allowZero !== undefined) {
				this._updateZeroArea();
			}
		},
		/* jshint maxcomplexity: 10 */

		_refreshDisabledClass: function () {
			if (this.disabled) {
				domClass.add(this, this.baseClass + "-disabled");
			} else {
				domClass.remove(this, this.baseClass + "-disabled");
			}
		},

		_refreshStarsRendering: function () {
			var createChildren = this.children.length - 2 !== this.max;
			if (createChildren) {
				// Not relying on live NodeList, due to: https://github.com/Polymer/polymer/issues/346
				Array.prototype.slice.call(this.getElementsByTagName("DIV")).forEach(this.removeChild, this);
			}
			this._updateStars(this.value, createChildren);
		},

		_refreshEditionEventHandlers: function () {
			var passive = this.disabled || this.readOnly;
			if (!passive && !this._keyDownHandle) {
				this._keyDownHandle = this.on("keydown", this._keyDownHandler.bind(this));
			} else if (passive && this._keyDownHandle) {
				this._keyDownHandle.remove();
				this._keyDownHandle = null;
			}
			if (!passive && !this._startHandles) {
				this._startHandles = [this.on("pointerenter", this._pointerEnterHandler.bind(this)),
									  this.on("pointerdown", this._wireHandlers.bind(this))];
			} else if (passive && this._startHandles) {
				while (this._startHandles.length) {
					this._startHandles.pop().remove();
				}
				this._startHandles = null;
			}
		},

		_removeEventsHandlers: function () {
			while (this._otherEventsHandles.length) {
				this._otherEventsHandles.pop().remove();
			}
		},

		_wireHandlers: function () {
			if (!this._otherEventsHandles.length) {
				// handle move on the stars strip
				this._otherEventsHandles.push(this.on("pointermove", this._pointerMoveHandler.bind(this)));
				// handle the end of the value editing
				this._otherEventsHandles.push(this.on("pointerup", this._pointerUpHandler.bind(this)));
				this._otherEventsHandles.push(this.on("pointerleave", this._pointerLeaveHandler.bind(this)));
				this._otherEventsHandles.push(this.on("pointercancel", this._pointerLeaveHandler.bind(this)));
			}
		},

		_pointerEnterHandler: function (/*Event*/ event) {
			this._wireHandlers();

			if (event.pointerType === "mouse") {
				this._hovering = true;
				domClass.add(this, this.baseClass + "-hovered");
			}

			this._enterValue = this.value;
		},

		_pointerMoveHandler: function (/*Event*/ event) {
			var newValue = this._coordToValue(event);
			if (this._hovering) {
				if (newValue !== this._hoveredValue) {
					domClass.add(this, this.baseClass + "-hovered");
					this._updateStars(newValue, false);
					this._hoveredValue = newValue;
				}
			} else {
				this.value = newValue;
			}
		},

		_pointerUpHandler: function (/*Event*/ event) {
			this.value = this._coordToValue(event);
			this._enterValue = this.value;
			if (!this._hovering) {
				this._removeEventsHandlers();
			} else {
				domClass.remove(this, this.baseClass + "-hovered");
			}
		},

		/*jshint unused:vars */
		_pointerLeaveHandler: function (/*Event*/ event) {
			if (this._hovering) {
				this._hovering = false;
				this._hoveredValue = null;
				domClass.remove(this, this.baseClass + "-hovered");
				this.value = this._enterValue;
			}
			this._removeEventsHandlers();
		},

		_keyDownHandler: function (/*Event*/ event) {
			if (this._incrementKeyCodes.indexOf(event.keyCode) !== -1) {
				event.preventDefault();
				this._incrementValue();
			} else if (this._decrementKeyCodes.indexOf(event.keyCode) !== -1) {
				event.preventDefault();
				this._decrementValue();
			}
		},

		_incrementValue: function () {
			if (this.value < this.max) {
				this.value = this.value + (this.editHalfValues ? 0.5 : 1);
			}
		},

		_decrementValue: function () {
			if (this.value > (this.allowZero ? 0 : (this.editHalfValues ? 0.5 : 1))) {
				this.value = this.value - (this.editHalfValues ? 0.5 : 1);
			}
		},

		_coordToValue: function (/*Event*/event) {
			var box = domGeometry.position(this, false);
			var xValue = event.clientX - box.x;
			var rawValue = null, discreteValue;
			// fix off values observed on leave event
			if (xValue < 0) {
				xValue = 0;
			} else if (xValue > box.w) {
				xValue = box.w;
			}
			if (this._inZeroSettingArea(xValue, box.w)) {
				return 0;
			} else {
				rawValue = this._xToRawValue(xValue, box.w);
			}
			if (rawValue != null) {
				if (rawValue === 0) {
					rawValue = 0.1; // do not allow setting the value to 0 when clicking on a star
				}
				discreteValue = Math.ceil(rawValue);
				if (this.editHalfValues && (discreteValue - rawValue) > 0.5) {
					discreteValue -= 0.5;
				}
				return discreteValue;
			}
		},

		/*jshint unused:vars*/
		_inZeroSettingArea: function (/*Number*/x, /*Number*/domNodeWidth) {
			return x < this._zeroAreaWidth;
		},

		_xToRawValue: function (/*Number*/x, /*Number*/domNodeWidth) {
			var starStripLength = domNodeWidth - this._zeroAreaWidth;
			return (x - this._zeroAreaWidth) / (starStripLength / this.max);
		},

		_updateStars: function (/*Number*/value, /*Boolean*/create) {
			var stars = this.querySelectorAll("div");
			if (create) {
				this._zeroSettingArea = domConstruct.create("div", {}, this.valueNode, "before");
				this._zeroSettingArea.className = this.baseClass + "-zero ";
				this._updateZeroArea();
			}
			for (var i = 0; i < this.max; i++) {
				if (i <= value - 1) {
					var starClass = this.baseClass + "-full-star";
				} else if (i >= value) {
					starClass = this.baseClass + "-empty-star";
				} else {
					starClass = this.baseClass + "-half-star";
				}
				if (create) {
					var parent = domConstruct.create("div", {}, this.valueNode, "before");
				} else {
					parent = stars[i + 1];
				}
				parent.className = this.baseClass + "-star-icon " + starClass;
			}
		},

		_updateZeroArea: function () {
			if (this.readOnly || !this.allowZero) {
				domClass.add(this._zeroSettingArea, "d-hidden");
				this._zeroAreaWidth = 0;
			} else {
				domClass.remove(this._zeroSettingArea, "d-hidden");
				this._zeroAreaWidth = domGeometry.position(this._zeroSettingArea, false).w;
			}
		}
	});

	return register("d-star-rating",
			has("bidi") ? [HTMLElement, StarRating, BidiStarRating] : [HTMLElement, StarRating]);
});
