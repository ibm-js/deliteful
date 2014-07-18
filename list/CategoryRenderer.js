/** @module deliteful/list/CategoryRenderer */
define([
	"dcl/dcl",
	"delite/register",
	"delite/handlebars!./List/CategoryRenderer.html",
	"./Renderer"
], function (dcl, register, template, Renderer) {

	/**
	 * Default category renderer for the {@link module:deliteful/list/List deliteful/list/List widget}.
	 * 
	 * @class module:deliteful/list/CategoryRenderer
	 */
	var CategoryRenderer = dcl(Renderer, /** @lends module:deliteful/list/CategoryRenderer# */ {

		/**
		 * CSS class of a category renderer. This value is expected by the
		 * {@link module:deliteful/list/List deliteful/list/List widget}
		 * so it must not be changed.
		 * @member {string}
		 * @protected
		 */
		baseClass: "d-list-category",

		template: template,

		//////////// PROTECTED METHODS ///////////////////////////////////////

		attachedCallback: dcl.superCall(function (sup) {
			return function () {
				sup.apply(this, arguments);
				if (this.getParent().getAttribute("role") === "grid") {
					this.setAttribute("role", "row");
					this.renderNode.setAttribute("role", "columnheader");
				} else {
					this.renderNode.removeAttribute("tabindex");
					this.renderNode.setAttribute("role", "heading");
				}
			};
		})

	});

	return register("d-list-category-renderer", [HTMLElement, CategoryRenderer]);
});
