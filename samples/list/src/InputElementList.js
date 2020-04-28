import register from "delite/register";
import ItemRenderer from "deliteful/list/ItemRenderer";
import List from "deliteful/list/List";
import template from "delite/handlebars!deliteful/samples/list/templates/BlankItemRenderer.html";

var MyCustomRenderer = register("d-configuration-item", [ ItemRenderer ], {
	template: template,
	refreshRendering: function (oldVals) {
		if ("item" in oldVals) {
			var renderNode = this.firstElementChild;
			renderNode.innerHTML = "";
			if (this.item.elementTag) {
				var elementNode = renderNode.appendChild(
					this._createElement(this.item.elementTag, this.item.elementAttrs));
				elementNode.setAttribute("tabindex", "0");
				if (this.item.label) {
					var labelNode = renderNode.appendChild(this.ownerDocument.createElement("span"));
					labelNode.className = "label";
					labelNode.innerHTML = this.item.label;
					elementNode.setAttribute("aria-label", this.item.label);
					// Set the label attribute that key search uses
					elementNode.label = this.item.label;
				}
			}
		}
	},
	_createElement: function (tag, attributes) {
		var elementNode = this.ownerDocument.createElement(tag);
		for (var key in attributes) {
			elementNode[key] = attributes[key];
		}
		return elementNode;
	}
});

export default register("d-configuration", [ List ], {
	ItemRenderer: MyCustomRenderer,
	copyAllItemProps: true
});
