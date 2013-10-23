// module:
//		dui/tests/boilerplate
// description:
//		A <script src="boilerplate.js"> on your test page will:
//
//		- load claro or a specified theme
//		- load the loader (i.e. define the require() method)
//
//		By URL flags you can specify the theme,
//		and optionally enable RTL (right to left) mode, and/or dj_a11y (high-
//		contrast/image off emulation) ... probably not a genuine test for a11y.
//
//		You should NOT be using this in a production environment.  Rather, load
//		the AMD loader directly, for example:
//
//		<script src="requirejs/require.js">


// Parse the URL, get parameters
var dir = "",
	testMode = null,
	locale;
if (window.location.href.indexOf("?") > -1) {
	var str = window.location.href.substr(window.location.href.indexOf("?") + 1).split(/#/);
	var ary = str[0].split(/&/);
	for (var i = 0; i < ary.length; i++) {
		var split = ary[i].split("="),
			key = split[0],
			value = (split[1] || '').replace(/[^\w]/g, "");	// replace() to prevent XSS attack
		switch (key) {
		case "locale":
			// locale string | null
			locale = value;
			break;
		case "dir":
			// rtl | null
			dir = value;
			break;
		case "a11y":
			if (value) {
				testMode = "dj_a11y";
			}
			break;
		}
	}
}

// Find the <script src="boilerplate.js"> tag, to get test directory and data-dojo-config argument
var scripts = document.getElementsByTagName("script"), script, overrides = {};
for (i = 0; script = scripts[i]; i++) {
	var src = script.getAttribute("src"),
		match = src && src.match(/(.*|^)boilerplate\.js/i);
	if (match) {
		// Sniff location of dui/tests directory relative to this test file.   testDir will be an empty string if it's
		// the same directory, or a string including a slash, ex: "../", if the test is in a subdirectory.
		testDir = match[1];

		// Sniff configuration on attribute in script element.
		// Allows syntax like <script src="boilerplate.js data-dojo-config="parseOnLoad: true">, where the settings
		// specified override the default settings.
		var attr = script.getAttribute("data-dojo-config");
		if (attr) {
			overrides = eval("({ " + attr + " })");
		}
		break;
	}
}

// Setup configuration options for the loader
require = {
	baseUrl: testDir + "../../",
	packages: [
		{name: 'dojo', location: 'dojo'},
		{name: 'dui', location: 'dui'},
		{name: 'dojox', location: 'dojox'},
		{name: 'doh', location: 'util/doh'}
	],
	locale: locale || "en-us",
	config: {
		'dojo/has': {
			'dojo-bidi': dir == "rtl"
		}
	}
};
for (var key in overrides) {
	require[key] = overrides[key];
}

// Output the boilerplate text to load the loader.
document.write('<script type="text/javascript" src="' + testDir + '../../requirejs/require.js"></script>');

// On IE9 the following inlined script will run before dojo has finished loading, leading to an error because require()
// isn't defined yet.  Workaround it by putting the code in a separate file.
//document.write('<script type="text/javascript">require(["dojo/domReady!"], boilerplateOnLoad);</script>');
document.write('<script type="text/javascript" src="' + testDir + 'boilerplateOnload.js"></script>');

function boilerplateOnLoad() {
	// This function is the first registered domReady() callback.

	// a11y (flag for faux high-contrast testing)
	if (testMode) {
		document.body.className += " " + testMode;
	}

	// BIDI
	if (dir == "rtl") {
		// set dir=rtl on <html> node
		document.body.parentNode.setAttribute("dir", "rtl");

		require(["dojo/query!css2", "dojo/NodeList-dom"], function (query) {
			// pretend all the labels are in an RTL language, because
			// that affects how they lay out relative to inline form widgets
			query("label").attr("dir", "rtl");
		});
	}

	// parseOnLoad: true requires that the parser itself be loaded.
	if (require.parseOnLoad) {
		require(["dojo/parser"]);
	}
}
