/** @module deliteful/Panel */
define(["dcl/dcl",
	"delite/register",
	"delite/Container",
	"delite/handlebars!./Panel/Panel.html",
    "delite/theme!./Panel/themes/{{theme}}/Panel.css"
], function (dcl, register, Container, template) {

	/**
	 * A container widget with a Title Bar on top, that uses CSS3 Flexible box to
	 * always show the title and fill the available space with its children.
	 *
	 * @class module:deliteful/Panel
	 * @augments module:delite/Container
	 * @example:
	 * <d-panel id="panel" label="Title">
	 *   <div>...</div>
	 *   <div>...</div>
	 * </d-panel>
	 */
	return register("d-panel", [HTMLElement, Container], /** @lends module:deliteful/Panel# */ {

		/**
		 * The name of the CSS class of this widget.
		 * @member {string}
		 * @default "d-panel"
		 */
		baseClass: "d-panel",

		/**
		 * The label to be displayed in the panel header.
		 * @member {string}
		 * @default ""
		 */
		label: "",

		/**
		 * The name of the CSS class to apply to DOMNode in panel header to make it display an icon.
		 * If the panel is used inside an Accordion, this icon is displayed when panel is open.
		 * @member {string}
		 * @default ""
		 */
		iconClass: "",

		/**
		 * If the panel is used inside an Accordion:
		 * The name of the CSS class to apply to DOMNode in panel header to make it display an icon when panel is
		 * closed.
		 * @member {string}
		 * @default ""
		 */
		closedIconClass: "",

		template: template,

		postRender: function () {
			this.headerNode.id = (this.id ? this.id : "panel_" + this.widgetId) + "_panelHeader";
			this.containerNode.setAttribute("aria-labelledby", this.headerNode.id);
		}
	});
});