define([
	"dojo/_base/declare",
	"dui/form/_ExpandingTextAreaMixin",
	"./TextArea"
], function(declare, ExpandingTextAreaMixin, TextArea){

	return declare("dui.mobile.ExpandingTextArea", [TextArea, ExpandingTextAreaMixin], {
		// summary:
		//		Non-templated TEXTAREA widget with the capability to adjust its 
		//		height according to the amount of data.
		// description:
		//		A textarea that dynamically expands/contracts (changing its height) as
		//		the user types, to display all the text without requiring a vertical scroll bar.
		//
		//		Takes all the parameters (name, value, etc.) that a vanilla textarea takes.
		//		Rows are not supported since this widget adjusts its height.
		// example:
		//	|	<textarea dojoType="dui.mobile.ExpandingTextArea">...</textarea>

		baseClass: "duiTextArea duiExpandingTextArea"
	});
});
