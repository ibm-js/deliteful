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
		// 		progression with respect to the max value (ie: if value is 53 and max is 100, the progression is 53%.
		// 		If max is 200, the progression is 26%). Negative and NaN values are defaulted to 0. Values higher
		// 		than max are defaulted to max.
		//		Set the value to 'Infinity' to force the progress bar state to indeterminate.
		//		Default: Infinity
		value: Infinity,

		// max: Number
		//		Number which express the task as completed.
		//		Negative and NaN values are defaulted to 0.
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
			this.addInvalidatingProperties("value", "message", "max", "fractionDigits", "displayValues");
		},

		buildRendering: renderer,

		refreshRendering: function (props) {
			var _percent, _value, _max, _displayValues;
			_value = Math.max(0, isNaN(this.value) ? 0 : this.value);
			_max = Math.max(0, isNaN(this.max) ? 0 : this.max);
			if (_value !== Infinity) {
				_value = Math.min(this.value, _max);
				_percent = _value / _max;
			}

			if (props.value || props.max) {
				if (_value === Infinity) {
					this.indicatorNode.style.removeProperty("width");
					this.msgNode.removeAttribute("msg-ext");
					this.removeAttribute("aria-valuenow");
				} else {
					this.indicatorNode.style.width = (_percent * 100) + "%";
					this.msgInvertNode.style.width = window.getComputedStyle(this.msgNode).getPropertyValue("width");
					this.setAttribute("aria-valuenow", _percent * 100);
				}
			}

			if (props.max) {
				this.setAttribute("aria-valuemax", _max);
			}

			_displayValues = this.displayValues && _value !== Infinity;
			domClass.toggle(this.msgNode, this.baseClass + "-msg-ext", _displayValues);
			if (_displayValues) {
				//set content value to be used by pseudo element d-progress-bar-msg-ext::after
				this.msgNode.setAttribute("msg-ext", this.formatValues(_percent, _value, _max));
			}

			this.msgNode.innerHTML = this.msgInvertNode.innerHTML = this.formatMessage(_percent, _value, _max);

			domClass.toggle(this, this.baseClass + "-indeterminate", (_value === Infinity));
			domClass.toggle(this, this.baseClass + "-empty", (_percent === 0));
			domClass.toggle(this, this.baseClass + "-full", (_percent === 1));

			if (props.value || props.max) {
				this.emit("change", {percent: _percent, value: _value, max: _max});
			}
		},

		startup: function () {
			//set label id here because this.id is not available in buildRendering when
			//the widget is instantiated programmatically
			//todo: ensure an id is available, otw generate one, see https://github.com/ibm-js/delite/issues/109
//			if (this.id) {
//				this.labelNode.setAttribute("id", this.id + "_label");
//				this.setAttribute("aria-labelledby", this.labelNode.id);//todo: set only once
//			}
		},

		enteredViewCallback: dcl.after(function () {
			this.indicatorNode = this.querySelector(".d-progress-bar .d-progress-bar-indicator");
			this.msgNode = this.querySelector(".d-progress-bar .d-progress-bar-msg");
			this.msgInvertNode = this.querySelector(".d-progress-bar .d-progress-bar-msg-invert");
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