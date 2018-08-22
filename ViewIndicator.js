/** @module deliteful/ViewIndicator */
define([
	"dcl/dcl",
	"delite/register",
	"dpointer/events",
	"delite/Widget",
	"delite/hc",
	"delite/theme!./ViewIndicator/themes/{{theme}}/ViewIndicator.css"
], function (dcl, register, dpointer, Widget) {

	/**
	 * ViewIndicator widget. Indicates which view is currently visible in a ViewStack.
	 *
	 * @example
	 * <d-view-stack id="vs">
	 *     <div id="childA">...</div>
	 *     <div id="childB">...</div>
	 *     <div id="childC">...</div>
	 * </d-view-stack>
	 * <d-view-indicator id="vi" viewstack="vs"></d-view-indicator>
	 * @class module:deliteful/ViewIndicator
	 * @augments module:delite/Widget
	 */
	return register("d-view-indicator", [HTMLElement, Widget], /** @lends module:deliteful/ViewIndicator# */{
		/**
		 * The name of the CSS class of this widget.
		 * @member {string}
		 * @default "d-view-indicator"
		 */
		baseClass: "d-view-indicator",

		/**
		 * The ViewStack widget associated with the indicator.
		 */
		viewStack: null,

		constructor: function () {
			this.on("pointerdown", function (e) {
				if (typeof e.target._vsChildIndex === "number") {
					this.viewStack.show(this.viewStack.children[e.target._vsChildIndex]);
				} else {
					var next = (e.clientX - this.offsetLeft) > this.offsetWidth / 2;
					if (this.effectiveDir === "rtl") {
						next = !next;
					}
					if (next) {
						this.viewStack.showNext();
					} else {
						this.viewStack.showPrevious({reverse: true});
					}
				}
			}.bind(this));
		},

		postRender: function () {
			dpointer.setTouchAction(this, "none");
		},
		
		refreshRendering: function (props) {
			if ("viewStack" in props) {
				this._attachViewStack();
				this._refreshDots();
			}
		},

		/**
		 * Sets event listeners to the ViewStack so as to update dots when children are shown/hidden
		 * @private
		 */
		_attachViewStack: function () {
			if (this._afterAttachHandle) {
				this._afterAttachHandle.remove();
				this._afterAttachHandle = null;
			}
			if (this._afterShowHandle) {
				this._afterShowHandle.remove();
				this._afterShowHandle = null;
			}
			if (this.viewStack) {
				var rd = this._refreshDots.bind(this);
				this._afterAttachHandle = this.on("customelement-attached", rd, this.viewStack);
				this._afterShowHandle = this.on("delite-after-show", rd, this.viewStack);
			}
		},

		/**
		 * Refreshes the dots from the SwapView's contents.
		 * @private
		 */
		_refreshDots: function () {
			// TODO: avoid recreating all the dots when only the visible child has changed
			this.innerHTML = "";
			for (var i = 0; i < this.viewStack.children.length; i++) {
				var child = this.viewStack.children[i];
				var dot = this.ownerDocument.createElement("div");
				dot.className = "-d-view-indicator-dot" +
					(child.style.visibility === "visible" ? " -d-view-indicator-dot-selected" : "");
				dot._vsChildIndex = i;
				this.appendChild(dot);
			}
		}
	});
});
