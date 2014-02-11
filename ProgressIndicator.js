define([
	"dcl/dcl",
	"delite/register",
	"delite/Widget",
	"delite/Invalidating",
	"delite/themes/load!delite/themes/{{theme}}/common_css,./ProgressIndicator/themes/{{theme}}/ProgressIndicator_css"
], function (dcl, register, Widget, Invalidating) {

	return register("d-progress-indicator", [HTMLElement, Widget, Invalidating], {
		// summary:
		//		d-progress-indicator widget displays a round spinning graphical representation that indicates
		//		that a task is ongoing. A spinning animation automatically starts when the widget starts.
		// 		Automatic animation startup can be disabled by setting the autoStart
		// 		attribute to false. The animation can be stopped or started manually using start() and stop()
		// 		methods. A value can be set to indicate a percentage of progression.

		// autoStart: boolean
		//		Set to false disabled the automatic startup of the spinning animation when the widget startup()
		// 		method executes. Use start() method to manually start the animation.
		//		Note that explicit declaration of the value attribute has precedence over this attribute.
		//		Default: true
		autoStart: true,

		// value: Number
		//		Set a value from 0 to 100 to indicate a percentage of progression of an ongoing task.
		//		Negative value is defaulted to 0. Values up to 100 are defaulted to 100. NaN is ignored.
		//		Explicit declaration of this attribute cancels the autStart animation.
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
		_minLapsTime: 200, // lower limit threshold for lapsTime property

		/* internal methods */
		_requestRendering: function (animationFrame) {
			//browser agnostic animation frame renderer
			//return a request id
			return (window.requestAnimationFrame || // standard
				window.webkitRequestAnimationFrame || // webkit
				window.mozRequestAnimationFrame || // mozilla
				window.msRequestAnimationFrame || // ie10
				function (callBack) {// others (ie9)
					return this.defer(callBack, 1000 / 60);
				}.bind(this))(animationFrame);
		},

		_cancelRequestRendering: function (requestId) {
			//browser agnostic animation frame canceler
			return (window.cancelRequestAnimationFrame || //standard
				window.webkitCancelAnimationFrame || // webkit
				window.webkitCancelRequestAnimationFrame || // webkit deprecated
				window.mozCancelRequestAnimationFrame || // mozilla
				window.msCancelRequestAnimationFrame || // ie10
				function (handle) {// others (ie9)
					handle.remove();
				})(requestId);
		},

		_reset: function () {
			//ensure that any pending frame animation request is done before doing the actual reset
			this._requestRendering(
				function () {
					//remove any displayed value
					this.labelNode.textContent = "";
					//reset the opacity
					for (var i = 0; i < 12; i++) {
						this.lineNodeList[i].setAttribute("opacity", (i + 1) * (1 / 12));
					}
				}.bind(this));
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
		},

		stop: function () {
			// summary:
			//		Stops the animation.
			if (this._requestId) {
				this._cancelRequestRendering(this._requestId);
				this._requestId = 0;
			}
		},

		setColor: function (color) {
			// summary
			// 		Sets the widget color. Use this method if you wish to change the color after the widget is
			// 		created, otherwise you can change the color from the theme in CSS class .d-progress-indicator
			// 		You can also set inline color style color when you declare the widget:
			// 			<d-progress-indicator style="color:red;"></d-progress-indicator>
			//		or when you instantiates the widget:
			// 			new ProgressIndicator({style:"color:red;});
			//		Color parameter: Use same values as the color CSS property
			this.linesNode.style.stroke = color; // text value color
			this.labelNode.style.fill = color; // lines color
			//android chrome 31.0.1650.59 hack: force to refresh text color otherwise color doesn't change.
			this.labelNode.textContent = this.labelNode.textContent;
		},

		/* widget lifecycle methods */
		preCreate: function () {
			//watched properties to trigger invalidation
			this.addInvalidatingProperties("value", "lapsTime");
		},

		buildRendering: function () {
			//todo: should use template. see issue: https://github.com/ibm-js/delite/issues/90
			// <svg>
			//	 <defs>
			//		 <symbol id="symbolId" viewBox="0 0 30 30" preserveAspectRatio="none">
			//			 <text x="48%" y="67%"></text>
			//		 </symbol>
			//	 </defs>
			//	 <g class="d-progress-indicator-lines">
			//		 <line x1="50.0%" y1="24.0%" x2="50.0%" y2="07.0%"></line>
			//		 <line x1="63.0%" y1="28.0%" x2="72.0%" y2="13.0%"></line>
			//		 <line x1="73.0%" y1="37.0%" x2="88.0%" y2="28.0%"></line>
			//		 <line x1="93.0%" y1="50.0%" x2="76.0%" y2="50.0%"></line>
			//		 <line x1="73.0%" y1="63.0%" x2="88.0%" y2="71.0%"></line>
			//		 <line x1="63.0%" y1="72.0%" x2="71.0%" y2="87.0%"></line>
			//		 <line x1="50.0%" y1="76.0%" x2="50.0%" y2="93.0%"></line>
			//		 <line x1="37.0%" y1="72.0%" x2="28.0%" y2="87.0%"></line>
			//		 <line x1="27.0%" y1="63.0%" x2="13.0%" y2="71.0%"></line>
			//		 <line x1="24.0%" y1="50.0%" x2="07.0%" y2="50.0%"></line>
			//		 <line x1="27.0%" y1="37.0%" x2="13.0%" y2="29.0%"></line>
			//		 <line x1="37.0%" y1="27.0%" x2="29.0%" y2="13.0%"></line>
			//	 </g>
			//	 <use x="28.5%" y="28.5%" width="43%" height="43%" xlink:href="#symbolId"></use>
			// </svg>
			var svgNS = "http://www.w3.org/2000/svg";
			var svgNode = document.createElementNS(svgNS, "svg");
			var defsNode = document.createElementNS(svgNS, "defs");
			var symbolNode = document.createElementNS(svgNS, "symbol");
			symbolNode.setAttribute("viewBox", "0 0 30 30");
			symbolNode.setAttribute("preserveAspectRatio", "none");
			defsNode.appendChild(symbolNode);
			var textNode = document.createElementNS(svgNS, "text");
			textNode.setAttribute("x", "48%");
			textNode.setAttribute("y", "67%");
			textNode.textContent = "";
			symbolNode.appendChild(textNode);
			svgNode.appendChild(defsNode);
			var gNode = document.createElementNS(svgNS, "g");
			gNode.setAttribute("class", "d-progress-indicator-lines");
			var lineNode;
			lineNode = document.createElementNS(svgNS, "line");
			lineNode.setAttribute("x1", "50%");
			lineNode.setAttribute("y1", "24%");
			lineNode.setAttribute("x2", "50%");
			lineNode.setAttribute("y2", "07%");
			gNode.appendChild(lineNode);
			lineNode = document.createElementNS(svgNS, "line");
			lineNode.setAttribute("x1", "63%");
			lineNode.setAttribute("y1", "28%");
			lineNode.setAttribute("x2", "72%");
			lineNode.setAttribute("y2", "13%");
			gNode.appendChild(lineNode);
			lineNode = document.createElementNS(svgNS, "line");
			lineNode.setAttribute("x1", "73%");
			lineNode.setAttribute("y1", "37%");
			lineNode.setAttribute("x2", "88%");
			lineNode.setAttribute("y2", "28%");
			gNode.appendChild(lineNode);
			lineNode = document.createElementNS(svgNS, "line");
			lineNode.setAttribute("x1", "93%");
			lineNode.setAttribute("y1", "50%");
			lineNode.setAttribute("x2", "76%");
			lineNode.setAttribute("y2", "50%");
			gNode.appendChild(lineNode);
			lineNode = document.createElementNS(svgNS, "line");
			lineNode.setAttribute("x1", "73%");
			lineNode.setAttribute("y1", "63%");
			lineNode.setAttribute("x2", "88%");
			lineNode.setAttribute("y2", "71%");
			gNode.appendChild(lineNode);
			lineNode = document.createElementNS(svgNS, "line");
			lineNode.setAttribute("x1", "63%");
			lineNode.setAttribute("y1", "72%");
			lineNode.setAttribute("x2", "71%");
			lineNode.setAttribute("y2", "87%");
			gNode.appendChild(lineNode);
			lineNode = document.createElementNS(svgNS, "line");
			lineNode.setAttribute("x1", "50%");
			lineNode.setAttribute("y1", "76%");
			lineNode.setAttribute("x2", "50%");
			lineNode.setAttribute("y2", "93%");
			gNode.appendChild(lineNode);
			lineNode = document.createElementNS(svgNS, "line");
			lineNode.setAttribute("x1", "37%");
			lineNode.setAttribute("y1", "72%");
			lineNode.setAttribute("x2", "28%");
			lineNode.setAttribute("y2", "87%");
			gNode.appendChild(lineNode);
			lineNode = document.createElementNS(svgNS, "line");
			lineNode.setAttribute("x1", "27%");
			lineNode.setAttribute("y1", "63%");
			lineNode.setAttribute("x2", "13%");
			lineNode.setAttribute("y2", "71%");
			gNode.appendChild(lineNode);
			lineNode = document.createElementNS(svgNS, "line");
			lineNode.setAttribute("x1", "24%");
			lineNode.setAttribute("y1", "50%");
			lineNode.setAttribute("x2", "07%");
			lineNode.setAttribute("y2", "50%");
			gNode.appendChild(lineNode);
			lineNode = document.createElementNS(svgNS, "line");
			lineNode.setAttribute("x1", "27%");
			lineNode.setAttribute("y1", "37%");
			lineNode.setAttribute("x2", "13%");
			lineNode.setAttribute("y2", "29%");
			gNode.appendChild(lineNode);
			lineNode = document.createElementNS(svgNS, "line");
			lineNode.setAttribute("x1", "37%");
			lineNode.setAttribute("y1", "27%");
			lineNode.setAttribute("x2", "29%");
			lineNode.setAttribute("y2", "13%");
			gNode.appendChild(lineNode);
			svgNode.appendChild(gNode);
			var useNode = document.createElementNS(svgNS, "use");
			useNode.setAttribute("x", "28.5%");
			useNode.setAttribute("y", "28.5%");
			useNode.setAttribute("width", "43%");
			useNode.setAttribute("height", "43%");
			svgNode.appendChild(useNode);
			this.appendChild(svgNode);
		},

		enteredViewCallback: dcl.after(function () {
			//template: use query selector to get nodes reference that will not be available from buildRendering
			this.svgNode = this.querySelector(".d-progress-indicator svg");
			this.linesNode = this.querySelector(".d-progress-indicator-lines");
			this.lineNodeList = this.querySelectorAll(".d-progress-indicator-lines > line");
			this.labelNode = this.querySelector(".d-progress-indicator text");
			//set unique SVG symbol id
			this.querySelector(".d-progress-indicator symbol").id = this.id + "-symbol";
			this.querySelector(".d-progress-indicator use")
				.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#" + this.id + "-symbol");
			//set non-overridable styles
			this.svgNode.style.width = "100%";
			this.svgNode.style.height = "100%";
			this.svgNode.style.textAnchor = "middle";
			//set color from CSS color property (either from theme or overridden by the user)
			//also allow to get the proper color value on Windows IE/FF when high contrast mode is enforced
			this.setColor(window.getComputedStyle(this).getPropertyValue("color"));
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
				this.stop();
				//ensure pending frame animation requests are done before any updates
				this._requestRendering(function () {
					//normalize the value
					var percent = Math.max(Math.min(this.value, 100), 0);
					//display the integer value
					this.labelNode.textContent = Math.floor(percent);
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
		}
	});
});