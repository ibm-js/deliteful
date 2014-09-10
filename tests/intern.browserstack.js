// Intern configuration file to run deliteful tests against BrowserStack.
//
// Note: you must set BROWSERSTACK_USERNAME and BROWSERSTACK_ACCESS_KEY environment variables, for example:
//
//		$ export BROWSERSTACK_USERNAME=jsmith
//		$ export BROWSERSTACK_ACCESS_KEY=abcdef123456890
//
// See https://www.browserstack.com/automate to get values for those variables

// run grunt --help for help on how to run
// Learn more about configuring this file at <https://github.com/theintern/intern/wiki/Configuring-Intern>.
// These default settings work OK for most people. The options that *must* be changed below are the
// packages, suites, excludeInstrumentation, and (if you want functional tests) functionalSuites.

define({
	// Browsers to run integration testing against. Note that version numbers must be strings if used with Sauce
	// OnDemand. Options that will be permutated are browserName, version, platform, and platformVersion; any other
	// capabilities options specified for an environment will be copied as-is
	environments: [
		// It seems that specifying version="" or leaving version unspecified
		// does not default to the latest version of the browser.

		// Desktop.

		// IE doesn't work, see
		// http://stackoverflow.com/questions/25481703/exceptions-trying-to-run-intern-test-against-browserstack-ie
		//{ browserName: "internet explorer", version: "11", platform: "Win8", requireWindowFocus: "true",
		//	name : "deliteful"},
		//{ browserName: "internet explorer", version: "10", platform: "Windows", requireWindowFocus: "true",
		//	name : "deliteful"},
		// { browserName: "internet explorer", version: "9", platform: "Windows" },

		{ browserName: "firefox", version: "31", platform: ["Windows" ], name : "deliteful"}

		// Chrome doesn't work either, see
		/* jshint maxlen: 125*/
		// http://stackoverflow.com/questions/25482084/intern-2-against-chrome-browserstac-hangs-fetching-page-once-a-minute
		// { browserName: "chrome", version: "35", platform: [ "Windows" ],
		//	name : "deliteful"},
		//{ browserName: "safari", version: "7", platform: [ "mac" ], name : "deliteful"},

		// Not sure how to test mobile yet
		// Mobile
		//{ browserName: "iphone 7.1 simulator", platform: "mac", version: "7.1", deviceName: "iPhone",
//			app: "safari", device: "iPhone Simulator", name: "deliteful" }

//		{ browserName: "android", platform: "Linux", version: "4.1", name : "deliteful"},
	],

	tunnel: "BrowserStackTunnel",
	tunnelOptions: {
		verbose: true,
		port: "80"
	},

	loader: {
		baseUrl: typeof window !== "undefined" ? "../../.." : "..",
		config: {
			"ecma402/locales": "en-US"
		}
	},

	useLoader: {
		"host-node": "requirejs",
		"host-browser": "../../../requirejs/require.js"
	},

	// Non-functional test suite(s) to run in each browser
	suites: [ "deliteful/tests/unit/all" ],

	// Functional test suite(s) to run in each browser once non-functional tests are completed
	functionalSuites: [ "deliteful/tests/functional/all" ],

	// A regular expression matching URLs to files that should not be included in code coverage analysis
	/* jshint maxlen: 128*/
	excludeInstrumentation:
		/^(requirejs.*|dcl|dojo|dstore|dpointer|decor|delite\/|deliteful\/tests|ecma402|.*themes|.*transitions|.*node_modules)/
});
