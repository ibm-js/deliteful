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

	return intern;
});
