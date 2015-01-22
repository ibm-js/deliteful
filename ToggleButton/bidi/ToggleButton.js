define([
	"dcl/dcl",
	"dpointer/events"
], function (dcl) {

	return dcl(null, {
		refreshRendering: function (oldVals) {
			if (this.checked && this.checkedLabel) {
				if ("checked" in oldVals || "textDir" in oldVals || "checkedLabel" in oldVals) {
					this.labelNode.textContent = this.applyTextDirection(this.checkedLabel);
				}
			}
			else if ("checked" in oldVals || "textDir" in oldVals || "label" in oldVals) {
				this.labelNode.textContent = this.applyTextDirection(this.label);
			}
			if (this.title && "textDir" in oldVals) {
				this.title = this.applyTextDirection(this.title);
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
