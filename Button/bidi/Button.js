define(["dcl/dcl", "dpointer/events"], function (dcl) {

	// module:
	//		deliteful/Button/bidi/Button

	return dcl(null, {
		// summary:
		//		Support for control over text direction for Button widget,
		//		using Unicode Control Characters to control text direction.
		// description:
		//		Implementation for text direction support for label and tooltip.
		//		This class should not be used directly.
		//		Button widget loads this module when user sets "has: {'bidi': true }" in data-dojo-config.

		refreshRendering: function (oldVals) {
			if ("textDir" in oldVals || "label" in oldVals) {
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
