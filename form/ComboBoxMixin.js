define([
	"dojo/_base/declare", // declare
	"dojo/Deferred",
	"dojo/_base/lang", // lang.mixin
	"dojo/store/util/QueryResults",
	"./_AutoCompleterMixin",
	"./_ComboBoxMenu",
	"../HasDropDown",
	"dojo/text!./templates/DropDownBox.html"
], function(declare, Deferred,lang, QueryResults, _AutoCompleterMixin, _ComboBoxMenu, HasDropDown, template){


	// module:
	//		dui/form/ComboBoxMixin

	return declare("dui.form.ComboBoxMixin", [HasDropDown, _AutoCompleterMixin], {
		// summary:
		//		Provides main functionality of ComboBox widget

		// dropDownClass: [protected extension] Function String
		//		Dropdown widget class used to select a date/time.
		//		Subclasses should specify this.
		dropDownClass: _ComboBoxMenu,

		// hasDownArrow: Boolean
		//		Set this textbox to have a down arrow button, to display the drop down list.
		//		Defaults to true.
		hasDownArrow: true,

		templateString: template,

		baseClass: "duiTextBox duiComboBox",

		/*=====
		// store: [const] dojo/store/api/Store
		//		Reference to data provider object used by this ComboBox.
		store: null,
		=====*/

		// Set classes like duiDownArrowButtonHover depending on
		// mouse action over button node
		cssStateNodes: {
			"_buttonNode": "duiDownArrowButton"
		},

		_setHasDownArrowAttr: function(/*Boolean*/ val){
			this._set("hasDownArrow", val);
			this._buttonNode.style.display = val ? "" : "none";
		},

		_showResultList: function(){
			// hide the tooltip
			this.displayMessage("");
			this.inherited(arguments);
		}
	});
});
