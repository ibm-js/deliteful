/** @module deliteful/ProgressBar */
define([
	"dcl/dcl",
	"requirejs-dplugins/jquery!attributes/classes",
	"ecma402/IntlShim",
	"delite/register",
	"delite/Widget",
	"delite/handlebars!./ProgressBar/ProgressBar.html",
	"delite/theme!./ProgressBar/themes/{{theme}}/ProgressBar.css"
], function (dcl, $, Intl, register, Widget, template) {
	/**
	 * A widget that displays the completion progress of a task.
	 *
	 * The progress is either indeterminate, indicating that progress is being made but that it is not clear how
	 * much more work remains to be done before the task is complete, or the progress is a number in the range
	 * zero to a maximum, giving the fraction of work that has so far been completed.
	 *
	 * There are two properties that determine the current task completion represented by the element. The value
	 * property specifies how much of the task has been completed, and the max property specifies how much work
	 * the task requires in total. The units are arbitrary and not specified.
	 *
	 * When the progress bar is determinate, a default message displays the percentage of progression.
	 * The property fractionDigits allows to specify the number of fraction digits to display. You can set a custom
	 * message using the message property, or override the method formatMessage to generate a dynamic custom message.
	 *
	 * When the progress bar is indeterminate, use the message property to display a message.
	 *
	 * @class module:deliteful/ProgressBar
	 * @augments module:delite/Widget
	 */
	return register("d-progress-bar", [HTMLElement, Widget], /** @lends module:deliteful/ProgressBar# */{

		/**
		 * A number indicating the amount of completion of a task.
		 * The value property must be a valid floating-point number or NaN. Set the value to NaN to make the
		 * progress bar indeterminate. Set a value comprised between 0 and the max property to make
		 * the progress bar determinate. A value greater than max is converted to the max value. An invalid or
		 * negative value is converted to 0.
		 * @member {number}
		 * @default NaN
		 */
		value: NaN,

		/**
		 * A number which express the task as completed.
		 * The max property must be a valid positive floating-point number, otherwise it is converted to 1.0.
		 * @member {number}
		 * @default 1.0
		 */
		max: 1.0,

		/**
		 * Indicates the relative position of the current value relative to the maximum value (max).
		 * If the progress bar is an indeterminate progress bar, then the position is −1. Otherwise, it is the result
		 * of dividing the current value by the maximum value.
		 * @member {number}
		 * @default -1
		 * @readonly
		 */
		position: -1,

		/**
		 * Allow to specify/override the message on the progress bar whether it's determinate or indeterminate.
		 * The default behavior of the ProgressBar is to  displays the percentage of completion when the state
		 * is determinate, and to display no message when state is indeterminate. You can override this with the
		 * message property. Set an empty string to restore the default behavior.
		 * @member {string}
		 * @default ""
		 */
		message: "",

		/**
		 * Allow to set an additional message.
		 * Depending on the theme it may not be displayed. For themes that display
		 * both messages, typically message is on one side and the additional message is on the other side. By default
		 * the additional message is in the form value/max. Ex: [65%........379/583] or [Loading......379/583]. You may
		 * customize it by overriding the method formatExtMsg.
		 * @member {boolean}
		 * @default false
		 */
		displayExtMsg: false,

		/**
		 * Number of places to show on the default message displayed when the progress bar is determinate.
		 * @member {number}
		 * @default 0
		 */
		fractionDigits: 0,

		/**
		 * The name of the CSS class of this widget.
		 * @member {string}
		 * @default "d-progress-bar"
		 */
		baseClass: "d-progress-bar",

		template: template,

		postRender: function () {
			// TODO: move this code to the template
			this.setAttribute("aria-valuemin", 0);
		},

		computeProperties: function (props) {
			if ("max" in props) {
				var newMax = this._convert2Float(this.max, 1.0);
				if (newMax <= 0) {
					newMax = 1.0;
				}
				if (newMax !== this.max) {
					this.max = newMax;
				}
			}
			if ("value" in props && !isNaN(this.value)) {
				var newValue = this._convert2Float(this.value, 0);
				newValue = Math.max(0, Math.min(this.max, newValue));
				if (newValue !== this.value) {
					this.value = newValue;
				}
			}
			this.position = isNaN(this.value) ? -1 : this.value / this.max;
		},

		refreshRendering: function (props) {
			//update widget to reflect value/max changes
			if ("max" in props) {
				// TODO: move to template
				this.setAttribute("aria-valuemax", this.max);
			}
			if ("value" in props || "max" in props) {
				if (this.position === -1) { //indeterminate state
					this.indicatorNode.style.removeProperty("width");
					this.removeAttribute("aria-valuenow");
				} else {
					this.indicatorNode.style.width = (this.position * 100) + "%";
					this.msgInvertNode.style.width =
						window.getComputedStyle(this.msgNode).getPropertyValue("width");
					this.setAttribute("aria-valuenow", this.value);
				}
			}

			//update widget message
			this.msgNode.innerHTML = this.msgInvertNode.innerHTML =
				this.formatMessage(this.position, this.value, this.max);
			var hasExtMsg = this.displayExtMsg && this.position !== -1;
			$(this.msgNode).toggleClass(this.baseClass + "-msg-ext", hasExtMsg);
			if (hasExtMsg) {
				//set content value to be used by pseudo element d-progress-bar-msg-ext::after
				this.msgNode.setAttribute("msg-ext", this.formatExtMsg(this.position, this.value, this.max));
			} else {
				this.msgNode.removeAttribute("msg-ext");
			}
			//aria text only on indeterminate state with custom message
			if (this.message && this.position === -1) {
				this.setAttribute("aria-valuetext", this.message);
			} else {
				this.removeAttribute("aria-valuetext");
			}
			$(this).toggleClass(this.baseClass + "-indeterminate", (this.position === -1));
		},

		/**
		 * Formats and returns a message to display inside/beside the progress bar (depends on theme settings).
		 * If a custom message is specified with the message property, it is returned as-is. Otherwise if the
		 * progress bar is determined (value is not NaN), it returns the percentage of progression formatted in
		 * respect with fractionDigits. This method is called when the value and/or the max property changes. May be
		 * overridden to customize the message.
		 *
		 * @param {number} position -  Position of the current value relative to the maximum value (from 0.0 to 1.0).
		 * @param {number} value - The amount of completion of the task.
		 * @param {number} max - The value that express the task is completed (maximum value).
		 * @returns {string} The message to display.
		 */
		formatMessage: function (position, value, /*jshint unused: vars */max) {
			if (!this._numberFormat || this._prevLang !== this.lang ||
				this._numberFormat.resolvedOptions().minimumFractionDigits !== this.fractionDigits) {
				var options = {
					style: "percent",
					minimumFractionDigits: this.fractionDigits,
					maximumFractionDigits: this.fractionDigits
				};
				this._numberFormat = new Intl.NumberFormat(this.lang || undefined, options);
				this._prevLang = this.lang;
			}
			return this.message ? this.message : (isNaN(value) ? "" : this._numberFormat.format(position));
		},

		/**
		 * Formats and returns the extra message to display when the property displayExtMsg is enabled.
		 * Returns a string formatted with "value/max". May be overridden to customize the extra message.
		 *
		 * @param {number} position Position of the current value relative to the maximum value (from 0.0 to 1.0).
		 * @param {number} value The amount of completion of the task.
		 * @param {number} max The value that express the task is completed (maximum value).
		 * @returns {string} The extra message to display.
		 */
		formatExtMsg: function (position, value, max) {
			return value + "/" + max;
		},

		/*
		 * Converts a value to a valid floating-point numbers.
		 * The Infinity and Not-a-Number (NaN) values are not valid floating-point numbers.
		 *
		 * @param value - The value to convert
		 * @param fallbackValue - The value to assign if the conversion fails.
		 * @returns {Number}
		 * @private
		 */
		_convert2Float: function (value, fallbackValue) {
			var v = parseFloat(value);
			if (isNaN(v) || v === Infinity) {
				v = fallbackValue;
			}
			return v;
		}
	});
});
