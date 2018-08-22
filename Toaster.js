/** @module deliteful/Toaster */
define([
	"dcl/dcl",
	"delite/Widget",
	"delite/register",
	"decor/sniff",
	"delite/handlebars!./Toaster/Toaster.html",
	"./ToasterMessage",
	"delite/theme!./Toaster/themes/{{theme}}/Toaster.css"
], function (dcl, Widget, register, has, template, ToasterMessage) {

		/* helpers */
		function isRemovable(m) {return m._toBeRemoved && (! m._isRemoved); }

		/**
		 * Toaster widget.  Displays instances of `ToasterMessage`.
		 *
		 * Messages are posted through `postMessage()`, which takes either
		 * a full `ToasterMessage` instance or a message as a string.
		 *
		 * `ToasterMessage` instances are displayed for a finite or infinite duration.
		 * (see the `duration` property of `ToasterMessage`).
		 *
		 * @class module:deliteful/Toaster
		 * @augments module:delite/Widget
		 * @example
		 *   <d-toaster id="t"></d-toaster>
		 *   <d-button on-click="t.postMessage('button clicked', {duration: 1000})">...</d-button>
		 */
		return register("d-toaster", [HTMLElement, Widget], /** @lends module:deliteful/Toaster */ {

			_wrapper: null,

			baseClass: "d-toaster",

			/**
			 * The name of the CSS class that specifies the placement of
			 * toaster's messages.
			 *
			 * The toaster comes with 7 classes which can be used out-of-the-box.
			 *  - `d-toaster-placement-default` for the default position
			 *  - `d-toaster-placement-tl` for top-left
			 *  - `d-toaster-placement-tc` for top-center
			 *  - `d-toaster-placement-tr` for top-right
			 *  - `d-toaster-placement-bl` for bottom-left
			 *  - `d-toaster-placement-bc` for bottom-center
			 *  - `d-toaster-placement-br` for bottom-right
			 *
			 * This property can be set to any string as long as it references
			 * the name of a CSS class properly defined.
			 *
			 * @member {string}
			 * @default `d-toaster-placement-default`
			 */
			placementClass: "d-toaster-placement-default",

			/**
			 * A list containing all `ToasterMessage` instances posted.
			 * @member {module:deliteful/ToasterMessage[]}
			 * @default null
			 */
			messages: null,

			/**
			 * If `true`, the messages are displayed bottom to top.
			 * @member {boolean}
			 * @default false
			 */
			invertOrder: false,

			/**
			 * A CSS class which is added to each message inserted in the DOM without being visible yet.
			 *
			 * It is toggled to `animationEnterClass`.
			 * This class is useful when you want to set an initial state for `animationEnterClass`.
			 *
			 * @member {string}
			 * @default "d-toaster-initial"
			 */
			animationInitialClass: "d-toaster-initial",

			/**
			 * A CSS class which is inserted to make the message visible in DOM (ex: a fade-in CSS transition).
			 * It is removed as soon as the animation has completed.
			 *
			 * If no `transitionend` or `animationend` event is heard, this class is never removed.
			 *
			 * @member {string}
			 * @default "d-toaster-fadein"
			 */
			animationEnterClass: "d-toaster-fadein",

			/**
			 * A CSS class which is inserted to make the message invisible in DOM (ex: a fade-out CSS transition).
			 * It is toggled to `animationQuitClass` when the animation has completed.
			 *
			 * If no `transitionend` or `animationend` event is heard, this class is never removed.
			 *
			 * @member {string}
			 * @default "d-toaster-fadeout"
			 */
			animationQuitClass: "d-toaster-fadeout",

			/**
			 * A CSS class which is inserted after `animationQuitClass` has completed.
			 *
			 * If no `transitionend` or `animationend` event is heard, this class is never inserted.
			 *
			 * @member {string}
			 * @default "d-toaster-fadefinish"
			 */
			animationEndClass: "d-toaster-fadefinish",

			_emitExpiration: function (m) {
				this.emit("messageExpired", {message: m}); // TODO: shouldn't a event be named lowercase?
			},
			_emitInsertion: function (m) {
				this.emit("messageInserted", {message: m});
			},
			_emitRemoval: function (m) {
				this.emit("messageRemoved", {message: m});
			},
			_getRemovableMsg: function () {
				return this.messages.filter(isRemovable);
			},
			_allExpAreRemovable: function () {
				for (var i = 0, l = this.messages.length; i < l; i++) {
					var m = this.messages[i];
					if (m.isExpirable()) {
						if (!isRemovable(m)) { return false; }
					}
				}
				return true;
			},

			template: template,

			constructor: function () {
				this.messages = [];

				// NOTE: the following a11y attributes are needed for JAWS but
				// break VoiceOver
				if (!has("ios")) {
					this.setAttribute("aria-atomic", "true");
					this.setAttribute("role", "alert");
				}
			},

			refreshRendering: function (props) {
				if ("messages" in props) {
					this.messages.forEach(function (m) {
						if (!m._isInserted) {
							m._insertInDom(this, true);
							m._showInDom(this, true);
							this._emitInsertion(m);
						} else if (m.isExpirable() && m._hasExpired && (!m._toBeRemoved)) {
							m._hideInDom(this, true);
							this._emitExpiration(m);
						}
					}, this);
					if (this._allExpAreRemovable()) {
						this._getRemovableMsg().forEach(function (m) {
							m._removeFromDom(this, true);
							m.destroy();
							this.messages.splice(this.messages.indexOf(m), 1);
							this._emitRemoval(m);
						}, this);
					}
				}
			},

			/**
			 * Posts a message in the toaster.
			 *
			 * The message can be either a full `ToasterMessage` instance or
			 * a simple string, in which case the proprieties of the message
			 * are specified through the `props` argument which is passed to the
			 * `ToasterMessage` constructor.
			 *
			 * @param {string|module:deliteful/ToasterMessage} message Either the content of the
			 * message as a string or an instance of `deliteful/ToasterMessage`.
			 * @param {Object} [props] A hash used to initialize a message instance (only relevant 
			 * when `message` passed is a string).
			 *
			 * @returns {module:deliteful/ToasterMessage} The message instance passed as a parameter
			 * or created from the string.
			 */
			postMessage: function (message, props) {
				var m;
				if (typeof(message) === "string") {
					var args = props ? Object.create(props) : {};
					args.message = message;
					m = new ToasterMessage(args);
				} else {
					m = message;
				}
				return this._addMessage(m);
			},
			_addMessage: function (m) {
				this.messages.push(m);
				this.notifyCurrentValue("messages");
				return m;
			}
		});
	});
