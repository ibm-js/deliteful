define(["dojo/has"], function(has){
	"use strict";

	var
		doc = document,
		head = doc.head || (doc.head = doc.getElementsByTagName('head')[0]);

	// Reverse feature test to infer if document.createElement("style") works on this platform.
	// Will be true except for IE6 - IE10.
	has.add("dom-create-style-element", !doc.createStyleSheet);

	function insertCss(/*String*/ css){
		if(has("dom-create-style-element")){
			// we can use standard <style> element creation
			styleSheet = doc.createElement("style");
			styleSheet.setAttribute("type", "text/css");
			styleSheet.appendChild(doc.createTextNode(css));
			head.insertBefore(styleSheet, head.firstChild);
			return styleSheet;
		}else{
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
		//		This plugin will load the specified CSS file, or alternately an AMD module containing CSS,
		//		and insert its content into the document.
		//
		//		Similar to dojo/text!, this plugin won't resolve until it has completed loading the specified CSS.
		//		
		//		This loader has the following limitations:
		//
		//			- The plugin will not wait for @import statements to complete before resolving.
		//	  		  Imported CSS files should not have @import statements, but rather
		//			  all CSS files needed should be listed in the widget's define([...], ...) dependency list.
		//
		//			- Loading plain CSS files won't work cross domain.  Instead you should load AMD modules containing CSS.
		//
		//		For a more full featured loader one can use:
		//
		//		- Xstyle's CSS loader (https://github.com/kriszyp/xstyle/blob/master/core/load-css.js)
		//		- CURL's (https://github.com/cujojs/curl/blob/master/src/curl/plugin/css.js)
		//		- requirejs-css-plugin (https://github.com/tyt2y3/requirejs-css-plugin)
		//		- requirecss (https://github.com/guybedford/require-css)

		load: function(path, require, onload, config, parse){
			// summary:
			//		Load and install the specified CSS file, then call onload().
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
			require([/\.css$/.test(path) ? "dojo/text!" + path : path], function(css){
				// Adjust relative image paths to be relative to document location rather than to the CSS file.
				// This is necessary since we are inserting the CSS as <style> nodes rather than as <link> nodes.
				var pathToCssFile = path.replace(/[^/]+$/, ""),
					adjustedCss = css.replace(/(url\(")([^/])/g, "$1" + pathToCssFile + "$2");

				// Insert CSS into document and call onload
				var node = insertCss(adjustedCss);
				onload(node);
			})
		}
	};
});