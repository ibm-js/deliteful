define([
	"dojo/_base/declare", // declare
	"../Button",
	"./_ToggleButtonMixin"
], function(declare, Button, _ToggleButtonMixin){

	// module:
	//		dui/form/ToggleButton


	return declare("dui.form.ToggleButton", [Button, _ToggleButtonMixin], {
		// summary:
		//		A templated button widget that can be in two states (checked or not).
		//		Can be base class for things like tabs or checkbox or radio buttons.

		baseClass: "duiToggleButton"
	});
});
