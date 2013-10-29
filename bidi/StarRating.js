define([
	"dcl/dcl",
	"dojo/has",
	"dojo/keys",
	"dojo/dom-construct"
], function (dcl, has, keys, domConstruct) {

	// module:
	//		dui/bidi/StarRating

	return dcl(null, {
		// summary:
		//		Bidi support for StarRating widget.
		// description:
		//		Implementation for RTL and LTR direction support.
		//		This class should not be used directly.
		//		StarRating widget loads this module when user sets "has: {'dojo-bidi': true }" in data-dojo-config.

		startup: function () {
			if (!this.isLeftToRight()) {
				this._incrementKeyCodes = [keys.LEFT_ARROW, keys.UP_ARROW, keys.NUMPAD_PLUS];
				this._decrementKeyCodes = [keys.RIGHT_ARROW, keys.DOWN_ARROW, keys.NUMPAD_MINUS];
			}
		},

		_inZeroSettingArea: dcl.superCall(function (sup) {
			return function (/*Number*/x, /*Number*/domNodeWidth) {
				if (this.isLeftToRight()) {
					return sup.call(this, x, domNodeWidth);
				} else {
					return x > (domNodeWidth - this.zeroAreaWidth);
				}
			};
		}),

		_xToRawValue: dcl.superCall(function (sup) {
			return function (/*Number*/x, /*Number*/domNodeWidth) {
				var starStripLength = domNodeWidth - this.zeroAreaWidth;
				if (this.isLeftToRight()) {
					return sup.call(this, x, domNodeWidth);
				} else {
					return (starStripLength - x) / (starStripLength / this.maximum);
				}
			};
		}),

		_updateStars: dcl.superCall(function (sup) {
			return function (/*Number*/value, /*Boolean*/create) {
				if (this.isLeftToRight()) {
					return sup.call(this, value, create);
				} else {
					var i, index, parent, starClass;
					for (i = 0; i < this.maximum; i++) {
						index = (this.maximum - i - 1);
						if (index <= value - 1) {
							starClass = this.baseClass + "FullStar";
						} else if (index >= value) {
							starClass = this.baseClass + "EmptyStar";
						} else {
							starClass = this.baseClass + "HalfStarRtl";
						}
						if (create) {
							parent = domConstruct.create("div", {
								style: {"float": "left"}
							}, this);
						} else {
							parent = this.children[i];
						}
						parent.className = this.baseClass + "StarIcon " + starClass;
					}
				}
			};
		}),
		
		_updateZeroArea: dcl.superCall(function (sup) {
			return function (/*Number*/value) {
				if (!this.isLeftToRight()) {
					if (this.editable) {
						this.style.paddingRight = this.zeroAreaWidth + "px";
					} else {
						this.style.paddingRight = "0px";
					}
				} else {
					sup.call(this, value);
				}
			};
		})
	});
});
