define(["dcl/dcl",
        "dojo/dom-class",
        "delite/register",
        "delite/Widget"
], function (dcl, domClass, register, Widget) {

	// module:
	//		deliteful/list/Renderer

	return dcl([Widget], {
		// summary:
		//		Base class for a widget that render an item or a category inside a deliteful/list/List widget.
		//
		// description:
		//		This base class provide all the infrastructure that a deliteful/list/List widget
		//		expect from a renderer, including keyboard navigation support.
		//
		//		Keyboard navigation for a renderer instance is defined using the setFocusableChildren method.

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
			this.setAttribute("role", "listitem");
			domClass.add(this, "d-key-nav");
		},

		/*=====
		 render: function () {
			// summary:
			// 		render the item or category inside the renderNode of the renderer.
			// tags:
			//		protected abstract
		 },
		 =====*/

		setFocusableChildren: function (/*DomNode...*//*jshint unused:vars*/children) {
			// summary:
			//		This method set the list of children of the renderer that can
			//		be focused during keyboard navigation, by keyboard navigation
			//		order. This method is generally called from the render method
			//		implementation, after the focused node have been created and
			//		assigned as named attributes of the renderer.
			// children: DomNode
			//		The focusable children (dom nodes) of the renderer, in the order
			//		they are focusable using keyboard navigation.
			// tags:
			//		protected
			if (this._focusableChildren) {
				for (var i = 0; i < this._focusableChildren.length; i++) {
					domClass.remove(this._focusableChildren[i], "d-key-nav");
					delete this._focusableChildren[i].tabIndex;
				}
			}
			this._focusableChildren = [];
			for (i = 0; i < arguments.length; i++) {
				var node = arguments[i];
				if (node) {
					this._focusableChildren.push(node);
					domClass.add(node, "d-key-nav");
					node.tabIndex = -1;
				}
			}
		},

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
				var fromChildIndex = -1, refNode = fromChild || this._focusedChild;
				if (refNode) {
					fromChildIndex = this._focusableChildren.indexOf(refNode);
				}
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