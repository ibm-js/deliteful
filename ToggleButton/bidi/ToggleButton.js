define([
	"dcl/dcl"
], function (dcl) {

	return dcl(null, {
		_setCheckedLabelAttr: function (value) {
			value = this.wrapWithUcc(value);
			this._set("checkedLabel", value);
		}

	});
});