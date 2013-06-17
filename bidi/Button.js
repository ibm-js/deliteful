define(["dojo/_base/declare"], function(declare){

	// module:
	//		dui/bidi/Button

	return declare(null, {
		// summary:
		//		Support for control over text direction for Button widget, using Unicode Control Characters to control text direction.
		// description:
		//		Implementation for text direction support for label and tooltip.
		//		This class should not be used directly.
		//		Button widget loads this module when user sets "has: {'dojo-bidi': true }" in data-dojo-config.

		refreshRendering: function(){
			this.inherited(arguments);

			this.containerNode.textContent = this.wrapWithUcc(this.containerNode.textContent);
			if(this.titleNode.title){
				this.titleNode.title = this.wrapWithUcc(this.titleNode.title);
			}
		}
	});
});
