define(["dcl/dcl",
        "delite/register",
        "./Renderer"
], function (dcl, register, Renderer) {
	
	// module:
	//		deliteful/list/CategoryRenderer

	var CategoryRenderer = dcl([Renderer], {
		// summary:
		//		Default category renderer for the deliteful/list/List widget.
		//

		// category: String
		//		the category to render.
		category: "",
		_setCategoryAttr: function (value) {
			this._set("category", value);
			this.render(value);
		},

		// baseClass: [protected] String
		//		CSS class of a category renderer. This value is expected by the deliteful/list/List widget
		//		so it must not be changed.
		baseClass: "d-list-category",

		//////////// PROTECTED METHODS ///////////////////////////////////////

		buildRendering: dcl.superCall(function (sup) {
			// summary:
			//		Create the widget container node, into which a category will be rendered.
			// tags:
			//		protected
			return function () {
				if (sup) {
					sup.apply(this, arguments);
				}
				this.containerNode = this;
				this.style.display = "block";
			};
		}),

		render: function () {
			// summary:
			//		render the category inside this.containerNode.
			// item: Object
			//		The category to render.
			// tags:
			//		protected
			this.containerNode.innerHTML = this.category;
		}

	});

	return register("d-list-category", [HTMLElement, CategoryRenderer]);
});