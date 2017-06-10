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
		{ browserName: "internet explorer", version: "11", platform: "Windows 7", requireWindowFocus: "true",
			name : "deliteful"},
		{ browserName: "firefox", version: "53", platform: [ /*"OS X 10.6", "Linux", */ "Windows 7" ],
			name : "deliteful"},
		{ browserName: "chrome", version: "51", platform: [ /*"OS X 10.6", "Linux", */ "Windows 7" ],
			name : "deliteful"}

		// Disable Safari and iOS tests because they hang on SauceLabs.
		// See https://github.com/theintern/intern/issues/752.
		// As the comment says there, could try switching to BrowserStack
		//{ browserName: "safari", version: "9", name : "deliteful"}
		//{ browserName: "iphone", platform: "OS X 10.10", version: "9.3", deviceName: "iPad Retina",
		//		name: "deliteful" },
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

	// A regular expression matching URLs to files that should not be included in code coverage analysis
	excludeInstrumentation:
		/*jshint -W101*/
		/^(requirejs.*|dcl|dojo|dstore|dpointer|decor|jquery|lie|delite\/|deliteful\/tests|ecma402|.*themes|.*transitions|.*node_modules)/
});
