define([
	"dojo/_base/window",
	"dojo/sniff",
	"dojo/query",
	"dojo/dom-class",
	"dojo/dom-construct",
	"dojo/dom-geometry",
	"dojo/dom-style",
	"dojo/keys",
	"dpointer/events",
	"dojo/on",
	"delite/register",
	"delite/FormValueWidget",
	"delite/theme!./Slider/themes/{{theme}}/Slider_css"
], function (win, has, query, domClass, domConstruct, domGeometry, domStyle,
		keys, dpointer, on, register, FormValueWidget) {

	// boolean feature test variable to decide if position() return attributes
	// need to be adjusted by the body and node current zoom levels
	// null = unknown
	var useZoom = null;

	return register("d-slider", [HTMLElement, FormValueWidget], {
		// summary:
		//		A non-templated Slider widget similar to the HTML5 INPUT type=range.

		// min: [const] Number
		//		The first value the slider can be set to.
		min: NaN,

		// max: [const] Number
		//		The last value the slider can be set to.
		max: NaN,

		// step: [const] Number
		//		The delta from 1 value to another.
		//		This causes the slider handle to snap/jump to the closest possible value.
		//		A value of 0 means continuous (as much as allowed by pixel resolution).
		step: 1,

		// baseClass: [const] String
		//		The name of the CSS class of this widget.
		baseClass: "d-slider",

		// flip: [const] Boolean
		//		Specifies if the slider should change its default: ascending <--> descending.
		flip: false,

		// vertical: [const] Boolean
		//		The slider direction for ascending values.
		//		- false: horizontal (dependent on default left-to-right or right-to-left direction)
		//		- true: vertical
		vertical: false,

		preCreate: function () {
			this._orientationAttrs = {
				false: { start: "x", size: "w", pageStart: "pageX", clientStart: "clientX",
						progressBarStart: "left", progressBarSize: "width" },
				true: { start: "y", size: "h", pageStart: "pageY", clientStart: "clientY", progressBarStart: "top",
						progressBarSize: "height" }
			};

			this.addInvalidatingProperties(
				{ value: "invalidateProperty" },
				{ min: "invalidateProperty" },
				{ max: "invalidateProperty" },
				"name",
				"flip",
				"step",
				"vertical"
			);
		},

		refreshProperties: function (props) {
			if (props.value && !this.handleMin && String(this.value).indexOf(",") > 0) {
				this.handleMin = domConstruct.create("div", { role: "slider" }, this.progressBar, "first");
				this.tabStops = "handleMin,focusNode";
			}
			if (props.value || props.min || props.max) {
				// force the value in bounds
				var values = String(this.value).split(/,/g);
				var	minValue = Math.max(Math.min(values[0], values[values.length - 1], this.max), this.min),
					maxValue = Math.min(Math.max(values[0], values[values.length - 1], this.min), this.max);
				// correct value in case the values were outside min/max
				var correctedValue = values.length === 1 ? String(maxValue) : (minValue + "," + maxValue);
				if (correctedValue !== this.value) {
					this.value = correctedValue;
					this.validateProperties();
				}
			}
			if (props.value) {
				this.valueNode.value = String(this.value);
			}
		},

		/*jshint maxcomplexity: 14*/
		refreshRendering: function (props) {
			var toCSS = function (baseClass, modifier) {
				return baseClass.split(/ /g).map(function (c) {
					return c + modifier;
				}).join(" ");
			};

			if (props.vertical || props.flip) {
				// add V or H suffix to baseClass for styling purposes
				// _reversed is complicated since you can have flipped right-to-left and vertical
				// is upside down by default
				this._reversed = !((!this.vertical && (this.isLeftToRight() !== this.flip)) ||
					(this.vertical && this.flip));
				this._attrs = this._orientationAttrs[this.vertical];
				var baseClass = toCSS(this.className, this.vertical ? "-v" : "-h");
				domClass.add(this, baseClass);
				baseClass = this.baseClass + " " + baseClass;
				domClass.add(this, toCSS(baseClass, this._reversed ? "-htl" : "-lth"));
				domClass.add(this.containerNode, toCSS(baseClass, "-bar") + " " + toCSS(baseClass, "-remaining-bar"));
				domClass.add(this.progressBar, toCSS(baseClass, "-bar") + " " + toCSS(baseClass, "-progress-bar"));
				domClass.add(this.focusNode, toCSS(baseClass, "-handle") + " " + toCSS(baseClass, "-handle-max"));
				if (this.handleMin) {
					domClass.add(this.handleMin, toCSS(baseClass, "-handle") + " " + toCSS(baseClass, "-handle-min"));
				}
				// pass widget attributes to children
				var self = this;
				this.getChildren().forEach(function (obj) {
					obj.vertical = self.vertical;
					obj.reverse = self._reversed;
				});
			}
			if (props.name) {
				var name = this.name;
				this.removeAttribute("name");
				// won't restore after a browser back operation since name changed nodes
				this.valueNode.setAttribute("name", name);
			}
			if (props.max) {
				this.focusNode.setAttribute("aria-valuemax", this.max);
			}
			if (props.min) {
				(this.handleMin || this.focusNode).setAttribute("aria-valuemin", this.min);
			}
			if (props.value || props.min || props.max) {
				this._positionHandles();
			}
		},

		buildRendering: function () {

			// look for child INPUT node under root node
			this.valueNode = query("> INPUT", this)[0];
			if (!this.valueNode) {
				this.valueNode = domConstruct.create("input", { "type": "text", readOnly: true, value: this.value },
					this, "last");
			}

			this.containerNode = domConstruct.create("div", {}, this, "last");
			var n = this.firstChild;
			while (n) {
				var next = n.nextSibling;
				if (n !== this.valueNode && n !== this.containerNode) {
					// move all extra markup nodes to the containerNode for relative sizing and placement
					this.containerNode.appendChild(n);
				}
				n = next;
			}
			this.progressBar = domConstruct.create("div", {}, this.containerNode, "last");
			this.focusNode = domConstruct.create("div", { role: "slider" }, this.progressBar, "last");

			// prevent default browser behavior (like scrolling) on touchstart
			dpointer.setTouchAction(this, "none");
		},

		_positionHandles: function () {
			var values = String(this.value).split(/,/g);
			if (values.length === 1) {
				values = [this.min, values[0]];
			} else {
				this.handleMin.setAttribute("aria-valuenow", values[0]);
				this.handleMin.setAttribute("aria-valuemax", values[1]);
			}
			this.focusNode.setAttribute("aria-valuenow", values[1]);
			this.focusNode.setAttribute("aria-valuemin", values[0]);
			var	toPercent = (values[1] - this.min) * 100 / (this.max - this.min),
				toPercentMin = (values[0] - this.min) * 100 / (this.max - this.min),
				s = {};
			s[this._attrs.progressBarSize] = (toPercent - toPercentMin) + "%";
			s[this._attrs.progressBarStart] = (this._reversed ? (100 - toPercent) : toPercentMin) + "%";
			domStyle.set(this.progressBar, s);
		},

		postCreate: function () {
			//TODO fix complexity
			/*jshint maxcomplexity:16*/
			var	beginDrag = function (e) {
					var	setValue = function (priorityChange) {
							var values = String(this.value).split(/,/g);
							value -= offsetValue;
							// now perform visual slide
							domClass.toggle(this.progressBar, "d-slider-transition", !!priorityChange);
							this.value = values.length === 1
									? String(value)
									: (isMax
										? (values[0] + "," + value)
										: (value + "," + values[1]));
							this.validateProperties();
							this._handleOnChange(this.value, priorityChange);
						}.bind(this),
						getEventData = function (e) {
							var pixelValue = e[this._attrs.clientStart] - box[this._attrs.start];
							pixelValue = Math.min(Math.max(pixelValue, 0), box[this._attrs.size]);
							var discreteValues = this.step ? ((this.max - this.min) / this.step) :
								box[this._attrs.size];
							if (discreteValues <= 1 || discreteValues === Infinity) {
								discreteValues = box[this._attrs.size];
							}
							var wholeIncrements = Math.round(pixelValue * discreteValues / box[this._attrs.size]);
							value = (this.max - this.min) * wholeIncrements / discreteValues;
							value = this._reversed ? (this.max - value) : (this.min + value);
						}.bind(this),
						continueDrag = function (e) {
							getEventData(e);
							setValue(false);
						}.bind(this),
						endDrag = function (e) {
							if (actionHandles) {
								actionHandles.forEach(function (h) { h.remove(); });
							}
							actionHandles = [];
							getEventData(e);
							setValue(true);
							// fire onChange
						}.bind(this),
						// get the starting position of the content area (dragging region)
						// can't use true since the added docScroll and the returned x are body-zoom incompatible
						box = domGeometry.position(this.containerNode, false),
						bodyZoom = /*has("ie") ? 1 : */(parseFloat(domStyle.get(win.body(), "zoom")) || 1),
						nodeZoom = /*has("ie") ? 1 : */(parseFloat(domStyle.get(node, "zoom")) || 1),
						root = win.doc.documentElement,
						actionHandles;
					if (this.disabled || this.readOnly) { return; }
					// begin feature test to see if position() values need zoom
					// seems to result in "if any version of IE, then don't use zoom"
					// check if pointer down event is inside the box
					var zoom = bodyZoom * nodeZoom;
					if (zoom !== 1 || useZoom === false) {
						if (useZoom === null) {
							var outerBox = this.getBoundingClientRect();
							var errorWithoutZoom = Math.max(0, outerBox.left - e.clientX, e.clientX - outerBox.right,
								outerBox.top - e.clientY, e.clientY - outerBox.bottom
							);
							var errorWithZoom = Math.max(0, outerBox.left * zoom - e.clientX,
								e.clientX - outerBox.right * zoom,
								outerBox.top * zoom - e.clientY, e.clientY - outerBox.bottom * zoom
							);
							if (errorWithZoom < errorWithoutZoom) {
								useZoom = true;
							} else if (errorWithZoom > errorWithoutZoom) {
								useZoom = false;
							}
						}
						if (useZoom === true) {
							box.x *= zoom;
							box.y *= zoom;
							box.w *= zoom;
							box.h *= zoom;
						}
					}
					var offsetValue = 0;
					getEventData(e);
					var values = String(this.value).split(/,/g);
					var isMax = (values.length === 1) || (Math.abs(value - values[0]) > Math.abs(value - values[1]));
					if (e.target !== this.focusNode && e.target !== this.handleMin) {
						setValue(true);
					} else {
						offsetValue = value - ((isMax && this.handleMin) ? values[1] : values[0]);
					}
					this[isMax ? "focusNode" : "handleMin"].focus();
					if (actionHandles) {
						actionHandles.forEach(function (h) { h.remove(); });
					}
					actionHandles = this.own(
						on(root, "pointermove", continueDrag),
						on(root, "pointerup", endDrag)
					);
				}.bind(this),

				keyDown = function (e) {
					function handleKeys() {
						var	step = this.step,
							multiplier = 1;
						switch (e.keyCode) {
						case keys.HOME:
							values[handleIdx] = [ this.min, values[0] ][handleIdx];
							break;
						case keys.END:
							values[handleIdx] = maxValue;
							break;
						case keys.RIGHT_ARROW:
							multiplier = -1;
							/* falls through */
						case keys.LEFT_ARROW:
							values[handleIdx] = parseFloat(values[handleIdx]) +
								multiplier * ((this.flip && !this.vertical) ? step : -step);
							break;
						case keys.DOWN_ARROW:
							multiplier = -1;
							/* falls through */
						case keys.UP_ARROW:
							values[handleIdx] = parseFloat(values[handleIdx]) +
								multiplier * ((!this.flip || !this.vertical) ? step : -step);
							break;
						default:
							return;
						}
						e.preventDefault();
						this.value = values.join(",");
						this.validateProperties();
						this._handleOnChange(this.value, false);
					}

					if (this.disabled || this.readOnly || e.altKey || e.ctrlKey || e.metaKey) { return; }
					var	handleIdx = 0,
						maxValue = this.max,
						values = String(this.value).split(/,/g);
					if (e.target === this.focusNode) {
						handleIdx = values.length - 1;
					} else if (e.target === this.handleMin) {
						maxValue = values[1];
					} else {
						return;
					}
					handleKeys.bind(this)();
				}.bind(this),

				keyUp = function (e) {
					if (this.disabled || this.readOnly || e.altKey || e.ctrlKey || e.metaKey) { return; }
					this._handleOnChange(this.value, true);
				}.bind(this),

				value,
				node = this;
			if (!isNaN(parseFloat(this.valueNode.value))) { // INPUT value
				// set this here in case refreshProperties runs before startup (Chrome)
				this.value = this.valueNode.value;
			}
			this.own(
				on(this, "pointerdown", beginDrag),
				on(this, "keydown", keyDown), // for desktop a11y
				on(this.focusNode, "keyup", keyUp) // fire onChange on desktop
			);
			this.invalidateProperty("vertical"); // apply appropriate CSS class names in case the default is used
			this.invalidateProperty("tabIndex"); // apply default tabIndex in case the default is used
		},

		startup: function () {
			var valueNodeValue = this.valueNode.value; // setting the DOM attribute can change the element value
			if (this.valueNode.getAttribute("value") === null) {
				this.valueNode.setAttribute("value", this.value); // set the reset value
			}
			if (!isNaN(parseFloat(valueNodeValue))) { // browser back button or value coded on INPUT
				this.value = valueNodeValue; // the valueNode value has precedence over the widget markup value
			}
			// if the form is reset, then notify the widget to reposition the handles
			if (this.valueNode.form) {
				var self = this;
				this.own(on(this.valueNode.form, "reset", function () {
					self.defer(function () {
						if (this.value !== this.valueNode.value) {
							this.value = this.valueNode.value;
						}
					});
				}));
			}
		}
	});
});
