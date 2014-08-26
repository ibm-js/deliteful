/** @module deliteful/ScrollableContainer */
define([
	"delite/register",
	"delite/Container",
	"delite/Scrollable"
], function (register, Container, Scrollable) {

	/**
	 * A container widget with scrolling capabilities.
	 * 
	 * This widget can scroll its contents horizontally and/or vertically. 
	 * Its scrolling capabilities and API are provided by its parent class
	 * `delite/Scrollable`.
	 * @example
	 * <d-scrollable-container scrollDirection="horizontal">
	 *   <div>...</div>
	 *   <div>...</div>
	 * </d-scrollable-container>
	 * @class module:deliteful/ScrollableContainer
	 * @augments module:delite/Container
	 * @augments module:delite/Scrollable
	 */
	return register("d-scrollable-container", [HTMLElement, Container, Scrollable],
		/** @lends module:deliteful/ScrollableContainer# */{

		/**
		 * The name of the CSS class of this widget.
		 * @member {string}
		 * @default "d-scrollable-container"
		 */
		baseClass: "d-scrollable-container"
	});
});
