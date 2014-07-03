/** @module deliteful/StarRating/bidi/StarRating */
define([
	"dcl/dcl",
	"dojo/keys",
	"dojo/dom-geometry"
], function (dcl, keys, domGeometry) {

	/**
	 * Bidi support for StarRating widget.
	 * 
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

		_xToRawValue: dcl.superCall(function (sup) {
			return function (/*Number*/x, /*Number*/domNodeWidth) {
				if (this.isLeftToRight()) {
					return sup.call(this, x, domNodeWidth);
				} else {
					if (this._zeroAreaWidth === undefined) {
						this._zeroAreaWidth = domGeometry.position(this._zeroSettingArea, false).w;
					}
					var starStripLength = domNodeWidth - this._zeroAreaWidth;
					return (starStripLength - x) / (starStripLength / this.max);
				}
			};
		})

	});
});
