define([
	"intern!object",
	"intern/chai!assert",
	"intern/chai!should",
	"intern/chai!expect",
	"dojo/dom-geometry",
	"dojo/dom-class",
	"delite/register",
	"deliteful/Toaster",
	"deliteful/ToasterMessage"
], function (registerSuite, assert, should, expect, domGeom, domClass, register, Toaster, ToasterMessage) {

	var _assert = {}; // this object will contain custom assertions methods

	_assert.includeOnceWithMessage = function(array, message){
		var isSameMessage = function(messageWidget){return messageWidget.message === message};
		assert(array.filter(isSameMessage).length === 1, 
				"there is one message: '" + message + "'", 
				"there are none or more than one message: '" + message + "'");
	}
	_assert.includeOnce = function (array, element) {
		var isSameAsElement = function (e) { return e === element; };
		assert(array.filter(isSameAsElement).length === 1, 
				element + " is included once in array", 
				element + " is not included once in array");
	}
	_assert.include = function (array, element, message) {
		assert(array.indexOf(element) >= 0, message);
	}


	var toaster, container;

	registerSuite({

		name: "Toaster",

		setup: function () {
			container = document.createElement("div");
			container.setAttribute("id", "container")
			document.body.appendChild(container);
		},
		
		"Default values": function(){
			var toasterDefault = new Toaster();
			toasterDefault.startup();
			toasterDefault.placeAt("container");
			toasterDefault.show();

			assert(domClass.contains(toasterDefault, "d-toaster-placement-default"),
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
		"Checking if placement class of the toaster is correct": function(){
			var toasters = { 
				default: null,
						 tl: null, tc: null, tr: null, 
				bl: null, bc: null, br: null 
			};
			Object.keys(toasters).forEach(function(pos){
				toasters[pos] = new Toaster({placementClass: "d-toaster-placement-" + pos});
				toasters[pos].startup();
				toasters[pos].placeAt("container");
				toasters[pos].show();
				assert.isTrue(domClass.contains(toasters[pos], "d-toaster-placement-" + pos),
					"d-toaster-placement-" + pos + " CSS class has been correctly set")
			})
		},
		"Checking raw message creation and posting": function(){
			var toast = new Toaster();
			toast.startup();
			toast.placeAt("container");
			toast.show();

			// creating the messages
			var makeMessage = function(i){
				return "message content n�" + i;
			}
			var messages = [1, 2, 3, 4, 5].map(makeMessage);

			// posting the messages
			messages.forEach(function(m){
				toast.postMessage(m);
			});

			// checking the posted messages
			messages.forEach(function(m){
				_assert.includeOnceWithMessage(toast.messages, m);
			});
		},
		"Checking message widget creation and posting": function(){
			var toast = new Toaster();
			toast.startup();
			toast.placeAt("container");
			toast.show();

			// creating the messages
			var makeMessage = function(i){
				var m = new ToasterMessage({message: "Hello world " + i});
				return m;
			}
			var messages = [1, 2, 3, 4, 5].map(makeMessage);

			// posting the messages
			messages.forEach(function(mw){
				toast.postMessage(mw);
			});

			// checking the posted messages
			messages.forEach(function(mw){
				_assert.include(toast.messages, mw, 
					mw + " has been correctly added");
			});

			assert.lengthOf(toast.messages, messages.length, 
					"all messages are found");
		},
		"Testing behaviour of _hasOnlyRemovableMsg and _getRemovableMsg": function() {
			var toast = new Toaster();
			toast.startup();
			toast.placeAt("container");
			toast.show();

			var resetToast = function () {
				toast._flushMessageList();
				for (var i = 0; i < 100; i++){
					var m = ToasterMessage({message: "Hello, World", duration: 1000});
					toast.postMessage(m);
				}
			};

			resetToast();
			// somes messages are removable (those in removableMsgs0) and some are not
			var removableMsgs0 = [];
			toast.messages.forEach(function (m, i) { 
				// NOTE: updating `_tobeRemoved` is done seprately on purpose
				// doing it in the previous for loop would have a side effect on the 
				// `toast.messages` list as `postMessage` invokes `refreshRendering`

				if (i % 2) {
					removableMsgs0.push(m);
					m._tobeRemoved = true; // some are removable
				} else
					m._tobeRemoved = false; // and some are not
			});

			assert.isFalse(toast._hasOnlyRemovableMsg(), 
					"not all messages are removable");

			var removableMsgs = toast._getRemovableMsg();
			assert.lengthOf(removableMsgs, removableMsgs0.length, 
					"number of removable messages found is correct");

			removableMsgs0.forEach(function(m0){
				_assert.include(removableMsgs, m0, 
					"message " + m0 + " removable messages retrieved");
			});

			resetToast();
			// all messages are removable 
			toast.messages.forEach(function (m) {
				m._tobeRemoved = true;
			});
			assert.isTrue(toast._hasOnlyRemovableMsg(), "_hasOnlyRemovableMsg");
			var removableMsgs = toast._getRemovableMsg();
			toast.messages.forEach(function(m0){
				_assert.include(removableMsgs, m0, 
					"All removable Msg were retrieved by _getRemovableMsg")
			});


			resetToast();
			// all messages are non removable
			toast.messages.forEach(function (m) {
				m._tobeRemoved = false; // no removable messages
			});
			assert.isFalse(toast._hasOnlyRemovableMsg(), 
					"make sure _hasOnlyRemovableMsg outputs false");
			var removableMsgs = toast._getRemovableMsg();
			assert.lengthOf(removableMsgs, 0, 
					"make sure number of msg retrieved by _getRemovableMsg is 0")
		},
		"Checking _nonRemovableAreOnlyPersistants behaviour": function () {
			var toast = new Toaster();
			toast.startup();
			toast.placeAt("container");
			toast.show();

			// some messages are removable and some are not
			// some messages are persistant and some are not
			// if a message is a non removable then it is persistant
			for (var i = 0; i < 100; i++){
				var m = ToasterMessage({messages: "Hello, World", duration: 2000});
				m._tobeRemoved = i < 50 ? true : false; // some are non removable
				if (! m._tobeRemoved) // a non removable is persistant
					m.duration = NaN;
				else // a removable can be persistant or expirable
					m.duration = i % 2 === 0 ? 2000 : NaN;
				toast.postMessage(m);
			}

			assert.isTrue(toast._nonRemovableAreOnlyPersistent(),
					"all removable messages are persistant");


			// some messages are removable and some are not
			// some messages are persistant and some are not
			// some messages are not removable and not persistant
			toast._flushMessageList();
			for (var i = 0; i < 100; i++){
				var m = ToasterMessage({messages: "Hello, World", duration: 0});
				m._tobeRemoved = i < 50 ? true : false; // some are non removable
				m.duration = i % 2 === 0 ? 2000 : NaN; // some are persistant
				toast.postMessage(m);
			}

			assert.isFalse(toast._nonRemovableAreOnlyPersistent(),
					"not all removable messages are persistant")


			// all messages are non removable 
			// some messages are persistant and some are not
			toast._flushMessageList();
			for (var i = 0; i < 100; i++){
				var m = ToasterMessage({messages: "Hello, World", duration: 0});
				m._tobeRemoved = false; // all are non removable
				m.duration = i % 2 === 0 ? 2000 : NaN; // some are persistant
				toast.postMessage(m);
			}
			assert.isFalse(toast._nonRemovableAreOnlyPersistent(),
					"there are only removable messages but no all of them are persistant")

			// all messages are non removable 
			// all messages are persistant
			toast._flushMessageList();
			for (var i = 0; i < 100; i++){
				var m = ToasterMessage({messages: "Hello, World", duration: 0});
				m._tobeRemoved = false; // all are non removable
				m.duration = 2000; // all are persistant
				toast.postMessage(m);
			}
			assert.isFalse(toast._nonRemovableAreOnlyPersistent(),
					"all are non removable but none are persistant")
		},

		teardown: function () {
			container.parentNode.removeChild(container);
		}
	});
});
