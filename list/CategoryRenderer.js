/** @module deliteful/list/CategoryRenderer */
define([
	"delite/register",
	"delite/handlebars!./List/CategoryRenderer.html",
	"./Renderer"
], function (register, template, Renderer) {

	/**
	 * Default category renderer for the {@link module:deliteful/list/List deliteful/list/List widget}.
	 * 
	 * @class module:deliteful/list/CategoryRenderer
	 */
	return register("d-list-category-renderer", [HTMLElement, Renderer],
		 /** @lends module:deliteful/list/CategoryRenderer# */ {

		/**
		 * CSS class of a category renderer.
		 * @member {string}
		 * @protected
		 */
		baseClass: "d-list-category",

		template: template,

		//////////// PROTECTED METHODS ///////////////////////////////////////

		refreshRendering: function (oldVals) {
			if ("parentRole" in oldVals) {
				if (this.parentRole === "grid") {
					this.setAttribute("role", "row");
					this.renderNode.setAttribute("role", "columnheader");
				} else {
					this.removeAttribute("role");		// alternately, set role=presentation
					this.renderNode.removeAttribute("tabindex");	// todo: do opposite for when parentRole === grid
					this.renderNode.setAttribute("role", "heading");
				}
			}
		}
	});
});
