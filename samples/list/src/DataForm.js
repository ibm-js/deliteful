import register from "delite/register";
import ItemRenderer from "deliteful/list/ItemRenderer";
import List from "deliteful/list/List";

const MyCustomRenderer = register("d-data-form-item", [ ItemRenderer ], {
	item: null,

	counter: 1,

	initializeRendering: function () {
		this.setAttribute("role", "row");
		var renderNode = this.renderNode = this.ownerDocument.createElement("div");
		renderNode.setAttribute("role", "gridcell");
		renderNode.setAttribute("class", "d-list-cell");
		renderNode.setAttribute("tabindex", "-1");
		this.appendChild(renderNode);
		this._firstNameNode = this.appendField("First name");
		this._lastNameNode = this.appendField("Last name");
		this._dateOfBirthNode = this.appendField("Date of birth");
		var button = this.ownerDocument.createElement("button");
		button.innerHTML = "Update record";
		button.onclick = function () {
			alert("record updated");
		};
		renderNode.appendChild(button);
	},

	appendField: function (name) {
		var label = this.ownerDocument.createElement("label");
		label.className = "label";
		label.innerHTML = name + ":";
		this.renderNode.appendChild(label);
		var input = this.ownerDocument.createElement("input");
		input.id = this.widgetId + "-" + this.counter++;
		label.setAttribute("for", input.id);
		this.renderNode.appendChild(input);
		return input;
	},

	refreshRendering: function () {
		this._firstNameNode.value = this.item.firstName;
		this._lastNameNode.value = this.item.lastName;
		this._dateOfBirthNode.value = this.item.dateOfBirth;
	}
});

export default register("d-data-form", [ List ], {
	ItemRenderer: MyCustomRenderer,
	copyAllItemProps: true
});
