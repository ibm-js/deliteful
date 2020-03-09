// module:
//		deliteful/tests/boilerplate
// description:
//		A <script src="boilerplate.js"> on your test page will
//		load the loader (i.e. define the require() method)
//
//		In addition, by URL flags you can specify:
//			- locale=... to set the locale
//			- dir=rtl to set the page to RTL mode
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
if (dir) {
	document.documentElement.setAttribute("dir", dir);
}

// Find the <script src="boilerplate.js"> tag, to get test directory.
var scripts = document.getElementsByTagName("script"), script, testDir;
for (var i = 0; (script = scripts[i]); i++) {
	var src = script.getAttribute("src"),
		match = src && src.match(/(.*|^)boilerplate\.js/i);
	if (match) {
		// Sniff location of delite/tests directory relative to this test file.  testDir will be an empty string if
		// it's the same directory, or a string including a slash, ex: "../", if the test is in a subdirectory.
		testDir = match[1];

		break;
	}
}

// Add polyfills for IE.
if (/Trident/.test(navigator.userAgent)) {
	document.write("<script type='text/javascript' src='" + testDir + "ie-polyfills.js'></script>");
}

// Setup configuration options for the loader
/* global require:true */
require = {
	baseUrl: testDir + "../node_modules/",
	packages: [
		{ name: "deliteful", location: ".." }
	],
	locale: locale || "en-us"
};

// Load Requirejs.
document.write("<script type='text/javascript' src='" + testDir + "../node_modules/requirejs/require.js'></script>");