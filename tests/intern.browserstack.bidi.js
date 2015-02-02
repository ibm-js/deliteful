// run grunt --help for help on how to run
define([
	"./intern.browserstack"
], function (intern) {

	intern.loader.config["requirejs-dplugins/has"] = {
		"bidi": true
	};
	intern.suites = [ "deliteful/tests/unit/bidi/all" ];
	intern.functionalSuites = [];

	return intern;
});
