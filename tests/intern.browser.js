// Test file to run infrastructure tests from a browser
// Run using http://localhost/deliteful/node_modules/intern/client.html?config=tests/intern.browser

define([
	"./intern"
], function (intern) {

	intern.loader = {
		baseUrl: "../../.."
	};

	return intern;
});
