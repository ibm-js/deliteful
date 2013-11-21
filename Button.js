define([
	"dcl/dcl",
	"dojo/hccss",
	"dojo/_base/lang",
	"dojo/dom-construct",
	"./register",
	"./Widget",
	"./mixins/Invalidating",
	"dojo/has!dojo-bidi?./bidi/Button",
	"./themes/load!common,Button"		// common for duiInline etc., Button for duiButton etc.
], function (dcl, has, lang, domConstruct, register, Widget, Invalidating, BidiButton) {

	var Button = dcl([Widget, Invalidating], {
		// summary:
		//		Non-templated BUTTON widget.
		//
		//		Buttons can display a label, an icon, or both.
		//		A name for the button should always be specified through innerHTML or the label attribute.
		//		It can be hidden via showLabel=false, but will always appear in high contrast mode.
		// example:
		//	|	<button data-dojo-type="dui/Button" onclick="...">Hello world</button>

		// label: String
		//		Text to display in button.
		label: "",

		// showLabel: Boolean
		//		Set this to true to hide the label text and display only the icon.
		//		(If showLabel=false then iconClass must be specified.)
		//		Especially useful for toolbars.
		//		If showLabel=true, the label will become the title (a.k.a. tooltip/hint) of the icon.
		//
		//		The exception case is for computers in high-contrast mode, where the label
		//		will still be displayed, since the icon doesn't appear.
		showLabel: true,

		// iconClass: String
		//		Class to apply to DOMNode in button to make it display an icon
		iconClass: "",

		// baseClass: String
		//		The name of the CSS class of this widget.
		baseClass: "duiButton",

		preCreate: function () {
			this.addInvalidatingProperties("label", "showLabel", "title", "iconClass", "textDir");
		},

		postCreate: function () {
			// Get label from innerHTML, and then clear it since we are to put the label in a <span>
			if (!this.label) {
				this.label = this.textContent.trim();
				this.innerHTML = "";
			}

			this.focusNode = this;
		},

		refreshRendering: function (props) {
			// summary:
			//		Render or re-render the widget, based on property settings.
			//		Note that this will always create sub-nodes to contain the icon and the label,
			//		even though that's only really necessary when both are present.

			// Add or remove icon, or change its class
			if (props.iconClass) {
				if (this.iconClass && !has("highcontrast")) {
					this.iconNode = this.iconNode || domConstruct.create("span", null, this, "first");
					this.iconNode.className = "duiReset duiInline duiIcon " + this.iconClass;
				} else if (this.iconNode) {
					domConstruct.destroy(this.iconNode);
					delete this.iconNode;
				}
			}
			// Set or remove label
			var showLabel = this.label && (this.showLabel || has("highcontrast"));
			if (props.label || props.showLabel) {
				if (showLabel) {
					this.containerNode = this.containerNode ||
						domConstruct.create("span", {className: "duiReset duiInline duiButtonText"}, this);
					this.containerNode.textContent = this.label;
				} else if (this.containerNode) {
					domConstruct.destroy(this.containerNode);
					delete this.containerNode;
				}
			}

			// Set title.  If no label is shown and no title has been specified,
			// label is also set as title attribute of icon.
			// TODO: if label is later changed, title won't be changed.
			if (props.title || props.label) {
				this.title = this.title || (!showLabel && this.label) || "";
			}
		}
	});

	return register("d-button", has("dojo-bidi") ? [HTMLButtonElement, Button, BidiButton] :
		[HTMLButtonElement, Button]);
});
