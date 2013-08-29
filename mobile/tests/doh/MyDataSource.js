define([
	"dojo/_base/declare",
	"dui/mobile/dh/UrlDataSource"
], function(declare, UrlDataSource){

	return declare("dui.mobile.tests.doh.MyDataSource", UrlDataSource, {
		constructor: function(){
			console.log("This is MyDataSource");
			window._MyDataSourceFlag = true;
			this.inherited(arguments);
		}
	});
});
