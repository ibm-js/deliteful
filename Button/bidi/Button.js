define(["dcl/dcl"], function (dcl) {

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

		refreshRendering: function () {
			this.containerNode.textContent = this.wrapWithUcc(this.containerNode.textContent);
			if (this.title) {
				this.title = this.wrapWithUcc(this.title);
			}
		}
	});
});
