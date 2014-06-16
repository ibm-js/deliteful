/** @module deliteful/list/CategoryRenderer */
define(["dcl/dcl",
        "delite/register",
        "delite/handlebars",
        "requirejs-text/text!./List/CategoryRenderer.html",
        "./Renderer"
], function (dcl, register, handlebars, template, Renderer) {

	/**
	 * Default category renderer for the {@link module:deliteful/list/List deliteful/list/List widget}.
	 * 
	 * 	 TODO: DESCRIBE THE TEMPLATE AND ITS ATTACH POINTS + document how to extend this class in user doc
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

		/**
		 * The {@link module:delite/handlebars} template for the item renderer.
		 * Note that this value cannot be updated at runtime, it is only mean to
		 * provide an easy way to customize the renderer when subclassing.
		 * @member {string}
		 * @protected
		 */
		templateString: template,

		//////////// PROTECTED METHODS ///////////////////////////////////////

		buildRendering: function () {
			var renderFunc = handlebars.compile(this.templateString);
			renderFunc.call(this);
		},

		refreshRendering: function (props) {
			if (props.item) {
				this.renderNode.innerHTML = this.item.category;
			}
		}

	});

	return register("d-list-category-renderer", [HTMLElement, CategoryRenderer]);
});