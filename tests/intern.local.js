// run grunt --help for help on how to run
define([
	"./intern"
], function (intern) {
	intern.tunnel = "NullTunnel";

	// Uncomment this line (and modify machine name) for testing against remote VM.
	// intern.proxyUrl = "http://mac.local:9000";

	intern.environments = [
		{
			browserName: "chrome",
			chromeOptions: {
				args: ["headless", "disable-gpu"]
			}
		}
	];

	intern.maxConcurrency = 1;

	// A regular expression matching URLs to files that should not be included in code coverage analysis
	intern.excludeInstrumentation =
		/*jshint -W101*/
		/^(requirejs.*|dcl|dojo|dstore|dpointer|decor|lie|delite\/|deliteful\/tests|.*themes|.*transitions|.*node_modules)/;

	return intern;
});
