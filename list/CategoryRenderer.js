/** @module deliteful/list/CategoryRenderer */
define([
	"delite/register",
	"./Renderer",
	"delite/handlebars!./List/CategoryRenderer.html",
	"delite/handlebars!./List/GridCategoryRenderer.html"
], function (
	register,
	Renderer,
	CategoryTemplate,
	GridCategoryTemplate
) {
	/**
	 * Default category renderer for the {@link module:deliteful/list/List deliteful/list/List widget}.
	 *
	 * @class module:deliteful/list/CategoryRenderer
	 * @class module:deliteful/list/CategoryRenderer
	 */
	// eslint-disable-next-line max-len
	return register("d-list-category-renderer", [HTMLElement, Renderer], /** @lends module:deliteful/list/CategoryRenderer# */ {
		/**
		 * CSS class of a category renderer.
		 * @member {string}
		 * @protected
		 */
		baseClass: "d-list-category",

		//////////// PROTECTED METHODS ///////////////////////////////////////

		computeProperties: function () {
			// If subclass hasn't set the template in the prototype, then set it here, according to parentRole.
			if (!this.constructor.prototype.template && this.parentRole) {
				this.template = this.parentRole === "grid" ? GridCategoryTemplate : CategoryTemplate;
			}
		}
	});
});
