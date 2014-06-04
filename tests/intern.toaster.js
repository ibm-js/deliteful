// run grunt --help for help on how to run
define([
	"./intern"
], function (intern) {
	intern.useSauceConnect = false;
	intern.webdriver = {
		host: "localhost",
		port: 4444
	};

	intern.environments = [
		//{ browserName: "firefox" },
		//{ browserName: "safari" },
		{ browserName: "chrome" }
		//{ browserName: "internet explorer", requireWindowFocus: "true" }
	];

	// Non-functional test suite(s) to run in each browser
	intern.suites = [ 
		//"deliteful/tests/unit/Toaster",
		//"deliteful/tests/unit/ToasterMessage",
		//"deliteful/tests/unit/ToasterMessage-insert-show-hide-remove.js",
	];

	// Functional test suite(s) to run in each browser once non-functional tests are completed
	intern.functionalSuites = [ 
			"deliteful/tests/functional/Toaster"
		];

	return intern;
});
