define([
	"dcl/dcl",
	"dpointer/events"
], function (dcl) {

	return dcl(null, {
		refreshRendering: function (oldVals) {
			if ("textDir" in oldVals || "checkedLabel" in oldVals) {
				this._innerNode.firstChild.textContent = this.applyTextDirection(this.checkedLabel);
			}
			if ("textDir" in oldVals || "uncheckedLabel" in oldVals) {
				this._innerNode.lastChild.textContent = this.applyTextDirection(this.uncheckedLabel);
			}
		},

		postRender: function () {
			this.on("pointerover", this._pointerOverHandler.bind(this));
		},

		_pointerOverHandler: function () {
			if (this.title) {
				this.title = this.applyTextDirection(this.title);
			}
		}
	});
});