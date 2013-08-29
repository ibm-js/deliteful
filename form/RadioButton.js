define([
	"dojo/_base/declare", // declare
	"./CheckBox",
	"./_RadioButtonMixin"
], function(declare, CheckBox, _RadioButtonMixin){

	// module:
	//		dui/form/RadioButton

	return declare("dui.form.RadioButton", [CheckBox, _RadioButtonMixin], {
		// summary:
		//		Same as an HTML radio, but with fancy styling.

		baseClass: "duiRadio"
	});
});
