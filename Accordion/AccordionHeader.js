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

		template: template,

		createdCallback: function () {
			this.on("focusin", function () {
				this.focusinHandler();
			}.bind(this));
			this.on("focusout", function () {
				this.focusoutHandler();
			}.bind(this));
		},

		// Handling for when there are fields inside the header that can be focused.
		// The template must set tabindex=-1 on all
		// fields inside the header, in addition to the header itself.
		focusinHandler: function () {
			console.log(this.id, ", focusin");
			// Set all the tabindexes to 0 so that user can tab around fields in the header.
			Array.prototype.forEach.call(this.querySelectorAll("[tabindex]"), function (node) {
				node.tabIndex = 0;
			});
		},

		focusoutHandler: function () {
			console.log(this.id, ", focusout");
			// Set all the tabindexes to -1 so that tabbing doesn't hit unselected headers.
			Array.prototype.forEach.call(this.querySelectorAll("[tabindex]"), function (node) {
				node.tabIndex = -1;
			});
		}
	});
});
