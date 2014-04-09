define([
	"dcl/dcl",
	"dojo/has",
	"dojo/_base/lang",
	"dojo/dom-construct",
	"dojo/dom-class",
	"delite/register",
	"delite/Widget",
	"delite/Invalidating",
	"dojo/has!dojo-bidi?./Button/bidi/Button",
	"delite/themes/load!./Button/themes/{{theme}}/Button_css"
], function (dcl, has, lang, domConstruct, domClass, register, Widget, Invalidating, BidiButton) {

	var Button = dcl([Widget, Invalidating], {
		// summary:
		//		Non-templated BUTTON widget.
		//
		//		Buttons can display a label, an icon, or both.
		//		A name for the button should always be specified through innerHTML or the label attribute.
		//		It can be hidden via showLabel=false, but will always appear in high contrast mode.

		// label: String
		//		Text to display in button.
		label: "",

		// showLabel: Boolean
		//		Set this to false to hide the label text and display only the icon.
		//		(If showLabel=false then iconClass must be specified.)
		//		Especially useful for toolbars.
		//		If showLabel=false, the label will become the title (a.k.a. tooltip/hint) of the icon.
		//
		//		The exception case is for computers in high-contrast mode, where the label
		//		will still be displayed, since the icon doesn't appear.
		showLabel: true,

		// iconClass: String
		//		Class to apply to DOMNode in button to make it display an icon
		iconClass: "",

		// baseClass: String
		//		The name of the CSS class of this widget.
		baseClass: "d-button",

		preCreate: function () {
			this.addInvalidatingProperties("label", "showLabel", "title", "iconClass", "textDir");
		},

		buildRendering: function () {
			// Get label from innerHTML, and then clear it since we are to put the label in a <span>
			if (!this.label) {
				this.label = this.textContent.trim();
				this.textContent = "";
			}
			this.focusNode = this;
			// Create child <span> here to avoid deletion when we get the label from innerHTML
			this.containerNode = domConstruct.create("SPAN", {}, this, "last");
		},

		postCreate: function (){
			this.invalidateProperty("label");
			this.validate();
		},

		_setIconClassAttr: function (value) {
			// Retain the previous icon class to remove it later in refreshRendering
			this._previousIconClass = this.iconClass;
			this._set("iconClass", value);
		},
		
		/*jshint maxcomplexity: 15*/
		refreshRendering: function (props) {
			// summary:
			//		Render or re-render the widget, based on property settings.
			//		Note that this will always create sub-nodes to contain the icon and the label,
			//		even though that's only really necessary when both are present.

			// Add or remove icon, or change its class
			if (props.iconClass) {
				domClass.remove(this.containerNode, this._previousIconClass);
				domClass.toggle(this.containerNode, "d-button-icon", this.iconClass);
				domClass.toggle(this.containerNode, this.iconClass, this.iconClass);
			}
			// Set or remove label
			var showLabel = this.label && this.showLabel;
			if (props.label || props.showLabel) {
				this.containerNode.textContent = showLabel ? this.label : "";
				domClass.toggle(this.containerNode, "d-button-text", showLabel);
			}
			// Set title.  If no label is shown and no title has been specified,
			// label is also set as title attribute of icon.
			if (props.title || props.label) {
				this.title = this.title || (!showLabel && this.label) || "";
			}
		}
	});

	return register("d-button", has("dojo-bidi") ? [HTMLButtonElement, Button, BidiButton] :
		[HTMLButtonElement, Button]);
});
