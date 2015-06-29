// run grunt --help for help on how to run
define([
	"./intern"
], function (intern) {
	intern.tunnel = "NullTunnel";
	intern.tunnelOptions = {
		hostname: "localhost",
		port: 4444
	};

	// Uncomment this line (and modify machine name) for testing against remote VM.
	// intern.proxyUrl = "http://mac.local:9000";

	intern.environments = [
		{ browserName: "firefox" },
		{ browserName: "safari" },
		{ browserName: "chrome" },
		{ browserName: "internet explorer", requireWindowFocus: "true" }
	];

	intern.maxConcurrency = 1;

	return intern;
});
