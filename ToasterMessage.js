/** @module deliteful/ToasterMessage */
define([
	"dcl/dcl",
	"delite/Widget",
	"delite/register",
	"requirejs-dplugins/Promise!",
	"requirejs-dplugins/jquery!attributes/classes",
	"dpointer/events",
	"./features",
	"delite/handlebars!./Toaster/ToasterMessage.html"
], function (dcl, Widget, register, Promise, $, pointer, has, template) {

	// TODO: this could be abstracted in a separate class, so that it can be used by other widgets
	// such as the toggle/switch.
	// TODO: this part might need some more refactoring, the updateElement/resetElement methods do not belong in
	// the SwipeStateMachine constructor.
	var SwipeToDismiss = function (element, callback) {
		var SwipeStateMachine = function (element) {

			var MIN_HORIZONTAL = 100,       // unit = px
				MIN_SPEED = 0.85;           // unit = px/ms

			function getEventLocation(event) {
				return { x: event.clientX, y: event.clientY };
			}

			function opacity(distance, elementWidth) {
				return distance < elementWidth ?
					1 - distance * 1.0 / elementWidth : 0;
			}

			function updateElement(element, gesture) {
				var d = gesture.distance();
				if (d >= 0) {
					element.style.left = d + "px";                           // translate element
					element.style.opacity = opacity(d, element.clientWidth); // change opacity
				}
			}

			function resetElement(element) {
				element.style.left = "";
				element.style.opacity = ""; // TODO we should make sure this doesn't interfere with user css
			}

			function setUnderGestureCtrl(element) {
				if (element.isExpirable()) {
					element._timer.pause();
				}
			}

			function releaseFromGestureCtrl(element) {
				if (element.isExpirable()) {
					element._timer.resume();
				}
			}

			this.gesture = {
				trajectory: null,
				startTime: null,
				endTime: null,

				first: function () {
					return this.trajectory[0];
				},
				last: function () {
					var last = this.trajectory.length - 1;
					return this.trajectory[last];
				},
				secondLast: function () {
					var last = this.trajectory.length - 2;
					return this.trajectory[last];
				},

				// gesture parameters
				distance: function () {
					return this.last().x - this.first().x;
				},
				direction: function () {
					return this.last().x - this.secondLast().x > 0 ?
						"right" : "left";
				},
				duration: function () {
					if (this.startTime && this.endTime) {
						return this.endTime - this.startTime;
					}
				},
				speed: function () {
					return this.distance() / this.duration();
				},

				// gesture validators
				isLongEnough: function () {
					return this.distance() > MIN_HORIZONTAL;
				},
				isFastEnough: function () {
					return this.speed() > MIN_SPEED;
				},
				isDirectedToRight: function () {
					return this.direction() === "right";
				}
			};

			this.hasStarted = false;
			this.hasEnded = false;

			this.startCapture = function (event) {
				this.hasStarted = true;
				this.hasEnded = false;

				var loc = getEventLocation(event);
				this.gesture.trajectory = [loc];
				this.gesture.startTime = new Date().getTime();
				this.gesture.endTime = null;

				setUnderGestureCtrl(element);
			};

			this.keepCapturing = function (event) {
				var loc = getEventLocation(event);
				this.gesture.trajectory.push(loc);
				updateElement(element, this.gesture);
			};

			this.endCapture = function () {
				this.hasStarted = false;
				this.hasEnded = true;

				this.gesture.endTime = new Date().getTime();
				if (this.gesture.isFastEnough() ||
					this.gesture.isLongEnough() && this.gesture.isDirectedToRight()) {
					callback();
				} else {
					resetElement(element);
					releaseFromGestureCtrl(element);
				}

			};
		};

		var state = new SwipeStateMachine(element);

		function _pointerDownHandler(event) {
			state.startCapture(event);
			pointer.setPointerCapture(element, event.pointerId);
		}

		function _pointerMoveHandler(event) {
			if (state.hasStarted && !state.hasEnded) {
				state.keepCapturing(event);
			}
		}

		function _pointerUpHandler(event) {
			if (state.hasStarted) {
				state.endCapture(event);
			}
		}

		this.isEnabled = false;
		var signalDown, signalMove, signalUp;
		this.enable = function () {
			this.isEnabled = true;
			signalDown = element.on("pointerdown", _pointerDownHandler);
			signalMove = element.on("pointermove", _pointerMoveHandler);
			signalUp = element.on("pointerup", _pointerUpHandler);
		};
		this.disable = function () {
			if (this.isEnabled) {
				this.isEnabled = false;
				signalDown.remove();
				signalMove.remove();
				signalUp.remove();
			}
		};

	};

	// TODO: this could be abstracted in a separate class, so that it can be used by other widgets
	var Timer = function (duration) {
		var promise = new Promise(function (resolve, reject) {
			var timer = null, _startDate = null, _remaining = null,
			_fulfilled = false;		// NOTE: necessary because _remaining == 0 doesn't 
									// necessarily mean the timeout callback was fired immediately

			function _start(duration) {
				_startDate = Date.now();
				timer = setTimeout(function () {
					_fulfilled = true;
					resolve();
				}, duration);
			}

			function computeRemaining() {
				var rt = duration - Date.now() + _startDate;
				return rt >= 0 ? rt : 0;
			}

			this.start = function () {
				_start(duration);
				return promise;
			};

			this.pause = function () {
				if (timer !== null) {
					clearTimeout(timer);
					timer = null;
					_remaining = computeRemaining();
				} else {
					_remaining = 0;
				}
			};

			this.resume = function () {
				_start(_remaining);
				return promise;
			};

			this.destroy = function () {
				if (! _fulfilled) {
					reject();
				}
			};
		}.bind(this));
	};

	var PauseTimerOnHover = function (element) {

		var hovering = false;
		function _pauseTimer() {
			if (!hovering) {
				hovering = true;
				element._timer.pause();
			}
		}

		function _resumeTimer() {
			if (hovering) {
				hovering = false;
				element._timer.resume();
			}
		}

		function _pointerUpHandler(e) {
			if (e.pointerType === "touch") {
				_resumeTimer();
			}
		}

		this.isEnabled = false;
		var eventHandlers;
		this.enable = function () {
			this.isEnabled = true;
			eventHandlers = [element.on("pointerover", _pauseTimer),
				element.on("pointerleave", _resumeTimer),
				element.on("pointercancel", _resumeTimer),
				element.on("pointerup", _pointerUpHandler)];
		};

		this.disable = function () {
			if (this.isEnabled) {
				this.isEnabled = false;
				eventHandlers.forEach(function (eventHandler) {
					eventHandler.remove();
				});
				eventHandlers = null;
			}
		};
	};

	var D_INVISIBLE = "d-invisible",
		D_HIDDEN = "d-hidden",
		D_SWIPEOUT = "d-toaster-swipeout";

	/* message types */
	var messageTypes = {
		info: "info", // default
		success: "success",
		warning: "warning",
		error: "error"
	};
	var defaultType = messageTypes.info;

	function normalizeType(type) {
		return messageTypes[type] || defaultType;
	}

	function messageTypeClass(type) {
		return "d-toaster-type-" + type;
	}

	/* message duration */
	var defaultDuration = 2000;

	function normalizeDuration(duration) {
		return typeof duration === "number" && !isNaN(duration) ? duration : defaultDuration;
	}

	var transitionendEvents = {
		"transition": "transitionend", // >= IE10, FF
		"-webkit-transition": "webkitTransitionEnd"  // > chrome 1.0 , > Android 2.1 , > Safari 3.2
	};

	function whichEvent(events) {
		// NOTE: returns null if event is not supported
		var fakeElement = document.createElement("fakeelement");
		for (var event in events) {
			if (fakeElement.style[event] !== undefined) {
				return events[event];
			}
		}
		return null;
	}

	var animationendEvent = has("animationEndEvent"),
		transitionendEvent = whichEvent(transitionendEvents);

	function listenAnimationEvents(element, callback) {
		var events = [animationendEvent, transitionendEvent];
		events.forEach(function (event) {
			if (event) { // if event is supported
				var tmp = {};
				var listener = (function (el, ev, d) {
					return function () {
						callback(el, ev);
						d.handler.remove();
					};
				})(element, event, tmp);
				tmp.handler = element.on(event, listener);
			} else {
				callback(element, event);
			}
		});
	}

	/**
	 * ToasterMessage widget.
	 *
	 * This class is not meant to be used alone. It needs to be combined
	 * with deliteful/Toaster.
	 *
	 * @class module:deliteful/ToasterMessage
	 * @augments module:delite/Widget
	 * @example
	 *   var toaster = new Toaster();
	 *   var message = new ToasterMessage({message: "hello, world!"});
	 *   toaster.postMessage(message);
	 */
	return register("d-toaster-message", [HTMLElement, Widget], /** @lends module:deliteful/ToasterMessage */ {
		baseClass: "d-toaster-message",

		/**
		 * Content of the message.
		 *
		 * @member {string}
		 * @default null
		 */
		message: null,

		/**
		 * Type of the message.
		 * `type` is one of `["info", "success", "warning", "error"]`.
		 *
		 * @member {string}
		 * @default "info"
		 */
		type: dcl.prop({
			set: function (value) {
				var type = normalizeType(value);
				this.messageTypeClass = messageTypeClass(type);
				this._set("type", type);
			},
			get: function () {
				return this._get("type") || defaultType;
			},
			enumerable: true,
			configurable: true
		}),

		/**
		 * Duration which specifies how long the message is shown.
		 * If set to a strictly negative value, the message is shown persistently until it is
		 * dismissed.
		 *
		 * @member {number}
		 * @default 2000
		 */
		duration: dcl.prop({
			set: function (value) {
				var duration = normalizeDuration(value);
				this._set("duration", duration);
			},
			get: function () {
				return this._get("duration") || defaultDuration;
			},
			enumerable: true,
			configurable: true
		}),

		_dismissButton: null,
		/**
		 * Indicates whether the message can be dismissed. Is one of ["on", "off", "auto"].
		 * If "auto", `isDismissible` adopts a default behaviour that depends
		 * on `duration`.
		 *
		 * @member {string}
		 * @default null
		 */
		dismissible: "auto",

		/**
		 * A string containing the class that matches the type of the message.
		 * @member {string}
		 * @default null
		 */
		messageTypeClass: messageTypeClass(defaultType),

		/**
		 * Dismisses the message, optionally with an animation.
		 *
		 * @param {string} [animation] an animation class that will be added to dismiss the message
		 */
		dismiss: function (animation) { // called when dismiss button is clicked or swipe detected
			var parent = this.getParent();
			this._hideInDom(parent, !!animation, animation);
		},

		// states
		_isInserted: false,
		_hasExpired: false,
		_toBeRemoved: false,
		_isRemoved: false,

		/**
		 * Returns whether the message can expire. The default implementation
		 * returns `true` if `duration` is larger or equal than `0`.
		 * @returns {boolean}
		 */
		isExpirable: function () {
			return this.duration >= 0;
		},

		/**
		 * Returns whether the message can be dismissed.
		 *
		 * If the `dismissible` property was set to `"on"` (respectively `"off"`),
		 * this method returns `true` (respectively `false`).
		 * If `dismissible` was set to `"auto"`, this method returns `false` if
		 * the message is expirable, `true` otherwise.
		 *
		 * @returns {boolean}
		 */
		isDismissible: function () {
			return this.dismissible === "auto" ?
				!this.isExpirable() : this.dismissible === "on";
		},

		_timer: null,

		_insertInDom: function (toaster, animated) {
			var wrapper = toaster._wrapper;
			this._isInserted = true;
			if (animated) {
				$(this).addClass(toaster.animationInitialClass);
			}
			if (toaster.invertOrder && wrapper.hasChildNodes()) {
				// NOTE: invertOrder has an effect only when wrapper has children
				var first = wrapper.childNodes[0];
				wrapper.insertBefore(this, first);
			} else {
				wrapper.appendChild(this);
			}
			this.connectedCallback();

			// starting timer
			if (this.isExpirable()) {
				this._timer = new Timer(this.duration);
				this.own(this._timer);
				this._timer.start().then(function () {
					this._hasExpired = true;
					toaster.notifyCurrentValue("messages");
				}.bind(this));
			}

			// toggling dismiss button visibility
			$(this._dismissButton).toggleClass(D_HIDDEN, !this.isDismissible());
		},
		_showInDom: function (toaster, animated) {
			if (animated) {
				this.defer(function () {
					// NOTE: this timeout is here only to prevent the browser from optimizing
					// (which makes the animation invisible)
					$(this).removeClass(toaster.animationInitialClass);
					$(this).addClass(toaster.animationEnterClass);
					listenAnimationEvents(this, function (element) {
						$(element).removeClass(toaster.animationEnterClass);

						// NOTE: the swipe dismissing is made possible only once the entering animation is done
						// this is done to avoid the CSS of the animation to interfere with the swipe

						// setting up the swipe-to-dismiss
						if (element.isDismissible()) {
							element.swipeToDismiss.enable();
						}
					});
				}, 1);
			} else {
				// setting up the swipe-to-dismiss
				if (this.isDismissible()) {
					this.swipeToDismiss.enable();
				}
			}
			// setting up pause-timer-on-hover
			if (this.isExpirable()) {
				this.pauseTimerOnHover.enable();
			}
		},
		_hideInDom: function (toaster, animated, customAnimation) {
			var animation = customAnimation || toaster.animationQuitClass;
			if (toaster !== null) {
				// NOTE: the swipe dismissing is made possible only till the leaving animation starts
				// this is done to avoid the CSS of the animation to interfere with the swipe
				this.swipeToDismiss.disable();

				if (animated) {
					$(this).addClass(animation);
					listenAnimationEvents(this, function (element) {
						element._toBeRemoved = true;
						toaster.notifyCurrentValue("messages");
					});
				} else {
					$(this).addClass(D_INVISIBLE);
					this._toBeRemoved = true;
					toaster.notifyCurrentValue("messages"); // TODO: could be better handled with an event
				}
			}
			if (this.isExpirable()) {
				this.pauseTimerOnHover.disable();
			}
		},
		_removeFromDom: function (toaster, animated) {
			$(this).removeClass(toaster.animationQuitClass);
			$(this).addClass(animated ? toaster.animationEndClass : D_HIDDEN);
			toaster._wrapper.removeChild(this);
			this._isRemoved = true;
		},
		template: template,
		postRender: function () {
			// TODO this should be done only if this.isDismissible()
			// but at this stage this.isDismissible() ouput is wrong because members have not been initialized yet

			// setting up the swipe to dismiss listener
			this.swipeToDismiss = new SwipeToDismiss(this, function () {
				this.dismiss(D_SWIPEOUT);
			}.bind(this));

			// setting up click listener for dismiss button
			if (this._dismissButton !== null) {
				this.on("pointerdown", function () {
					this.dismiss();
				}.bind(this), this._dismissButton);
			}
			// setting up pause timer on hover listener
			this.pauseTimerOnHover = new PauseTimerOnHover(this);
		}
	});
});
