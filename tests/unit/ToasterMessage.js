define([
	"intern!object",
	"intern/chai!assert",
	"dojo/dom-geometry",
	"dojo/dom-class",
	"delite/register",
	"deliteful/Toaster",
	"deliteful/ToasterMessage"
], function (registerSuite, assert, domGeom, domClass, register, Toaster, ToasterMessage) {

	var container, toaster;
	registerSuite({
		name: "ToasterMessage",

		setup: function () {
			container = document.createElement("div");
			container.setAttribute("id", "container")
			document.body.appendChild(container);
			
			toaster =  new Toaster();
			toaster.startup();
			toaster.placeAt("container");
			toaster.show();
		},

		"Default values": function(){
			var messageDefault = ToasterMessage()

			// default
			assert.isNull(messageDefault.message,
				"message is null by default");
			assert.equal(messageDefault.type, "info",
				"type is info by default");
			assert.equal(messageDefault.duration, 2000,
				"duration is 2000 by default");
			assert.isFalse(messageDefault._isInserted,
				"_isInserted is false by default");
			assert.isFalse(messageDefault._isRemoved, false,
				"_isRemoved is false by default");
			assert.isFalse(messageDefault._hasExpired, false,
				"_hasExpired is false by default");
			assert.isFalse(messageDefault.isDismissible(), false,
				"isDismissible is false by default");
			assert.isFalse(messageDefault._tobeRemoved, false,
				"_tobeRemoved is false by default");
		},
		"Default with only message and type": function(){
			var messageDefault = ToasterMessage({
				message: "my message",
				type: "error"
			});
			// forced
			assert.isNotNull(messageDefault.message,
				"message is not null");
			assert.equal(messageDefault.type, "error",
				"type is error");

			// default
			assert.equal(messageDefault.duration, 2000,
				"duration is 2000 by default");
			assert.isFalse(messageDefault._isInserted,
				"_isInserted is false by default");
			assert.isFalse(messageDefault._isRemoved, false,
				"_isRemoved is false by default");
			assert.isFalse(messageDefault._hasExpired, false,
				"_hasExpired is false by default");
			assert.isFalse(messageDefault.isDismissible(), false,
				"isDismissible() is false by default");
			assert.isFalse(messageDefault._tobeRemoved, false,
				"_tobeRemoved is false by default");
		},
		"Default with finite duration": function(){
			var messageDefault = ToasterMessage({
				duration: 6000
			});

			// forced
			assert.equal(messageDefault.duration, 6000,
				"duration is 6000");
			assert.isTrue(messageDefault.isExpirable(),
				"isExpirable should be set to true");
			assert.isFalse(messageDefault.isDismissible(),
				"isDismissible() should be set to false");

			// default
			assert.isNull(messageDefault.message,
				"message is null by default");
			assert.equal(messageDefault.type, "info",
				"type is info by default");
			assert.isFalse(messageDefault._isInserted,
				"_isInserted is false by default");
			assert.isFalse(messageDefault._isRemoved, false,
				"_isRemoved is false by default");
			assert.isFalse(messageDefault._hasExpired, false,
				"_hasExpired is false by default");
			assert.isFalse(messageDefault.isDismissible(), false,
				"isDismissible() is false by default");
			assert.isFalse(messageDefault._tobeRemoved, false,
				"_tobeRemoved is false by default");
		},
		"Default with NaN duration": function(){
			var messageDefault = ToasterMessage({
				duration: NaN
			});

			// forced
			assert.isTrue(isNaN(messageDefault.duration),
				"duration is NaN");
			assert.isFalse(messageDefault.isExpirable(),
				"isExpirable should be set to false");
			assert.isTrue(messageDefault.isDismissible(),
				"isDismissible() is false by default");

			// default
			assert.isNull(messageDefault.message,
				"message is null by default");
			assert.equal(messageDefault.type, "info",
				"type is info by default");
			assert.isFalse(messageDefault._isInserted,
				"_isInserted is false by default");
			assert.isFalse(messageDefault._isRemoved,
				"_isRemoved is false by default");
			assert.isFalse(messageDefault._hasExpired,
				"_hasExpired is false by default");
			assert.isFalse(messageDefault._tobeRemoved,
				"_tobeRemoved is false by default");
		},

		"Testing types": function(){
			var m = ToasterMessage({ message: "Hello, world" });
			
			var types = ["info", "success", "error", "warning"];
			types.forEach(function(t){
				m.type = t;
				assert.equal(m.type, t,
					"type is correct");
			});

			var invalidTypes = ["infO", "Success", "dummy"];
			invalidTypes.forEach(function(t){
				try {
					m.type = t;
				} catch (e) {
					assert.equal(e.name, "MessageTypeError", 
						"An expection is raised when type is incorrect");
				}
			});
		},

		// durations
		"Testing durations": function(){
			var m = ToasterMessage({ message: "Hello, world" });

			var invalidDurations = ["2000", null, -1000];
			invalidDurations.forEach(function(d){
				try {
					m.duration = d;
				} catch (e) {
					assert(e.name === "MessageDurationError");
				}
			});
		},
		"Testing valid durations": function(){
			var durations = [2000, 10000, NaN];
			var message = "Dummy message";
			var m = ToasterMessage({ message: message });
			durations.forEach(function(d){
				m.duration = d;
				if (isNaN(d))
					assert(isNaN(m.duration));
				else
					assert(m.duration === d);
			});
		},
		"Testing _getDismissButton": function() {
			var toast = Toaster();
			toast.startup();
			toast.placeAt("container");

			var m = ToasterMessage({
				message: "Hello world",
				type: "error",
				duration: 2000
			});

			assert.isNotNull(m._getDismissButton(), 
					"there should always be a dismiss button in the template")
			
		},
		teardown: function () {
			container.parentNode.removeChild(container);
		}
	});
});
