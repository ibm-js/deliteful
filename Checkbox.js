/** @module deliteful/Checkbox */
define([
	"dcl/dcl",
	"delite/register",
	"delite/FormWidget",
	"./Toggle",
	"delite/handlebars!./Checkbox/Checkbox.html",
	"requirejs-dplugins/css!./Checkbox/Checkbox.css"
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

		/**
		 * If true, then the checkbox displays as indeterminate.  Doesn't affect the `checked` property's
		 * value though.
		 */
		indeterminate: false,

		template: template,

		afterInitializeRendering: function () {
			this._lbl4 = null;
			this.on("click", this._inputClickHandler.bind(this), this.focusNode);
			this.on("change", this._inputClickHandler.bind(this), this.focusNode);
		},

		refreshRendering: function (oldVals) {
			// Since d-checked is set programatically, let's set d-indeterminate programatically too.
			if ("indeterminate" in oldVals) {
				if (this.indeterminate) {
					this.classList.add("d-indeterminate");
				} else {
					this.classList.remove("d-indeterminate");
				}
			}
		},

		_inputClickHandler: function (evt) {
			this.indeterminate = false;
			this.checked = this.focusNode.checked;

			// Emit event from my root node rather than from the embedded <input>
			evt.stopPropagation();
			this.emit(evt.type);
		}
	});
});
