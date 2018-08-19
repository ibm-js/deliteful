/** @module deliteful/DropDownButton */
define([
	"delite/register",
	"delite/HasDropDown",
	"./Button"
], function (register, HasDropDown, Button) {

	/**
	 * A button to launch a dropdown or tooltip [dialog].
	 * @class module:deliteful/DropDownButton
	 * @example
	 * <d-dropdown-button dropDown="my-tooltip">
	 *     Click me
	 * </d-dropdown-button>
	 * <d-tooltip id="my-tooltip">...</d-tooltip>
	 * @augments module:deliteful/Button
	 */
	return register("d-dropdown-button", [Button, HasDropDown], /** @lends module:deliteful/DropDownButton# */ {
		/**
		 * The name of the CSS class of this widget.
		 * @member {string}
		 * @default "d-dropdown-button"
		 */
		baseClass: "d-dropdown-button"
	});
});
