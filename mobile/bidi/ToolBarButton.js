define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/dom-class"
], function(declare, lang, domClass){

	// module:
	//		dojox/mobile/ToolBarButton

	return declare(null, {
		buildRendering: function(){
			this.inherited(arguments);
			//dojox.mobile mirroring support
			if(!this.isLeftToRight() && this.arrow){
				var cRemove1 = (this.arrow === "left" ? "duiToolBarButtonLeftArrow" : "duiToolBarButtonRightArrow");
				var cRemove2 = (this.arrow === "left" ? "duiToolBarButtonHasLeftArrow" : "duiToolBarButtonHasRightArrow");
				var cAdd1 = (this.arrow === "left" ? "duiToolBarButtonRightArrow" : "duiToolBarButtonLeftArrow");
				var cAdd2 = (this.arrow === "left" ? "duiToolBarButtonHasRightArrow" : "duiToolBarButtonHasLeftArrow");
				domClass.remove(this.arrowNode, cRemove1);
				domClass.add(this.arrowNode, cAdd1);
				domClass.remove(this.domNode, cRemove2);
				domClass.add(this.domNode, cAdd2);
			}
		},
		_setLabelAttr: function(/*String*/text){
			// summary:
			//		Sets the button label text.
			this.inherited(arguments);
			// dojox.mobile mirroring support
			if(!this.isLeftToRight()){
				domClass.toggle(this.tableNode, "duiToolBarButtonTextRtl", text || this.arrow);
			}
		}
	});
});
