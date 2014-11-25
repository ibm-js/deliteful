/** @module deliteful/ViewIndicator */
define([
	"dcl/dcl", "delite/register", "dojo/dom-class", "dpointer/events", "delite/Widget", "delite/keys",
	"delite/theme!./ViewIndicator/themes/{{theme}}/ViewIndicator.css"
], function (dcl, register, domClass, dpointer, Widget, keys) {

	/**
	 * ViewIndicator widget. Indicates which view is currently visible in a ViewStack.
	 *
	 * @example:
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
		viewstack: null,

		attachedCallback: function () {
			// If the user hasn't specified a tabindex declaratively, then set to default value.
			if (!this.hasAttribute("tabindex")) {
				this.focusNode.tabIndex = "0";
			} else {
				this.focusNode.tabIndex = this.tabIndex;
				this.tabIndex = -1;
			}
		},

		render: function () {
			this.focusNode = this.ownerDocument.createElement("div");
			this.appendChild(this.focusNode);
			dpointer.setTouchAction(this, "none");
			// init WAI-ARIA attributes
			this.focusNode.setAttribute("role", "slider");
			this.focusNode.setAttribute("aria-valuemin", 0);
		},

		postRender: function () {
			this.on("keydown", function (e) {
				if (this.viewstack) {
					switch (e.keyCode) {
					case keys.LEFT_ARROW:
						if (this.isLeftToRight()) {
							this.viewstack.showPrevious();
						} else {
							this.viewstack.showNext();
						}
						break;
					case keys.RIGHT_ARROW:
						if (this.isLeftToRight()) {
							this.viewstack.showNext();
						} else {
							this.viewstack.showPrevious();
						}
						break;
					}
				}
			}.bind(this), this.focusNode);
		},

		refreshRendering: function (props) {
			if ("viewstack" in props) {
				this._attachViewStack();
				this._refreshDots();
			}
		},

		/**
		 * Sets event listeners to the ViewStack so as to update dots when children are shown/hidden
		 * @private
		 */
		_attachViewStack: function () {
			if (this._afterShowHandle) {
				this._afterShowHandle.remove();
				this._afterShowHandle = null;
			}
			if (this.viewstack) {
				this._afterShowHandle = this.on("delite-after-show", this._refreshDots.bind(this), this.viewstack);
			}
		},

		/**
		 * Refreshes the dots from the SwapView's contents.
		 * @private
		 */
		_refreshDots: function () {
			// recreate all for now
			this.focusNode.innerHTML = "";
			for (var i = 0; i < this.viewstack.children.length; i++) {
				var child = this.viewstack.children[i];
				var dot = this.ownerDocument.createElement("div");
				dot.className = "-d-view-indicator-dot" +
					(child.style.visibility === "visible" ? " -d-view-indicator-dot-selected" : "");
				dot._index = i;
				this.on("pointerdown", function (e) {
					this.viewstack.show(this.viewstack.children[e.target._index]);
				}.bind(this), dot);
				this.focusNode.appendChild(dot);
			}
			this.focusNode.setAttribute("aria-valuemax", Math.max(this.viewstack.children.length - 1, 0));
		}
	});
});
