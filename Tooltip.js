/** @module deliteful/Tooltip */
define([
	"delite/place",
	"delite/register",
	"delite/Container",
	"delite/handlebars!./Tooltip/Tooltip.html",
	"requirejs-dplugins/jquery!attributes/classes",
	"delite/theme!./Tooltip/themes/{{theme}}/Tooltip.css"
], function (place, register, Container, template, $) {

	/**
	 * A tooltip widget, to be used as a popup.
	 * Meant to contain simple or rich text, but not interactive controls (ex: links and buttons).
	 *
	 * @class module:deliteful/Tooltip
	 * @augments module:delite/Container
	 */
	return register("d-tooltip", [HTMLElement, Container], /** @lends module:deliteful/Tooltip# */ {
		/**
		 * The name of the CSS class of this widget.
		 * @member {string}
		 * @default "d-tooltip"
		 */
		baseClass: "d-tooltip",

		template: template,

		constructor: function () {
			this.on("popup-after-show", this.onOpen.bind(this));
			this.on("popup-after-position", this.onPosition.bind(this));
			this.on("popup-before-hide", this.onClose.bind(this));
		},

		/**
		 * Called when tooltip is displayed or repositioned.
		 * This is called from the delite/popup code, and should not be called directly.
		 */
		onPosition: function (/*Object*/ pos) {
			var tooltipCorner = pos.corner,
				aroundCorner = pos.aroundCorner;

			// Set appropriate class.
			var newC = {
				// Real around node
				"MR-ML": "d-tooltip-right",
				"ML-MR": "d-tooltip-left",
				"TM-BM": "d-tooltip-above",
				"BM-TM": "d-tooltip-below",
				"BL-TL": "d-tooltip-below d-tooltip-AB-left",
				"TL-BL": "d-tooltip-above d-tooltip-AB-left",
				"BR-TR": "d-tooltip-below d-tooltip-AB-right",
				"TR-BR": "d-tooltip-above d-tooltip-AB-right",
				"BR-BL": "d-tooltip-right",
				"BL-BR": "d-tooltip-left",

				// Positioning "around" a point, ex: mouse position
				"BR-TL": "d-tooltip-below d-tooltip-AB-left",
				"BL-TR": "d-tooltip-below d-tooltip-AB-right",
				"TL-BR": "d-tooltip-above d-tooltip-AB-right",
				"TR-BL": "d-tooltip-above d-tooltip-AB-left"
			}[aroundCorner + "-" + tooltipCorner];
			$(this).removeClass(this._currentOrientClass || "").addClass(newC);
			this._currentOrientClass = newC;

			// Position the tooltip connector for middle alignment.
			var myPos = place.position(this);
			var aroundNodeCoords = pos.aroundNodePos;
			function clamp(value, min, max) {
				return Math.max(min, Math.min(max, value));
			}
			if (tooltipCorner.charAt(0) === "M" && aroundCorner.charAt(0) === "M") {
				this.connectorNode.style.top = clamp(
					aroundNodeCoords.y + ((aroundNodeCoords.h - this.connectorNode.offsetHeight) >> 1) - myPos.y,
					3,
					this.offsetHeight - this.connectorNode.offsetHeight - 3) + "px";
				this.connectorNode.style.left = "";
			} else if (tooltipCorner.charAt(1) === "M" && aroundCorner.charAt(1) === "M") {
				this.connectorNode.style.left = clamp(
					aroundNodeCoords.x + ((aroundNodeCoords.w - this.connectorNode.offsetWidth) >> 1) - myPos.x,
					3,
					this.offsetWidth - this.connectorNode.offsetWidth - 3) + "px";
				this.connectorNode.style.top = "";
			}
		},

		/**
		 * Called when tooltip is displayed.
		 * This is called from the delite/popup code, and should not be called directly.
		 */
		onOpen: function (/*Object*/ pos) {
			// Setup aria-described property pointing from anchor-node to this node.
			var aroundNode = pos.around;
			if (aroundNode) {
				this.anchorNode = aroundNode.focusNode || aroundNode;
				if (!this.id) {
					this.id = this.widgetId;
				}
				this.anchorNode.setAttribute("aria-describedby", this.id);
			}
		},

		/**
		 * Called when tooltip is hidden.
		 * This is called from the delite/popup code, and should not be called directly.
		 */
		onClose: function () {
			if (this.anchorNode) {
				this.anchorNode.removeAttribute("aria-describedby");
			}
		}
	});
});
