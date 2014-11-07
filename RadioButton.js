/** @module deliteful/RadioButton */
define([
	"delite/register",
	"./Checkbox",
	"delite/handlebars!./RadioButton/RadioButton.html",
	"delite/theme!./RadioButton/themes/{{theme}}/RadioButton.css"
], function (register, Checkbox, template) {

	/**
	 * A radio button widget similar to an HTML5 input type="radio" element.
	 * @example
	 * <d-radio-button checked="true" name="categories" value="sport"></d-radio-button>
	 * <d-radio-button name="categories" value="SUV"></d-radio-button>
	 * @class module:deliteful/RadioButton
	 * @augments module:deliteful/Checkbox
	 */
	return register("d-radio-button", [HTMLElement, Checkbox], /** @lends module:deliteful/RadioButton# */ {

		/**
		 * The component css base class.
		 * @member {string}
		 * @default "d-radio-button"
		 */
		baseClass: "d-radio-button",

		template: template,

		_inputClickHandler: register.superCall(function (sup) {
			return function (evt) {
				sup.call(this, evt);
				// sync widget state to be sure state of other "same-group" buttons are in-sync in
				// user click handler (to be sure there's only one checked radio at the time the
				// user click handler is called)
				this.deliver();
			};
		}),

		toggle: register.superCall(function (sup) {
			return function () {
				if (!this.checked) {
					sup.call(this);
				}
			};
		}),

		refreshRendering: function (props) {
			if ("checked" in props && this.checked) {
				// this one has been checked, then unchecked previously checked radio in the same group
				if (!this._related) {
					// find radio buttons of the same "group"
					var inputs = (this.valueNode.form || this.ownerDocument)
						.querySelectorAll("input[type='radio'][name='" + this.name + "']");
					this._related =
						Array.prototype.filter.call(inputs, function (input) {
							return input !== this.valueNode && input.form === this.valueNode.form;
						}.bind(this)).map(this.getEnclosingWidget.bind(this));
				}
				this._related.forEach(function (r) {
					r.checked = !this.checked;
				}.bind(this));
			}
			if ("name" in props) {
				delete this._related;
			}
		}
	});
});