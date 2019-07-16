define(function (require) {
	"use strict";

	var registerSuite = require("intern!object");
	var assert = require("intern/chai!assert");
	var Toaster = require("deliteful/Toaster");
	var ToasterMessage = require("deliteful/ToasterMessage");

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


	var container, toaster;

	registerSuite({

		"name": "Toaster",

		"setup": function () {
			container = document.createElement("div");
			container.setAttribute("id", "container");
			document.body.appendChild(container);
		},

		"beforeEach": function () {
			toaster = new Toaster();
			toaster.placeAt("container");
		},

		"afterEach": function () {
			if (toaster) {
				toaster.destroy();
				toaster = null;
			}
		},

		"Default values": function () {
			assert(toaster.classList.contains("d-toaster-placement-default"),
				"toaster has class d-toaster-placement-default");

			assert.isFalse(toaster.invertOrder,
				"invertOrder should be set to false by default");
			assert.strictEqual(toaster.animationInitialClass, "d-toaster-initial",
				"animationInitialClass is by default d-toaster-initial");
			assert.strictEqual(toaster.animationEnterClass, "d-toaster-fadein",
				"animationEnterClass is by default d-toaster-fadein");
			assert.strictEqual(toaster.animationQuitClass, "d-toaster-fadeout",
				"animationQuitClass is by default d-toaster-fadeout");
			assert.strictEqual(toaster.animationEndClass, "d-toaster-fadefinish",
				"animationEndClass is by default d-toaster-fadefinish");
		},
		"Checking if placement class of the toaster is correct": function () {
			var positions = ["default", "tc", "tl", "tr", "bl", "bc", "br"];
			positions.forEach(function (pos) {
				toaster = new Toaster({placementClass: "d-toaster-placement-" + pos});
				toaster.placeAt("container");
				assert.isTrue(toaster.classList.contains("d-toaster-placement-" + pos),
					"d-toaster-placement-" + pos + " CSS class has been correctly set");
				toaster.destroy();
			});
		},
		"Checking raw message creation and posting": function () {
			// creating the messages
			var makeMessage = function (i) {
				return "message content " + i;
			};
			var messages = [1, 2, 3, 4, 5].map(makeMessage);

			// posting the messages
			messages.forEach(function (m) {
				toaster.postMessage(m);
			});

			// checking the posted messages
			messages.forEach(function (m) {
				_assert.includeOnceWithMessage(toaster.messages, m);
			});
		},
		"Checking message widget creation and posting": function () {
			// creating the messages
			var makeMessage = function (i) {
				return new ToasterMessage({message: "Hello world " + i});
			};
			var messages = [1, 2, 3, 4, 5].map(makeMessage);

			// posting the messages
			messages.forEach(function (mw) {
				toaster.postMessage(mw);
			});

			// checking the posted messages
			messages.forEach(function (mw) {
				_assert.include(toaster.messages, mw,
					mw + " has been correctly added");
			});

			assert.lengthOf(toaster.messages, messages.length,
				"all messages are found");
		},
		"Testing behaviour of _allExpAreRemovable and _getRemovableMsg #1": function () {
			for (var i = 0; i < 100; i++) {
				var m1 = new ToasterMessage({message: "Hello, World", duration: 1000});
				toaster.postMessage(m1);
			}

			// some messages are removable (those in removableMsgs0) and some are not
			var removableMsgs0 = [];
			toaster.messages.forEach(function (m2, j) {
				// NOTE: updating `_toBeRemoved` is done separately on purpose
				// doing it in the previous for loop would have a side effect on the
				// `toaster.messages` list as `postMessage` invokes `refreshRendering`

				if (j % 2) {
					removableMsgs0.push(m2);
					m2._toBeRemoved = true; // some are removable
				} else {
					m2._toBeRemoved = false; // and some are not
				}
			});
			assert.isFalse(toaster._allExpAreRemovable(),
				"not all messages are removable");

			var removableMsgs = toaster._getRemovableMsg();
			assert.lengthOf(removableMsgs, removableMsgs0.length,
				"number of removable messages found is correct");

			removableMsgs0.forEach(function (m0) {
				_assert.include(removableMsgs, m0,
					"message " + m0 + " removable messages retrieved");
			});
		},

		"Testing behaviour of _allExpAreRemovable and _getRemovableMsg #2": function () {
			for (var i = 0; i < 100; i++) {
				var m1 = new ToasterMessage({message: "Hello, World", duration: 1000});
				toaster.postMessage(m1);
			}

			// all messages are removable
			toaster.messages.forEach(function (m2) {
				m2._toBeRemoved = true;
			});
			assert.isTrue(toaster._allExpAreRemovable(), "all messages are removable");
			var removableMsgs = toaster._getRemovableMsg();
			toaster.messages.forEach(function (m0) {
				_assert.include(removableMsgs, m0,
					"All removable Msg were retrieved by _getRemovableMsg");
			});
		},

		"Testing behaviour of _allExpAreRemovable and _getRemovableMsg #3": function () {
			for (var i = 0; i < 100; i++) {
				var m1 = new ToasterMessage({message: "Hello, World", duration: 1000});
				toaster.postMessage(m1);
			}

			// all messages are non removable
			toaster.messages.forEach(function (m2) {
				m2._toBeRemoved = false; // no removable messages
			});
			assert.isFalse(toaster._allExpAreRemovable(),
				"make sure _hasOnlyRemovableMsg outputs false");
			var removableMsgs = toaster._getRemovableMsg();
			assert.lengthOf(removableMsgs, 0,
				"make sure number of msg retrieved by _getRemovableMsg is 0");
		},

		/*jshint maxcomplexity:11*/
		"Checking _nonRemovableAreOnlyPersistent behaviour #1": function () {
			// some messages are removable and some are not
			// some messages are persistent and some are not
			// if a message is expirable then it is removable
			var N = 20;
			for (var i = 0; i < N; i++) {
				var m = new ToasterMessage({messages: "Hello, World", duration: 2000});
				m.duration = i < N / 2 ? -1 : 2000;
				m._toBeRemoved = m.isExpirable() || (i % 2 !== 0); // some are non removable
				toaster.postMessage(m);
			}

			assert.isTrue(toaster._allExpAreRemovable(),
				"all exp messages are removable");
		},

		"Checking _nonRemovableAreOnlyPersistent behaviour #2": function () {
			// some messages are removable and some are not
			// some messages are persistent and some are not
			// some messages are expirable and not removable
			var N = 20;
			for (var i = 0; i < N; i++) {
				var m = new ToasterMessage({messages: "Hello, World", duration: 0});
				m.duration = i < N / 2 ? -1 : 2000; // some are expirable
				m._toBeRemoved = i % 2 !== 0;   // some are non removable
				toaster.postMessage(m);
			}

			assert.isFalse(toaster._allExpAreRemovable(),
				"not all exp are removable");
		},

		"Checking _nonRemovableAreOnlyPersistent behaviour #3": function () {
			// all messages are non removable
			// some messages are exp and some are not
			var N = 20;
			for (var i = 0; i < N; i++) {
				var m = new ToasterMessage({messages: "Hello, World", duration: 0});
				m._toBeRemoved = false; // all are non removable
				m.duration = i % 2 === 0 ? 2000 : -1; // some are persistent
				toaster.postMessage(m);
			}
			assert.isFalse(toaster._allExpAreRemovable(),
				"there are no removable messages at all");
		},

		"Checking _nonRemovableAreOnlyPersistent behaviour #4": function () {
			// all messages are non removable
			// all messages are expirable
			var N = 20;
			for (var i = 0; i < N; i++) {
				var m = new ToasterMessage({messages: "Hello, World", duration: 0});
				m._toBeRemoved = false; // all are non removable
				m.duration = 2000; // all are expirable
				toaster.postMessage(m);
			}
			assert.isFalse(toaster._allExpAreRemovable(),
				"there are no removable messages");
		},

		"teardown": function () {
			container.parentNode.removeChild(container);
		}
	});
});
