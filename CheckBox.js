/** @module deliteful/CheckBox */
define([
	"dcl/dcl",
	"dojo/dom-class",
	"delite/register",
	"delite/FormWidget",
	"./Toggle",
	"delite/handlebars!./CheckBox/CheckBox.html",
	"delite/theme!./CheckBox/themes/{{theme}}/CheckBox.css"
], function (dcl, domClass, register, FormWidget, Toggle, template) {

	/**
	 * A checkbox widget.
	 * @example
	 * <d-checkbox checked="true"></d-checkbox>
	 * @class module:deliteful/CheckBox
	 * @augments module:delite/FormWidget
	 * @augments module:deliteful/Toggle
	 */
	return register("d-checkbox", [HTMLElement, FormWidget, Toggle], /** @lends module:deliteful/CheckBox# */ {

		/**
		 * The component css base class.
		 * @member {string}
		 * @default "d-checkbox"
		 */
		baseClass: "d-checkbox",

		template: template,

		postCreate: function () {
			this.on("click", function () {
				this._set("checked", this.focusNode.checked);
			}.bind(this), this.focusNode);
			// The fact that deliteful/Checkbox is not an HTMLInputElement seems not being compatible with the default
			// "<label for" behavior of the browser. So it needs to explicitly listen to click on associated
			// <label for=...> elements.
			if (this.id) {
				this._lbl4 = this.ownerDocument.querySelector("label[for='" + this.id + "']");
				if (this._lbl4) {
					this.on("click", this.toggle.bind(this), this._lbl4);
				}
			}
		},

		_onFocus: dcl.superCall(function (sup) {
			return function () {
				// for highcontrast a11y
				if (this._lbl4) {
					domClass.add(this._lbl4, "d-focused-label");
				}
				sup.call(this);
			};
		}),

		_onBlur: dcl.superCall(function (sup) {
			return function () {
				// for highcontrast a11y
				if (this._lbl4) {
					domClass.remove(this._lbl4, "d-focused-label");
				}
				sup.call(this);
			};
		})
	});
});