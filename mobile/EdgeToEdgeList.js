define([
	"dojo/_base/declare",
	"./RoundRectList"
], function(declare, RoundRectList){

	// module:
	//		dui/mobile/EdgeToEdgeCategory

	return declare("dui.mobile.EdgeToEdgeList", RoundRectList, {
		// summary:
		//		An edge-to-edge layout list.
		// description:
		//		EdgeToEdgeList is an edge-to-edge layout list, which displays
		//		all items in equally-sized rows. Each item must be a
		//		dui/mobile/ListItem.
		
		// filterBoxClass: String
		//		The name of the CSS class added to the DOM node inside which is placed the 
		//		dui/mobile/SearchBox created when mixing dui/mobile/FilteredListMixin.
		//		The default value is "duiFilteredEdgeToEdgeListSearchBox". 
		filterBoxClass: "duiFilteredEdgeToEdgeListSearchBox",

		buildRendering: function(){
			this.inherited(arguments);
			this.domNode.className = "duiEdgeToEdgeList";
		}
	});
});
