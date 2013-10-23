define(["dojo/dom-construct", "dojo/has"], function (domConstruct, has) {
	"use strict";

	var
		doc = document,
		head = doc.head || (doc.head = doc.getElementsByTagName('head')[0]),
		lastInsertedStylesheet,
		sheets = {};		// map of which stylesheets have already been inserted

	// Reverse feature test to infer if document.createElement("style") works on this platform.
	// Will be true except for IE6 - IE10.
	has.add("dom-create-style-element", !doc.createStyleSheet);

	function insertCss(/*String*/ css) {
		// summary:
		//		Inserts the specified CSS into the document, after any CSS previously inserted
		//		by this function, but before any user-defined CSS.  This lets the app's stylesheets
		//		override the widget's default styling.

		// Creates a new stylesheet on each call.  Could alternately just add CSS to the old stylesheet.
		// Maybe the current implementation is faster.
		if (has("dom-create-style-element")) {
			// we can use standard <style> element creation
			styleSheet = doc.createElement("style");
			styleSheet.setAttribute("type", "text/css");
			styleSheet.appendChild(doc.createTextNode(css));
			domConstruct.place(styleSheet, lastInsertedStylesheet || head, lastInsertedStylesheet ? "after" : "first");
			lastInsertedStylesheet = styleSheet;
			return styleSheet;
		} else {
			// IE6 - 10
			var styleSheet = doc.createStyleSheet();
			styleSheet.cssText = css;
			return styleSheet.owningElement;
		}
	}

	return {
		// summary:
		//		CSS loading plugin for the DUI widgets.
		//
		//		This plugin will load the specified CSS files, or alternately AMD modules containing CSS,
		//		and insert their content into the document in the specified order.
		//
		//		The CSS files or modules are specified as a comma separated list, for example
		//		dui/css!../foo.css,../bar.css or for modules, dui/css!../foo,../bar.
		//
		//		Similar to dojo/text!, this plugin won't resolve until it has completed loading the specified CSS.
		//		
		//		This loader has the following limitations:
		//
		//			- The plugin will not wait for @import statements to complete before resolving.
		//	  		  Imported CSS files should not have @import statements, but rather
		//			  all CSS files needed should be listed in the widget's define([...], ...) dependency list.
		//
		//			- Loading plain CSS files won't work cross domain, unless you set Access-Control-Allow-Origin
		//			  in the HTTP response header.  Instead you should load AMD modules containing CSS.
		//
		//		For a more full featured loader one can use:
		//
		//		- [Xstyle's CSS loader](https://github.com/kriszyp/xstyle/blob/master/core/load-css.js)
		//		- [CURL's](https://github.com/cujojs/curl/blob/master/src/curl/plugin/css.js)
		//		- [requirejs-css-plugin](https://github.com/tyt2y3/requirejs-css-plugin)
		//		- [requirecss](https://github.com/guybedford/require-css)

		load: function (mids, require, onload) {
			// summary:
			//		Load and install the specified CSS files, in specified order, and then call onload().
			// path: String
			//		Absolute path to the resource.
			// require: Function
			//		AMD's require() method
			// onload: Function
			//		Callback function which will be called, when the loading finishes
			//		and the stylesheet has been inserted.

			// Use dojo/text! to load the CSS data rather than <link> tags because:
			//		1. In a build, the CSS data will already be inlined into the JS file.  Using <link> tags would
			//		   cause needless network requests.
			//		2. Avoid browser branching/hacks.  Many browsers have issues detecting
			//		   when CSS has finished loading and require tricks to detect it.

			mids = mids.split(/, */);

			var dependencies = mids.map(function (path) {
				return /\.css$/.test(path) ? "dojo/text!" + path : path;
			});

			require(dependencies, function () {
				// We loaded all the requested CSS files, but some may have already been inserted into the document,
				// possibly in between when the require() call started and now.  Insert the others CSS files now.
				var cssTexts = arguments;
				mids.forEach(function (mid, idx) {
					if (!(mid in sheets)) {
						// Adjust relative image paths to be relative to document location rather than to the CSS file.
						// This is necessary since we are inserting the CSS as <style> nodes rather than as <link> nodes.
						var css = cssTexts[idx],
							pathToCssFile = require.toUrl(mid).replace(/[^/]+$/, ""),
							adjustedCss = css.replace(/(url\(")([^/])/g, "$1" + pathToCssFile + "$2");

						// Insert CSS into document
						sheets[mid] = insertCss(adjustedCss);
					}
				});
				onload(mids);
			});
		}
	};
});