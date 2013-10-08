define([
	"dojo/_base/declare",
	"dojo/dom-class",
	"./Container"
], function(declare, domClass, Container){

	// module:
	//		dui/mobile/FormLayout

	return declare("dui.mobile.FormLayout", Container, {
		// summary:
		//		A responsive container to create mobile forms.
		// description:
		//		This container layouts form widgets according to the screen size.
		//		Each row of a form is made of a <label> and a <fieldset> that contains one or more form widgets.
		//		By default, if the width of the screen if greater than 500px, the <label> and the <fieldset> are positioned on the same line.
		//		Otherwise they are stacked vertically. You can force how a <label> and its <fieldset> are positioned using the
		//		'columns' property.
		//		Form controls are: "dui/Button", "dui/mobile/CheckBox", "dui/mobile/ComboBox",
		//		"dui/mobile/RadioButton", "dui/mobile/Slider", "dui/mobile/TextBox", "dui/mobile/SearchBox",
		//		"dui/mobile/ExpandingTextArea", "dui/mobile/ToggleButton".
		// example:
		// |	<div data-dojo-type="dui/mobile/FormLayout" data-dojo-props="columns:'two', rightAlign:true">
		// |		<div>
		// |			<label>Name:</label>
		// |			<fieldset>
		// |				<input data-dojo-type="dui/mobile/TextBox">
		// |			</fieldset>
		// |		</div>
		// |		<div>
		// |			<label>Make a choice:</label>
		// |			<fieldset>
		// |				<input type="radio" id="rb1" data-dojo-type="dui/mobile/RadioButton" name="mobileRadio" checked><label for="rb1">Small</label>
		// |				<input type="radio" id="rb2" data-dojo-type="dui/mobile/RadioButton" name="mobileRadio" checked><label for="rb2">Medium</label>
		// |				<input type="radio" id="rb3" data-dojo-type="dui/mobile/RadioButton" name="mobileRadio" checked><label for="rb3">Large</label>
		// |			</fieldset>
		// |		</div>
		// |	</div>


		// columns: [const] "auto" | "single" | "two"
		//		This property controls how a <label> and its <fieldset> are positioned. The <label> can be on the same line
		//		than its <fieldset> (two columns) or on top of it (single column).
		//		If set to "auto", the number of columns depends on the width of the screen: Two columns
		//		if the width of the screen is larger than 500px, one column otherwise. The width of the screen is determined using CSS
		//		Media Queries.
		//		Setting this property to "single" or "two" allows to force the layout used whatever the width of the screen.
		//		Default value for this property is "auto".
		//		Note that changing the value of the property after the widget
		//		creation has no effect.
		columns: "auto",

		// rightAlign: [const] Boolean
		//		This property controls the horizontal position of control(s) in a <fieldset>. It applies only
		//		to forms that have two columns (see 'columns' property).
		//		Default value for this property is false.
		//		Note that changing the value of the property after the widget
		//		creation has no effect.
		rightAlign: false,

		/* internal properties */

		// baseClass: String
		//		The name of the CSS class of this widget.
		baseClass: "duiFormLayout",

		buildRendering: function(){
			this.inherited(arguments);
			if(this.columns == "auto"){
				domClass.add(this.domNode, "duiFormLayoutAuto");
			}else if(this.columns == "single"){
				domClass.add(this.domNode, "duiFormLayoutSingleCol");
			}else if(this.columns == "two"){
				domClass.add(this.domNode, "duiFormLayoutTwoCol");
			}
			if(this.rightAlign){
				domClass.add(this.domNode, "duiFormLayoutRightAlign");
			}
		}
	});
});
