define([
	"dojo/_base/declare",
	"./common"
], function(declare, common){

	// module:
	//		dui/mobile/bidi/Tooltip

	return declare(null, {
		// summary:
		//		Support for control over text direction for mobile Tooltip widget, using Unicode Control Characters to control text direction.
		// description:
		//		Implementation for text direction support for Tooltip's text containing embedded nodes.
		//		Complicated embedded nodes (like tables) are not supported.
		//		This class should not be used directly.
		//		Mobile Tooltip widget loads this module when user sets "has: {'dojo-bidi': true }" in data-dojo-config.
		postCreate: function(){
			this.inherited(arguments);
			if(this.textDir){
				this._applyTextDirToTextElements();
		    }		    
		},
		buildRendering: function(){
		    this.inherited(arguments);
			//dui.mobile mirroring support
			if(!this.isLeftToRight()){
				this.arrow.style.left = "0px";
			}
		},

		_setTextDirAttr: function(textDir){
			if(textDir && this.textDir !== textDir){
				this.textDir = textDir;
				this._applyTextDirToTextElements();
			}
		},

		_applyTextDirToTextElements: function(){
			// summary:
			//		Wrap relevant child text nodes in directional UCC marks
			this.domNode.childNodes.forEach(function(node){
				var currentNode = (node.nodeType === 1 && node.childNodes.length === 1) ? node.firstChild : node;
				if(currentNode.nodeType === 3 && currentNode.nodeValue){
					if(currentNode.nodeValue.search(/[.\S]/) != -1){
						currentNode.nodeValue = common.removeUCCFromText(currentNode.nodeValue);
						currentNode.nodeValue = common.enforceTextDirWithUcc(currentNode.nodeValue, this.textDir);
					}
				}
			}, this);
		}
	});
});

