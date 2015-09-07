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

		attachedCallback: function () {
			if (this.getParent().getAttribute("role") === "grid") {
				this.setAttribute("role", "row");
				this.renderNode.setAttribute("role", "columnheader");
			} else {
				this.renderNode.removeAttribute("tabindex");
				this.renderNode.setAttribute("role", "heading");
			}
		}
	});
});
