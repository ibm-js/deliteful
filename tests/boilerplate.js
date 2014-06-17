// module:
//		delite/tests/boilerplate
// description:
//		A <script src="boilerplate.js"> on your test page will
//		load the loader (i.e. define the require() method)
//
//		In addition, by URL flags you can specify:
//			- locale=... to set the locale
//			- dir=rtl to turn on the has("bidi") flag and set the page to RTL mode
//
//		You should NOT be using this in a production environment.  Rather, load
//		the AMD loader directly, for example:
//
//		<script src="requirejs/require.js">


// Parse the URL, get parameters
var dir = "",
	locale;
if (window.location.href.indexOf("?") > -1) {
	var str = window.location.href.substr(window.location.href.indexOf("?") + 1).split(/#/);
	var ary = str[0].split(/&/);
	for (var i = 0; i < ary.length; i++) {
		var split = ary[i].split("="),
			key = split[0],
			value = (split[1] || "").replace(/[^\w]/g, "");	// replace() to prevent XSS attack
		switch (key) {
		case "locale":
			// locale string | null
			locale = value;
			break;
		case "dir":
			// rtl | null
			dir = value;
			break;
		}
	}
}

// Find the <script src="boilerplate.js"> tag, to get test directory and data-config argument
var scripts = document.getElementsByTagName("script"), script, overrides = {}, testDir;
for (i = 0; (script = scripts[i]); i++) {
	var src = script.getAttribute("src"),
		match = src && src.match(/(.*|^)boilerplate\.js/i);
	if (match) {
		// Sniff location of delite/tests directory relative to this test file.  testDir will be an empty string if
		// it's the same directory, or a string including a slash, ex: "../", if the test is in a subdirectory.
		testDir = match[1];

		// Sniff configuration on attribute in script element.
		// Allows syntax like <script src="boilerplate.js data-dojo-config="parseOnLoad: true">, where the settings
		// specified override the default settings.
		var attr = script.getAttribute("data-config");
		if (attr) {
			/* jshint evil:true */
			overrides = eval("({ " + attr + " })");
		}
		break;
	}
}

// Setup configuration options for the loader
/* global require:true */
require = {
	baseUrl: testDir + "../../",
	locale: locale || "en-us",
	config: {
		"requirejs-dplugins/has": {
			"bidi": dir === "rtl"
		}
	}
};
for (var key in overrides) {
	require[key] = overrides[key];
}

// Output the boilerplate text to load the loader.
document.write("<script type='text/javascript' src='" + testDir + "../../requirejs/require.js'></script>");

// On IE9 the following inlined script will run before dojo has finished loading, leading to an error because require()
// isn't defined yet.  Workaround it by putting the code in a separate file.
document.write("<script type='text/javascript' src='" + testDir + "boilerplateOnload.js'></script>");

/* global boilerplateOnLoad:true */
boilerplateOnLoad = function () {
	// This function is the first registered domReady() callback.

	// BIDI
	if (dir === "rtl") {
		// set dir=rtl on <html> node
		document.body.parentNode.setAttribute("dir", "rtl");

		// pretend all the labels are in an RTL language, because
		// that affects how they lay out relative to inline form widgets
		var labels = document.body.querySelectorAll("label");
		for (var i = 0; i < labels.length; i++) {
			labels[i].setAttribute("dir", "rtl");
		}
	}
};
