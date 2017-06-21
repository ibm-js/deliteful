/** @module deliteful/Accordion/AccordionHeader */
define([
	"delite/register",
	"delite/Widget",
	"delite/handlebars!./AccordionHeader/AccordionHeader.html"
], function (
	register,
	Widget,
	template
) {
	/**
	 * The header (aka title) that goes above each Panel of an Accordion.
	 * @class module:deliteful/Accordion/AccordionHeader
	 */
	return register("d-accordion-header", [HTMLElement, Widget],
			/** @lends module:deliteful/Accordion/AccordionHeader# */ {
		/**
		 * The name of the CSS class of this widget.
		 * @member {string}
		 * @default "d-panel"
		 */
		baseClass: "d-accordion-header",

		/**
		 * Header's label.
		 * @member {string}
		 * @default ""
		 */
		label: "",

		/**
		 * Accordion sets this value to true if the corresponding Panel is open.
		 * @member {boolean}
		 */
		open: false,

		/**
		 * CSS class to apply to DOMNode to display an icon for an open panel.
		 * @member {string}
		 * @default ""
		 */
		openIconClass: "",

		/**
		 * CSS class to apply to DOMNode to display an icon for a closed panel.
		 * @member {string}
		 * @default ""
		 */
		closedIconClass: "",

		/**
		 * ID of corresponding panel.
		 * @member {string}
		 */
		panelId: "",

		template: template,

		focus: function () {
			this.focusNode.focus();
		}
	});
});
