/** @module deliteful/Checkbox */
define([
	"dcl/dcl",
	"delite/register",
	"delite/FormWidget",
	"./Toggle",
	"delite/handlebars!./Checkbox/Checkbox.html",
	"delite/theme!./Checkbox/themes/{{theme}}/Checkbox.css"
], function (dcl, register, FormWidget, Toggle, template) {

	/**
	 * A 2-state checkbox widget similar to an HTML5 input type="checkbox" element.
	 * @example
	 * <d-checkbox checked="true"></d-checkbox>
	 * @class module:deliteful/Checkbox
	 * @augments module:delite/FormWidget
	 * @augments module:deliteful/Toggle
	 */
	return register("d-checkbox", [HTMLElement, FormWidget, Toggle], /** @lends module:deliteful/Checkbox# */ {

		/**
		 * The component css base class.
		 * @member {string}
		 * @default "d-checkbox"
		 */
		baseClass: "d-checkbox",

		template: template,

		postRender: function () {
			this._lbl4 = null;
			this.on("click", this._inputClickHandler.bind(this), this.focusNode);
			this.on("change", this._inputClickHandler.bind(this), this.focusNode);
		},

		_inputClickHandler: function () {
			this.checked = this.focusNode.checked;
		}
	});
});