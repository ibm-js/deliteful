// run grunt --help for help on how to run
define([
	"./intern"
], function (intern) {

	// TODO: update this variable to use the IP address of your host
	var host = "192.168.0.21";

	intern.tunnel = "NullTunnel";
	intern.tunnelOptions = {
		hostname: "localhost",
		port: 4723
	};

	intern.environments = [
		{ browserName: "safari", platformName: "iOS", platformVersion: "7.1", deviceName: "iPhone Retina (4-inch)" },
		{ browserName: "safari", platformName: "iOS", platformVersion: "7.1", deviceName: "iPad Retina (64-bit)" },
		{ browserName: "safari", platformName: "iOS", platformVersion: "7.0", deviceName: "iPhone Retina (4-inch)" },
		{ browserName: "safari", platformName: "iOS", platformVersion: "7.0", deviceName: "iPad Retina (64-bit)" }//,
//		{ browserName: "safari", platformName: "iOS", platformVersion: "6.1", deviceName: "iPhone Retina (4-inch)" },
//		{ browserName: "safari", platformName: "iOS", platformVersion: "6.1", deviceName: "iPad Retina (64-bit)" }
	];

	intern.maxConcurrency = 1;

	intern.proxyUrl = "http://" + host + ":9000/";

	return intern;
});