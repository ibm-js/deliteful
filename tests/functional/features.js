define([
	"intern",
	"intern!object",
	"intern/dojo/node!leadfoot/helpers/pollUntil",
	"intern/chai!assert",
	"require"
], function (intern, registerSuite, pollUntil, assert, require) {
	
	var testChannelFlagsDone = false;
	
	var loadFile = function (remote, fileName) {
		return remote
			.get(require.toUrl(fileName))
			.then(pollUntil("return ready ? true : null;", [],
				intern.config.WAIT_TIMEOUT, intern.config.POLL_INTERVAL));
	};
	
	var checkChannelFlags = function (has, isPhone, isTablet, isDesktop, description) {
		assert.strictEqual(has["phone-like-channel"], isPhone,
			"phone-like-channel on " + description);
		assert.strictEqual(has["tablet-like-channel"], isTablet,
			"tablet-like-channel on " + description);
		assert.strictEqual(has["desktop-like-channel"], isDesktop,
			"desktop-like-channel on " + description);
		testChannelFlagsDone = true;
	};
	var checkChannelFlagsPhone = function (has, description) {
		checkChannelFlags(has, true, false, false, description);
	};
	var checkChannelFlagsTablet = function (has, description) {
		checkChannelFlags(has, false, true, false, description);
	};
	var checkChannelFlagsDesktop = function (has, description) {
		checkChannelFlags(has, false, false, true, description);
	};
	
	registerSuite({
		name: "deliteful/features - functional",

		"channel flags and breakpoint flags": function () {
			this.timeout = intern.config.TEST_TIMEOUT;
			var remote = this.remote;
			return loadFile(remote, "./features.html")
				.execute("return _has")
				.then(function (has) {
					/* jshint maxcomplexity: 19 */
					var platform = remote.environmentType.platform ?
							remote.environmentType.platform.toUpperCase() : null,
						deviceName = remote.environmentType.deviceName ?
							remote.environmentType.deviceName.toUpperCase() : null,
						browserName = remote.environmentType.browserName ?
							remote.environmentType.browserName.toUpperCase() : null;

					var description = "platform: " + platform + " deviceName: " + deviceName +
						" browserName: " + browserName;
					
					if (platform &&
						platform.indexOf("WINDOWS") !== -1 ||
						platform.indexOf("XP") !== -1 ||
						platform.indexOf("LINUX") !== -1 ||
						platform.indexOf("OS X") !== -1 ||
						platform.indexOf("MAC") !== -1) {
						checkChannelFlagsDesktop(has, description);
					} else if (deviceName) {
						// Values of deviceName may evolve depending on the configuration
						// of saucelabs test platforms, and depending on the config files
						// (tests/intern(.local).js).
						if (deviceName.indexOf("IPHONE") !== -1 ||
							deviceName.indexOf("GALAXY S") !== -1 ||
							deviceName.indexOf("GALAXY NOTE") !== -1 ||
							deviceName.indexOf("NEXUS 4") !== -1 ||
							deviceName.indexOf("NEXUS 5") !== -1) {
							checkChannelFlagsPhone(has, description);
						} else if (deviceName.indexOf("IPAD") !== -1 ||
							deviceName.indexOf("NEXUS 7") !== -1 ||
							deviceName.indexOf("NEXUS 9") !== -1 ||
							deviceName.indexOf("GALAXY TAB") !== -1) {
							checkChannelFlagsTablet(has, description);
						}
					}
					// Did the test run on a platform such that the testing code above doesn't check
					// the flags? This assertion allows to detect whether we need to update the
					// testing code to add new platforms/devices.
					assert.isTrue(testChannelFlagsDone,
						"not checked with platform: " + platform +
						" deviceName: " + deviceName +
						" browserName: " + browserName +
						" (new platform/device to be added to the test?)");
				})
				.end();
		}
	});
});
