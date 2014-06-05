/** @module deliteful/list/CategoryRenderer */
define(["dcl/dcl",
        "delite/register",
        "./Renderer"
], function (dcl, register, Renderer) {

	/**
	 * Default category renderer for the {@link module:deliteful/list/List deliteful/list/List widget}.
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

		//////////// PROTECTED METHODS ///////////////////////////////////////

		/**
		 * Renders the category of the item inside this.renderNode.
		 * @protected
		 */
		render: function () {
			this.renderNode.innerHTML = this.item.category;
		}

	});

	return register("d-list-category-renderer", [HTMLElement, CategoryRenderer]);
});