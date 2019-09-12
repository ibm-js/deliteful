/** @module deliteful/list/Renderer */
define([
	"dcl/dcl",
	"delite/a11y",
	"delite/Widget"
], function (
	dcl,
	a11y,
	Widget
) {
	/**
	 * The base class for a widget that renders an item or its category inside a deliteful/list/List widget.
	 *
	 * This base class provide all the infrastructure that a deliteful/list/List widget
	 * expects from a renderer, including keyboard navigation support.
	 *
	 * @class module:deliteful/list/Renderer
	 * @augments module:delite/Widget
	 */
	return dcl([Widget], /** @lends module:deliteful/list/Renderer# */ {
		/**
		 * The list item to render.
		 * @member {Object}
		 * @default {}
		 */
		item: {}, // must be initialized to an empty object because it is expected by the template

		/**
		 * The ARIA role of the parent.  Renderer role will be adjusted based on its parent's role.
		 */
		parentRole: ""
	});
});
