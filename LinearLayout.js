/** @module deliteful/LinearLayout */
define([
	"dojo/dom-class",
	"delite/register",
	"delite/Widget",
	"delite/DisplayContainer",
	"delite/theme!./LinearLayout/themes/{{theme}}/LinearLayout_css"
], function (domClass, register, Widget, DisplayContainer) {
	/**
	 * A layout container based on CSS3 Flexible Box.
	 * 
	 * Child elements in a LinearLayout container can be laid out horizontally or vertically.
	 * A child can have a flexible width or height depending on orientation.
	 * To enable flexibility of a child, add the CSS class "fill" on it.
	 * This widget also provides two utility CSS classes: width100 and height100.
	 * These classes are useful for setting width or height to 100% easily.
	 * @example
	 * <d-linear-layout>
	 *   <div>...</div>
	 *   <div class="fill">...</div>
	 *   <div>...</div>
	 * </d-linear-layout>
	 * @class module:deliteful/LinearLayout
	 * @augments module:delite/Container
	 */
	return register("d-linear-layout", [HTMLElement, Widget, DisplayContainer],
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

		refreshRendering: function () {
			domClass.toggle(this, "-d-linear-layout-v", this.vertical);
			domClass.toggle(this, "-d-linear-layout-h", !this.vertical);
		},

		buildRendering: function () {
			this.deliver();
		}
	});
});