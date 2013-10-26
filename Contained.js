define([
	"dcl/dcl"
], function (dcl) {

	// module:
	//		dui/Contained

	return dcl(null, {
		// summary:
		//		Mixin for widgets that are children of a container widget
		// example:
		//	|	// make a basic custom widget that knows about its parents
		//	|	register("my.customClass", [HTMLElement, Contained], {});

		_getSibling: function (/*String*/ which) {
			// summary:
			//		Returns next or previous sibling
			// which:
			//		Either "next" or "previous"
			// tags:
			//		private
			var node = this;
			do {
				node = node[which + "Sibling"];
			} while (node && node.nodeType !== 1);
			return node;	// Element
		},

		getPreviousSibling: function () {
			// summary:
			//		Returns null if this is the first child of the parent,
			//		otherwise returns the next element sibling to the "left".

			return this._getSibling("previous"); // Element
		},

		getNextSibling: function () {
			// summary:
			//		Returns null if this is the last child of the parent,
			//		otherwise returns the next element sibling to the "right".

			return this._getSibling("next"); // Element
		},

		getIndexInParent: function () {
			// summary:
			//		Returns the index of this widget within its container parent.
			//		It returns -1 if the parent does not exist, or if the parent
			//		is not a dui/Container

			var p = this.getParent();
			if (!p || !p.getIndexOfChild) {
				return -1; // int
			}
			return p.getIndexOfChild(this); // int
		}
	});
});
