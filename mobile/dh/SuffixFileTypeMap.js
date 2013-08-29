define([
	"dojo/_base/lang"
], function(lang){

	// module:
	//		dui/mobile/dh/SuffixFileTypeMap

	var o = {
		// summary:
		//		A component that provides a map for determining content-type from
		//		the suffix of the URL.
	};
	lang.setObject("dui.mobile.dh.SuffixFileTypeMap", o);

	o.map = {
		"html": "html",
		"json": "json"
	};

	o.add = function(/*String*/ key, /*String*/ contentType){
		// summary:
		//		Adds a handler class for the given content type.
		this.map[key] = contentType;
	};

	o.getContentType = function(/*String*/ fileName){
		// summary:
		//		Returns the handler class for the given content type.		
		var fileType = (fileName || "").replace(/.*\./, "");
		return this.map[fileType];
	};

	return o;
});
