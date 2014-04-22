/** @module deliteful/ToggleButton */
define([
	"dcl/dcl",
	"delite/register",
	"requirejs-dplugins/has",
	"./Button",
	"./Toggle",
	"delite/theme!./ToggleButton/themes/{{theme}}/ToggleButton.css"
], function (dcl, register, has, Button, Toggle) {

	/**
	 * A 2-states toggle button widget.
	 * @example
	 * <d-button is="d-toggle-button" checked="true">Foo</button>
	 * A toggle button can display a different label depending on its state. By default, the label specified inline
	 * in the markup or via the 'label' property is displayed whatever the state is. It is however possible to set a
	 * label specific to the checked state via the 'checkedLabel' property.
	 * @example
	 * <d-button is="d-toggle-button" checked="true" checkedLabel="On">Off</button>
	 * Similarly, a toggle button can display a different icon depending on its state. By default, the css class
	 * specified by the 'iconClass' property is applied whatever the state is. However, a css class specific to the
	 * checked state can be specified via the 'checkedIconClass' property.
	 * @example
	 * <style>
	 *   .iconOn {
	 *     background-image: url('images/on.png');
	 *     width: 16px;
	 *     height: 16px;
	 *   }
	 * </style>
	 * <d-button is="d-toggle-button" checked="true" checkedIconClass="iconOn">Off</button>
	 * @class module:deliteful/ToggleButton
	 * @augments module:deliteful/Toggle
	 * @augments module:deliteful/Button.Mixin
	 */
	var ToggleButton =  dcl([Button.Impl, Toggle], /** @lends module:deliteful/ToggleButton# */ {

		/**
		 * The component css base class.
		 * @member {string}
		 * @default "d-toggle-button"
		 */
		baseClass: "d-toggle-button",

		/**
		 * The label to display when the button is checked. If not specified, the default label (either the one
		 * specified inline in markup or via the 'label' property) is used for both states.
		 * @member {string}
		 * @default ""
		 */
		checkedLabel: "",

		/**
		 * The name of the CSS class to apply to DOMNode in button to make it display an icon when the button is
		 * checked. If not specified, the class specified in the 'iconClass' property, if any, is used for both states.
		 * @member {string}
		 * @default ""
		 */
		checkedIconClass: "",

		preCreate: function () {
			this.focusNode = this;
		},

		postCreate: function () {
			this.on("click", function () {
				this.toggle();
			}.bind(this));
		},

		/*jshint maxcomplexity:12*/
		refreshRendering: dcl.superCall(function (sup) {
			return function (props) {
				if ("checked" in props) {
					this.setAttribute("aria-pressed", "" + this.checked);
					if (this.checkedLabel) {
						this.renderText(this.checked ? this.checkedLabel : this.label);
					}
					if (this.checkedIconClass) {
						this.renderIcon(this.checked ? this.checkedIconClass : this.iconClass);
					}
				}
				if ("label" in props || "checkedLabel" in props) {
					this.renderText(this.checkedLabel && this.checked ? this.checkedLabel : this.label);
					delete props.label; // prevent Button from processing label changes
				}
				if ("iconClass" in props || "checkedIconClass" in props) {
					this.renderIcon(this.checkedIconClass && this.checked ? this.checkedIconClass : this.iconClass);
					delete props.iconClass;
				}
				sup.apply(this, arguments);
			};
		})
	});
	return register("d-toggle-button", [HTMLButtonElement, ToggleButton]);
});