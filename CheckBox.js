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

	var labelClickHandler;

	/**
	 * A 2-state checkbox widget.
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
			this._lbl4 = null;
			this.on("click", function () {
				this.checked = this.focusNode.checked;
			}.bind(this), this.focusNode);
		},

		attachedCallback: dcl.after(function () {
			// The fact that deliteful/Checkbox is not an HTMLInputElement seems not being compatible with the default
			// "<label for" behavior of the browser. So it needs to explicitly listen to click on associated
			// <label for=...> elements.
			if (!labelClickHandler) {
				// set a global listener that listens to click events on label elt
				labelClickHandler = function (e) {
					var forId;
					if (/label/i.test(e.target.tagName) && (forId = e.target.getAttribute("for"))) {
						var elt = document.getElementById(forId);
						if (elt && elt.buildRendering && elt._lbl4 !== undefined) { //_lbl4: to check it's a checkbox
							// call click() on the input instead of this.toggle() to get the 'change' event for free
							elt.focusNode.click();
						}
					}
				};
				this.ownerDocument.addEventListener("click", labelClickHandler);
			}
		})
	});
});