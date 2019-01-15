define([
	"delite/register",
	"delite/Widget",
	"dpointer/events",
	"delite/theme!./ResizeHandle/themes/{{theme}}/ResizeHandle.css"
], function (
	register,
	Widget,
	dpointer
) {

	/**
	 * The handle on the bottom-right corner of a Dialog or other widget that allows
	 * the widget to be resized.  Typically not used directly.
	 */
	return register("d-resize-handle", [HTMLElement, Widget], {

		baseClass: "d-resize-handle",

		/**
		 * Attach the handle to this element.
		 * @member {Element}
		 */
		target: null,

		/**
		 * One of: x|y|xy limit resizing to a single axis, default to xy ...
		 * @member {string}
		 */
		resizeAxis: "xy",

		/**
		 * Smallest height in px resized node can be.
		 * @member {number}
		 */
		minHeight: 100,

		/**
		 * Smallest width in px resized node can be.
		 * @member {number}
		 */
		minWidth: 100,

		/**
		 * Largest height in px resized node can become.
		 * @member {number}
		 */
		maxHeight: Infinity,

		/**
		 * Largest width in px resized node can become.
		 * @member {number}
		 */
		maxWidth: Infinity,

		/**
		 * Toggle to enable this widget to maintain the aspect ratio of the attached node.
		 * @member {boolean}
		 */
		fixedAspect: false,

		/**
		 * Class indicating which directions the ResizeHandle can be dragged.
		 */
		resizeClass: "",

		postRender: function () {
			dpointer.setTouchAction(this, "none");
			this.on("pointerdown", this._beginSizing.bind(this));
		},

		computeProperties: function (props) {
			if ("resizeAxis" in props) {
				switch (this.resizeAxis.toLowerCase()) {
				case "xy":
					this._resizeX = this._resizeY = true;
					this.resizeClass = this.effectiveDir === "ltr" ? "d-resize-nwse" : "d-resize-nesw";
					break;
				case "x":
					this._resizeX = true;
					this._resizeY = false;
					this.resizeClass = "d-resize-ew";
					break;
				case "y":
					this._resizeY = true;
					this._resizeX = false;
					this.resizeClass = "d-resize-ns";
					break;
				}
			}
		},

		refreshRendering: function (props) {
			if ("resizeClass" in props) {
				this.classList.remove(props.resizeClass);
				this.classList.add(this.resizeClass);
			}
		},

		/**
		 * Setup movement listeners and calculate initial size.
		 * @param {Event} e
		 * @private
		 */
		_beginSizing: function (e) {
			if (this._isSizing) { return; }

			this._isSizing = true;
			this.startPoint = { x: e.clientX, y: e.clientY };

			var style = getComputedStyle(this.target);
			this.startSize = {
				w: parseFloat(style.width),
				h: parseFloat(style.height)
			};
			if (this.effectiveDir === "rtl" && (getComputedStyle(this.target).position === "absolute" ||
				this.target.parentElement.classList.contains("d-popup"))) {
				// Save start position, relative to document.
				var win = this.target.ownerDocument.defaultView,
					bcr = this.target.getBoundingClientRect();
				this.startPosition = {
					l: bcr.left + win.pageXOffset,
					t: bcr.top + win.pageYOffset
				};
			}

			this._pconnects = [
				this.on("pointermove", this._changeSizing.bind(this), document),
				this.on("pointerup", this._endSizing.bind(this), document)
			];

			e.preventDefault();
			e.stopPropagation();
		},

		/**
		 *
		 * @param {Event} e
		 * @returns {{w: *, h: *}}
		 * @private
		 */
		_getNewCoords: function (e) {
			// Normalize e.clientX and e.clientY to be within viewport even if user dragged cursor
			// outside of browser window.
			var clientX = Math.min(Math.max(e.clientX, 0), window.innerWidth),
				clientY = Math.min(Math.max(e.clientY, 0), window.innerHeight);

			var dx = (this.effectiveDir === "ltr" ? 1 : -1) * (this.startPoint.x - clientX),
				dy = this.startPoint.y - clientY,
				newW = this.startSize.w - (this._resizeX ? dx : 0),
				newH = this.startSize.h - (this._resizeY ? dy : 0),
				r = this._checkConstraints(newW, newH);

			var startPosition = this.startPosition;

			if (startPosition && this._resizeX) {
				// Adjust x position for RTL.
				r.l = startPosition.l + dx;
				if (r.w !== newW) {
					r.l += (newW - r.w);
				}
				r.t = startPosition.t;
			}

			return r;
		},

		/**
		 * Filter through the various possible constraint possibilities.
		 * @param newW
		 * @param newH
		 * @returns {{w: *, h: *}}
		 * @private
		 */
		_checkConstraints: function (newW, newH) {
			// minimum size check
			if (newW < this.minWidth) {
				newW = this.minWidth;
			}
			if (newH < this.minHeight) {
				newH = this.minHeight;
			}

			// maximum size check
			if (newW > this.maxWidth) {
				newW = this.maxWidth;
			}
			if (newH > this.maxHeight) {
				newH = this.maxHeight;
			}

			if (this.fixedAspect) {
				var w = this.startSize.w, h = this.startSize.h,
					delta = w * newH - h * newW;
				if (delta < 0) {
					newW = newH * w / h;
				} else if (delta > 0) {
					newH = newW * h / w;
				}
			}

			return { w: newW, h: newH };
		},

		/**
		 * Called when moving the ResizeHandle ... determines
		 * new size based on settings/position and sets styles.
		 * @param {Event} e
		 * @private
		 */
		_changeSizing: function (e) {
			var tmp = this._getNewCoords(e);

			this.target.style.width = tmp.w + "px";
			this.target.style.height = tmp.h + "px";

			if ("l" in tmp) {
				// For RTL mode, when changing size need to adjust the X position too, so that the top right corner
				// stays in the same place.
				if (getComputedStyle(this.target).position === "absolute") {
					this.target.style.left = tmp.l + "px";
				} else {
					// Popup node, size is set on this.target but the position is set on its parent.
					this.target.parentElement.style.left = tmp.l + "px";
				}
			}

			this.target.emit("delite-manually-resized");

			e.preventDefault();
			e.stopPropagation();
		},

		/**
		 * Disconnect listeners and clean up sizing.
		 * @private
		 */
		_endSizing: function (e) {
			this._pconnects.forEach(function (handle) {
				handle.remove();
			});
			this._isSizing = false;
			this.target.emit("delite-manually-resized");

			e.preventDefault();
			e.stopPropagation();
		}
	});
});
