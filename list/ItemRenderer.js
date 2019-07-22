/** @module deliteful/list/ItemRenderer */
define([
	"delite/register",
	"./Renderer",
	"delite/handlebars!./List/ItemRenderer.html",
	"delite/handlebars!./List/GridItemRenderer.html"
], function (register, Renderer, ItemTemplate, GridItemTemplate) {

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

		// Computed from parentRole.
		role: "",

		//////////// PROTECTED METHODS ///////////////////////////////////////

		computeProperties: function () {
			// If subclass hasn't set the template in the prototype, then set it here, according to parentRole.
			if (!this.constructor.prototype.template && this.parentRole) {
				this.template = this.parentRole === "grid" ? GridItemTemplate : ItemTemplate;
			}

			this.role = {
				grid: "row",
				listbox: "option",
				menu: "menuitem",	// there's also menuitemcheckbox and menuitemradio
				list: "listitem"
			}[this.parentRole];
		}
	});
});
