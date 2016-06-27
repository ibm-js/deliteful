/** @module deliteful/list/ItemRenderer */
define([
	"delite/register",
	"./Renderer",
	"delite/handlebars!./List/ItemRenderer.html"
], function (register, Renderer, template) {

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

	return register("d-list-item-renderer", [HTMLElement, Renderer], /** @lends module:deliteful/list/ItemRenderer# */ {
		/**
		 * CSS class of an item renderer.
		 * @member {string}
		 * @protected
		 */
		baseClass: "d-list-item",

		template: template,

		//////////// PROTECTED METHODS ///////////////////////////////////////

		refreshRendering: function (oldVals) {
			if ("parentRole" in oldVals) {
				if (this.parentRole === "grid") {
					this.setAttribute("role", "row");
					this.renderNode.setAttribute("role", "gridcell");
				} else {
					this.removeAttribute("role");		// alternately, set role=presentation
					this.renderNode.setAttribute("role", {
						listbox: "option",
						menu: "menuitem",	// there's also menuitemcheckbox and menuitemradio
						list: "listitem"
					}[this.parentRole]);
				}
			}
		}
	});
});
