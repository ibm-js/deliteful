define([
	"dojo/_base/declare",
	"./RoundRectCategory"
], function(declare, RoundRectCategory){

	// module:
	//		dui/mobile/EdgeToEdgeCategory

	return declare("dui.mobile.EdgeToEdgeCategory", RoundRectCategory, {
		// summary:
		//		A category header for an edge-to-edge list.
		buildRendering: function(){
			this.inherited(arguments);
			this.domNode.className = "duiEdgeToEdgeCategory";

			if(this.type && this.type == "long"){
				this.domNode.className += " duiEdgeToEdgeCategoryLong";
			}
		}
	});
});
