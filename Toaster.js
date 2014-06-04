/** @module deliteful/Toaster */
define(["dcl/dcl",
	"delite/Widget",
	"delite/register",
	"dojo/Deferred",
	"dojo/has",
	"dojo/sniff",
	"delite/handlebars!./Toaster/template-default.html",
	"delite/Invalidating",
	"deliteful/ToasterMessage",
	"dojo/dom-class",
	"dojo/has!dojo-bidi?./Toaster/bidi/Toaster"
	], function (dcl, Widget, register, Deferred, has, sniff, renderer, Invalidating, ToasterMessage, domClass,
                 BidiToaster) {

		var DUI_HIDDEN = "d-hidden";

		/* helpers */
		var isPersistent   = function (m) {return ! m.isExpirable(); };
		var isRemovable    = function (m) {return m._tobeRemoved && (! m._isRemoved); };
		var isNotRemovable = function (m) {return ! m._tobeRemoved; };

		return register("d-toaster", has("dojo-bidi") ?
				[HTMLElement, Widget, Invalidating, BidiToaster] : [HTMLElement, Widget, Invalidating], {

			/** 
			 * @summary
			 * Toaster widget. Displays instances of ToasterMessage.
			 *
			 * @description
			 * Messages are posted through postMessage, which takes either 
			 * a full ToasterMessage instance or a message as a string.
			 * 
			 * ToasterMessage instances are displayed for a finite or infinite duration. 
			 * (cf. duration property of ToasterMessage).
			 *
			 *
			 *
			 *
			 * @example
			 *  	<d-toaster id="t"></d-toaster>
			 *		<d-button onclick="t.postMessage('button clicked', {duration: 1000})">...</d-button>
			 */

			_wrapper: null,

			baseClass: "d-toaster-wrapper",

			/**
			 * @summary
			 * A class that defines where the messages of the toaster will appear.
			 *
			 * @description
			 * The toaster comes with 7 classes which can be used out-of-the-box.
			 * - "d-toaster-placement-default" for the default position
			 * - "d-toaster-placement-tl" for top-left
			 * - "d-toaster-placement-tc" for top-center
			 * - "d-toaster-placement-tr" for top-right
			 * - "d-toaster-placement-bl" for bottom-left
			 * - "d-toaster-placement-bc" for bottom-center
			 * - "d-toaster-placement-br" for bottom-right
			 * 
			 * This property can be set to any string as long as it references 
			 * a the name of a CSS class properly defined.
			 *
			 * @member {String}
			 * @default "d-toaster-placement-default"
			 */
			placementClass: "d-toaster-placement-default",

			/**
			 * A list containing all ToasterMessage instances posted.
			 * @member {Array}
			 * @default null
			 */
			messages: null,
			
			/**
			 * If true, the messages are diplayed bottom to top.
			 * @member {Boolean}
			 * @default false
			 */
			invertOrder: false,

			/**
			 * A class which is added when the message is inserted in DOM (but not made visible yet)
			 * @member {String}
			 * @default "d-toaster-initial"
			 */
			animationInitialClass: "d-toaster-initial",

			/**
			 * A class which is inserted to make the message visible in DOM (ex: a fade-in CSS transition)
			 * @member {String}
			 * @default "d-toaster-fadein"
			 */
			animationEnterClass: "d-toaster-fadein",

			/**
			 * A class which is inserted to make the message invisible in DOM (ex: a fade-out CSS transition)
			 * @member {String}
			 * @default "d-toaster-fadeout"
			 */
			animationQuitClass: "d-toaster-fadeout",

			/**
			 * A class which is inserted after
			 * @member {String}
			 * @default "d-toaster-fadefinish"
			 */
			animationEndClass: "d-toaster-fadefinish",

			_emitExpiration: function (m) {
				this.emit("messageExpired"  , {message: m});
			},
			_emitInsertion: function (m) {
				this.emit("messageInserted" , {message: m});
			},
			_emitRemoval: function (m) {
				this.emit("messageRemoved"  , {message: m});
			},

			_addAriaAttr: function () {
				this.setAttribute("aria-live"    ,  "assertive");
				this.setAttribute("aria-relevant",  "additions text");

				if (! has("ios")) { // specific to JAWS
					this.setAttribute("aria-atomic" , "true");
					this.setAttribute("role"        , "alert");
				}
			},
			buildRendering: function () {
				this._wrapper = document.createElement("div");
				domClass.add(this._wrapper, "d-toaster-inner");
				if (! this.isLeftToRight()) {
					domClass.add(this._wrapper, "d-toaster-rtl");
				}
				this.appendChild(this._wrapper);
				this._addAriaAttr();
			},
			_hasOnlyRemovableMsg: function () {
				var removableMsg = this._getRemovableMsg();
				return removableMsg.length === this.messages.length;
			},
			_getRemovableMsg: function () {
				return this.messages.filter(isRemovable);
			},
			_nonRemovableAreOnlyPersistent: function () {
				var nonRemovableMsg = this.messages.filter(isNotRemovable);
				return nonRemovableMsg.every(isPersistent);
			},
			refreshRendering: function (props) {
				var _this = this;
				if (props.messages) {
					this.messages.forEach(function (m) {
						if (! m._isInserted) {
							m._insertInDom(_this, true);
							m._showInDom(_this, true);
							_this._emitInsertion(m);
						} else if (m.isExpirable() && m._hasExpired && (!m._tobeRemoved)) {
							m._hideInDom(_this, true);
							_this._emitExpiration(m);
						}
					});
					if (this._hasOnlyRemovableMsg()) {
						this._getRemovableMsg().forEach(function (m) {
							m._removeFromDom(_this, true);
							_this._emitRemoval(m);
						});
					} else if (this._nonRemovableAreOnlyPersistent()) {
						this._getRemovableMsg().forEach(function (m) {
							m._removeFromDom(_this, true);
							_this._emitRemoval(m);
						});
					}
				}
			},
			preCreate: function () {
				this.messages = [];
				this.addInvalidatingProperties("messages");
			},
			postCreate: function () {
				domClass.add(this, this.placementClass);
			},
			/**
			 * @summary
			 * Posts a message in the toaster
			 *
			 * @description
			 * The message can be either a full ToasterMessage instance or
			 * a simple string, in which case the propreties of the message
			 * are specified through props which is passed to the ToasterMessage 
			 * constructor
			 *
			 * @param message {String|module:deliteful/ToasterMessage} Either the content of the message as a `String` or a instance of `deliteful/ToasterMessage`
			 * @param props {Object} [1] A hash used to initialize a message instance (only relevant when `message` passed is a `String`)
			 */
			postMessage: function (message, props) {
				var m;
				if (typeof(message) === "string") {
					var args = {message: message};
					dcl.mix(args, props);
					m = new ToasterMessage(args);
				} else {
					m = message;
				}
				m.startup();
				this._addMessageToList(m);
				this.refreshRendering({messages: true});
			},
			/**
			 * Hides the toaster
			 */
			hide: function () {
				domClass.add(this, DUI_HIDDEN);
			},
			/**
			 * Shows the toaster
			 */
			show: function () {
				domClass.remove(this, DUI_HIDDEN);
			},
			_flushMessageList: function () {
				this.messages = [];
			},
			_addMessageToList: function (m) {
				this.messages.push(m);
				if (m.isExpirable()) {
					var then = function () {
						m._hasExpired = true;
						this.refreshRendering({messages: true});
					};
					m._startTimer(then.bind(this));
				}
			},
			_setPlacementClassAttr: function (placementClass) {
				domClass.remove(this, this.placementClass);
				domClass.add(this, placementClass);

				this._set("placementClass", placementClass);
			}
		});
	});
