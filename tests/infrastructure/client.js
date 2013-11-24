// Test file to run infrastructure tests from a browser
// Run using http://localhost/dui/node_modules/intern/client.html?config=tests/infrastructure/client

define({
	loader: {
		// location of all the packages, relative to client.html
		baseUrl: "../../.."
	},

	// Non-functional test suites
	suites: [ "dui/tests/infrastructure/unit" ]
});
