define([
	"dojo/_base/declare", // declare
	"dojo/sniff", // has("msapp")
	"../_WidgetBase",
	"../_CssStateMixin",
	"../_TemplatedMixin",
	"./_FormWidgetMixin"
], function(declare, has, _WidgetBase, _CssStateMixin, _TemplatedMixin, _FormWidgetMixin){

	// module:
	//		dijit/form/_FormWidget

	return declare("dijit.form._FormWidget", [_WidgetBase, _TemplatedMixin, _CssStateMixin, _FormWidgetMixin], {
		// summary:
		//		Base class for widgets corresponding to native HTML elements such as `<checkbox>` or `<button>`,
		//		which can be children of a `<form>` node or a `dijit/form/Form` widget.
		//
		// description:
		//		Represents a single HTML element.
		//		All these widgets should have these attributes just like native HTML input elements.
		//		You can set them during widget construction or afterwards, via `dijit/_WidgetBase.set()`.
		//
		//		They also share some common methods.

		// Override automatic assigning type --> focusNode, it causes exception on IE.
		// Instead, type must be specified as ${type} in the template, as part of the original DOM.
		// TODO: check if this is still needed or if it was only an issue for IE6/7
		_setTypeAttr: null
	});
});
