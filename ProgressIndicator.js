define([
	"dcl/dcl",
	"delite/register",
	"delite/Widget",
	"delite/Invalidating",
	"delite/handlebars!./ProgressIndicator/ProgressIndicator.html",
	"delite/themes/load!delite/themes/{{theme}}/common_css,./ProgressIndicator/themes/{{theme}}/ProgressIndicator_css"
], function (dcl, register, Widget, Invalidating, renderer) {

	return register("d-progress-indicator", [HTMLElement, Widget, Invalidating], {
		// summary:
		//		d-progress-indicator widget displays a round spinning graphical representation that indicates
		//		that a task is ongoing. This widget starts hidden. Call the start() method to show the widget and start
		// 		the spinning animation. Use  autoStart to automatically show and start the animation  when the widget
		// 		starts. A value can be set to indicate a percentage of progression.

		// autoStart: boolean
		//		Set to true enabled the automatic startup of the spinning animation when the widget startup()
		// 		method executes.
		//		Default: true
		autoStart: false,

		// value: Number
		//		Set a value from 0 to 100 to indicate a percentage of progression of an ongoing task.
		//		Negative value is defaulted to 0. Values up to 100 are defaulted to 100. NaN is ignored.
		//		Explicit declaration of this attribute cancels the autStart animation. Setting a value makes this
		//		widget visible.
		//		Default: NaN
		value: NaN,

		// lapsTime: Number
		//		Duration of an animation revolution in milliseconds.
		//		Minimum value is 500ms: lower values are defaulted to the minimum value.
		//		Default: 1000
		lapsTime: 1000,

		// baseClass: String
		// 		Name prefix for CSS classes used by this widget.
		//		Default: "d-progress-indicator"
		baseClass: "d-progress-indicator",

		/* internal properties */
		_requestId: 0, //request animation id or clearTimeout param
		_minLapsTime: 500, // lower limit threshold for lapsTime property
		_requestAnimationFunction: (
			(window.requestAnimationFrame && window.requestAnimationFrame.bind(window)) || // standard
			(window.webkitRequestAnimationFrame && window.webkitRequestAnimationFrame.bind(window)) || // webkit
			function (callBack) {// others (ie9)
				return this.defer(callBack, 1000 / 60);
			}),
		_cancelRequestAnimationFunction: (
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
			return this._cancelRequestAnimationFunction(requestId);
		},

		_reset: function () {
			//ensure that any pending frame animation request is done before doing the actual reset
			this._requestRendering(
				function () {
					//remove any displayed value
					this.msgNode.textContent = "";
					//reset the opacity
					for (var i = 0; i < 12; i++) {
						this.lineNodeList[i].setAttribute("opacity", (i + 1) * (1 / 12));
					}
				}.bind(this));
		},

		_stopAnimation: function () {
			if (this._requestId) {
				this._cancelRequestRendering(this._requestId);
				this._requestId = 0;
			}
		},

		/* public methods */
		start: function () {
			// summary:
			//		Starts the animation.
			if (this._requestId) {
				//animation is already ongoing
				return;
			}
			//restore initial opacity and remove text
			this._reset();
			//compute the amount of opacity to subtract at each frame, on each line.
			//note: 16.7 is the average animation frame refresh interval in ms (~60FPS)
			var delta = (16.7 / Math.max(this._minLapsTime, this.lapsTime));
			//round spinning animation routine
			var frameAnimation = function () {
				//set lines opacity
				for (var i = 0, opacity; i < 12; i++) {
					opacity = (parseFloat(this.lineNodeList[i].getAttribute("opacity")) - delta) % 1;
					this.lineNodeList[i].setAttribute("opacity", (opacity < 0) ? 1 : opacity);
				}
				//render the next frame
				this._requestId = this._requestRendering(frameAnimation);
			}.bind(this);
			//start the animation
			this._requestId = this._requestRendering(frameAnimation);
			//ensure the widget is visible
			this.style.visibility = "visible";
		},

		stop: function (/*boolean*/destroy) {
			// summary:
			//		Stops the animation if it is running and hide the widget.
			//		destroy: set to true to destroy the widget after it stopped.
			if (destroy) {
				this.destroy();
			} else {
				this._stopAnimation();
				this.style.visibility = "hidden";
			}
		},

		/* widget lifecycle methods */
		preCreate: function () {
			//watched properties to trigger invalidation
			this.addInvalidatingProperties("value", "lapsTime");
		},

		buildRendering: renderer,

		enteredViewCallback: dcl.after(function () {
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
			//set color from CSS color property (either from theme or overridden by the user)
			//also allow to get the proper color value on Windows IE/FF when high contrast mode is enforced

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
			//auto start animation
			if (this.autoStart) {
				this.start();
			}
		}),

		refreshRendering: function (props) {
			//refresh value
			if (props.value && !isNaN(this.value)) {
				//ensure any ongoing animation stops
				this._stopAnimation();
				//ensure the widget is visible
				this.style.visibility = "visible";
				//ensure pending frame animation requests are done before any updates
				this._requestRendering(function () {
					//normalize the value
					var percent = Math.max(Math.min(this.value, 100), 0);
					//display the integer value
					this.msgNode.textContent = Math.floor(percent);
					//minimum amount of opacity.
					var minOpacity = 0.2;
					//update lines opacity
					for (var i = 0, opacity; i < 12; i++) {
						opacity = Math.min(Math.max((percent * 0.12 - i), 0), 1) * (1 - minOpacity);
						this.lineNodeList[i].setAttribute("opacity", minOpacity + opacity);
					}
				}.bind(this));
			}
			//refresh lapsTime
			if (props.lapsTime) {
				if (this._requestId) {
					//restart the animation to take the new lapsTime into account
					this.stop();
					this.start();
				}
			}
		},

		destroy: function () {
			this._stopAnimation();
		}
	});
});