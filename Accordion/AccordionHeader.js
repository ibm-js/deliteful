/** @module deliteful/Accordion/AccordionHeader */
define([
	"delite/a11y",
	"delite/register",
	"delite/Widget",
	"delite/handlebars!./AccordionHeader/AccordionHeader.html"
], function (
	a11y,
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
		 * Corresponding panel.
		 * @member {delite/Widget}
		 */
		panel: null,

		template: template,

		createdCallback: function () {
			this.on("focusin", this.focusinHandler.bind(this));
			this.on("focusout", this.focusoutHandler.bind(this));
			this.on("keydown", this.keydownHandler.bind(this));
		},

		refreshRendering: function (oldVals) {
			if ("panel" in oldVals) {
				this.panel.on("focusin", this.focusinHandler.bind(this));
				this.panel.on("focusout", this.focusoutHandler.bind(this));
			}
		},

		/**
		 * Handler for when header or related panel gets a focus event.
		 * @param evt
		 */
		focusinHandler: function (evt) {
			if (evt.target === this || this.panel.contains(evt.target)) {
				// If the AccordionHeader itself is focused, or if the panel is focused,
				// then set tabIndex=0 so that tab and shift-tab work correctly.
				this.tabIndex = 0;

				// Handling for when there are fields inside the header that can be tab navigated.
				// Set all the tabindexes to 0 so that user can tab around fields in the header.
				Array.prototype.forEach.call(this.querySelectorAll("[tabindex]"), function (node) {
					node.tabIndex = 0;
				});
			} else {
				// If my descendant gets focus, remove my tabIndex to
				// avoid Safari and Firefox problems with nested focusable elements.
				this.removeAttribute("tabindex");
			}
		},

		keydownHandler: function (evt) {
			// The focusinHandler() may have removed my tabIndex, but shift-tab from a node
			// inside of me should still go to me.  Call getFirstInTabbingOrder() on every
			// keystroke in case content changes dynamically.
			if (evt.shiftKey && evt.key === "Tab" && evt.target === a11y.getFirstInTabbingOrder(this)) {
				evt.preventDefault();
				evt.stopPropagation();
				this.tabIndex = 0;
				this.focus();
			}
		},

		/**
		 * Handler for when header or related panel gets a blur event.
		 * @param evt
		 */
		focusoutHandler: function (evt) {
			if (!this.contains(evt.relatedTarget) && !this.panel.contains(evt.relatedTarget)) {
				// Set all the tabindexes to -1 so that tabbing doesn't hit unselected headers.
				this.tabIndex = -1;
				Array.prototype.forEach.call(this.querySelectorAll("[tabindex]"), function (node) {
					node.tabIndex = -1;
				});
			}
		}
	});
});
