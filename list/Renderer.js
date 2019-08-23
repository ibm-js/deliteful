/** @module deliteful/list/Renderer */
define([
	"dcl/dcl",
	"delite/a11y",
	"delite/Widget"
], function (
	dcl,
	a11y,
	Widget
) {
	/**
	 * The base class for a widget that renders an item or its category inside a deliteful/list/List widget.
	 *
	 * This base class provide all the infrastructure that a deliteful/list/List widget
	 * expects from a renderer, including keyboard navigation support.
	 *
	 * Focusability and Keyboard navigation order for a renderer instance is defined using
	 * the navindex attribute on the rendered nodes:
	 * - no navindex attribute value means that the node is not focusable
	 * - a navindex attribute means that the node is focusable. When navigating
	 *  the renderer instance using the tab key, the traversal order is the following:
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
		 * that they are to be focused during keyboard navigation with the tab key.
		 * @member {Node[]}
		 * @private
		 */
		_focusableChildren: null,

		/**
		 * The ARIA role of the parent.  Renderer role will be adjusted based on its parent's role.
		 */
		parentRole: "",

		//////////// PROTECTED METHODS ///////////////////////////////////////

		render: dcl.after(function () {
			this.updateFocusableChildren();
		}),

		// Interface from List to Renderer to navigate fields

		/**
		 * Retrieves the first focusable child.
		 * @returns {Element}
		 * @protected
		 */
		getFirst: function () {
			if (this._focusableChildren) {
				for (var i = 0; i < this._focusableChildren.length; i++) {
					var child = this._focusableChildren[i];
					if (a11y._isElementShown(child)) {
						return child;
					}
				}
			}
			return null;
		},

		/**
		 * Retrieves the last focusable child.
		 * @returns {Element}
		 * @protected
		 */
		getLast: function () {
			if (this._focusableChildren) {
				for (var i = this._focusableChildren.length - 1; i >= 0; i--) {
					var child = this._focusableChildren[i];
					if (a11y._isElementShown(child)) {
						return child;
					}
				}
			}
			return null;
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
		 * This method updates the list of children of the renderer that can
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
			// parse the content to retrieve the ordered list of focusable children
			var nodes = Array.prototype.slice.call(this.querySelectorAll("[navindex]"), 0);
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
			}
		},

		/**
		 * Get the next or previous renderer child that can be focused using tab key (in actionable mode).
		 * @param {Element} fromChild - The child from which the next focusable child is requested
		 * @param {number} dir - The direction, from fromChild, of the next child: 1 for the child that
		 * comes after in the focusable order, -1 for the child that comes before.
		 * @returns {Element} The next focusable child if there is one.
		 * @protected
		 */
		getNextFocusableChild: function (fromChild, dir) {
			if (this._focusableChildren && fromChild !== this) {
				// retrieve the position of the from node
				var fromChildIndex = fromChild ? this._focusableChildren.indexOf(fromChild) : -1,
					nextChildIndex = fromChildIndex,
					nextChild;
				do {
					nextChildIndex = nextChildIndex + dir;
					nextChild = this._focusableChildren[nextChildIndex];
				} while (nextChild && !a11y._isElementShown(nextChild));
				return nextChild || null;
			}
		}
	});
});
