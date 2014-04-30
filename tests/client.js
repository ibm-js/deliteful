// Test file to run infrastructure tests from a browser
// Run using http://localhost/deliteful/node_modules/intern/client.html?config=tests/infrastructure/client

define({
	loader: {
		// location of all the packages, relative to client.html
		baseUrl: "../../.."
	},
	useLoader: {
		"host-node": "requirejs",
		"host-browser": "../../../requirejs/require.js"
	},

	// Non-functional test suites
	suites: [ "deliteful/tests/unit/all" ]
});
