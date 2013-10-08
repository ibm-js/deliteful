define([
	"./focus",
	"./_WidgetBase",
	"dcl/dcl"
], function(focus, _WidgetBase, dcl){

	// module:
	//		dui/_FocusMixin

	return dcl(null, {
		// summary:
		//		Mixin to widget to provide _onFocus() and _onBlur() methods that
		//		fire when a widget or its descendants get/lose focus

		// flag that I want _onFocus()/_onBlur() notifications from focus manager
		_focusManager: focus
	});

});
