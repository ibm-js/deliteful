/** @module deliteful/ToasterMessage */
define(["dcl/dcl",
	"delite/Widget",
	"delite/register",
	"dojo/Deferred",
	"dojo/dom-class",
	"dojo/on",
	"dpointer/events",
	"delite/handlebars!./Toaster/ToasterMessage.html",
	"delite/Invalidating"
], function (dcl, Widget, register, Deferred, domClass, on, pointer, renderer, Invalidating) {

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
		var _timer = null, _remaining = null,
			_startDate = null, _d = new Deferred();

		function _start(duration) {
			_startDate = Date.now();
			_timer = setTimeout(function () {
				_d.resolve();
			}, duration);
			return _d;
		}

		this.start = function () {
			return _start(duration);
		};

		this.pause = function () {
			if (_timer !== null) {
				clearTimeout(_timer);
				var rt = duration - Date.now() + _startDate;
				_remaining = rt > 0 ? rt : 0;
			} else {
				_remaining = 0;
			}
		};

		this.resume = function () {
			return _start(_remaining);
		};

		this.promise = function () {
			return _d;
		}
	}

	var D_TRANSPARENT = "d-transparent",
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

	var animationendEvent, transitionendEvent;

	var animationendEvents = {
		"animation": "animationend", // > IE10, FF
		"-webkit-animation": "webkitAnimationEnd",   // > chrome 1.0 , > Android 2.1 , > Safari 3.2
		"-ms-animation": "MSAnimationEnd" // IE 10
	};
	var transitionendEvents = {
		"transition": 'transitionend', // >= IE10, FF
		"-webkit-transition": "webkitTransitionEnd"  // > chrome 1.0 , > Android 2.1 , > Safari 3.2
	};

	function whichEvent(events) {
		var fakeElement = document.createElement("fakeelement");
		for (var event in events) {
			if (fakeElement.style[event] !== undefined) {
				return events[event];
			}
		}
		return null;
	}

	function listenAnimationEvents(element, callback) {

		if (!animationendEvent || !transitionendEvent) {
			animationendEvent = whichEvent(animationendEvents);
			transitionendEvent = whichEvent(transitionendEvents);
		}

		var events = [animationendEvent, transitionendEvent];
		events.forEach(function (event) {
			on.once(element, event, (function (el, ev) { // TODO: add a fallback under IE9
				return function () {
					callback(el, ev);
				};
			})(element, event), false);
		});
	}

	var ToasterMessage = dcl([Widget, Invalidating], /** @lends module:deliteful/ToasterMessage */ {

		/**
		 * ToasterMessage widget.
		 *
		 * This class is not meant to be used alone. It needs to be combined
		 * with deliteful/Toaster.
		 *
		 * @class module:deliteful/ToasterMessage
		 * @augments delite/Widget
		 * @augments delite/Invalidating
		 * @example
		 *   var toaster = new Toaster();
		 *   var message = new ToasterMessage({message: "hello, world!"});
		 *   toaster.postMessage(message);
		 */
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
		 * type is one of `["info", "success", "warning", "error"]`.
		 *
		 * @member {string}
		 * @default "info"
		 */
		type: defaultType,
		_setTypeAttr: function (value) {
			var type = normalizeType(value);
			this.messageTypeClass = messageTypeClass(type);
			this._set("type", type);
		},

		/**
		 * Duration for which the message will be shown.
		 * If set to < 0, the message will be shown persistently until it is
		 * dismissed.
		 *
		 * @member {number}
		 * @default 2000
		 */
		duration: defaultDuration,
		_setDurationAttr: function (value) {
			var duration = normalizeDuration(value);
			this._set("duration", duration);
		},

		_dismissButton: null,
		/**
		 * Indicates whether the message can be dismissed. Is one of ["on", "off", "auto"]
		 * if "auto", isDismissible will adopt a default behaviour that depends
		 * of duration.
		 *
		 * @member {string}
		 * @default null
		 */
		dismissible: "auto",

		/**
		 * a string containing the class that matches the type of the message
		 * @member {string}
		 * @default null
		 */
		messageTypeClass: messageTypeClass(defaultType),

		/**
		 * dismisses the message, optionally with an animation
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
		 * Returns whether the message is going to expire.
		 * @returns {boolean}
		 */
		isExpirable: function () {
			return this.duration >= 0;
		},

		/**
		 * Returns whether the message can be dismissed.
		 *
		 * if the dismissible property was set to `"on"` (resp. `"off"`),
		 * this method will output `true` (resp. `false`).
		 * if dismissible was set to `"auto"`, this method will output `false` if
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
				domClass.add(this, toaster.animationInitialClass);
			}
			if (toaster.invertOrder && wrapper.hasChildNodes()) {
				// NOTE: invertOrder has an effect only when wrapper has children
				var first = wrapper.childNodes[0];
				wrapper.insertBefore(this, first);
			} else {
				wrapper.appendChild(this);
			}
			this.startup();

			// starting timer
			if (this.isExpirable()) {
				this._timer = new Timer(this.duration);
				this.own(this._timer.promise()); // NOTE: this cancels the promise in case the widget is destroyed
				this._timer.start().then(function () {
					this._hasExpired = true;
					toaster.refreshRendering({messages: true});
				}.bind(this));
			}

			// toggling dismiss button visibility
			domClass.toggle(this._dismissButton, D_HIDDEN, !this.isDismissible());
		},
		_showInDom: function (toaster, animated) {
			if (animated) {
				this.defer(function () {
					// NOTE: this timeout is here only to prevent the browser from optimizing
					// (which makes the animation invisible)
					domClass.replace(this, toaster.animationEnterClass, toaster.animationInitialClass);
					listenAnimationEvents(this, function (element) {
						domClass.remove(element, toaster.animationEnterClass);

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
		},
		_hideInDom: function (toaster, animated, customAnimation) {
			var animation = customAnimation || toaster.animationQuitClass;
			if (toaster !== null) {
				// NOTE: the swipe dismissing is made possible only till the leaving animation starts
				// this is done to avoid the CSS of the animation to interfere with the swipe
				this.swipeToDismiss.disable();

				if (animated) {
					domClass.add(this, animation);
					listenAnimationEvents(this, function (element) {
						element._toBeRemoved = true;
						toaster.refreshRendering({messages: true});
					});
				} else {
					domClass.add(this, D_TRANSPARENT);
					this._toBeRemoved = true;
					toaster.refreshRendering({messages: true}); // TODO: could be better handled with an event
				}
			}
		},
		_removeFromDom: function (toaster, animated) {
			domClass.replace(this, animated ? toaster.animationEndClass : D_HIDDEN, toaster.animationQuitClass);
			toaster._wrapper.removeChild(this);
			this._isRemoved = true;
		},
		buildRendering: renderer,
		preCreate: function () {
			this.id = "d-toaster-message-" + this.widgetId;
			this.addInvalidatingProperties("type", "duration", "dismissible");
		},
		postCreate: function () {
			// TODO this should be done only if this.isDismissible()
			// but at this stage this.isDismissible() ouput is wrong because members have not been initialized yet

			// setting up the swipe to dismiss listener
			this.swipeToDismiss = new SwipeToDismiss(this, function () {
				this.dismiss(D_SWIPEOUT);
			}.bind(this));

			// setting up click listener for dismiss button
			if (this._dismissButton !== null) {
				this.own(on(this._dismissButton, "click", function () {
					this.dismiss();
				}.bind(this)));
			}
		}
	});
	return register("d-toaster-message", [HTMLElement, ToasterMessage]);
});
