/** @module deliteful/ToasterMessage */
define(["dcl/dcl",
	"delite/Widget",
	"delite/register",
	"dojo/Deferred",
	"dojo/on",
	"dpointer/events",
	"delite/handlebars!./Toaster/template-default.html",
	"delite/Invalidating",
	"dojo/dom-class"
	], function (dcl, Widget, register, Deferred, on, pointer, renderer, Invalidating, domClass) {

		var	isNull = function (value) {
				return value === null;
			};

		var setFingerAnim = function (element, callback) {
			var SwapStateMachine = new function () {

				var MIN_HORIZONTAL = 100,       // unit = px
					MIN_SPEED = 0.85;           // unit = px/ms

				var opacity = function (distance, elementWidth) {
					return distance < elementWidth ?
						1.0 - distance / elementWidth : 0;
				};

				var updateElement = function (element, gesture) {
					var d = gesture.distance();
					if (d >= 0) {
						element.style.left = d + "px";                           // translate element
						element.style.opacity = opacity(d, element.clientWidth); // change opacity
					}
				};

				var resetElement = function (element) {
					element.style.left = "";
					element.style.opacity = ""; // TODO make sure this doesn't interfere with user css
				};

				var setUnderGestureCtrl = function (element) {
					if (element.isExpirable()) {
						element._interruptTimer();
					}
				};

				var releaseFromGestureCtrl = function (element) {
					if (element.isExpirable()) {
						element._resumeTimer();
					}
				};

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
						} else {
							throw new Error("gesture has not finished!");
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

				this.endCapture = function (event) {
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

			var getEventLocation = function (event) {
				var x = event.clientX, y = event.clientY;
				return { x: x, y: y };
			};


			var reactToPointerDown = function (event) {
				SwapStateMachine.startCapture(event);
				pointer.setPointerCapture(element, event.pointerId);
			};
			var reactToPointerMove = function (event) {
				if (SwapStateMachine.hasStarted && !SwapStateMachine.hasEnded) {
					SwapStateMachine.keepCapturing(event);
				}
			};
			var reactToPointerUpOrOut = function (event) {
				if (SwapStateMachine.hasStarted) {
					SwapStateMachine.endCapture(event);
				}
			};
			this.setListners = function () {
				element.addEventListener("pointerdown" , reactToPointerDown);
				element.addEventListener("pointermove" , reactToPointerMove);
				element.addEventListener("pointerup"   , reactToPointerUpOrOut);
			};
			this.removeListners = function () {
				element.removeEventListener("pointerdown" , reactToPointerDown);
				element.removeEventListener("pointermove" , reactToPointerMove);
				element.removeEventListener("pointerup"   , reactToPointerUpOrOut);
			};

			this.setListners();
		};

		var DUI_TRANSPARENT = "d-transparent",
			DUI_HIDDEN      = "d-hidden",
			DUI_SWIPEOUT    = "d-toaster-swipeout";

		/* message types */
		var messageTypes = {
			info    : "info", // default
			success : "success",
			warning : "warning",
			error   : "error"
		};
		var defaultType = messageTypes.info;
		var normalizeType = function (type) {
			return type in messageTypes ? messageTypes[type] : defaultType;
		};
		var messageTypeClass = function (type) {
			return "d-toaster-type-" + type;
		};

		/* message duration */
		var defaultDuration = 2000;
		var normalizeDuration = function (duration) {
			switch (typeof(duration)) {
				case "number":
					return duration;
				default:
					return defaultDuration;
			}
		};
		var listenAnimationEvents = function (element, callback) {
			var events = [
				"webkitTransitionEnd" , // > chrome 1.0 , > Android 2.1 , > Safari 3.2
				"transitionend"       , // FF           , > IE10
				"webkitAnimationEnd"  , // > chrome 1.0 , > Android 2.1 , > Safari 3.2
				"MSAnimationEnd"      , // IE 10
				"animationend"
			];
			events.forEach(function (event) {
				on.once(element, event, (function (el, ev) {
					// TODO: afaik only one of the above events is fired and removed by once
					// the widget will keep listening to the other events, which can potentially
					// cause perf loss
					return function () {
						callback(el, ev);
					};
				})(element, event), false);
			});
		};

		return register("d-toaster-message", [HTMLElement, Widget, Invalidating], {
			baseClass: "d-toaster-message",

			/**
			 * property used as id from the message
			 *
			 * @member {String}
			 * @default null
			 */
			messageId: null,

			/**
			 * Content of the message.
			 *
			 * @member {String}
			 * @default null
			 */
			message: null,

			/**
			 * Type of the message.
			 * type is one of `["info", "success", "warning", "error"]`.
			 * 
			 * @member {String}
			 * @default "info"
			 */
			type: defaultType,

			/**
			 * Duration for which the message will be shown.
			 * If set to < -1, the message will be shown persistantly until it is
			 * dismissed.
			 *
			 * @member {Number}
			 * @default 2000
			 */
			duration: defaultDuration,

			/**
			 * Whether the message can be dismissed.
			 * if null, isDismissible will adopt a default behaviour that depends
			 * of duration.
			 *
			 * @member {Boolean}
			 * @default null
			 */
			dismissible: null,

			/**
			 * a string containing the class that matches the type of the message
			 * @member {String}
			 * @default null
			 */
			messageTypeClass: messageTypeClass(defaultType), 

            /**
             * dismisses the message, optionnally with an animation
             *
             * @param animation {String} [0] an animation class that will be added to dismiss the message
             */
			dismiss: function (animation) { // called when dismiss button is clicked or swipe detected
				var parent = this.getParent();
				if (animation) {
					this._hideInDom(parent, true, animation); // TODO: write this the way it should be
				} else {
					this._hideInDom(parent, false); // TODO: write this the way it should be
				}
			},

			// states
			_isInserted: false,
			_hasExpired: false,
			_tobeRemoved: false,
			_isRemoved: false,
			
            /**
             * whether the message is going to expire.
             * @return {Boolean}
             */
            isExpirable: function () {
				return this.duration > -1;
			},

            /**
			 * @summary
             * whether the message can be dismissed.
			 *
			 * @description
			 * if the dismissible property was set to true or false, 
			 * this method will output the value of dismissible
			 * if dismissible was not set this method will output false if 
			 * the message is expirable, true otherwise.
			 *
             * @return {Boolean}
             */
			isDismissible: function () {
				return this.dismissible !== null ?
					this.dismissible : ! this.isExpirable();
			},

			// custom setters
			_setTypeAttr: function (value) {
				var type = normalizeType(value);
				this.messageTypeClass = messageTypeClass(type);
				this._set("type", type);
			},
			_setDurationAttr: function (value) {
				var duration = normalizeDuration(value);
				this._set("duration", duration);
			},
			_getDismissButton: function () {
				var dbs = this.getElementsByClassName("d-toaster-dismiss");
				if (dbs.length > 0) {
					return dbs[0];
				} else {
					return null;
				}
			},

			// timing
            _timer: null,
            _insertDate: null,
            _remainingTime: null,
			_startTimer: function (then) {
				this._timer = this.defer(then, this.duration);
                this._timerCallback = then; // NOTE: callback stored for later reference
			},
            _interruptTimer: function () {
                if (! isNull(this._timer)) {
					// when there is a timer set
					this._timer.remove();                                             // remove the old timer
					var rt = this.duration - new Date().getTime() + this._insertDate; // calculate the remaining time
					this._remainingTime = rt > 0 ? rt : 0;

				} else {
					// when there is no timer
					this._remainingTime = 0;
                }
            },
            _resumeTimer: function () {
                if (isNull(this._remainingTime)) { // expect a remaining time to be defined
                    throw new Error("no remaining time was registered");
                } else {
					this._timer = this.defer(this._timerCallback, this._remainingTime);
                }
            },

			// life cycle
			_insertInDom: function (toaster, animated) {
				var wrapper = toaster._wrapper;
				this._isInserted = true;
                this._insertDate = new Date().getTime();
				if (animated) {
					domClass.add(this, toaster.animationInitialClass);
				}
				if (toaster.invertOrder && wrapper.hasChildNodes()) {   // NOTE: invertOrder has an effect only
					                                                    // when wrapper has children
					var first = wrapper.childNodes[0];
					wrapper.insertBefore(this, first);
				} else {
					wrapper.appendChild(this);
				}
			},
			_showInDom: function (toaster, animated) {
				if (animated) {
					this.defer(function () {
						// NOTE: this timeout is here only to prevent the browser from optimizing
						// (which makes the animation invisible)
						domClass.replace(this, toaster.animationEnterClass, toaster.animationInitialClass);
						listenAnimationEvents(this, function (element, event) {
							domClass.remove(element, toaster.animationEnterClass);
						});
					}, 1);
				}
				setFingerAnim(this, function () {
					this.dismiss(DUI_SWIPEOUT); // TODO make this a constant
				}.bind(this));
			},
			_hideInDom: function (toaster, animated, customAnimation) {
				var animation = customAnimation || toaster.animationQuitClass;
				if (toaster !== null) {
					if (animated) {
						domClass.add(this, animation);
						listenAnimationEvents(this, function (element, event) {
							element._tobeRemoved = true;
							toaster.refreshRendering({messages: true});
						});
					} else {
						domClass.add(this, DUI_TRANSPARENT);
						this._tobeRemoved = true;
						toaster.refreshRendering({messages: true});
					}

				}
			},
			_removeFromDom: function (toaster, animated) {
				domClass.remove(this, toaster.animationQuitClass);
				if (animated) {
					domClass.add(this, toaster.animationEndClass);
				} else {
					domClass.add(this, DUI_HIDDEN);
				}

				this._isRemoved = true;
				this.destroy();
			},
			buildRendering: renderer,
			refreshRendering: function (props) {},
			preCreate: function () {
				this.messageId = "d-toaster-message-" + this.widgetId;
				this.addInvalidatingProperties("type", "duration", "dismissible");
			},
			postCreate: function () {

				// setting up the dimiss button
				var db = this._getDismissButton();
				if (db !== null) {
					var _this = this;
					db.onclick = function () { _this.dismiss(); };
				}
			}

		});
	});
