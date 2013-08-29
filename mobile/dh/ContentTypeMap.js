define([
	"dojo/_base/lang"
], function(lang){

	// module:
	//		dui/mobile/dh/ContentTypeMap

	var o = {
		// summary:
		//		A component that provides a map for determining the content handler
		//		class from a content-type.
	};
	lang.setObject("dui.mobile.dh.ContentTypeMap", o);

	o.map = {
		"html": "dui/mobile/dh/HtmlContentHandler",
		"json": "dui/mobile/dh/JsonContentHandler"
	};

	o.add = function(/*String*/ contentType, /*String*/ handlerClass){
		// summary:
		//		Adds a handler class for the given content type.
		this.map[contentType] = handlerClass;
	};

	o.getHandlerClass = function(/*String*/ contentType){
		// summary:
		//		Returns the handler class for the given content type.
		return this.map[contentType];
	};

	return o;
});
