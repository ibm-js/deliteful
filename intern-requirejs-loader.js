// From https://stackoverflow.com/questions/54925478/how-do-i-configure-intern-4-to-use-requirejs/54927704#54927704
/* globals Promise, requirejs */
intern.registerLoader(function (options) {
	function initLoader (requirejs) {
		// Configure requireJS -- use options passed in through the intern.json
		// config, and add anything else.
		requirejs.config(options);

		// This is the function Intern will actually call to load modules.
		return function (modules) {
			return new Promise(function (resolve, reject) {
				requirejs(modules, resolve, reject);
			});
		};
	}

	if (typeof window !== "undefined") {
		return intern.loadScript("deliteful/node_modules/requirejs/require.js").then(function () {
			return initLoader(requirejs);
		});
	} else {
		return initLoader(require("requirejs"));
	}
});
