/** @module deliteful/StarRating/bidi/StarRating */
define([
	"dcl/dcl",
	"dojo/has",
	"dojo/keys",
	"dojo/dom-construct"
], function (dcl, has, keys, domConstruct) {

	/**
	 * @summary
	 *	Bidi support for StarRating widget.
	 * @description
	 * Implementation for RTL and LTR direction support.
	 * This class should not be used directly.
	 * StarRating widget loads this module when user sets "has: {'bidi': true }" in data-dojo-config.
	 * @class module:deliteful/StarRating/bidi/StarRating
	 */
	return dcl(null, /** @lends module:deliteful/StarRating/bidi/StarRating */{

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
					return x > (domNodeWidth - this._zeroAreaWidth);
				}
			};
		}),

		_xToRawValue: dcl.superCall(function (sup) {
			return function (/*Number*/x, /*Number*/domNodeWidth) {
				var starStripLength = domNodeWidth - this._zeroAreaWidth;
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
					if (create) {
						this._zeroSettingArea = domConstruct.create("div", {}, this);
						this._zeroSettingArea.className = this.baseClass + "-zero ";
						this._updateZeroArea();
					}
				}
			};
		})
		
	});
});
