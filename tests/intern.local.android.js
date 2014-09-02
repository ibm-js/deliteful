// run grunt --help for help on how to run
define([
	"./intern"
], function (intern) {

	// TODO: update this variable to use the IP address of your host
	var host = "192.168.0.21";

	intern.tunnel = "NullTunnel";
	intern.tunnelOptions = {
		hostname: "localhost",
		port: 4444
	};

	intern.environments = [
		{ browserName: "android", platformVersion: "19" }, // Android 4.4
		{ browserName: "android", platformVersion: "18" } // Android 4.3
	];

	intern.proxyUrl = "http://" + host + ":9000/";

	return intern;
});