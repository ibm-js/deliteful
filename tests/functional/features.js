define([
	"intern",
	"intern!object",
	"intern/dojo/node!leadfoot/helpers/pollUntil",
	"intern/chai!assert",
	"require"
], function (intern, registerSuite, pollUntil, assert, require) {
	
	function loadFile(remote, fileName) {
		return remote
			.get(require.toUrl(fileName))
			.then(pollUntil("return ready ? true : null;", [],
				intern.config.WAIT_TIMEOUT, intern.config.POLL_INTERVAL));
	}
	
	function checkChannelFlags(has, isPhone, isTablet, isDesktop, description) {
		assert.strictEqual(has["phone-like-channel"], isPhone,
			"phone-like-channel on " + description);
		assert.strictEqual(has["tablet-like-channel"], isTablet,
			"tablet-like-channel on " + description);
		assert.strictEqual(has["desktop-like-channel"], isDesktop,
			"desktop-like-channel on " + description);
	}
	function checkChannelFlagsPhone(has, description) {
		checkChannelFlags(has, true, false, false, description);
	}
	function checkChannelFlagsTablet(has, description) {
		checkChannelFlags(has, false, true, false, description);
	}
	function checkChannelFlagsDesktop(has, description) {
		checkChannelFlags(has, false, false, true, description);
	}
	
	registerSuite({
		name: "deliteful/features - functional",

		"channel flags and breakpoint flags": function () {
			var remote = this.remote;
			return loadFile(remote, "./features.html")
				.execute("return _has")
				.then(function (has) {
					/* jshint maxcomplexity: 21 */
					var platform = remote.environmentType.platformName || remote.environmentType.platform;
					var deviceName = remote.environmentType.deviceName;
					var browserName = remote.environmentType.browserName;

					var description = "platform: " + platform + " deviceName: " + deviceName +
						" browserName: " + browserName;

					if (/windows|xp|linux|os x|mac/i.test(platform)) {
						checkChannelFlagsDesktop(has, description);
					} else if (/iphone|galaxy s|galaxy note|nexus 4|nexus 5/i.test(deviceName)) {
						// Values of deviceName may evolve depending on the configuration
						// of saucelabs test platforms, and depending on the config files
						// (tests/intern(.local).js).
						checkChannelFlagsPhone(has, description);
					} else if (/ipad|nexus 7|nexus 9|galaxy tab/i.test(deviceName)) {
						checkChannelFlagsTablet(has, description);
					} else {
						// Did the test run on a platform such that the testing code above doesn't check
						// the flags? This throw means we need to update the testing code to add new platforms/devices.
						throw new Error(
							"not checked with platform: " + platform +
							" deviceName: " + deviceName +
							" browserName: " + browserName +
							" (new platform/device to be added to the test?)");
					}
				});
		}
	});
});
