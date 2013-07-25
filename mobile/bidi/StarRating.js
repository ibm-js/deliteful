define([
	"dojo/_base/declare",
	"dojo/has",
	"dojo/keys",
	"dojo/dom-construct"
], function(declare, has, keys, domConstruct){

	// module:
	//		dojox/mobile/bidi/StarRating

	return declare(null, {
		// summary:
		//		Bidi support for mobile StarRating widget.
		// description:
		//		Implementation for RTL and LTR direction support.
		//		This class should not be used directly.
		//		Mobile StarRating widget loads this module when user sets "has: {'dojo-bidi': true }" in data-dojo-config.

		startup: function(){
			this.inherited(arguments);
			if(!this.isLeftToRight()){
				this._incrementKeyCodes = [keys.LEFT_ARROW, keys.UP_ARROW, keys.NUMPAD_PLUS];
				this._decrementKeyCodes = [keys.RIGHT_ARROW, keys.DOWN_ARROW, keys.NUMPAD_MINUS];
			}
		},

		_inZeroSettingArea: function(/*Number*/x, /*Number*/domNodeWidth){
			if(this.isLeftToRight()){
				return this.inherited(arguments);
			}else{
				return x > (domNodeWidth - this.zeroAreaWidth);
			}
		},

		_xToRawValue: function(/*Number*/x, /*Number*/domNodeWidth){
			var starStripLength = domNodeWidth - this.zeroAreaWidth;
			if(this.isLeftToRight()){
				return this.inherited(arguments);
			}else{
				return (starStripLength - x) / (starStripLength / this.maximum);
			}
		},

		_setZeroAreaWidthAttr: function(/*Number*/value){
			this.inherited(arguments);
			if(!this.isLeftToRight()){
				// Zero setting area is on the right side
				this.domNode.style.paddingLeft = "0px";
				this.domNode.style.paddingRight = this.zeroAreaWidth + "px";
			}
		},

		_updateStars: function(/*Number*/value, /*Boolean*/create){
			if(this.isLeftToRight()){
				return this.inherited(arguments);
			}else{
				var i, index;
				var parent;
				var starClass;
				for(i = 0; i < this.maximum; i++){
					index = (this.maximum - i - 1);
					if(index <= value - 1){
						starClass = this.baseClass + "FullStar";
					}else if(index >= value){
						starClass = this.baseClass + "EmptyStar";
					}else{
						starClass = this.baseClass + "HalfStarRtl";
					}
					if(create){
						parent = domConstruct.create("div", {
							style: {"float": "left"}
						}, this.domNode);
					}else{
						parent = this.domNode.children[i];
					}
					parent.className = this.baseClass + "StarIcon " + starClass;
				}
			}
		}
	});
});
