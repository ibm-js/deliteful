// run grunt --help for help on how to run
define([
	"./intern.local"
], function (intern) {
	
	intern.loader = {
		baseUrl: typeof window !== "undefined" ? "../../.." : "..",
		config: {
			"ecma402/locales": "en-US",
			"requirejs-dplugins/has": {
				"bidi": true
			}
		}
	};
	intern.suites = [ "deliteful/tests/unit/bidi/all" ];
	intern.functionalSuites = [];

	return intern;
});
