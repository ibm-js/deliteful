define([
	"dojo/dom-class",
	"dojo/dom-construct",
	"dojo/number",
	"delite/register",
	"delite/Widget",
	"delite/Invalidating",
	"delite/themes/load!delite/themes/{{theme}}/common_css,./ProgressBar/themes/{{theme}}/ProgressBar_css",
	"dojo/has!dojo-bidi?delite/themes/load!./ProgressBar/themes/{{theme}}/ProgressBar_rtl_css"
], function (domClass, domConstruct, number, register, Widget, Invalidating) {

	return register("d-progress-bar", [HTMLElement, Widget, Invalidating], {
		// summary
		//		d-progress-bar widget displays status for tasks that takes a long time.
		//
		//		CSS styles:
		//		- d-progress-bar: margins, display type, position, borders and font styles.
		//		- d-progress-bar-background: background color and shape.
		//		- d-progress-bar-indicator: progress indicator styles: color, transition...
		//		- d-progress-bar-label: text label content and position.
		//		- d-progress-bar-label-ext: text label content and position (see displayValues property).
		//		- d-progress-bar-indeterminate: set indeterminate state styles with descendent selectors.
		//		- d-progress-bar-empty: set when progress is 0% (set styles with descendent selectors).
		//		- d-progress-bar-full: set when progress is 100% (set styles with descendent selectors).

		// value: String (Percentage or Number)
		//		Number or percentage indicating the amount of completed task.
		//		With "%": percentage value, 0% <= progress <= 100%, or
		//		without "%": absolute value, 0 <= progress <= maximum.
		//		Set the value to 'Infinity' to force the progress bar state to indeterminate.
		//		Negative and NaN values are defaulted to 0.
		//		Default: Infinity
		value: "Infinity",

		// maximum: Number
		//		Number which express the task as completed.
		//		Negative values are defaulted to 0.
		//		Default: 100
		maximum: 100,

		// label: String
		//		Allow to specify/override the label on the progress bar whether it's determinate or indeterminate.
		// 		By default, when the state is determinate the progress bar displays the percentage of completion
		// 		or a number which express the amount of task completed.
		// 		When state is indeterminate it doesn't display a label.
		//		Set an empty string to restore the default label.
		//		Default: ""
		label: "",

		// displayValues: Boolean
		//		Allow to display the current value vs the maximum in the form value/maximum in addition to the current
		//		label. When true, the label stick to one side and value/maximum stick to the other side.
		//		Ex: [65%........379/583]
		//		This property is theme dependent. On some theme it has no effect.
		//		Default: false
		displayValues: false,

		// fractionDigits: Number
		//		Number of places to show on default label displayed by the progress bar.
		//		Default: 0
		fractionDigits: 0,

		// baseClass: String
		// 		Name prefix for CSS classes used by this widget
		//		Default: "d-progress-bar"
		baseClass: "d-progress-bar",

		preCreate: function () {
			// watched properties to trigger invalidation
			this.addInvalidatingProperties("value", "label", "maximum", "fractionDigits", "displayValues");
		},

		buildRendering: function () {
			// Construct the UI for this widget.
			// The widget structure with supported CSS classes:
			//<div class="d-progress-bar d-progress-bar-empty d-progress-bar-full d-progress-bar-indeterminate"
			//	id="{widgetID}"
			//	role="progressbar"
			//	aria-valuenow="..." aria-valuemin="0" aria-valuemax="..." aria-labelledby="{widgetID}_label">
			//	<div class="d-progress-bar-background">
			//		<div style="width: x%" class="d-progress-bar-indicator"></div>
			//	</div>
			//	<div id="{widgetID}_label" label-ext="..." class="d-progress-bar-label" >{label}</div>
			//</div>
			this.setAttribute("role", "progressbar");
			this.backgroundNode = domConstruct.create("div",
				{className: this.baseClass + "-background"}, this, "last");
			this.indicatorNode = domConstruct.create("div",
				{className: this.baseClass + "-indicator "},
				this.backgroundNode, "last");
			this.labelNode = domConstruct.create("div",
				{className: this.baseClass + "-label"}, this, "last");
			this.setAttribute("aria-valuemin", 0);
			domClass.add(this, this.baseClass + "-empty");
		},

		refreshRendering: function () {
			this._update();
		},

		startup:  function () {
			//set label id here because this.id is not available in buildRendering when
			//the widget is instantiated programmatically
			this._setLabelId();
			//refreshRendering not called when the widget is instantiated programmatically, so
			//explicitly update the widget state here.
			this._update();
		},

		_setLabelId: function () {
			// summary:
			//		Set the label id (required by aria-labelledby).
			// tags:
			//		private
			if (this.id) {
				this.labelNode.setAttribute("id", this.id + "_label");
			}
		},

		_setIndicatorSize: function (percent) {
			// summary:
			//		Set indicatorNode size according to the amount of completed task.
			//		LTR: set the width property
			//		RTL: set the left property
			// tags:
			//		private
			if (this.isLeftToRight()) {
				this.indicatorNode.style.width = percent + "%";
			} else {
				this.indicatorNode.style.left = (100 - percent) + "%";
			}
		},

		_update: function () {
			// summary:
			//		Internal method to update ProgressBar according to its attributes values.
			// tags:
			//		private
			var _percent = 0, _value, _maximum, _displayValues;
			_value = (this.value === "Infinity") ? Infinity:this.value;
			_maximum = (this.maximum < 0) ? 100:this.maximum;
			_displayValues = this.displayValues && _value !== Infinity && this.label === "";

			if (_value === Infinity) {
				this.indicatorNode.style.removeProperty("width");
				this.indicatorNode.style.removeProperty("left"); // RTL
				this.labelNode.removeAttribute("label-ext");
				this.removeAttribute("aria-valuenow");
			} else {
				if (String(this.value).indexOf("%") !== -1) {
					_percent = Math.min(parseFloat(this.value) / 100, 1);
					_value = _percent * _maximum;
				} else {
					if (isNaN(this.value) || this.value < 0) {
						_value = 0;
					} else {
						_value = Math.min(parseFloat(this.value), _maximum);
					}
					_percent = _value / _maximum;
				}
				this._setIndicatorSize(_percent * 100);
				this.setAttribute("aria-valuenow", _value);
			}
			this.labelNode.innerHTML = this.formatMessage(_percent, _value, _maximum);
			domClass.toggle(this.labelNode, this.baseClass + "-label-ext", _displayValues);
			if (_displayValues) {
				//set content value to be used by pseudo element d-progress-bar-label-ext::after
				this.labelNode.setAttribute("label-ext", this.formatValues(_percent, _value, _maximum));
			}

			this.setAttribute("aria-labelledby", this.labelNode.id);
			this.setAttribute("aria-valuemax", _maximum);
			if (_value !== Infinity) {
				if (domClass.contains(this, this.baseClass + "-indeterminate")) {
					// force remove transition to avoid flickering when switching
					// from Indeterminate to determinate state.
					this.indicatorNode.style.webkitTransition = this.indicatorNode.style.transition = "width 0s";
					//this.indicatorNode.style.webkitTransition = "width 0s";
					domClass.remove(this, this.baseClass + "-indeterminate");
				} else {
					this.indicatorNode.style.removeProperty("transition");
					this.indicatorNode.style.removeProperty("-webkit-transition");
				}
			} else {
				domClass.add(this, this.baseClass + "-indeterminate");
			}
			domClass.toggle(this, this.baseClass + "-empty", (_percent === 0));
			domClass.toggle(this, this.baseClass + "-full", (_percent === 1));
			this.emit("change", {percent: _percent, value: _value, maximum: _maximum});
			/*	issue:
			 this inline declaration doesn't work on iOS and Android stock browser (4.2.2/webkit:535.19):
			 onchange="alert(this.value + "," + event.percent)"
			 */
		},
		/*
		issue:
		if this function is defined, this inline declaration doesn't work:
		onchange="alert(this.value + "," + event.percent)"
		*/
//		onChange: function () {
//		},

		formatMessage: function (/*Number*/percent, /*Number*/value, /*jshint unused: vars *//*Number*/maximum) {
			// summary:
			//		Generates HTML message to show inside/beside the progress bar (depends on theme settings).
			// 		May be overridden.
			// percent:
			//		Percentage indicating the amount of completed task.
			// value:
			//		The current value
			// maximum:
			//		The maximum value

			return this.label ? this.label : (value === Infinity ?
				"" : number.format(percent, {type: "percent", places: this.fractionDigits, round: -1, locale: this.lang}));
		},

		formatValues: function (/*Number*/percent, /*Number*/value, /*Number*/maximum) {
			// summary:
			//		Set content to be displayed when property displayValues is enabled. By default it returns
			//		value/maximum
			// 		May be overridden.
			// percent:
			//		Percentage indicating the amount of completed task.
			// value:
			//		The current value
			// maximum:
			//		The maximum value
			return (this.isLeftToRight()) ? value + "/" + maximum:maximum + "/" + value;
		}
	});
});