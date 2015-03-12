/** @module deliteful/SwapView */
define([
	"dcl/dcl", "delite/register", "delite/keys",
	"requirejs-dplugins/jquery!attributes/classes",
	"dpointer/events", "./ViewStack",
	"delite/theme!./SwapView/themes/{{theme}}/SwapView.css"
], function (dcl, register, keys, $, dpointer, ViewStack) {
	/**
	 * SwapView container widget. Extends ViewStack to let the user swap the visible child using a swipe gesture.
	 * You can also use the Page Up / Down keyboard keys to go to the next/previous child.
	 *
	 * @example:
	 * <d-swap-view id="sv">
	 *     <div id="childA">...</div>
	 *     <div id="childB">...</div>
	 *     <div id="childC">...</div>
	 * </d-swap-view>
	 * @class module:deliteful/SwapView
	 * @augments module:deliteful/ViewStack
	 */
	return register("d-swap-view", [HTMLElement, ViewStack], /** @lends module:deliteful/SwapView# */{
		/**
		 * The name of the CSS class of this widget. Note that this element also use the d-view-stack class to
		 * leverage `deliteful/ViewStack` styles.
		 * @member {string}
		 * @default "d-swap-view"
		 */
		baseClass: "d-swap-view",

		/**
		 * Drag threshold: drag will start only if the user moves the pointer more than this threshold.
		 * @member {number}
		 * @default 10
		 * @private
		 */
		_dragThreshold: 10,

		/**
		 * Swap threshold: number between 0 and 1 that determines the minimum swipe gesture to swap the view.
		 * Default is 0.25 which means that you must drag (horizontally) by more than 1/4 of the view size to swap
		 * views.
		 * @member {number}
		 * @default 0.25
		 */
		swapThreshold: 0.25,

		render: function () {
			dpointer.setTouchAction(this, "pan-y");
		},

		attachedCallback: function () {
			// If the user hasn't specified a tabindex declaratively, then set to default value.
			if (!this.hasAttribute("tabindex")) {
				this.tabIndex = "0";
			}
		},

		preRender: function () {
			// we want to inherit from ViewStack's CSS (including transitions).
			$(this).addClass("d-view-stack");
		},

		postRender: function () {
			this.on("pointerdown", this._pointerDownHandler.bind(this));
			this.on("pointermove", this._pointerMoveHandler.bind(this));
			this.on("pointerup", this._pointerUpHandler.bind(this));
			this.on("lostpointercapture", this._pointerUpHandler.bind(this));
			this.on("pointercancel", this._pointerUpHandler.bind(this));
			this.on("keydown", this._keyDownHandler.bind(this));
		},

		/**
		 * Starts drag/swipe interaction.
		 * @private
		 */
		_pointerDownHandler: function (e) {
			if (!this._drag) {
				this._drag = { start: e.clientX };
				dpointer.setPointerCapture(e.target, e.pointerId);
			}
		},

		/**
		 * Handle pointer move events during drag/swipe interaction.
		 * @private
		 */
		_pointerMoveHandler: function (e) {
			/* jshint maxcomplexity: 13 */
			if (this._drag) {
				var dx = e.clientX - this._drag.start;
				if (!this._drag.started && Math.abs(dx) > this._dragThreshold) {
					// user dragged (more than the threshold), start sliding children.
					var childOut = this._visibleChild;
					var childIn = (this.effectiveDir === "ltr" ? dx < 0 : dx > 0) ? childOut.nextElementSibling :
						childOut.previousElementSibling;
					if (childIn) {
						this._drag.childOut = childOut;
						this._drag.childIn = childIn;
						this._drag.started = true;
						this._drag.ended = false;

						this._drag.reverse = dx > 0;

						$(this).addClass("-d-swap-view-drag");

						childIn.style.visibility = "visible";
						childIn.style.display = "";
					}
				}
				if (this._drag.started && !this._drag.ended) {
					// This is what will really translate the children as the user swipes/drags.
					var rx = this._drag.rx = dx / this.offsetWidth;

					var v = this._drag.reverse ? rx : -rx;

					var lv = Math.floor((this._drag.reverse ? 1 - v : v) * 100);
					var rv = Math.floor((this._drag.reverse ? v : 1 - v) * 100);

					var left = this._drag.reverse ? this._drag.childIn : this._drag.childOut;
					var right = this._drag.reverse ? this._drag.childOut : this._drag.childIn;

					this._setTranslation(left, -lv);
					this._setTranslation(right, rv);
				}
			}
		},

		/**
		 * Handle end of drag/swipe interaction.
		 * @private
		 */
		_pointerUpHandler: function () {
			if (this._drag) {
				if (!this._drag.started) {
					// abort before user really dragged
					this._drag = null;
				} else if (!this._drag.ended) {
					// user released finger/mouse
					this._drag.ended = true;

					this._setupTransitionEndHandlers();

					this._setTransitionProperties(this._drag.childIn);
					this._setTransitionProperties(this._drag.childOut);

					if ((this._drag.reverse && this._drag.rx > this.swapThreshold) ||
						(!this._drag.reverse && this._drag.rx < -this.swapThreshold)) {
						// user dragged more than the swap threshold: finish sliding to the next/prev child.
						this._setTranslation(this._drag.childIn, 0);
						this._setTranslation(this._drag.childOut, this._drag.reverse ? 100 : -100);
					} else {
						// user dragged less then the swap threshold: slide back to the current child.
						this._drag.slideBack = true;
						this._setTranslation(this._drag.childIn, this._drag.reverse ? -100 : 100);
						this._setTranslation(this._drag.childOut, 0);
					}
				}
			}
		},

		/**
		 * Handle Page Up/Down keys to show the previous/next child.
		 * @private
		 */
		_keyDownHandler: function (e) {
			switch (e.keyCode) {
			case keys.PAGE_UP:
				this.showNext();
				break;
			case keys.PAGE_DOWN:
				this.showPrevious({reverse: true});
				break;
			}
		},

		_setupTransitionEndHandlers: function () {
			// set listeners to cleanup all CSS classes after the slide transition (either from ViewStack::show,
			// of from the slide back animation).
			if (!this._endTransitionHandler) {
				this._endTransitionHandler = function () {
					if (this._endTransitionHandler) {
						this._addTransitionEndHandlers(this._drag.childIn, false);
						this._addTransitionEndHandlers(this._drag.childOut, false);
						this._endTransitionHandler = null;
					}
					this._endTransition();
				}.bind(this);
				this._addTransitionEndHandlers(this._drag.childIn, true);
				this._addTransitionEndHandlers(this._drag.childOut, true);
			}
		},

		/**
		 * Cleanup all CSS classes and added rules after transition.
		 * @private
		 */
		_endTransition: function () {
			if (this._drag) {
				$(this).removeClass("-d-swap-view-drag");

				if (this._drag.slideBack) {
					// Hide the "in" view if the wap was cancelled (slide back).
					this._drag.childIn.style.visibility = "hidden";
					this._drag.childIn.style.display = "none";
				} else {
					this._drag.childOut.style.visibility = "hidden";
					this._drag.childOut.style.display = "none";
					this.show(this._drag.childIn, {transition: "none"});
				}

				this._clearTransitionProperties(this._drag.childIn);
				this._clearTransitionProperties(this._drag.childOut);

				this._clearTranslation(this._drag.childIn);
				this._clearTranslation(this._drag.childOut);

				this._drag = null;
			}
		},

		// CSS/events utilities

		_addTransitionEndHandlers: function (child, add) {
			var m = (add ? "add" : "remove") + "EventListener";
			child[m]("webkitTransitionEnd", this._endTransitionHandler);
			child[m]("transitionend", this._endTransitionHandler); // IE10 + FF
		},

		_setTransitionProperties: function (child) {
			child.style.webkitTransitionProperty = "-webkit-transform";
			child.style.transitionProperty = "transform";
			child.style.webkitTransitionDuration = "0.3s";
			child.style.mozTransitionDuration = "0.3s";
			child.style.transitionDuration = "0.3s";
		},

		_clearTransitionProperties: function (child) {
			child.style.webkitTransitionProperty = "";
			child.style.transitionProperty = "";
			child.style.webkitTransitionDuration = "";
			child.style.mozTransitionDuration = "";
			child.style.transitionDuration = "";
		},

		_setTranslation: function (child, percent) {
			var t = "translate3d(" + percent + "%, 0, 0)";
			child.style.webkitTransform = t;
			child.style.transform = t;
		},

		_clearTranslation: function (child) {
			child.style.webkitTransform = "";
			child.style.transform = "";
		}
	});
});
