/** @module deliteful/StarRating */
define([
	"dcl/dcl",
	"dpointer/events",
	"requirejs-dplugins/jquery!attributes/classes",
	"delite/register",
	"delite/FormValueWidget",
	"requirejs-dplugins/i18n!./StarRating/nls/StarRating",
	"delite/theme!./StarRating/themes/{{theme}}/StarRating.css"
], function (dcl, pointer, $,
			register, FormValueWidget, messages) {

	/**
	 * A widget that displays a rating, usually with stars, and that allows setting a different rating value
	 * by touching the stars.
	 * Its custom element tag is `d-star-rating`.
	 * 
	 * @class module:deliteful/StarRating
	 * @augments module:delite/FormValueWidget
	 */
	return register("d-star-rating", [HTMLElement, FormValueWidget], /** @lends module:deliteful/StarRating# */ {
		/**
		 * The name of the CSS class of this widget.
		 * @member {string}
		 * @default "d-star-rating"
		 */
		baseClass: "d-star-rating",

		/**
		 * The maximum rating, that is also the number of stars to show.
		 * @member {number}
		 * @default 5
		 */
		max: 5,

		/**
		 * The current value of the Rating.
		 * @member {number}
		 * @default 0
		 */
		value: 0,

		/**
		 * Indicates whether the user is allowed to edit half values (0.5, 1.5, ...) or not.
		 * Ignored if readOnly is set to false.
		 * @member {boolean}
		 * @default false
		 */
		editHalfValues: false,

		/**
		 * Indicates whether the user is allowed to set the value to zero or not.
		 * @member {boolean}
		 * @default true
		 */
		allowZero: true,

		/* internal properties */

		/*=====
		_hoveredValue: null,
		_startHandles: null,
		_keyDownHandle: null,
		=====*/
		_hovering: false,
		_otherEventsHandles: [],

		render: function () {
			this.focusNode = this.ownerDocument.createElement("div");
			this.appendChild(this.focusNode);
			pointer.setTouchAction(this, "none");
			// init WAI-ARIA attributes
			this.focusNode.setAttribute("role", "slider");
			this.focusNode.setAttribute("aria-valuemin", 0);
			this.valueNode.style.display = "none";
			if (!this.valueNode.parentNode) {
				this.appendChild(this.valueNode);
			}
		},

		/* jshint maxcomplexity: 13 */
		refreshRendering: function (props) {
			if ("disabled" in props) {
				$(this).toggleClass(this.baseClass + "-disabled", this.disabled);
			}
			if ("readOnly" in props) {
				$(this).toggleClass(this.baseClass + "-readonly", this.readOnly);
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
				$(this).addClass(this.baseClass + "-hovered");
			}
			var newValue = event.target.value;
			if (newValue !== undefined) {
				if (this._hovering) {
					if (newValue !== this._hoveredValue) {
						$(this).addClass(this.baseClass + "-hovered");
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
				$(this).removeClass(this.baseClass + "-hovered");
			}
		},

		_pointerLeaveHandler: function () {
			if (this._hovering) {
				this._hovering = false;
				this._hoveredValue = null;
				$(this).removeClass(this.baseClass + "-hovered");
				this._updateStars(this.value, false);
			}
			this._removeEventsHandlers();
		},

		_keyDownHandler: function (/*Event*/ event) {
			var incrementArrow = this.effectiveDir === "ltr" ? "ArrowRight" : "ArrowLeft",
				decrementArrow = this.effectiveDir === "ltr" ? "ArrowLeft" : "ArrowRight";

			switch (event.key) {
			case incrementArrow:
			case "ArrowUp":
			case "Add":
				event.preventDefault();
				this._incrementValue();
				break;
			case decrementArrow:
			case "ArrowDown":
			case "Subtract":
				event.preventDefault();
				this._decrementValue();
				break;
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
				$(this._zeroSettingArea).addClass("d-hidden");
				delete this.focusNode.value;
			} else {
				$(this._zeroSettingArea).removeClass("d-hidden");
				// _zeroSettingArea might not fill the whole widget height
				// so pointer events can land in the underlying focus node
				this.focusNode.value = 0;
			}
		}
	});
});
