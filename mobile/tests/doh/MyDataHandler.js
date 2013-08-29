define([
	"dojo/_base/declare",
	"dui/mobile/dh/DataHandler"
], function(declare, DataHandler){

	// module:
	//		dui/mobile/tests/doh/MyDataHandler
	// summary:

	return declare("dui.mobile.tsets.doh.DataHandler", DataHandler, {

		constructor: function(){
			console.log("This is MyDataHandler");
			window._MyDataHandlerFlag = true;
			this.inherited(arguments);
		}
	});
});