/** @module deliteful/Toggle */
define([
	"dcl/dcl",
	"delite/CssState"
], function (dcl, CssState) {

	/**
	 * A base class for 2-states form widgets.
	 * @class module:deliteful/Toggle
	 * @abstract
	 * @augments module:delite/CssState
	 */
	return dcl([CssState], /** @lends module:deliteful/Toggle# */ {

		/**
		 * Indicates whether this widget is checked.
		 * @member {boolean}
		 * @default false
		 */
		checked: false,

		/**
		 * The widget value that is sent to forms.
		 * @member {string}
		 * @default "on"
		 */
		value: "on",

		attachedCallback: dcl.after(function () {
			var initState = this.checked;
			if (this.valueNode && this.valueNode.form) {
				this.on("reset", function () {
					this.defer(function () {
						this.checked = initState;
					});
				}.bind(this), this.valueNode.form);
			}
		}),

		postRender: function () {
			// CssState handles focused property
			this.on("focus", function () { this.focused = true; }.bind(this), this.focusNode);
			this.on("blur", function () { this.focused = false; }.bind(this), this.focusNode);
		},

		/**
		 * Toggles the state of this widget.
		 * @method
		 */
		toggle: function () {
			if (!this.disabled) {
				this.checked = !this.checked;
			}
		}

	});
});
