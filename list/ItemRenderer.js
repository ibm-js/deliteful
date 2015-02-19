/** @module deliteful/list/ItemRenderer */
define([
	"dcl/dcl",
	"requirejs-dplugins/jquery!attributes/classes",
	"delite/register",
	"delite/handlebars!./List/ItemRenderer.html",
	"./Renderer"
], function (dcl, $, register, template, Renderer) {

	/**
	 * Default item renderer for the {@link module:deliteful/list/List deliteful/list/List widget}.
	 * 
	 * This renderer renders generic items that can have any of the following attributes (display
	 * position of the rendering described for LTR direction):
	 * - `iconclass`: css class to apply to a DIV element on the left side of the list item in order
	 * to display an icon.
	 * Rendered with CSS class `d-list-item-icon` + the value of the attribute;
	 * - `label`: string to render on the left side of the node, after the icon.
	 * Rendered with CSS class `d-list-item-label`;
	 * - `righttext`: string to render of the right side if the node.
	 * Rendered with CSS class `d-list-item-right-text`;
	 * - `righticonclass`: css class to apply to a DIV element on the right side of the list item
	 * in order to display an icon.
	 * Rendered with CSS class `d-list-item-right-icon2` + the value of the attribute;
	 * By default, none of the nodes that renders the attributes are focusable with keyboard navigation
	 * (no navindex attribute on the nodes). 
	 * 
	 * @class module:deliteful/list/ItemRenderer
	 * @augments module:deliteful/list/Renderer
	 */
	var ItemRenderer = dcl(Renderer, /** @lends module:deliteful/list/ItemRenderer# */ {

		/**
		 * CSS class of an item renderer.
		 * @member {string}
		 * @protected
		 */
		baseClass: "d-list-item",

		template: template,

		//////////// PROTECTED METHODS ///////////////////////////////////////

		attachedCallback: function () {
			if (this.getParent().getAttribute("role") === "grid") {
				this.setAttribute("role", "row");
				this.renderNode.setAttribute("role", "gridcell");
			} else {
				this.renderNode.setAttribute("role", "option");
			}
		}
	});

	return register("d-list-item-renderer", [HTMLElement, ItemRenderer]);
});
