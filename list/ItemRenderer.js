define(["dcl/dcl",
        "delite/register",
        "./Renderer"
], function (dcl, register, Renderer) {
	
	// module:
	//		deliteful/list/ItemRenderer

	var ItemRenderer = dcl([Renderer], {
		// summary:
		//		Default item renderer for the deliteful/list/List widget.
		//
		// description:
		//		This renderer renders generic items that can have any of the following attributes (display
		//		position of the rendering described for LTR direction) :
		//		- icon: path to an image to render as an icon on the left side of the list item.
		//				Rendered with CSS class d-list-item-icon;
		//		- label: string to render on the left side of the node, after the icon.
		//				Rendered with CSS class d-list-item-label;
		//		- righttext: string to render of the right side if the node.
		//				Rendered with CSS class d-list-item-right-text;
		//		- righticon2: path to an image to render as icon on the right side, after the right text. 
		//				Rendered with CSS class d-list-item-right-icon2;
		//		- righticon: path to an image to render as icon on the right side, after righticon2. 
		//				Rendered with CSS class d-list-item-right-icon;
		//		All the nodes that renders the attributes are focusable with keyboard navigation (using left and
		//		right arrows).

		// item: Object
		//		the list item to render.
		item: null,
		_setItemAttr: function (/*Object*/value) {
			this._set("item", value);
			this.render();
			// Set a label attribute For text search in keyboard navigation
			this.label = value.label;
		},

		// baseClass: [protected] String
		//		CSS class of an item renderer. This value is expected by the deliteful/list/List widget
		//		so it must not be changed.
		baseClass: "d-list-item",


		//////////// PROTECTED METHODS ///////////////////////////////////////

		buildRendering: dcl.superCall(function (sup) {
			// summary:
			//		Create the widget container node, into which an item will be rendered.
			// tags:
			//		protected
			return function () {
				if (sup) {
					sup.apply(this, arguments);
				}
				this.containerNode = register.createElement("div");
				this.containerNode.className = "d-list-item-node";
				this.appendChild(this.containerNode);
			};
		}),

		render: function () {
			// summary:
			//		render the item inside this.containerNode.
			// item: Object
			//		The item to render.
			// tags:
			//		protected
			this._renderNode("text", "labelNode", this.item ? this.item.label : null, "d-list-item-label");
			this._renderNode("image", "iconNode", this.item ? this.item.icon : null, "d-list-item-icon");
			this._renderNode("text", "righttext", this.item ? this.item.righttext : null, "d-list-item-right-text");
			this._renderNode("image", "righticon2", this.item ? this.item.righticon2 : null, "d-list-item-right-icon2");
			this._renderNode("image", "righticon", this.item ? this.item.righticon : null, "d-list-item-right-icon");
			this.setFocusableChildren(this.iconNode, this.labelNode, this.righttext, this.righticon2, this.righticon);
		},

		//////////// PRIVATE METHODS ///////////////////////////////////////

		_renderNode: function (nodeType, nodeName, data, nodeClass) {
			// summary:
			//		render a node.
			// nodeType: String
			//		"text" for a text node, "image" for an image node.
			// nodeName: String
			//		the name of the attribute to use to store a reference to the node in the renderer.
			// data: String
			//		the data to render (null if there is no data and the node should be deleted).
			//		For a nodeType of "text", data is the text to render.
			//		For a nodeType of "image", data is the path of the image to render
			// nodeClass: String
			//		CSS class for the node.
			// tag:
			//		private
			var dataAttribute = (nodeType === "text" ? "innerHTML" : "src");
			var nodeTag = (nodeType === "text" ? "DIV" : "IMG");
			if (data) {
				if (!this[nodeName]) {
					this[nodeName] = register.createElement(nodeTag);
					this[nodeName].id = this.id + nodeName;
					this[nodeName].className = nodeClass;
					this[nodeName].tabIndex = -1;
					if (this.containerNode.firstChild) {
						this.containerNode.insertBefore(this[nodeName], this.containerNode.firstChild);
					} else {
						this.containerNode.appendChild(this[nodeName]);
					}
				}
				if (this[nodeName].getAttribute(dataAttribute) !== data) {
					this[nodeName][dataAttribute] = data;
				}
			} else {
				if (this[nodeName]) {
					this[nodeName].parentNode.removeChild(this[nodeName]);
					delete this[nodeName];
				}
			}
		}

	});

	return register("d-list-item", [HTMLElement, ItemRenderer]);
});