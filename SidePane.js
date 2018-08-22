/** @module deliteful/SidePane */
define([
	"dcl/dcl",
	"dpointer/events",
	"requirejs-dplugins/jquery!attributes/classes",
	"decor/sniff",
	"delite/register",
	"delite/DisplayContainer",
	"requirejs-dplugins/Promise!",
	"delite/theme!./SidePane/themes/{{theme}}/SidePane.css"
],
	function (dcl, pointer, $, has, register, DisplayContainer, Promise) {
		function prefix(v) {
			return "-d-side-pane-" + v;
		}
		function setVisibility(node, val) {
			if (val) {
				node.style.visibility = "visible";
				node.style.display = "block";
			} else {
				node.style.visibility = "hidden";
				node.style.display = "none";
			}
		}
		function getNextSibling(node) {
			do {
				node = node.nextElementSibling;
			} while (node && node.nodeType !== 1);
			return node;
		}

		/**
		 * Dispatched after SidePane is shown.
		 * @example
		 * mySidePane.on("sidepane-after-show", function (evt) {
		 *      firstField.focus();
		 * });
		 * @event module:deliteful/SidePane#sidepane-after-show
		 */

		/**
		 * A widget displayed on the side of the screen.
		 *
		 * It can be displayed on top of the page
		 * (mode=overlay) or can push the content of the page (mode=push or mode=reveal).
		 * SidePane is a widget hidden by default.
		 * This widget must be a sibling of html's body element.
		 * If mode is set to "push" or "reveal", the width of the SidePane can't be changed in the markup
		 * (15em by default).
		 * However it can be changed in SidePane.less (@PANE_WIDTH variable).
		 * In "push" and "reveal" mode, the pushed element is the first sibling of the SidePane which has
		 * of type element (nodeType == 1) and not a SidePane.
		 * @example
		 * <body>
		 *   <d-side-pane>
		 *       SidePane content
		 *   </d-side-pane>
		 *   <div>
		 *       Main application
		 *   </div>
		 * </body>
		 * @class module:deliteful/SidePane
		 * @augments module:delite/DisplayContainer
		 */
		return register("d-side-pane", [HTMLElement, DisplayContainer],
			/** @lends module:deliteful/SidePane#*/ {
			/**
			 * The name of the CSS class of this widget.
			 * @member {string}
			 * @default "d-side-pane"
			 */
			baseClass: "d-side-pane",

			/**
			 * Can be "overlay", "reveal" or "push".
			 * In overlay mode, the pane is shown on top of the page.
			 * In reveal and push modes, The page is moved to make the pane visible. The difference between
			 * these two modes is the animated transition: in reveal mode, the pane does not move, it is
			 * already under the page. In push mode, the pane slide with the page.
			 * @member {string}
			 * @default "push"
			 */
			mode: "push",

			/**
			 * Can be "start" or "end". If set to "start", the panel is displayed on the
			 * left side in LTR mode.
			 * @member {string}
			 * @default "push"
			 */
			position: "start",

			/**
			 * Enable/Disable animations.
			 * @member {boolean}
			 * @default true
			 */
			animate: true,

			/**
			 * Enables the swipe closing of the pane.
			 * @member {boolean}
			 * @default true
			 */
			swipeClosing: true,

			_transitionTiming: {default: 0, chrome: 50, ios: 20, android: 100, ff: 100},
			_timing: 0,
			_visible: false,
			_opening: false,
			_originX: NaN,
			_originY: NaN,

			connectedCallback: function () {
				this.parentNode.style.overflow = "hidden";
			},

			show: dcl.superCall(function (sup) {
				return function () {
					if (arguments.length > 0) {
						return sup.apply(this, arguments).then(function (value) {
							return this._open().then(function () {
								return value;
							});
						}.bind(this));
					} else {
						return this._open();
					}
				};
			}),

			hide: dcl.superCall(function (sup) {
				return function () {
					if (arguments.length > 0) {
						return sup.apply(this, arguments).then(function (value) {
							return this._close().then(function () {
								return value;
							});
						}.bind(this));
					} else {
						return this._close();
					}
				};
			}),
			/**
			 * This method is called to toggle the visibility of the SidePane.
			 * @returns {Promise} A promise that will be resolved when the display & transition effect will have been
			 * performed.
			 */
			toggle: function () {
				return this._visible ? this.hide() : this.show();
			},

			/**
			 * Open the pane.
			 * @private
			 */
			_open: function () {
				var promise;
				var nextElement = getNextSibling(this);
				var animate = this.animate && has("ie") !== 9;
				if (!this._visible) {
					if (animate) {
						$(this).addClass(prefix("animate"));
						if (nextElement) {
							$(nextElement).addClass(prefix("animate"));
						}
					}

					if (this.mode === "reveal") {
						if (nextElement) {
							promise = this._setAfterTransitionHandlers(nextElement);
						}
					} else {
						promise = this._setAfterTransitionHandlers(this);
					}

					setVisibility(this, true);

					if (animate) {
						this.defer(this._openImpl, this._timing);
					} else {
						this._openImpl();
						promise = new Promise(function (resolve) {
							this.defer(resolve, this._timing);
						}.bind(this));
					}
				}
				return (promise || Promise.resolve(true)).then(function () {
					this.emit("sidepane-after-show");
				}.bind(this));
			},

			/**
			 * Close the pane.
			 * @private
			 */
			_close: function () {
				var promise;
				if (this._visible) {
					if (this.mode === "reveal") {
						var nextElement = getNextSibling(this);
						if (nextElement) {
							promise = this._setAfterTransitionHandlers(nextElement);
						}
					} else {
						promise = this._setAfterTransitionHandlers(this);
					}

					if (this.animate && has("ie") !== 9) {
						// This defer should be useless but is needed for Firefox, see #25
						this.defer(function () {this._hideImpl(); }, this._timing);
					} else {
						this._hideImpl();
						setVisibility(this, false);
					}
				}
				return promise || Promise.resolve(true);
			},

			_setAfterTransitionHandlers: function (node) {
				var self = this, holder = { node: node};
				var promise = new Promise(function (resolve) {
					holder.handle =  function () { self._afterTransitionHandle(holder, resolve); };
				});
				node.addEventListener("webkitTransitionEnd", holder.handle);
				node.addEventListener("transitionend", holder.handle); // IE10 + FF
				return promise;
			},

			_afterTransitionHandle: function (holder, resolve) {
				$(this).removeClass(prefix("under"));
				if (!this._visible) {
					setVisibility(this, false);
				}
				holder.node.removeEventListener("webkitTransitionEnd", holder.handle);
				holder.node.removeEventListener("transitionend", holder.handle);
				resolve();
			},

			preRender: function () {
				this._transitionTiming = {default: 0, chrome: 20, ios: 20, android: 100, ff: 100};
				for (var o in this._transitionTiming) {
					if (has(o) && this._timing < this._transitionTiming[o]) {
						this._timing = this._transitionTiming[o];
					}
				}
			},

			postRender: function () {
				pointer.setTouchAction(this, "pan-y");
				this._resetInteractions();
				setVisibility(this, false);
			},

			_refreshMode: function (nextElement) {
				$(this).removeClass([prefix("push"), prefix("overlay"), prefix("reveal")].join(" "))
					.addClass(prefix(this.mode));

				if (nextElement && this._visible) {
					$(nextElement).toggleClass(prefix("translated"), this.mode !== "overlay");
				}

				if (this.mode === "reveal" && !this._visible) {
					// Needed by FF only for the first opening.
					$(this).removeClass(prefix("ontop"))
						.addClass(prefix("under"));
				}
				else if (this.mode === "overlay") {
					$(this).removeClass(prefix("under"))
						.addClass(prefix("ontop"));
				} else {
					$(this).removeClass([prefix("under"), prefix("ontop")].join(" "));
				}
			},

			_refreshPosition: function (nextElement) {
				$(this).removeClass([prefix("start"), prefix("end")].join(" "))
					.addClass(prefix(this.position));
				if (nextElement && this._visible) {
					$(nextElement).removeClass([prefix("start"), prefix("end")].join(" "))
						.addClass(prefix(this.position));
				}
			},

			refreshRendering: function (props) {
				if (!("mode" in props || "position" in props || "animate" in props)) {
					return;
				}
				var nextElement = getNextSibling(this);

				// Always remove animation during a refresh. Avoid to see the pane moving on mode changes.
				// Not very reliable on IE11.
				$(this).removeClass(prefix("animate"));

				if (nextElement) {
					$(nextElement).removeClass(prefix("animate"));
					$(nextElement).toggleClass("d-rtl", this.effectiveDir === "rtl");
				}

				if ("mode" in props) {
					this._refreshMode(nextElement);
				}

				if ("position" in props) {
					this._refreshPosition(nextElement);
				}

				$(this).toggleClass(prefix("hidden"), !this._visible)
					.toggleClass(prefix("visible"), this._visible);

				// Re-enable animation
				if (this.animate) {
					this.defer(function () {
						$(this).addClass(prefix("animate"));
						if (nextElement) {
							$(nextElement).addClass(prefix("animate"));
						}
					}, this._timing);
				}
			},

			_openImpl: function () {
				if (!this._visible) {
					this._visible = true;
					$(this).removeClass(prefix("hidden"))
						.addClass(prefix("visible"));

					if (this.mode === "push" || this.mode === "reveal") {
						var nextElement = getNextSibling(this);
						if (nextElement) {
							$(nextElement)
								.removeClass([prefix("nottranslated"), prefix("start"), prefix("end")].join(" "))
								.addClass([prefix(this.position), prefix("translated")].join(" "));
						}
					}
				}
			},

			_hideImpl: function () {
				if (this._visible) {
					this._visible = false;
					this._opening = false;
					$(this.ownerDocument.body).removeClass(prefix("no-select"));
					$(this).removeClass(prefix("visible"))
						.addClass(prefix("hidden"));
					if (this.mode === "push" || this.mode === "reveal") {
						var nextElement = getNextSibling(this);
						if (nextElement) {
							$(nextElement)
								.removeClass([prefix("translated"), prefix("start"), prefix("end")].join(" "))
								.addClass([prefix(this.position), prefix("nottranslated")].join(" "));
						}
					}
				}
			},

			_isLeft: function () {
				return (this.position === "start" && this.effectiveDir === "ltr") ||
					(this.position === "end" && this.effectiveDir === "rtl");
			},

			_pointerDownHandler: function (event) {
				this._originX = event.pageX;
				this._originY = event.pageY;

				if (this._visible || (this._isLeft() && !this._visible && this._originX <= 10) ||
					(!this._isLeft() && !this._visible && this._originX >= this.ownerDocument.width - 10)) {
					this._opening = !this._visible;
					this._pressHandle.remove();
					this._moveHandle = this.on("pointermove", this._pointerMoveHandler.bind(this));
					this._releaseHandle = this.on("pointerup", this._pointerUpHandler.bind(this));

					$(this.ownerDocument.body).addClass(prefix("no-select"));
				}
			},

			_pointerMoveHandler: function (event) {
				if (!this._opening && Math.abs(event.pageY - this._originY) > 10) {
					this._resetInteractions();
				} else {
					var pos = event.pageX;

					if (this._isLeft()) {
						if (this._visible) {
							if (this._originX < pos) {
								this._originX = pos;
							}

							if ((this.swipeClosing && this._originX - pos) > 10) {
								this._close();
								this._originX = pos;
							}
						}
					} else {
						if (this._visible) {
							if (this._originX > pos) {
								this._originX = pos;
							}
							if ((this.swipeClosing && pos - this._originX) > 10) {
								this._close();
								this._originX = pos;
							}
						}
					}
				}
			},

			_pointerUpHandler: function () {
				this._opening = false;
				$(this.ownerDocument.body).removeClass(prefix("no-select"));
				this._resetInteractions();
			},

			_resetInteractions: function () {
				if (this._releaseHandle) {
					this._releaseHandle.remove();
				}
				if (this._moveHandle) {
					this._moveHandle.remove();
				}
				if (this._pressHandle) {
					this._pressHandle.remove();
				}

				if (this.swipeClosing) {
					this._pressHandle = this.on("pointerdown", this._pointerDownHandler.bind(this));
				}

				this._originX = NaN;
				this._originY = NaN;
			}
		});
	});
