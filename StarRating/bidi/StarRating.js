/** @module deliteful/StarRating/bidi/StarRating */
define([
	"dcl/dcl",
	"dojo/keys"
], function (dcl, keys) {

	/**
	 * Bidi support for StarRating widget.
	 * 
	 * Implementation for RTL and LTR direction support.
	 * This class should not be used directly.
	 * StarRating widget loads this module when user sets "has: {'bidi': true }" in data-dojo-config.
	 * @class module:deliteful/StarRating/bidi/StarRating
	 */
	return dcl(null, /** @lends module:deliteful/StarRating/bidi/StarRating */{

		attachedCallback: function () {
			if (!this.isLeftToRight()) {
				this._incrementKeyCodes = [keys.LEFT_ARROW, keys.UP_ARROW, keys.NUMPAD_PLUS];
				this._decrementKeyCodes = [keys.RIGHT_ARROW, keys.DOWN_ARROW, keys.NUMPAD_MINUS];
			}
		}
	});
});
