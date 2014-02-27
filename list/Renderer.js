define(["dcl/dcl",
        "dojo/dom-class",
        "delite/register",
        "delite/Widget"
], function (dcl, domClass, register, Widget) {

	// module:
	//		deliteful/list/Renderer

	return dcl([Widget], {
		// summary:
		//		Base class for a widget that render an item or its category inside a deliteful/list/List widget.
		//
		// description:
		//		This base class provide all the infrastructure that a deliteful/list/List widget
		//		expect from a renderer, including keyboard navigation support.
		//
		//		Focusability and Keyboard navigation order for a renderer instance is defined using
		//		the navindex attribute on the rendered nodes:
		//		- no navindex attribute value means that the node is not focusable
		//		- a navindex attribute means that the node is focusable. When navigating
		//		  the renderer instance using arrow keys, the traversal order is the following:
		//			- the nodes with the lowest navindex value comes first
		//			- if two nodes have the same navindex value, the one that is before the other one in the DOM
		//			  comes first.

		// item: Object
		//		the list item to render data for.
		item: null,
		_setItemAttr: function (/*Object*/value) {
			this._set("item", value);
			this.render();
		},

		// _focusableChildren: Array
		//		contains all the renderer nodes that can be focused, in the same order
		//		that they are to be focused during keyboard navigation with the left and right arrow
		//		keys.
		_focusableChildren: null,

		/*=====
		// renderNode: DOMNode
		//		the dom node within which the rendering will occur.
		renderNode: null,
		=====*/

		//////////// PROTECTED METHODS ///////////////////////////////////////

		buildRendering: function () {
			// summary:
			//		set containerNode and Aria attributes.
			// tags:
			//		protected
			this.containerNode = this;
			this.setAttribute("role", "row");
			this.id = "d-list-item-" + this.widgetId;
			this.tabIndex = "-1";
		},

		render: dcl.after(function () {
			// summary:
			// 		render the item or category inside the renderNode of the renderer.
			// tags:
			//		protected abstract
			this._updateFocusableChildren();
		}),

		// Interface from List to Renderer to navigate fields

		_getFirst: function () {
			// first focusable node
			if (this._focusableChildren && this._focusableChildren.length) {
				return this._focusableChildren[0];
			} else {
				return null;
			}
		},

		_getLast: function () {
			// last focusable node
			if (this._focusableChildren && this._focusableChildren.length) {
				return this._focusableChildren[this._focusableChildren.length - 1];
			} else {
				return null;
			}
		},

		_getNext: function (child) {
			// focusable node after child
			return this._getNextFocusableChild(child, 1);
		},

		_getPrev: function (child) {
			// focusable node before child
			return this._getNextFocusableChild(child, -1);
		},

		_updateFocusableChildren: function () {
			// summary:
			//		This method update the list of children of the renderer that can
			//		be focused during keyboard navigation.
			// tags:
			//		protected
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
				node.setAttribute("role", "gridcell");
				if (!node.id) {
					node.id = this.id + "-cell-" + i;
				}
			}
		},

		_getNextFocusableChild: function (fromChild, dir) {
			// summary:
			//		Get the next renderer child that can be focused using arrow keys.
			// fromChild: Widget
			//		The child from which the next focusable child is requested
			// dir: int
			//		The direction, from fromChild, of the next child: 1 for the child that
			//		comes after in the focusable order, -1 for the child that comes before.
			// tags:
			//		protected
			// returns:
			//		the next focusable child if there is one.
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