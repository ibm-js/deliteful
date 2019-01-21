define([
	"dcl/advise",
	"dojo/dnd/Moveable",
	"delite/popup",
	"delite/register",
	"delite/Container",
	"delite/Dialog",
	"delite/Viewport",
	"./ResizeHandle",
	"delite/handlebars!./Dialog/Dialog.html",
	"requirejs-dplugins/i18n!./Dialog/nls/Dialog",
	"delite/theme!./Dialog/themes/{{theme}}/Dialog.css",
	"delite/uacss"		// Dialog.css references "d-ie" class
], function (
	advise,
	Moveable,
	popup,
	register,
	Container,
	Dialog,
	Viewport,
	ResizeHandle,
	template,
	messages
) {

	"use strict";

	/**
	 * A dialog widget, to be used as a popup.
	 * Meant to contain forms or interactive controls (ex: links, buttons).
	 *
	 * @class module:deliteful/Dialog
	 * @augments module:delite/Dialog
	 * @augments module:delite/Container
	 */
	return register("d-dialog", [HTMLElement, Dialog, Container],  /** @lends module:deliteful/Dialog# */ {

		baseClass: "d-dialog",

		nls: messages,

		template: template,

		/**
		 * Whether or not dialog is modal.
		 */
		modal: true,

		/**
		 * Whether or not dialog is draggable.
		 */
		draggable: true,

		/**
		 * If set, makes dialog resizable.  One of: x|y|xy limit resizing to a single axis.
		 * @member {string}
		 */
		resizeAxis: "",

		/**
		 * The title of the Dialog, displayed at the top, above the content.
		 * @member {string}
		 */
		label: "",

		/**
		 * Class to display the close button icon.
		 * @member {string}
		 * @default "d-dialog-close-icon"
		 */
		closeButtonIconClass: "d-dialog-close-icon",

		refreshRendering: function (props) {
			// Add/remove ResizeHandle depending on whether or not Dialog is resizable.
			if ("resizeAxis" in props) {
				if (this._resizeHandle) {
					this._resizeHandle.destroy();
				}
				if (this.resizeAxis) {
					this._resizeHandle = new ResizeHandle({
						target: this,
						resizeAxis: this.resizeAxis
					});

					// When resize starts, set min/max size restrictions.
					advise.before(this._resizeHandle, "_beginSizing", function () {
						// Don't let the user shrink the dialog below the space needed for the boilerplate
						// and 50px for the content.
						var minHeight = this.getBoundingClientRect().height
							- this.containerNode.getBoundingClientRect().height + 50,
							minWidth = 200;

						// Adjust min height/width if Dialog has custom getMinSize() method.
						if (this.getMinSize) {
							var minSize = this.getMinSize();
							minHeight = Math.max(minHeight, minSize.h);
							minWidth = Math.max(minWidth, minSize.w);
						}

						this._resizeHandle.minHeight = minHeight;
						this._resizeHandle.minWidth = minWidth;

						// If dialog has getMaxSize() method, set max size restrictions.
						if (this.getMaxSize) {
							var maxSize = this.getMaxSize();
							this._resizeHandle.maxHeight = maxSize.h;
							this._resizeHandle.maxWidth = maxSize.w;
						}
					}.bind(this));

					// Add it to root node, not this.containerNode.
					HTMLElement.prototype.appendChild.call(this, this._resizeHandle);
				}
			}

			if ("draggable" in props) {
				if (this.draggable) {
					this.enableDrag();
				} else {
					this.disableDrag();
				}

			}
		},

		/**
		 * Display the Dialog.
		 */
		open: function () {
			var previouslyFocusedNode = this.ownerDocument.activeElement;

			popup.open({
				parent: previouslyFocusedNode,
				popup: this,
				orient: ["center"],
				onExecute: this.close.bind(this),
				onCancel: this.close.bind(this),
				onClose: function () {
					// Focus previously focused node unless it's hidden or destroyed,
					// in which case caller must handle the focus.
					if (previouslyFocusedNode && previouslyFocusedNode.focus &&
						previouslyFocusedNode.offsetParent !== null) {
						previouslyFocusedNode.focus();
					}
				}.bind(this)
			});

			this.focus();
		},

		/**
		 * Closes the dialog.
		 * Called automatically when dialog emits an "execute" or "cancel" event.
		 */
		close: function () {
			popup.close(this);
		},

		focus: function () {
			// Focus on first field.
			this._getFocusItems();
			if (this._firstFocusItem && this._firstFocusItem !== this) {
				this._firstFocusItem.focus();
			}
		},

		/**
		 * Make the dialog draggable.
		 */
		enableDrag: function () {
			if (!this.moveable) {
				var wrapper = popup.createWrapper(this);

				this.moveable = new Moveable(wrapper, {
					handle: this.headerNode,
					area: "padding",
					within: true
				});

				advise.after(this.moveable, "onMoveStart", function () {
					// Lock in width/height to prevent squashing when Dialog dragged past right edge of screen.
					var cs = getComputedStyle(this),
						wrapper = this.parentNode;
					wrapper.style.width = this.style.width = cs.width;
					wrapper.style.height = this.style.height = cs.height;

					this.emit("delite-dragged");
				}.bind(this));

				advise.after(this.moveable, "onMoveStop", function () {
					// Snap back so drag handle on screen.
					this.moveIntoView();
				}.bind(this));
			}
		},

		/**
		 * Move the dialog back into view, at least enough so that the user can drag it again.
		 */
		moveIntoView: function () {
			// Note: all positions relative to document (not to viewport).
			var viewport = Viewport.getEffectiveBox(),
				wrapper = this.parentNode,
				bcr = this.headerNode.getBoundingClientRect(),
				curTop = parseFloat(wrapper.style.top),
				curLeft = parseFloat(wrapper.style.left),
				minTop = viewport.t,
				minLeft = viewport.l + 50 - bcr.width,
				maxTop = Math.max(viewport.t + viewport.h - bcr.height, 0),
				maxLeft = Math.max(viewport.l + viewport.w - 50, 0);

			if (curTop < 0 || curTop > maxTop || curLeft < minLeft || curLeft > maxLeft) {
				var top = Math.min(Math.max(curTop, minTop), maxTop),
					left = Math.min(Math.max(curLeft, minLeft), maxLeft);
				wrapper.style.top = top  + "px";
				wrapper.style.left = left + "px";

				this.emit("popup-after-position");
			}
		},

		/**
		 * Remove ability to drag the dialog.
		 */
		disableDrag: function () {
			if (this.moveable) {
				this.moveable.destroy();
				delete this.moveable;
			}
		},

		/**
		 * Called when clicking the dialog's close button.
		 * @protected
		 */
		closeButtonClickHandler: function () {
			this.emit("cancel");
		}
	});
});
