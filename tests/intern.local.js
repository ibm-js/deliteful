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
		{ browserName: "firefox" },
		{ browserName: "safari" },
		{ browserName: "chrome" },
		{ browserName: "internet explorer" }
	];

	return intern;
});