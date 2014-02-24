define([
	"dcl/dcl",
	"dojo/has",
	"dojo/keys",
	"dojo/dom-construct"
], function (dcl, has, keys, domConstruct) {

	// module:
	//		deliteful/StarRating/bidi/StarRating

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
					return (starStripLength - x) / (starStripLength / this.max);
				}
			};
		}),

		_updateStars: dcl.superCall(function (sup) {
			return function (/*Number*/value, /*Boolean*/create) {
				if (this.isLeftToRight()) {
					return sup.call(this, value, create);
				} else {
					var stars = this.querySelectorAll("div");
					for (var i = 0; i < this.max; i++) {
						var index = (this.max - i - 1);
						if (index <= value - 1) {
							var starClass = this.baseClass + "-full-star";
						} else if (index >= value) {
							starClass = this.baseClass + "-empty-star";
						} else {
							starClass = this.baseClass + "-half-star";
						}
						if (create) {
							var parent = domConstruct.create("div", {}, this);
						} else {
							parent = stars[i];
						}
						parent.className = this.baseClass + "-star-icon " + starClass;
					}
				}
			};
		}),
		
		_updateZeroArea: dcl.superCall(function (sup) {
			return function (/*Number*/value) {
				if (!this.isLeftToRight()) {
					if (this.readOnly) {
						this.style.paddingRight = "0px";
					} else {
						this.style.paddingRight = this.zeroAreaWidth + "px";
					}
				} else {
					sup.call(this, value);
				}
			};
		})
	});
});
