/** @module deliteful/list/ItemRenderer */
define(["dcl/dcl",
        "dojo/dom-class",
        "delite/register",
        "delite/handlebars",
        "requirejs-text/text!./List/ItemRenderer.html",
        "./Renderer"
], function (dcl, domClass, register, handlebars, template, Renderer) {

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
	 * TODO: DESCRIBE THE TEMPLATE AND ITS ATTACH POINTS + document how to extend this class in user doc
	 * 
	 * @class module:deliteful/list/ItemRenderer
	 * @augments module:deliteful/list/Renderer
	 */
	var ItemRenderer = dcl(Renderer, /** @lends module:deliteful/list/ItemRenderer# */ {

		/**
		 * CSS class of an item renderer. This value is expected by the
		 * {@link module:deliteful/list/List deliteful/list/List widget}
		 * so it must not be changed.
		 * @member {string}
		 * @protected
		 */
		baseClass: "d-list-item",

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
				if (this.iconNode) {
					if (this.iconNode) {
						// FIXME: removal of the previous value
						// => Need a fix for https://github.com/ibm-js/delite/issues/120 to do so.
						domClass.add(this.iconNode, this.item.iconclass);
					} else {
						// FIXME: removal of the previous value
						// => Need a fix for https://github.com/ibm-js/delite/issues/120 to do so.
					}
				}
				if (this.rightIconNode) {
					if (this.item.righticonclass) {
						// FIXME: removal of the previous value
						// => Need a fix for https://github.com/ibm-js/delite/issues/120 to do so.
						domClass.add(this.rightIconNode, this.item.righticonclass);
					} else {
						// FIXME: removal of the previous value
						// => Need a fix for https://github.com/ibm-js/delite/issues/120 to do so.
					}
				}
				if (this.labelNode) {
					this.labelNode.innerHTML = this.item.label ? this.item.label : "";
				}
				if (this.rightTextNode) {
					this.rightTextNode.innerHTML = this.item.righttext ? this.item.righttext : "";
				}
			}
		},
	});

	return register("d-list-item-renderer", [HTMLElement, ItemRenderer]);
});