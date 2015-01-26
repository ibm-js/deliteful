define([
	"intern!object",
	"intern/chai!assert",
	"delite/register",
	"deliteful/Toaster",
	"deliteful/ToasterMessage"
], function (registerSuite, assert, register, Toaster, ToasterMessage) {

	var container, toaster;
	registerSuite({
		name: "ToasterMessage",

		setup: function () {
			container = document.createElement("div");
			container.setAttribute("id", "container");
			document.body.appendChild(container);

			toaster = new Toaster();
			toaster.placeAt("container");
		},
		"Default values": function () {
			var messageDefault = new ToasterMessage();

			// default
			assert.isNull(messageDefault.message);
			assert.strictEqual(messageDefault.type, "info");
			assert.strictEqual(messageDefault.duration, 2000, "duration is 2000 by default");
			assert.isFalse(messageDefault._isInserted);
			assert.isFalse(messageDefault._isRemoved, false);
			assert.isFalse(messageDefault._hasExpired, false);
			assert.isFalse(messageDefault.isDismissible(), false);
			assert.isFalse(messageDefault._toBeRemoved, false);
		},
		"Default with only message and type": function () {
			var messageDefault = new ToasterMessage({
				message: "my message",
				type: "error"
			});
			// forced
			assert.isNotNull(messageDefault.message);
			assert.strictEqual(messageDefault.type, "error");

			// default
			assert.strictEqual(messageDefault.duration, 2000,
				"duration is 2000 by default");
			assert.isFalse(messageDefault._isInserted);
			assert.isFalse(messageDefault._isRemoved);
			assert.isFalse(messageDefault._hasExpired);
			assert.isFalse(messageDefault.isDismissible());
			assert.isFalse(messageDefault._toBeRemoved);
		},
		"Default with finite duration": function () {
			var messageDefault = new ToasterMessage({
				duration: 6000
			});

			// forced
			assert.strictEqual(messageDefault.duration, 6000);
			assert.isTrue(messageDefault.isExpirable());
			assert.isFalse(messageDefault.isDismissible());

			// default
			assert.isNull(messageDefault.message);
			assert.strictEqual(messageDefault.type, "info");
			assert.isFalse(messageDefault._isInserted);
			assert.isFalse(messageDefault._isRemoved, false);
			assert.isFalse(messageDefault._hasExpired, false);
			assert.isFalse(messageDefault.isDismissible(), false);
			assert.isFalse(messageDefault._toBeRemoved, false);
		},
		"Default with -1 duration": function () {
			var messageDefault = new ToasterMessage({
				duration: -1
			});

			// forced
			assert.strictEqual(messageDefault.duration, -1);
			assert.isFalse(messageDefault.isExpirable());
			assert.isTrue(messageDefault.isDismissible());

			// default
			assert.isNull(messageDefault.message);
			assert.strictEqual(messageDefault.type, "info");
			assert.isFalse(messageDefault._isInserted);
			assert.isFalse(messageDefault._isRemoved);
			assert.isFalse(messageDefault._hasExpired);
			assert.isFalse(messageDefault._toBeRemoved);
		},

		"Testing types": function () {
			var m = new ToasterMessage({ message: "Hello, world" });

			var types = ["info", "success", "error", "warning"];
			types.forEach(function (t) {
				m.type = t;
				assert.strictEqual(m.type, t,
					"type is correct");
			});

			var invalidTypes = ["infO", "Success", "dummy"];
			invalidTypes.forEach(function (t) {
				m.type = t;
				assert.strictEqual(m.type, "info",
					"type was set to default");

			});
		},

		// durations
		"Testing durations": function () {
			var m = new ToasterMessage({ message: "Hello, world" });

			var invalidDurations = ["2000", null, {}];
			invalidDurations.forEach(function (d) {
				m.duration = d;
				assert.strictEqual(m.duration, 2000, "default duration was set");
			});
		},
		"Testing valid durations": function () {
			var durations = [2000, -1];
			var message = "Dummy message";
			var m = new ToasterMessage({ message: message });
			durations.forEach(function (d) {
				m.duration = d;
				assert.strictEqual(m.duration, d);
			});
		},
		teardown: function () {
			container.parentNode.removeChild(container);
		}
	});
});
