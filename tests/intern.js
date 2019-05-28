// run grunt --help for help on how to run
// Learn more about configuring this file at <https://github.com/theintern/intern/wiki/Configuring-Intern>.
// These default settings work OK for most people. The options that *must* be changed below are the
// packages, suites, excludeInstrumentation, and (if you want functional tests) functionalSuites.
define({
	// The port on which the instrumenting proxy will listen
	proxyPort: 9000,

	// Browsers to run integration testing against. Note that version numbers must be strings if used with Sauce
	// OnDemand. Options that will be permutated are browserName, version, platform, and platformVersion; any other
	// capabilities options specified for an environment will be copied as-is
	environments: [
		{ browserName: "MicrosoftEdge", fixSessionCapabilities: false, name: "deliteful"},
		{ browserName: "internet explorer", version: "11", platform: "Windows 8.1",
			requireWindowFocus: "true", name: "deliteful"},
		{ browserName: "firefox", version: "67", platform: [ "Windows 10" ], name: "deliteful" },
		{ browserName: "chrome", version: "74", platform: [ "Windows 10" ], name: "deliteful" },

		// Safari hangs on SauceLabs, so commented out.
		//{ browserName: "safari", version: "11", name: "deliteful" },

		{ browserName: "iphone", platform: "OS X 10.10", version: "10.2", deviceName: "iPad Retina",
			name: "deliteful" },

		// TODO: According to https://wiki.saucelabs.com/display/DOCS/Platform+Configurator#/
		// iOS config should be declared like this:
		// { browserName: "Safari", platformName: "iOS", platformVersion: "12.2", deviceName: "iPad Simulator",
		//	name: "deliteful" },

		{ browserName: "android", platform: "Linux", version: "6.0",
			deviceName: "Android Emulator", deviceType: "tablet", name: "deliteful" }
	],

	// Maximum number of simultaneous integration tests that should be executed on the remote WebDriver service
	maxConcurrency: 5,

	// Whether or not to start Sauce Connect before running tests
	tunnel: "SauceLabsTunnel",

	// Maximum duration of a test, in milliseconds
	defaultTimeout: 300000, // 5 minutes

	// Maximum time to wait for something (pollUntil, etc...)
	WAIT_TIMEOUT: 30000, // 30 seconds

	// Interval between two polling requests, in milliseconds (for pollUntil)
	POLL_INTERVAL: 500, // 0.5 seconds

	basePath: "..",

	loaders: {
		"host-node": "requirejs",
		"host-browser": "../../requirejs/require.js"
	},

	// Non-functional test suite(s) to run in each browser
	suites: [ "deliteful/tests/unit/all" ],

	// Functional test suite(s) to run in each browser once non-functional tests are completed
	functionalSuites: [ "deliteful/tests/functional/all" ],

	// Disable instrumentation against SauceLabs.  We do it when running locally.
	excludeInstrumentation: true
});
