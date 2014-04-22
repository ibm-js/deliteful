define([
	"dcl/dcl",
	"delite/register",
	"delite/Widget",
	"delite/Invalidating",
	"delite/handlebars!./ProgressIndicator/ProgressIndicator.html",
	"delite/theme!./ProgressIndicator/themes/{{theme}}/ProgressIndicator_css"
], function (dcl, register, Widget, Invalidating, renderer) {

	return register("d-progress-indicator", [HTMLElement, Widget, Invalidating], {
		// summary:
		//		d-progress-indicator widget displays a round spinning graphical representation that indicates
		//		that a task is ongoing. This widget starts hidden. Set the active property to true to make it visible.
		//		The spinning animation starts when the widget is visible unless you set the value property to indicate
		//		a percentage of progression.

		// active: boolean
		//		When inactive (active=false), the widget is hidden and animation is not started. When active, the
		//		widget is visible and the animation automatically starts unless you set the value.
		//		Default: false
		active: false,

		// value: Number
		//		Set a value from 0 to 100 to indicate a percentage of progression of an ongoing task. Set value to NaN
		//		hides the number and starts the spinning animation.
		//		Negative value is defaulted to 0. Values up to 100 are defaulted to 100.
		//		Default: NaN
		value: NaN,

		// speed: String
		//		Speed of the spinning animation. Accepted values are "slow", "normal" and "fast". Other values are
		//		defaulted to "normal". Note that the actual/real speed of the animation depends on the
		//		device/os/browser capabilities.
		//		Default: normal
		speed: "normal",

		// baseClass: String
		//		Name prefix for CSS classes used by this widget.
		//		Default: "d-progress-indicator"
		baseClass: "d-progress-indicator",

		/* internal properties */
		_requestId: 0, //request animation id or clearTimeout param
		_lapsTime: 1000, //duration of an animation revolution in milliseconds
		_requestAnimationFunction: (
			(window.requestAnimationFrame && window.requestAnimationFrame.bind(window)) || // standard
			(window.webkitRequestAnimationFrame && window.webkitRequestAnimationFrame.bind(window)) || // webkit
			function (callBack) {// others (ie9)
				return this.defer(callBack, 1000 / 60);
			}),
		_cancelAnimationFunction: (
			window.cancelAnimationFrame || //standard
			window.webkitCancelRequestAnimationFrame || // webkit
			function (handle) {// others (ie9)
				handle.remove();
			}).bind(window),

		/* internal methods */
		_requestRendering: function (animationFrame) {
			//browser agnostic animation frame renderer
			//return a request id
			return this._requestAnimationFunction.call(this, animationFrame);//call on this to match this.defer
		},

		_cancelRequestRendering: function (requestId) {
			//browser agnostic animation frame canceler
			return this._cancelAnimationFunction(requestId);
		},

		_reset: function () {
			//reset text and opacity.
			//ensure that any pending frame animation request is done before doing the actual reset
			this._requestRendering(
				function () {
					//remove any displayed value
					this.msgNode.textContent = "";
					//reset the opacity
					for (var i = 0; i < 12; i++) {
						this.lineNodeList[i].style.opacity = (i + 1) * (1 / 12);
					}
				}.bind(this));
		},

		_stopAnimation: function () {
			//stops the animation (if already started)
			if (this._requestId) {
				this._cancelRequestRendering(this._requestId);
				this._requestId = 0;
			}
		},

		_startAnimation: function () {
			//starts the animation (if not already started)
			if (this._requestId) {
				//animation is already ongoing
				return;
			}
			//restore initial opacity and remove text
			this._reset();
			//compute the amount of opacity to subtract at each frame, on each line.
			//note: 16.7 is the average animation frame refresh interval in ms (~60FPS)
			var delta = 16.7 / this._lapsTime;
			//round spinning animation routine
			var frameAnimation = function () {
				//set lines opacity
				for (var i = 0, opacity; i < 12; i++) {
					opacity = (parseFloat(this.lineNodeList[i].style.opacity) - delta) % 1;
					this.lineNodeList[i].style.opacity = (opacity < 0) ? 1 : opacity;
				}
				//render the next frame
				this._requestId = this._requestRendering(frameAnimation);
			}.bind(this);
			//start the animation
			this._requestId = this._requestRendering(frameAnimation);
		},

		/* widget lifecycle methods */
		preCreate: function () {
			//watched properties to trigger invalidation
			this.addInvalidatingProperties(
				"active",
				{value: "invalidateProperty"},
				{speed: "invalidateProperty"}
			);
		},

		buildRendering: renderer,

		attachedCallback: dcl.after(function () {
			//template: use query selector to get nodes reference that will not be available from buildRendering
			this.svgNode = this.querySelector(".d-progress-indicator svg");
			this.linesNode = this.querySelector(".d-progress-indicator-lines");
			this.lineNodeList = this.querySelectorAll(".d-progress-indicator-lines > line");
			this.msgNode = this.querySelector(".d-progress-indicator text");
			//set unique SVG symbol id
			var symbolId = this.baseClass + "-" + this.widgetId + "-symbol";
			this.querySelector(".d-progress-indicator symbol").id = symbolId;
			this.querySelector(".d-progress-indicator use")
				.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#" + symbolId);
			//set non-overridable styles
			this.svgNode.style.width = "100%";
			this.svgNode.style.height = "100%";
			this.svgNode.style.textAnchor = "middle";
			//a11y high contrast:
			//widget color is declared on svg line nodes (stroke) and text node (fill).
			//Unlike the color style property, stroke and fill are not updated by the browser when windows high contrast
			//mode is enabled. To ensure the widget is visible when high contrast mode is enabled,
			//we set the color property on the root node and check if it is forced by the browser. In such case we
			//force the stroke and fill values to reflect the high contrast color.
			this.style.color = window.getComputedStyle(this.msgNode).getPropertyValue("fill");
			var currentColor = window.getComputedStyle(this).getPropertyValue("color");
			if (this.style.color !== currentColor) {
				this.linesNode.style.stroke = currentColor; // text value color
				this.msgNode.style.fill = currentColor; // lines color
				//android chrome 31.0.1650.59 hack: force to refresh text color otherwise color doesn't change.
				this.msgNode.textContent = this.msgNode.textContent;
			}
			//set initial widget appearance
			this._reset();
		}),

		refreshProperties: function (props) {
			var correctedValue = null;
			if (props.speed) {
				//fast: 500ms
				//slow: 2000ms
				//normal: 1000ms (also default and fallback value)
				correctedValue = (this.speed === "fast") ? 500:(this.speed === "slow") ? 2000:1000;
				if (this._lapsTime !== correctedValue) {
					this._lapsTime = correctedValue;
				}
			}
			if (props.value && !isNaN(this.value)) {
				correctedValue = Math.max(Math.min(this.value, 100), 0);
				if (this.value !== correctedValue) {
					this.value = correctedValue;
				}
			}
			if (correctedValue) {
				this.validate();
			}
		},

		refreshRendering: function (props) {
			//refresh value
			if (props.value) {
				if (isNaN(this.value)) {
					//NaN: start the animation
					if (this.active) {
						this._startAnimation();
					}
				} else {
					//ensure any ongoing animation stops
					this._stopAnimation();
					//ensure pending frame animation requests are done before any updates
					this._requestRendering(function () {
						//display the integer value
						this.msgNode.textContent = Math.floor(this.value);
						//minimum amount of opacity.
						var minOpacity = 0.2;
						//update lines opacity
						for (var i = 0, opacity; i < 12; i++) {
							opacity = Math.min(Math.max((this.value * 0.12 - i), 0), 1) * (1 - minOpacity);
							this.lineNodeList[i].style.opacity = minOpacity + opacity;
						}
					}.bind(this));
				}

			}
			//refresh speed
			if (props.speed) {
				//if animation is ongoing, restart the animation to take the new speed into account
				if (this._requestId) {
					this._stopAnimation();
					this._startAnimation();
				}
			}
			//refresh active
			if (props.active) {
				if (this.active) {
					if (isNaN(this.value)) {
						//NaN: start the animation
						this._startAnimation();
					}
				} else {
					this._stopAnimation();
				}
				//set visibility in frame to be in sync with opacity/text changes.
				//Avoids mis-display when setting visibility=visible just after value=0.
				this._requestRendering(function () {
					this.style.visibility = this.active ? "visible" : "hidden";
				}.bind(this));
			}
		},

		destroy: function () {
			this._stopAnimation();
		}
	});
});