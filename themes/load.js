define([
	"require",
	"dojo/has",
	"dojo/_base/config",
	"../css"		// listed here for benefit of builder, so dui/css is included into the layer
], function (req, has, config) {

	"use strict";

	var themeMap = config.themeMap || [
		// summary:
		//		A map of user-agents to theme files.
		// description:
		//		The first array element is a regexp pattern that matches the
		//		userAgent string.
		//
		//		The second array element is a theme folder widget.
		//
		//		The matching is performed in the array order, and stops after the
		//		first match.

		// Note that the windows theme is never used unless the app explicitly requests it.
		// That's so websites on desktop machines look the same regardless of what browser is used.

		[/Holodark|Android/, "holodark"],
		[/BlackBerry|BB10/, "blackberry"],
		[/iPhone|iPad/, "ios"],
		[/.*/, "bootstrap"]			// chrome, firefox, IE
	];

	// Get the theme
	var theme = config.theme || location.search.match(/theme=(\w+)/) ? RegExp.$1 : null;
	if (!theme) {
		var ua = config.userAgent || (location.search.match(/ua=(\w+)/) ? RegExp.$1 : navigator.userAgent);
		for (var i = 0; i < themeMap.length; i++) {
			if (themeMap[i][0].test(ua)) {
				theme = themeMap[i][1];
				break;
			}
		}
	}

	function getPaths(/*String*/ widget, /*String[]*/ ary) {
		// summary:
		//		Given a widget, add the paths of the CSS files that need to be loaded for that widget into ary.
		//		The files to be loaded will vary depending on the theme.

		var base = widget.replace(/\.css$/, ""),
			suffix = /\.css$/.test(widget) ? ".css" : "",
			path = "./" + theme + "/" + base;

		ary.push(path + suffix);
		if (has("dojo-bidi")) {
			ary.push(path + "_rtl" + suffix);
		}
	}

	return {
		// summary:
		//		CSS loading plugin for the widgets with themes in this directory.
		//		Loads the CSS file(s) for the specified widget for the current theme.
		//
		//		For example, on an iPhone, load!common,Button will load (in the following order):
		//
		//			- dui/themes/ios/common.css
		//			- dui/themes/ios/common_rtl.css
		//			- dui/themes/ios/Button.css
		//			- dui/themes/ios/Button_rtl.css.
		//
		//		You can also pass an additional URL parameter string
		//		theme={theme widget} to force a specific theme through the browser
		//		URL input. The available theme ids are bootstrap, holodark (theme introduced in Android 3.0),
		//		blackberry, custom, and windows (from Windows 8). The theme names are case-sensitive. If the given
		//		widget does not match, the bootstrap theme is used.
		//
		//	|	http://your.server.com/yourapp.html // automatic detection
		//	|	http://your.server.com/yourapp.html?theme=android // forces Android theme
		//	|	http://your.server.com/yourapp.html?theme=holodark // forces Holodark theme
		//	|	http://your.server.com/yourapp.html?theme=blackberry // forces Blackberry theme
		//	|	http://your.server.com/yourapp.html?theme=custom // forces Custom theme
		//	|	http://your.server.com/yourapp.html?theme=ios // forces iPhone theme
		//
		//		You can also specify a particular user agent through the ua=... URL parameter.

		load: function (widgets, require, onload) {
			// summary:
			//		Load and install the specified CSS files for the given widget, then call onload().
			// widget: String
			//		Name of the widget.
			// require: Function
			//		AMD's require() method
			// onload: Function
			//		Callback function which will be called when the loading finishes
			//		and the stylesheet has been inserted.


			// Convert list of widgets (ex: common,Button) into arguments to CSS plugin
			// ex: ios/common, ios/common_rtl, ios/Button, ios/Button_rtl
			var paths = [];
			widgets.split(/, */).forEach(function (widget) {
				getPaths(widget, paths);
			});

			// Make single call to css! plugin to load resources in order specified
			req([ "../css!" + paths.join(",") ], function () {
				onload(arguments);
			});
		}
	};
});
