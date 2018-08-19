/** @module deliteful/Button */
define([
	"dcl/dcl",
	"requirejs-dplugins/has",
	"delite/a11yclick",
	"delite/register",
	"delite/Widget",
	"requirejs-dplugins/has!bidi?./Button/bidi/Button",
	"delite/handlebars!./Button/Button.html",
	"delite/theme!./Button/themes/{{theme}}/Button.css"
], function (
	dcl,
	has,
	a11yclick,
	register,
	Widget,
	BidiButton,
	template
) {

	/**
	 * A form-aware button widget.
	 * A Button can display a label, an icon, or both.  Icon is specified via the iconClass property that
	 * takes the name of the class to apply to the button node to display the icon.
	 * @example
	 * <style>
	 *   .iconForButton {
	 *     background-image: url('images/cut.png');
	 *     width: 16px;
	 *     height: 16px;
	 *   }
	 * </style>
	 * <d-button iconClass="iconForButton">Click Me</d-button>
	 * @class module:deliteful/Button
	 * @augments module:delite/Widget
	 */
	var Button = dcl(Widget, /** @lends module:deliteful/Button# */ {
		/**
		 * The `role` attribute to set on the root node.
		 */
		role: "button",

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

		/**
		 * If `true`, the button's label will be shown.
		 * @member {boolean}
		 * @default true
		 */
		showLabel: true,

		/**
		 * The tabindex when the button is enabled.
		 * @member {number}
		 * @default 0
		 */
		enabledTabIndex: 0,

		/**
		 * If set to true, the widget will not respond to user input and will not be included in form submission.
		 * FormWidget automatically updates `valueNode`'s and `focusNode`'s `disabled` property to match the widget's
		 * `disabled` property.
		 * @member {boolean}
		 * @default false
		 */
		disabled: false,

		template: template,

		createdCallback: function () {
			this.on("click", function (evt) {
				evt.preventDefault();
				if (this.disabled) {
					// Block click events (from both mouse and keyboard) when button is disbled.
					// If necessary, can change to addEventListener(..., true) to run even sooner.
					evt.stopImmediatePropagation();
				}
			}.bind(this));

			// Get label from innerHTML, and then clear it since we are to put the label in a <span>
			if (!this.label) {
				this.label = this.textContent.trim();
				this.innerHTML = "";
			}
		},

		postRender: function () {
			// Make SPACE/ENTER key cause button click event.
			a11yclick(this);
		},

		refreshRendering: function (props) {
			// If title was not explicitly specified, and showLabel === false, then set
			// title (aka tooltip) to be the label.
			if (("label" in props || "showLabel" in props) &&
				(!this.title || this.title === ("label" in props ? props.label : this.label))) {
				if (this.showLabel) {
					this.removeAttribute("title");
				} else {
					this.title = this.label;
				}
			}

			if ("disabled" in props || "enabledTabIndex" in props) {
				if (this.disabled) {
					this.setAttribute("aria-disabled", "true");
					this.removeAttribute("tabindex");
				} else {
					this.removeAttribute("aria-disabled");
					this.setAttribute("tabindex", this.enabledTabIndex);
				}
			}
		}
	});

	var ButtonElt = register("d-button", has("bidi") ? [HTMLElement, Button, BidiButton] :
		[HTMLElement, Button]);
	ButtonElt.Impl = Button;
	return ButtonElt;
});
