define([
	"dcl/dcl"
], function (dcl) {
	// module:
	//		deliteful/Switch/bidi/Switch

	return dcl(null, {
		_setCheckedLabelAttr: function (value) {
			value = this.wrapWithUcc(value);
			this._set("checkedLabel", value);
		},

		_setUncheckedLabelAttr: function (value) {
			value = this.wrapWithUcc(value);
			this._set("uncheckedLabel", value);
		}

	});
});
