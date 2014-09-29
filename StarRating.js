/** @module deliteful/StarRating */
define([
	"requirejs-dplugins/has",
	"dpointer/events",
	"dojo/keys",
	"dojo/dom-class",
	"delite/register",
	"delite/FormValueWidget",
	"requirejs-dplugins/has!bidi?./StarRating/bidi/StarRating",
	"requirejs-dplugins/i18n!./StarRating/nls/StarRating",
	"delite/uacss", // to use dedicated CSS styles in IE9
	"delite/theme!./StarRating/themes/{{theme}}/StarRating.css",
	"requirejs-dplugins/has!bidi?delite/theme!./StarRating/themes/{{theme}}/StarRating_rtl.css"
], function (has, pointer, keys, domClass,
			register, FormValueWidget, BidiStarRating, messages) {

	/**
	 * A widget that displays a rating, usually with stars, and that allows setting a different rating value
	 * by touching the stars.
	 * Its custom element tag is `d-star-rating`.
	 * 
	 * See the {@link https://github.com/ibm-js/deliteful/tree/master/docs/StarRating.md user documentation}
	 * for more details.
	 * 
	 * @class module:deliteful/StarRating
	 * @augments delite/FormValueWidget
	 */
	var StarRating = register.dcl([FormValueWidget], /** @lends module:deliteful/StarRating# */ {
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
		 * Indicates whether the user is allowed to edit half values (0.5, 1.5, ...) or not.
		 * Ignored if readOnly is set to false.
		 * @member {boolean}
		 */
		editHalfValues: false,

		/**
		 * Indicates whether the user is allowed to set the value to zero or not.
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

		render: function () {
			this.focusNode = this.ownerDocument.createElement("div");
			this.appendChild(this.focusNode);
			pointer.setTouchAction(this, "none");
			// init WAI-ARIA attributes
			this.focusNode.setAttribute("role", "slider");
			this.focusNode.setAttribute("aria-valuemin", 0);
		},

		createdCallback: register.after(function () {
			var inputs = this.getElementsByTagName("INPUT");
			if (inputs.length) {
				this.valueNode = inputs[0];
				if (!isNaN(parseFloat(this.valueNode.value))) {
					this.value = this.valueNode.value;
				}
				this.valueNode.style.display = "none";
			} else {
				this.valueNode = this.ownerDocument.createElement("input");
				this.valueNode.style.display = "none";
				this.appendChild(this.valueNode);
			}
			["disabled", "max", "value", "name", "readOnly", "allowZero"].forEach(function (prop) {
				this.notifyCurrentValue(prop);
			}, this);
		}),

		/* jshint maxcomplexity: 13 */
		refreshRendering: function (props) {
			if ("disabled" in props) {
				domClass.toggle(this, this.baseClass + "-disabled", this.disabled);
			}
			if ("max" in props) {
				this.focusNode.setAttribute("aria-valuemax", this.max);
			}
			if ("max" in props || "value" in props) {
				this._refreshStarsRendering();
			}
			if ("value" in props) {
				this.focusNode.setAttribute("aria-valuenow", this.value);
				this.focusNode.setAttribute("aria-valuetext",
						messages["aria-valuetext"].replace("${value}", this.value));
				this.valueNode.value = this.value;
			}
			if ("name" in props && this.name) {
				this.valueNode.name = this.name;
			}
			if ("readOnly" in props || "disabled" in props) {
				this._refreshEditionEventHandlers();
			}
			if ("readOnly" in props || "disabled" in props || "allowZero" in props) {
				this._updateZeroArea();
			}
		},
		/* jshint maxcomplexity: 10 */

		_refreshStarsRendering: function () {
			var createChildren = this.focusNode.children.length - 1 !== 2 * this.max;
			if (createChildren) {
				this.focusNode.innerHTML = "";
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
				this._startHandles = [this.on("pointerover", this._pointerOverHandler.bind(this)),
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
				this._otherEventsHandles.push(this.on("pointerup", this._pointerUpHandler.bind(this)));
				this._otherEventsHandles.push(this.on("pointerleave", this._pointerLeaveHandler.bind(this)));
				this._otherEventsHandles.push(this.on("pointercancel", this._pointerLeaveHandler.bind(this)));
			}
		},

		_pointerOverHandler: function (/*Event*/ event) {
			this._wireHandlers();
			if (!this._hovering && event.pointerType === "mouse") {
				this._hovering = true;
				domClass.add(this, this.baseClass + "-hovered");
			}
			var newValue = event.target.value;
			if (newValue !== undefined) {
				if (this._hovering) {
					if (newValue !== this._hoveredValue) {
						domClass.add(this, this.baseClass + "-hovered");
						this._updateStars(newValue, false);
						this._hoveredValue = newValue;
					}
				} else {
					// Set the previous value here, as this handler is called before _onFocus
					this._previousOnChangeValue = this.value;
					this.handleOnChange(newValue);
				}
			}
		},

		_pointerUpHandler: function (/*Event*/ event) {
			var value = event.target.value;
			if (value !== undefined) {
				this.handleOnChange(value);
			}
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
				this._updateStars(this.value, false);
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

		_updateStars: function (/*Number*/value, /*Boolean*/create) {
			var stars = this.focusNode.querySelectorAll("div");
			if (create) {
				this._zeroSettingArea = this.ownerDocument.createElement("div");
				this._zeroSettingArea.className = this.baseClass + "-zero";
				this._zeroSettingArea.value = 0;
				this.focusNode.appendChild(this._zeroSettingArea);
				this._updateZeroArea();
			}
			for (var i = 0; i < 2 * this.max; i++) {
				var starClass = this.baseClass + (i % 2 ? "-end " : "-start ");
				if ((i + 1) * 0.5 <= value) {
					starClass += this.baseClass + "-full";
				} else {
					starClass += this.baseClass + "-empty";
				}
				if (create) {
					var parent = this.ownerDocument.createElement("div");
					parent.value = this.editHalfValues ? (i + 1) / 2 : Math.ceil((i + 1) / 2);
					this.focusNode.appendChild(parent);
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
				delete this._zeroAreaWidth;
			}
		}
	});

	return register("d-star-rating",
			has("bidi") ? [HTMLElement, StarRating, BidiStarRating] : [HTMLElement, StarRating]);
});
