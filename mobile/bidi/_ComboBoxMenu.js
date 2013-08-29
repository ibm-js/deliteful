define([
	"dojo/_base/declare",
	"dojo/dom-construct",
	"dojo/dom-class",
	"dojo/dom-style"
],
	function(declare, domConstruct, domClass, domStyle){
	// module:
	//		dui/mobile/bidi/_ComboBoxMenu

	return declare(null, {

		buildRendering: function(){
			this.inherited(arguments);
			// dui.mobile mirroring support
			if(!this.isLeftToRight()){
				this.containerNode.style.left = "auto";
				domStyle.set(this.containerNode, { position:"absolute", top:0, right:0 });
				domClass.remove(this.previousButton, "duiComboBoxMenuItem");
				domClass.add(this.previousButton, "duiComboBoxMenuItemRtl");
				domClass.remove(this.nextButton, "duiComboBoxMenuItem");
				domClass.add(this.nextButton, "duiComboBoxMenuItemRtl");
			}
		}
		
	});
});
