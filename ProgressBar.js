define([
	"dcl/dcl",
	"dojo/dom-class",
	"dojo/number",
	"delite/register",
	"delite/Widget",
	"delite/Invalidating",
	"delite/handlebars!./ProgressBar/ProgressBar.html",
	"delite/themes/load!delite/themes/{{theme}}/common_css,./ProgressBar/themes/{{theme}}/ProgressBar_css",
	"dojo/has!dojo-bidi?delite/themes/load!./ProgressBar/themes/{{theme}}/ProgressBar_rtl_css"
], function (dcl, domClass, number, register, Widget, Invalidating, renderer) {

	return register("d-progress-bar", [HTMLElement, Widget, Invalidating], {
		// summary
		//		d-progress-bar widget displays status for tasks that takes a long time.

		// value: Number
		//		Number indicating the amount of completed task. The ProgressBar calculates the percentage of
		// 		progression with respect to the min and the max values (ie: if value is 53, min is 0 and max is 100,
		// 		the progression is 53%. If min is 0 and max is 200, the progression is 26%).
		// 		When calculating the percentage, value lower than min is defaulted to min. Value higher
		// 		than max is defaulted to max. Set the value to NaN to force the progress bar state to
		// 		indeterminate.
		//		Default: NaN
		value: NaN,

		// min: Number
		//		Starting point of the progression range. Attempt to set NaN or a number higher or equal to than max
		// 		will throw a RangeError.
		//		Default: 0
		min: 0,

		// max: Number
		//		Number which express the task as completed. Attempt to set NaN or a number lower or equal to min will
		// 		throw a RangeError.
		//		Default: 100
		max: 100,

		// message: String
		//		Allow to specify/override the message on the progress bar whether it's determinate or indeterminate.
		// 		The default behavior of the ProgressBar is to  displays the percentage of completion when the state
		// 		is determinate, and to display no message when state is indeterminate. You can override this with the
		// 		message attribute. Set an empty string to restore the default behavior.
		//		Default: ""
		message: "",

		// displayExtMsg: Boolean
		//		Set to true to display an other messages. The actual display of this message depends of the theme
		// 		which is actually enforced. The message sticks to one side and the extra message sticks to the
		// 		other side. Ex: [65%........379/583] or [Loading......379/583]. By default, the extra message is
		// 		in the form value/max. You may customize the extra message by overriding the method formatExtMsg().
		//		This property is theme dependent. On some theme it has no effect.
		//		Default: false
		displayExtMsg: false,

		// fractionDigits: Number
		//		Number of places to show on default message displayed by the progress bar.
		//		Default: 0
		fractionDigits: 0,

		// baseClass: String
		// 		Name prefix for CSS classes used by this widget
		//		Default: "d-progress-bar"
		baseClass: "d-progress-bar",

		preCreate: function () {
			// watched properties to trigger invalidation
			this.addInvalidatingProperties(
				{value: "invalidateProperty"},
				{min: "invalidateProperty"},
				{max: "invalidateProperty"},
				"message",
				"displayExtMsg",
				"fractionDigits"
			);
		},

		buildRendering: renderer,

		_setMinAttr: function (value) {
			if (isNaN(value) || value >= this.max) {
				throw new RangeError("min (" + value + ") must be < max (" + this.max + ")");
			}
			this._set("min", value);
		},

		_setMaxAttr: function (value) {
			if (isNaN(value) || value <= this.min) {
				throw new RangeError("max (" + value + ") must be > min (" + this.min + ")");
			}
			this._set("max", value);
		},

		refreshProperties: function () {
			if (!isNaN(this.value)) {
				//ensure value is in range (min < value < max)
				var correctedValue = Math.max(this.min, Math.min(this.value, this.max));
				if (correctedValue !== this.value) {
					this.value = correctedValue;
					this.validateProperties();
				}
			}
		},

		refreshRendering: function (props) {
			var _percent = (this.value - this.min) / (this.max - this.min);

			this._updateValues(props, this.value, _percent);
			this._updateMessages(this.value, _percent);
			domClass.toggle(this, this.baseClass + "-indeterminate", isNaN(this.value));
			if (props.value || props.max || props.min) {
				this.emit("change", {percent: _percent * 100, value: this.value, min: this.min, max: this.max});
			}
		},

		_updateValues: function (props, _value, _percent) {
			//update widget to reflect value changes (value, min or max)
			if (props.min) {
				this.setAttribute("aria-valuemin", this.min);
			}
			if (props.max) {
				this.setAttribute("aria-valuemax", this.max);
			}
			if (props.value || props.max || props.min) {
				if (isNaN(_value)) { //indeterminate state
					this.indicatorNode.style.removeProperty("width");
					this.removeAttribute("aria-valuenow");
				} else {
					this.indicatorNode.style.width = (_percent * 100) + "%";
					this.msgInvertNode.style.width = window.getComputedStyle(this.msgNode).getPropertyValue("width");
					this.setAttribute("aria-valuenow", _value);
				}
			}
		},

		_updateMessages: function (_value, _percent) {
			//update widget messages
			this.msgNode.innerHTML = this.msgInvertNode.innerHTML = this.formatMessage(_percent, _value, this.max);
			var _displayExtMsg = this.displayExtMsg && !isNaN(_value);
			domClass.toggle(this.msgNode, this.baseClass + "-msg-ext", _displayExtMsg);
			if (_displayExtMsg) {
				//set content value to be used by pseudo element d-progress-bar-msg-ext::after
				this.msgNode.setAttribute("msg-ext", this.formatExtMsg(_percent, _value, this.max));
			} else {
				this.msgNode.removeAttribute("msg-ext");
			}
			//aria text only on indeterminate state with custom message
			if (this.message && isNaN(_value)) {
				this.setAttribute("aria-valuetext", this.message);
			} else {
				this.removeAttribute("aria-valuetext");
			}
		},

		enteredViewCallback: dcl.after(function () {
			this.indicatorNode = this.querySelector("." + this.baseClass + " ." + this.baseClass + "-indicator");
			this.msgNode = this.querySelector("." + this.baseClass + " ." + this.baseClass + "-msg");
			this.msgInvertNode = this.querySelector("." + this.baseClass + " ." + this.baseClass + "-msg-invert");
			//default values
			this.refreshRendering({value: true, min: true, max: true});
		}),

		formatMessage: function (/*Number*/percent, /*Number*/value, /*jshint unused: vars *//*Number*/max) {
			// summary:
			//		Generates HTML message to show inside/beside the progress bar (depends on theme settings).
			//		If a custom message is specified, use it. If value is not NaN, format the percentage of
			//		progression in respect with fractionDigits.
			// 		May be overridden.
			// percent:
			//		Percentage indicating the amount of completed task.
			// value:
			//		The current value
			// max:
			//		The maximum value
			return this.message ? this.message : (isNaN(value) ? "" : number.format(percent, {
				type: "percent",
				places: this.fractionDigits,
				round: -1,
				locale: this.lang
			}));
		},

		formatExtMsg: function (/*Number*/percent, /*Number*/value, /*Number*/max) {
			// summary:
			//		Set content to be displayed when property displayExtMsg is enabled. By default it returns a
			// 		String formatted with "value/max"
			// 		May be overridden.
			// percent:
			//		Percentage indicating the amount of completed task.
			// value:
			//		The current value
			// max:
			//		The maximum value
			return (this.isLeftToRight()) ? value + "/" + max : max + "/" + value;
		}
	});
});