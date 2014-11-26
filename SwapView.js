/** @module deliteful/SwapView */
define([
	"dcl/dcl", "delite/register", "delite/keys", "dojo/dom-class", "dpointer/events", "./ViewStack",
	"delite/theme!./SwapView/themes/{{theme}}/SwapView.css"
], function (dcl, register, keys, domClass, dpointer, ViewStack) {
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
		 * The name of the CSS class of this widget.
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
		 * Default is 0.5 which means that you must drag (horizontally) by more than half the view size to swap views.
		 * @member {number}
		 * @default 0.5
		 */
		swapThreshold: 0.5,

		attachedCallback: function () {
			// If the user hasn't specified a tabindex declaratively, then set to default value.
			if (!this.hasAttribute("tabindex")) {
				this.tabIndex = "0";
			}
		},

		postRender: function () {
			// we want to inherit from ViewStack's CSS (including transitions).
			domClass.add(this, "d-view-stack");

			this.on("pointerdown", this._pointerDownHandler.bind(this));
			this.on("pointermove", this._pointerMoveHandler.bind(this));
			this.on("lostpointercapture", this._lostCaptureHandler.bind(this));
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
			if (this._drag) {
				var dx = e.clientX - this._drag.start;
				if (!this._drag.started && Math.abs(dx) > this._dragThreshold) {
					// user dragged (more than the threshold), start sliding children.
					var childOut = this._visibleChild;
					var childIn = (this.isLeftToRight() ? dx < 0 : dx > 0) ? childOut.nextElementSibling :
						childOut.previousElementSibling;
					if (childIn) {
						this._drag.childOut = childOut;
						this._drag.childIn = childIn;
						this._drag.started = true;
						this._drag.ended = false;

						var reverse = this._drag.reverse = dx > 0;

						childIn.style.visibility = "visible";
						childIn.style.display = "";

						domClass.add(this, "-d-swap-view-drag");

						domClass.add(childOut, "-d-swap-view-out");
						domClass.add(childIn, "-d-swap-view-in");
						if (reverse) {
							domClass.add(childOut, "-d-swap-view-reverse");
							domClass.add(childIn, "-d-swap-view-reverse");
						}
					}
				}
				if (this._drag.started && !this._drag.ended) {
					// This is what will really slide the children as the user swipes/drags.
					this._setRules(Math.abs(dx / this.offsetWidth));
				}
			}
		},

		/**
		 * Handle end of drag/swipe interaction.
		 * @private
		 */
		_lostCaptureHandler: function (e) {
			if (this._drag) {
				if (!this._drag.started) {
					// abort before user really dragged
					this._drag = null;
				} else if (!this._drag.ended) {
					// user released finger/mouse
					this._drag.ended = true;
					var rx = (e.clientX - this._drag.start) / this.offsetWidth;
					this._addTransitionEndHandlers();
					if ((this._drag.reverse && rx > this.swapThreshold) ||
						(!this._drag.reverse && rx < -this.swapThreshold)) {
						// user dragged more than the swap threshold: finish sliding to the next/prev child.
						this.show(this._drag.childIn,
							{ transition: "slide", reverse: this.isLeftToRight() ? this._drag.reverse :
								!this._drag.reverse });
					} else {
						// user dragged less then the swap threshold: slide back to the current child.
						domClass.add(this._drag.childOut, "-d-swap-view-slide-back");
						domClass.add(this._drag.childIn, "-d-swap-view-slide-back");
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

		_addTransitionEndHandlers: function () {
			// set listeners to cleanup all CSS classes after the slide transition (either from ViewStack::show,
			// of from the slide back animation).
			if (!this._cleanupHandler) {
				this._cleanupHandler = function () {
					if (this._cleanupHandler) {
						this._drag.childIn.removeEventListener("webkitTransitionEnd", this._cleanupHandler);
						this._drag.childIn.removeEventListener("transitionend", this._cleanupHandler); // IE10 + FF
						this._drag.childOut.removeEventListener("webkitTransitionEnd", this._cleanupHandler);
						this._drag.childOut.removeEventListener("transitionend", this._cleanupHandler); // IE10 + FF
						this._cleanupHandler = null;
					}
					this._cleanup();
				}.bind(this);
				this._drag.childIn.addEventListener("webkitTransitionEnd", this._cleanupHandler);
				this._drag.childIn.addEventListener("transitionend", this._cleanupHandler); // IE10 + FF
				this._drag.childOut.addEventListener("webkitTransitionEnd", this._cleanupHandler);
				this._drag.childOut.addEventListener("transitionend", this._cleanupHandler); // IE10 + FF
			}
		},

		/**
		 * Cleanup all CSS classes and added rules after transition.
		 * @private
		 */
		_cleanup: function () {
			if (this._drag) {
				domClass.remove(this, "-d-swap-view-drag");
				if (this._drag.childOut) {
					domClass.remove(this._drag.childOut, [
						"-d-swap-view-out", "-d-swap-view-reverse", , "-d-swap-view-slide-back"
					]);
				}
				if (this._drag.childIn) {
					if (domClass.contains(this._drag.childIn, "-d-swap-view-slide-back")) {
						// Hide the "in" view if the wap was cancelled (slide back).
						this._drag.childIn.style.visibility = "hidden";
						this._drag.childIn.style.display = "none";
					}
					domClass.remove(this._drag.childIn, [
						"-d-swap-view-in", "-d-swap-view-reverse", , "-d-swap-view-slide-back"
					]);
				}
				this._clearRules();
				this._drag = null;
			}
		},

		/**
		 * Looks for CSS rules used to define the drag effect (they are identified by the .-d-swap-view-drag selector),
		 * and replaces "100%" by the percentage corresponding to the current swipe position.
		 * @private
		 */
		_setRules: function (v) {

			var lv = Math.floor((this._drag.reverse ? 1 - v : v) * 100);
			var rv = Math.floor((this._drag.reverse ? v : 1 - v) * 100);

			if (!this._sheet) {
				var style = document.createElement("style");
				style.appendChild(document.createTextNode(""));
				document.head.appendChild(style);
				this._sheet = style.sheet;
			}
			this._clearRules();

			var sheets = document.styleSheets;
			for (var i = 0; i < sheets.length; i++) {
				if (sheets[i] !== this._sheet) {
					var rules = sheets[i].cssRules;
					for (var j = 0; j < rules.length; j++) {
						var r = rules[j];
						var t = r.cssText;
						if (t.match(".-d-swap-view-drag")) {
							this._sheet.insertRule(t.replace(/-100/g, -lv).replace(/100/g, rv), 0);
						}
					}
				}
			}
		},

		/**
		 * Removes all rules added by _setRules.
		 * @private
		 */
		_clearRules: function () {
			if (this._sheet) {
				while (this._sheet.cssRules.length > 0) {
					this._sheet.deleteRule(0);
				}
			}
		}
	});
});
