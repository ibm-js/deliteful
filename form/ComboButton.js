define([
	"dojo/_base/declare", // declare
	"dojo/keys", // keys
	"./DropDownButton",
	"dojo/text!./templates/ComboButton.html"
], function(declare, keys, DropDownButton, template){

	// module:
	//		dui/form/ComboButton

	return declare("dui.form.ComboButton", DropDownButton, {
		// summary:
		//		A combination button and drop-down button.
		//		Users can click one side to "press" the button, or click an arrow
		//		icon to display the drop down.
		//
		// example:
		// |	<button data-dojo-type="dui/form/ComboButton" onClick="...">
		// |		<span>Hello world</span>
		// |		<div data-dojo-type="dui/Menu">...</div>
		// |	</button>
		//
		// example:
		// |	var button1 = new ComboButton({label: "hello world", onClick: foo, dropDown: "myMenu"});
		// |	dojo.body().appendChild(button1.domNode);
		//

		templateString: template,

		// Map widget attributes to DOMNode attributes.
		_setIdAttr: "", // override _FormWidgetMixin which puts id on the focusNode
		_setTabIndexAttr: ["focusNode", "titleNode"],
		_setTitleAttr: "titleNode",

		// optionsTitle: String
		//		Text that describes the options menu (accessibility)
		optionsTitle: "",

		baseClass: "duiComboButton",

		// Set classes like duiButtonContentsHover or duiArrowButtonActive depending on
		// mouse action over specified node
		cssStateNodes: {
			"buttonNode": "duiButtonNode",
			"titleNode": "duiButtonContents",
			"_popupStateNode": "duiDownArrowButton"
		},

		_focusedNode: null,

		_onButtonKeyDown: function(/*Event*/ evt){
			// summary:
			//		Handler for right arrow key when focus is on left part of button
			if(evt.keyCode == keys[this.isLeftToRight() ? "RIGHT_ARROW" : "LEFT_ARROW"]){
				this._popupStateNode.focus();
				evt.stopPropagation();
				evt.preventDefault();
			}
		},

		_onArrowKeyDown: function(/*Event*/ evt){
			// summary:
			//		Handler for left arrow key when focus is on right part of button
			if(evt.keyCode == keys[this.isLeftToRight() ? "LEFT_ARROW" : "RIGHT_ARROW"]){
				this.titleNode.focus();
				evt.stopPropagation();
				evt.preventDefault();
			}
		},

		focus: function(/*String*/ position){
			// summary:
			//		Focuses this widget to according to position, if specified,
			//		otherwise on arrow node
			// position:
			//		"start" or "end"
			if(!this.disabled){
				(position == "start" ? this.titleNode : this._popupStateNode).focus();
			}
		}
	});
});
