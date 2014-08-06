// run grunt --help for help on how to run
// Learn more about configuring this file at <https://github.com/theintern/intern/wiki/Configuring-Intern>.
// These default settings work OK for most people. The options that *must* be changed below are the
// packages, suites, excludeInstrumentation, and (if you want functional tests) functionalSuites.
define({
	// The port on which the instrumenting proxy will listen
	proxyPort: 9000,

	proxyUrl: "http://127.0.0.1:9000/",

	// Browsers to run integration testing against. Note that version numbers must be strings if used with Sauce
	// OnDemand. Options that will be permutated are browserName, version, platform, and platformVersion; any other
	// capabilities options specified for an environment will be copied as-is
	environments: [
		// It seems that specifying version="" or leaving version unspecified
		// does not default to the latest version of the browser.

		// Desktop.
		// Not running on IE9 since Widget-attr test depends on domClass methods only available in IE10_
		{ browserName: "internet explorer", version: "11", platform: "Windows 8.1", requireWindowFocus: "true",
			name : "deliteful"},
		{ browserName: "internet explorer", version: "10", platform: "Windows 8", requireWindowFocus: "true",
			name : "deliteful"},
		// { browserName: "internet explorer", version: "9", platform: "Windows 7" },
		{ browserName: "firefox", version: "25", platform: [ /*"OS X 10.6", "Linux", */ "Windows 7" ],
			name : "deliteful"},
		{ browserName: "chrome", version: "32", platform: [ /*"OS X 10.6", "Linux", */ "Windows 7" ],
			name : "deliteful"},
		{ browserName: "safari", version: "7", platform: [ "OS X 10.9" ], name : "deliteful"},

		// Mobile
		{ browserName: "iphone 7.1 simulator", platform: "OS X 10.9", version: "7.1", deviceName: "iPhone",
			app: "safari", device: "iPhone Simulator", name: "deliteful" }
		
		/* For now disabled to avoid webdriver/sauce issues
		{ browserName: "ipad 7.1 simulator", platform: "OS X 10.9", version: "7.1", deviceName: "iPad",
			app: "safari", device: "iPad Simulator", name: "deliteful" },
		{ browserName: "iphone 7.0 simulator", platform: "OS X 10.9", version: "7.0", deviceName: "iPhone",
			app: "safari", device: "iPhone Simulator", name: "deliteful" },
		{ browserName: "ipad 7.0 simulator", platform: "OS X 10.9", version: "7.0", deviceName: "iPad",
			app: "safari", device: "iPad Simulator", name: "deliteful" }
		*/
//		{ browserName: "", platform: "OS X 10.8", version: "6", deviceName: "iPhone",
//			app: "safari", device: "iPhone Simulator", name: "deliteful" },
//		{ browserName: "", platform: "OS X 10.8", version: "6", deviceName: "iPad",
//			app: "safari", device: "iPad Simulator", name: "deliteful" },
//		{ browserName: "android", platform: "Linux", version: "4.1", name : "deliteful"},
//		{ browserName: "android", platform: "Linux", "device-type": "tablet", version: "4.1", name : "deliteful"},
//		{ browserName: "android", platform: "Linux", version: "4.1", name : "deliteful"},
//		{ browserName: "android", platform: "Linux", "device-type": "tablet", version: "4.0", name : "deliteful"},
//		{ browserName: "android", platform: "Linux", version: "4.0", name : "deliteful"},
	],

	// Maximum number of simultaneous integration tests that should be executed on the remote WebDriver service
	maxConcurrency: 3,

	// Whether or not to start Sauce Connect before running tests
	useSauceConnect: true,

	// Connection information for the remote WebDriver service. If using Sauce Labs, keep your username and password
	// in the SAUCE_USERNAME and SAUCE_ACCESS_KEY environment variables unless you are sure you will NEVER be
	// publishing this configuration file somewhere
	webdriver: {
		host: "localhost",
		port: 4444
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
	excludeInstrumentation:
		/^(requirejs.*|dcl|dojo|dstore|dpointer|decor|delite\/|deliteful\/tests|ecma402|.*themes|.*transitions)/
});
