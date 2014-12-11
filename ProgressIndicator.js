/** @module deliteful/ProgressIndicator */
define([
	"dcl/dcl",
	"delite/register",
	"delite/Widget",
	"delite/handlebars!./ProgressIndicator/ProgressIndicator.html",
	"delite/theme!./ProgressIndicator/themes/{{theme}}/ProgressIndicator.css"
], function (dcl, register, Widget, template) {
	/**
	 * A widget that displays a round spinning graphical representation that indicates that a task is ongoing.
	 *
	 * This widget starts hidden and the spinning animation starts when the widget becomes visible. Default widget
	 * size is 40x40px.
	 *
	 * @example <caption>Set the "active" property to true to make the widget visible when it starts.</caption>
	 * <d-progress-indicator active="true"></d-progress-indicator>
	 *
	 * @example <caption>Use style properties "width" and "height" to customize the widget size</caption>
	 * <d-progress-indicator active="true" style="width: 100%; height: 100%"></d-progress-indicator>
	 *
	 * @class module:deliteful/ProgressIndicator
	 * @augments module:delite/Widget
	 */
	return register("d-progress-indicator", [HTMLElement, Widget],
		/** @lends module:deliteful/ProgressIndicator# */ {

		/**
		 * Set to false to hide the widget and stop any ongoing animation.
		 * Set to true to show the widget: animation automatically starts unless you set a number to the "value"
		 * property.
		 * @member {boolean}
		 * @default false
		 */
		active: false,

		/**
		 * A value from 0 to 100 that indicates a percentage of progression of an ongoing task.
		 * Set the value to NaN to hide the number and start the spinning animation. Negative values are converted to 0
		 * and values over 100 are converted to 100.
		 * @member {number}
		 * @default NaN
		 */
		value: NaN,

		/**
		 * The relative speed of the spinning animation.
		 * Accepted values are "slow", "normal" and "fast". Other values are converted to "normal". Note that the
		 * actual/real speed of the animation depends of the device/os/browser capabilities.
		 * @member {string}
		 * @default "normal"
		 */
		speed: "normal",

		/**
		 * The name of the CSS class of this widget.
		 * @member {string}
		 * @default "d-progress-indicator"
		 */
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

		template: template,

		render: dcl.after(function () {
			this.lineNodeList = this.linesNode.querySelectorAll("line");
		}),

		attachedCallback: function () {
			//set unique SVG symbol id
			var symbolId = this.baseClass + "-" + this.widgetId + "-symbol";
			this.querySelector("symbol").id = symbolId;
			this.querySelector("use")
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
		},

		computeProperties: function (props) {
			var correctedValue = null;
			if ("speed" in props) {
				//fast: 500ms
				//slow: 2000ms
				//normal: 1000ms (also default and fallback value)
				correctedValue = (this.speed === "fast") ? 500:(this.speed === "slow") ? 2000:1000;
				if (this._lapsTime !== correctedValue) {
					this._lapsTime = correctedValue;
				}
			}
			if ("value" in props && !isNaN(this.value)) {
				correctedValue = Math.max(Math.min(this.value, 100), 0);
				if (this.value !== correctedValue) {
					this.value = correctedValue;
				}
			}
		},

		refreshRendering: function (props) {
			//refresh value
			if ("value" in props) {
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
			if ("speed" in props) {
				//if animation is ongoing, restart the animation to take the new speed into account
				if (this._requestId) {
					this._stopAnimation();
					this._startAnimation();
				}
			}
			//refresh active
			if ("active" in props) {
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
