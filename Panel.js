/** @module deliteful/Panel */
define(["dcl/dcl",
	"delite/register",
	"delite/Widget",
    "delite/theme!./Panel/themes/{{theme}}/Panel.css"
], function (dcl, register, Widget) {

	/**
	 * A container widget used inside an Accordion.
	 *
	 * @class module:deliteful/Panel
	 * @augments module:delite/Widget
	 * @example
	 * <d-panel id="panel" label="Title">
	 *   <div>...</div>
	 *   <div>...</div>
	 * </d-panel>
	 */
	return register("d-panel", [HTMLElement, Widget], /** @lends module:deliteful/Panel# */ {

		/**
		 * The name of the CSS class of this widget.
		 * @member {string}
		 * @default "d-panel"
		 */
		baseClass: "d-panel",

		/**
		 * The label to be displayed in the panel's header.
		 * @member {string}
		 * @default ""
		 */
		label: "",

		/**
		 * CSS class to apply to the icon node in the header when this panel is open.
		 * @member {string}
		 * @default ""
		 */
		openIconClass: "",

		/**
		 * CSS class to apply to icon node in the header when this panel is closed.
		 * @member {string}
		 * @default ""
		 */
		closedIconClass: ""
	});
});