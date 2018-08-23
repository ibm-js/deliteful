// run grunt --help for help on how to run
define([
	"./intern"
], function (intern) {
	intern.tunnel = "NullTunnel";

	// Uncomment this line (and modify machine name) for testing against remote VM.
	// intern.proxyUrl = "http://mac.local:9000";

	intern.environments = [
		{ browserName: "chrome" }
	];

	intern.maxConcurrency = 1;

	// A regular expression matching URLs to files that should not be included in code coverage analysis
	intern.excludeInstrumentation =
		/*jshint -W101*/
		/^(requirejs.*|dcl|dojo|dstore|dpointer|decor|jquery|lie|delite\/|deliteful\/tests|ecma402|.*themes|.*transitions|.*node_modules)/;

	return intern;
});
