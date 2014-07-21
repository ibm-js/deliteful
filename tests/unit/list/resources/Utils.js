define([
], function () {
	return {
		/**
		 * Deliver all changes to list and its renderer
		 */
		deliverAllChanges: function (list) {
			list.deliver();
			var renderers = list.containerNode.querySelectorAll(".d-list-item, .d-list-category");
			for (var i = 0; i < renderers.length; i++) {
				renderers.item(i).deliver();
			}
		}
	};
});