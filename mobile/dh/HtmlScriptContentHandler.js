define([
	"dojo/_base/declare",
	"./HtmlContentHandler",
	"../_ExecScriptMixin"
], function(declare, HtmlContentHandler, _ExecScriptMixin){

	// module:
	//		dui/mobile/dh/HtmlScriptContentHandler

	return declare("dui.mobile.dh.HtmlScriptContentHandler", [HtmlContentHandler, _ExecScriptMixin], {
		// summary:
		//		An HTML content handler that has script execution capability.
	});
});
