define([
	"intern!object",
	"intern/chai!assert",
	"requirejs-dplugins/jquery!attributes/classes",
	"delite/register",
	"deliteful/Toaster",
	"deliteful/ToasterMessage"
], function (registerSuite, assert, $, register, Toaster, ToasterMessage) {

	var _assert = {}; // this object will contain custom assertions methods

	_assert.includeOnceWithMessage = function (array, message) {
		var isSameMessage = function (messageWidget) {
			return messageWidget.message === message;
		};
		assert.strictEqual(array.filter(isSameMessage).length, 1,
			"there is one message: '" + message + "'");
	};
	_assert.includeOnce = function (array, element) {
		var isSameAsElement = function (e) {
			return e === element;
		};
		assert.strictEqual(array.filter(isSameAsElement).length, 1,
			element + " is included once in array");
	};
	_assert.include = function (array, element, message) {
		assert(array.indexOf(element) >= 0, message);
	};


	var container;

	registerSuite({

		name: "Toaster",

		setup: function () {
			container = document.createElement("div");
			container.setAttribute("id", "container");
			document.body.appendChild(container);
		},

		"Default values": function () {
			var toasterDefault = new Toaster();
			toasterDefault.placeAt("container");

			assert($(toasterDefault).hasClass("d-toaster-placement-default"),
				"toasterDefault has class d-toaster-placement-default");

			assert.isFalse(toasterDefault.invertOrder,
				"invertOrder should be set to false by default");
			assert.strictEqual(toasterDefault.animationInitialClass, "d-toaster-initial",
				"animationInitialClass is by default d-toaster-initial");
			assert.strictEqual(toasterDefault.animationEnterClass, "d-toaster-fadein",
				"animationEnterClass is by default d-toaster-fadein");
			assert.strictEqual(toasterDefault.animationQuitClass, "d-toaster-fadeout",
				"animationQuitClass is by default d-toaster-fadeout");
			assert.strictEqual(toasterDefault.animationEndClass, "d-toaster-fadefinish",
				"animationEndClass is by default d-toaster-fadefinish");
		},
		"Checking if placement class of the toaster is correct": function () {
			var toasters = {
				default: null,
				tc: null,
				tl: null,
				tr: null,
				bl: null,
				bc: null,
				br: null
			};
			Object.keys(toasters).forEach(function (pos) {
				toasters[pos] = new Toaster({placementClass: "d-toaster-placement-" + pos});
				toasters[pos].placeAt("container");
				assert.isTrue($(toasters[pos]).hasClass("d-toaster-placement-" + pos),
					"d-toaster-placement-" + pos + " CSS class has been correctly set");
			});
		},
		"Checking raw message creation and posting": function () {
			var toast = new Toaster();
			toast.placeAt("container");

			// creating the messages
			var makeMessage = function (i) {
				return "message content " + i;
			};
			var messages = [1, 2, 3, 4, 5].map(makeMessage);

			// posting the messages
			messages.forEach(function (m) {
				toast.postMessage(m);
			});

			// checking the posted messages
			messages.forEach(function (m) {
				_assert.includeOnceWithMessage(toast.messages, m);
			});
		},
		"Checking message widget creation and posting": function () {
			var toast = new Toaster();
			toast.placeAt("container");

			// creating the messages
			var makeMessage = function (i) {
				return new ToasterMessage({message: "Hello world " + i});
			};
			var messages = [1, 2, 3, 4, 5].map(makeMessage);

			// posting the messages
			messages.forEach(function (mw) {
				toast.postMessage(mw);
			});

			// checking the posted messages
			messages.forEach(function (mw) {
				_assert.include(toast.messages, mw,
					mw + " has been correctly added");
			});

			assert.lengthOf(toast.messages, messages.length,
				"all messages are found");
		},
		"Testing behaviour of _allExpAreRemovable and _getRemovableMsg": function () {
			var toast = new Toaster();
			toast.placeAt("container");

			var resetToast = function () {
				toast.messages = [];
				for (var i = 0; i < 100; i++) {
					var m = new ToasterMessage({message: "Hello, World", duration: 1000});
					toast.postMessage(m);
				}
			};

			resetToast();
			// some messages are removable (those in removableMsgs0) and some are not
			var removableMsgs0 = [];
			toast.messages.forEach(function (m, i) {
				// NOTE: updating `_toBeRemoved` is done separately on purpose
				// doing it in the previous for loop would have a side effect on the
				// `toast.messages` list as `postMessage` invokes `refreshRendering`

				if (i % 2) {
					removableMsgs0.push(m);
					m._toBeRemoved = true; // some are removable
				} else {
					m._toBeRemoved = false; // and some are not
				}
			});
			assert.isFalse(toast._allExpAreRemovable(),
				"not all messages are removable");

			var removableMsgs = toast._getRemovableMsg();
			assert.lengthOf(removableMsgs, removableMsgs0.length,
				"number of removable messages found is correct");

			removableMsgs0.forEach(function (m0) {
				_assert.include(removableMsgs, m0,
					"message " + m0 + " removable messages retrieved");
			});

			resetToast();
			// all messages are removable
			toast.messages.forEach(function (m) {
				m._toBeRemoved = true;
			});
			assert.isTrue(toast._allExpAreRemovable(), "all messages are removable");
			removableMsgs = toast._getRemovableMsg();
			toast.messages.forEach(function (m0) {
				_assert.include(removableMsgs, m0,
					"All removable Msg were retrieved by _getRemovableMsg");
			});


			resetToast();
			// all messages are non removable
			toast.messages.forEach(function (m) {
				m._toBeRemoved = false; // no removable messages
			});
			assert.isFalse(toast._allExpAreRemovable(),
				"make sure _hasOnlyRemovableMsg outputs false");
			removableMsgs = toast._getRemovableMsg();
			assert.lengthOf(removableMsgs, 0,
				"make sure number of msg retrieved by _getRemovableMsg is 0");
		},
		/*jshint maxcomplexity:11*/
		"Checking _nonRemovableAreOnlyPersistent behaviour": function () {
			var i, N = 20, m, toast = new Toaster();
			toast.placeAt("container");

			// some messages are removable and some are not
			// some messages are persistent and some are not
			// if a message is expirable then it is removable
			for (i = 0; i < N; i++) {
				m = new ToasterMessage({messages: "Hello, World", duration: 2000});
				m.duration = i < N / 2 ? -1 : 2000;
				m._toBeRemoved = m.isExpirable() || (i % 2 !== 0); // some are non removable
				toast.postMessage(m);
			}

			assert.isTrue(toast._allExpAreRemovable(),
				"all exp messages are removable");


			// some messages are removable and some are not
			// some messages are persistent and some are not
			// some messages are expirable and not removable
			toast.messages = [];
			for (i = 0; i < N; i++) {
				m = new ToasterMessage({messages: "Hello, World", duration: 0});
				m.duration = i < N / 2 ? -1 : 2000; // some are expirable
				m._toBeRemoved = i % 2 !== 0;   // some are non removable
				toast.postMessage(m);
			}

			assert.isFalse(toast._allExpAreRemovable(),
				"not all exp are removable");

			// all messages are non removable
			// some messages are exp and some are not
			toast.messages = [];
			for (i = 0; i < N; i++) {
				m = new ToasterMessage({messages: "Hello, World", duration: 0});
				m._toBeRemoved = false; // all are non removable
				m.duration = i % 2 === 0 ? 2000 : -1; // some are persistent
				toast.postMessage(m);
			}
			assert.isFalse(toast._allExpAreRemovable(),
				"there are no removable messages at all");

			// all messages are non removable
			// all messages are expirable
			toast.messages = [];
			for (i = 0; i < N; i++) {
				m = new ToasterMessage({messages: "Hello, World", duration: 0});
				m._toBeRemoved = false; // all are non removable
				m.duration = 2000; // all are expirable
				toast.postMessage(m);
			}
			assert.isFalse(toast._allExpAreRemovable(),
				"there are no removable messages");
		},

		teardown: function () {
			container.parentNode.removeChild(container);
		}
	});
});
