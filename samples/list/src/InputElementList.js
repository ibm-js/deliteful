import register from "delite/register";
import Widget from "delite/Widget";
import List from "deliteful/list/List";
import { html } from "lit-html";

register("d-configuration-item", [ HTMLElement, Widget ], {
	initializeRendering: function () {
		this.setAttribute("role", "row");
		this.className = "d-list-item";

		const div = this.ownerDocument.createElement("div");
		div.setAttribute("role", "gridcell");
		div.className = "d-list-cell";
		div.tabIndex = -1;
		this.appendChild(div);
	},

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
	renderItem: function (item) {
		return html`<d-configuration-item .item="${item}"></d-configuration-item>`;
	},

	copyAllItemProps: true
});
