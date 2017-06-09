/** @module deliteful/LinearLayout */
define([
	"requirejs-dplugins/jquery!attributes/classes",
	"delite/register",
	"delite/DisplayContainer",
	"delite/theme!./LinearLayout/themes/{{theme}}/LinearLayout.css"
], function ($, register, DisplayContainer) {
	/**
	 * A layout container based on CSS3 Flexible Box.
	 *
	 * Child elements in a LinearLayout container can be laid out horizontally or vertically.
	 * A child can have a flexible width or height depending on orientation.
	 * To enable flexibility of a child, add the CSS class "fill" on it.
	 * @example
	 * <d-linear-layout>
	 *   <div>...</div>
	 *   <div class="fill">...</div>
	 *   <div>...</div>
	 * </d-linear-layout>
	 * @class module:deliteful/LinearLayout
	 * @augments module:delite/DisplayContainer
	 */
	return register("d-linear-layout", [HTMLElement, DisplayContainer],
		/** @lends module:deliteful/LinearLayout# */{
		/**
		 * The name of the CSS class of this widget.
		 * @member {string}
		 * @default "d-linear-layout"
		 */
		baseClass: "d-linear-layout",

		/**
		 * True if the container is vertical.
		 * @member {boolean}
		 * @default true
		 */
		vertical: true,

		refreshRendering: function (oldValues) {
			if ("vertical" in oldValues) {
				$(this).toggleClass("-d-linear-layout-v", this.vertical);
				$(this).toggleClass("-d-linear-layout-h", !this.vertical);
			}
		}
	});
});
