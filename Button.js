/** @module deliteful/Button */
define([
	"dcl/dcl",
	"requirejs-dplugins/has",
	"delite/register",
	"delite/Widget",
	"requirejs-dplugins/has!bidi?./Button/bidi/Button",
	"delite/theme!./Button/themes/{{theme}}/Button.css"
], function (dcl, has, register, Widget, BidiButton) {

	/**
	 * A Non-templated form-aware button widget.
	 * A Button can display a label, an icon, or both. Icon is specified via the iconClass property that
	 * takes the name of the class to apply to the button node to display the icon.
	 * @example
	 * <style>
	 *   .iconForButton {
	 *     background-image: url('images/cut.png');
	 *     width: 16px;
	 *     height: 16px;
	 *   }
	 * </style>
	 * <button is="d-button" iconClass="iconForButton">Click Me</button>
	 * @class module:deliteful/Button
	 * @augments module:delite/Widget
	 */
	var Button = dcl(Widget, /** @lends module:deliteful/Button# */ {

		/**
		 * The text to display in the button.
		 * @member {string}
		 * @default ""
		 */
		label: "",

		/**
		 * The name of the CSS class to apply to DOMNode in button to make it display an icon.
		 * @member {string}
		 * @default ""
		 */
		iconClass: "",

		/**
		 * The name of the CSS class of this widget.
		 * @member {string}
		 * @default "d-button"
		 */
		baseClass: "d-button",

		postCreate: function () {
			// Get label from innerHTML, and then clear it since we are to put the label in a <span>
			if (!this.label) {
				this.label = this.textContent.trim();
				this.innerHTML = "";
			}
			this.focusNode = this;
		},

		refreshRendering: function (props) {
			// Add or remove icon, or change its class
			if ("iconClass" in props) {
				this.renderIcon(this.iconClass);
			}
			// Set or remove label
			if ("label" in props) {
				this.renderText(this.label);
			}
			if ("title" in props || "label" in props) {
				this.title = this.title || this.label || "";
			}
		},

		/**
		 * Renders the given icon in the button DOM.
		 * @param {string} cssClass The css class to apply to render the icon. If none (i.e. a falsy value) is provided,
		 * the existing DOM used to display the icon is destroyed.
		 */
		renderIcon: function (cssClass) {
			if (cssClass) {
				if (!this.iconNode) {
					this.iconNode = this.ownerDocument.createElement("span");
					this.insertBefore(this.iconNode, this.firstChild);
				}
				this.iconNode.className = "d-reset d-inline d-icon " + cssClass;
			} else if (this.iconNode) {
				this.removeChild(this.iconNode);
				this.iconNode = null;
			}
		},

		/**
		 * Renders the given text in the button DOM.
		 * @param {string} lbl The text to display. If none (i.e. a falsy value) is provided,
		 * the existing DOM used to display the text is destroyed.
		 */
		renderText: function (lbl) {
			if (lbl) {
				if (!this.labelNode) {
					this.labelNode = document.createElement("span");
					this.labelNode.className = "d-reset d-inline duiButtonText";
					this.appendChild(this.labelNode);
				}
				this.labelNode.textContent = lbl;
			} else if (this.labelNode) {
				this.removeChild(this.labelNode);
				this.labelNode = null;
			}
		}
	});

	var ButtonElt = register("d-button", has("bidi") ? [HTMLButtonElement, Button, BidiButton] :
		[HTMLButtonElement, Button]);
	ButtonElt.Impl = Button;
	return ButtonElt;
});
