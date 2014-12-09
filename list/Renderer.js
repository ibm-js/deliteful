/** @module deliteful/list/Renderer */
define([
	"dcl/dcl",
	"requirejs-dplugins/jquery!attributes/classes",
	"delite/register",
	"delite/Widget"
], function (dcl, $, register, Widget) {

	/**
	 * The base class for a widget that render an item or its category inside a deliteful/list/List widget.
	 * 
	 * This base class provide all the infrastructure that a deliteful/list/List widget
	 * expect from a renderer, including keyboard navigation support.
	 * 
	 * Focusability and Keyboard navigation order for a renderer instance is defined using
	 * the navindex attribute on the rendered nodes:
	 * - no navindex attribute value means that the node is not focusable
	 * - a navindex attribute means that the node is focusable. When navigating
	 *  the renderer instance using arrow keys, the traversal order is the following:
	 *  - the nodes with the lowest navindex value comes first
	 *  - if two nodes have the same navindex value, the one that is before the other one in the DOM
	 *  comes first.
	 * @class module:deliteful/list/Renderer
	 * @augments module:delite/Widget
	 */
	return dcl([Widget], /** @lends module:deliteful/list/Renderer# */ {

		/**
		 * The list item to render.
		 * @member {Object}
		 * @default {}
		 */
		item: {}, // must be initialized to an empty object because it is expected by the template

		/**
		 * Contains all the renderer nodes that can be focused, in the same order
		 * that they are to be focused during keyboard navigation with the left and right arrow
		 * keys.
		 * @member {Node[]}
		 * @private
		 */
		_focusableChildren: null,

		//////////// PROTECTED METHODS ///////////////////////////////////////

		render: dcl.after(function () {
			if (!this.renderNode) {
				throw new Error("render must define a renderNode property on the Renderer."
						+ " Example using attach-point in a template: "
						+ "<template><div attach-point='renderNode'></div></template>");
			}
			this.renderNode.tabIndex = -1;
			$(this.renderNode).addClass("d-list-cell");
			this.updateFocusableChildren();
		}),

		// Interface from List to Renderer to navigate fields

		/**
		 * Retrieves the first focusable child.
		 * @returns {Element}
		 * @protected
		 */
		getFirst: function () {
			if (this._focusableChildren && this._focusableChildren.length) {
				return this._focusableChildren[0];
			} else {
				return null;
			}
		},

		/**
		 * Retrieves the last focusable child.
		 * @returns {Element}
		 * @protected
		 */
		getLast: function () {
			if (this._focusableChildren && this._focusableChildren.length) {
				return this._focusableChildren[this._focusableChildren.length - 1];
			} else {
				return null;
			}
		},

		/**
		 * Retrieves the next focusable child after another child.
		 * @param {Element} child the child from which to retrieve the next focusable child
		 * @returns {Element}
		 * @protected
		 */
		getNext: function (child) {
			return this.getNextFocusableChild(child, 1);
		},

		/**
		 * Retrieves the previous focusable child before another child.
		 * @param {Element} child the child from which to retrieve the previous focusable child
		 * @returns {Element}
		 * @protected
		 */
		getPrev: function (child) {
			return this.getNextFocusableChild(child, -1);
		},

		/**
		 * This method update the list of children of the renderer that can
		 * be focused during keyboard navigation.
		 * If the list of navigable children of the renderer is updated after the
		 * render step has been executed, this method must be
		 * called to take into account the new list.
		 * If the list of navigable children is defined during the render
		 * step, there is no need to call this method.
		 */
		updateFocusableChildren: function () {
			if (this._focusableChildren) {
				for (var i = 0; i < this._focusableChildren.length; i++) {
					delete this._focusableChildren[i].tabIndex;
				}
			}
			// parse the renderNode content to retrieve the ordered list of focusable children
			var nodes = Array.prototype.slice.call(this.renderNode.querySelectorAll("[navindex]"), 0);
			this._focusableChildren = nodes.slice(0).sort(function (a, b) {
				var navindexA = parseInt(a.getAttribute("navindex"), 10);
				var navindexB = parseInt(b.getAttribute("navindex"), 10);
				if (navindexA === navindexB) {
					return nodes.indexOf(a) - nodes.indexOf(b);
				} else {
					return navindexA - navindexB;
					
				}
			});
			// update the focusable children nodes
			for (i = 0; i < this._focusableChildren.length; i++) {
				var node = this._focusableChildren[i];
				node.tabIndex = -1;
				if (!node.id) {
					node.id = this.id + "-cell-" + i;
				}
			}
		},

		/**
		 * Get the next renderer child that can be focused using arrow keys.
		 * @param {Element} fromChild The child from which the next focusable child is requested
		 * @param {number} dir The direction, from fromChild, of the next child: 1 for the child that
		 * comes after in the focusable order, -1 for the child that comes before.
		 * @returns {Element} The next focusable child if there is one.
		 * @protected
		 */
		getNextFocusableChild: function (fromChild, dir) {
			if (this._focusableChildren && fromChild !== this) {
				// retrieve the position of the from node
				var fromChildIndex = fromChild ? this._focusableChildren.indexOf(fromChild) : -1;
				var nextChildIndex = fromChildIndex + dir;
				if (nextChildIndex >= 0 && nextChildIndex < this._focusableChildren.length) {
					return this._focusableChildren[nextChildIndex]; // Widget
				} else {
					return null;
				}
			}
		}

	});

});
