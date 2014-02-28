define([
	"dcl/dcl",
	"dojo/dom-class",
	"dojo/dom-construct",
	"dojo/number",
	"delite/register",
	"delite/Widget",
	"delite/Invalidating",
	"delite/handlebars!./ProgressBar/ProgressBar.html",
	"delite/themes/load!delite/themes/{{theme}}/common_css,./ProgressBar/themes/{{theme}}/ProgressBar_css",
	"dojo/has!dojo-bidi?delite/themes/load!./ProgressBar/themes/{{theme}}/ProgressBar_rtl_css"
], function (dcl, domClass, domConstruct, number, register, Widget, Invalidating, renderer) {

	return register("d-progress-bar", [HTMLElement, Widget, Invalidating], {
		// summary
		//		d-progress-bar widget displays status for tasks that takes a long time.

		// value: Number
		//		Number indicating the amount of completed task. The ProgressBar calculates the percentage of
		// 		progression with respect to the min and the max values (ie: if value is 53, min is 0 and max is 100,
		// 		the progression is 53%. If min is 0 and max is 200, the progression is 26%).
		// 		When calculating the percentage, NaN and value lower than min are defaulted to min. Values higher
		// 		than max are defaulted to max. Set the value to 'Infinity' to force the progress bar state to
		// 		indeterminate.
		//		Default: Infinity
		value: Infinity,

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

		// displayValues: Boolean
		//		Allow to display the current value vs the max in the form value/max in addition to the current
		//		message. When true, the message stick to one side and value/max stick to the other side.
		//		Ex: [65%........379/583] or [Loading......379/583] if you specify a custom message.
		//		This property is theme dependent. On some theme it has no effect.
		//		Default: false
		displayValues: false,

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
			this.addInvalidatingProperties("value", "message", "min", "max", "fractionDigits", "displayValues");
		},

		buildRendering: renderer,

		refreshRendering: function (props) {
			var _percent = NaN, _value;
			if (props.min && isNaN(this.min)) {
				throw new RangeError("NaN not allowed for min");
			}
			if (props.max && isNaN(this.max)) {
				throw new RangeError("NaN not allowed for max");
			}
			if (this.min >= this.max) {
				throw new RangeError("min must be lower than max (min: " + this.min + ", max: " + this.max);
			}
			_value = Math.max(this.min, isNaN(this.value) ? this.min : this.value);
			if (_value !== Infinity) {
				_value = Math.min(_value, this.max);
				_percent = (_value - this.min) / (this.max - this.min);
			}
			this._updateValues(props, _value, _percent);
			this._updateMessages(_value, _percent);
			domClass.toggle(this, this.baseClass + "-indeterminate", (_value === Infinity));
			domClass.toggle(this, this.baseClass + "-empty", (_percent === 0));
			domClass.toggle(this, this.baseClass + "-full", (_percent === 1));
			if (props.value || props.max || props.min) {
				this.emit("change", {percent: _percent, value: _value, max: this.max});
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
				if (_value === Infinity) { //indeterminate state
					this.indicatorNode.style.removeProperty("width");
					this.removeAttribute("aria-valuenow");
				} else {
					this.indicatorNode.style.width = (_percent * 100) + "%";
					this.msgInvertNode.style.width = window.getComputedStyle(this.msgNode).getPropertyValue("width");
					this.setAttribute("aria-valuenow", _percent * 100);
				}
			}
		},

		_updateMessages: function (_value, _percent) {
			//update widget messages
			this.msgNode.innerHTML = this.msgInvertNode.innerHTML = this.formatMessage(_percent, _value, this.max);
			var _displayValues = this.displayValues && _value !== Infinity;
			domClass.toggle(this.msgNode, this.baseClass + "-msg-ext", _displayValues);
			if (_displayValues) {
				//set content value to be used by pseudo element d-progress-bar-msg-ext::after
				this.msgNode.setAttribute("msg-ext", this.formatValues(_percent, _value, this.max));
			} else {
				this.msgNode.removeAttribute("msg-ext");
			}
			//aria text only on indeterminate state with custom message
			if (this.message && _value === Infinity) {
				this.setAttribute("aria-valuetext", this.message);
			} else {
				this.removeAttribute("aria-valuetext");
			}
		},

		enteredViewCallback: dcl.after(function () {
			this.indicatorNode = this.querySelector(".d-progress-bar .d-progress-bar-indicator");
			this.msgNode = this.querySelector(".d-progress-bar .d-progress-bar-msg");
			this.msgInvertNode = this.querySelector(".d-progress-bar .d-progress-bar-msg-invert");
			//default values
			this.refreshRendering({value: true, min: true, max: true});
		}),

		formatMessage: function (/*Number*/percent, /*Number*/value, /*jshint unused: vars *//*Number*/max) {
			// summary:
			//		Generates HTML message to show inside/beside the progress bar (depends on theme settings).
			//		If a custom message is specified, use it. If value is not Infinity, format the percentage of
			//		progression in respect with fractionDigits.
			// 		May be overridden.
			// percent:
			//		Percentage indicating the amount of completed task.
			// value:
			//		The current value
			// max:
			//		The maximum value
			return this.message ? this.message : (value === Infinity ? "" : number.format(percent, {
				type: "percent",
				places: this.fractionDigits,
				round: -1,
				locale: this.lang
			}));
		},

		formatValues: function (/*Number*/percent, /*Number*/value, /*Number*/max) {
			// summary:
			//		Set content to be displayed when property displayValues is enabled. By default it returns a
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