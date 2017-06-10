define([
    "intern",
	"intern!object",
	"intern/dojo/node!leadfoot/helpers/pollUntil",
	"intern/chai!assert",
	"require"
], function (intern, registerSuite, pollUntil, assert, require) {

	registerSuite({
		name: "Tooltip - functional",

		setup: function () {
			var remote = this.remote;

			return remote.get(require.toUrl("./Tooltip.html")).then(pollUntil("return ready || null;", [],
				intern.config.WAIT_TIMEOUT, intern.config.POLL_INTERVAL));
		},

		layout: {
			below: function () {
				return this.remote
					.findById("top").click().end()
					.execute("return getPos('top')").then(function (res) {
						var anchor = res.anchor,
							tooltip = res.tooltip,
							connector = res.connector;
						assert.isBelow(anchor.bottom, tooltip.top, "tooltip below anchor");
						assert.isBelow(Math.abs(anchor.hcenter - tooltip.hcenter), 2,
							"tooltip horizontally centered with anchor " + anchor.hcenter + ", " + tooltip.hcenter);
						assert.isBelow(Math.abs(connector.bottom - tooltip.top), 1.1,
							"connector above tooltip rectangle");
						assert.isBelow(Math.abs(anchor.hcenter - connector.hcenter), 1.1,
							"connector horizontally centered with anchor");
					});
			},

			right: function () {
				return this.remote
					.findById("left").click().end()
					.execute("return getPos('left')").then(function (res) {
						var anchor = res.anchor,
							tooltip = res.tooltip,
							connector = res.connector;
						assert.isBelow(anchor.right, tooltip.right + 0.1, "tooltip to right of anchor");
						assert.isBelow(Math.abs(anchor.vcenter - tooltip.vcenter),
							1.1, "tooltip vertically centered with anchor");
						assert.isBelow(Math.abs(connector.right - tooltip.left), 1.1,
							"connector to left of tooltip rectangle");
						assert.isBelow(Math.abs(anchor.vcenter - connector.vcenter), 1.1,
							"connector vertically centered with anchor");
					});
			},

			"uncentered above": function () {
				return this.remote
					.findById("bottom-left").click().end()
					.execute("return getPos('bottom-left')").then(function (res) {
						var anchor = res.anchor,
							tooltip = res.tooltip,
							connector = res.connector;
						assert.isBelow(tooltip.bottom, anchor.top, "tooltip above anchor");
						assert.isBelow(Math.abs(connector.top - tooltip.bottom), 1.1,
							"connector below tooltip rectangle");
						assert.isBelow(Math.abs(anchor.hcenter - connector.hcenter), 1.1,
							"connector horizontally centered with anchor (rather than with tooltip)");
					});
			},

			"uncentered left": function () {
				return this.remote
					.findById("bottom-right").click().end()
					.execute("return getPos('bottom-right')").then(function (res) {
						var anchor = res.anchor,
							tooltip = res.tooltip,
							connector = res.connector;
						assert.isBelow(tooltip.right, anchor.left, "tooltip left of anchor");
						assert.isBelow(Math.abs(connector.left - tooltip.right), 1.1,
							"connector to left of tooltip rectangle");
						assert.isBelow(Math.abs(anchor.vcenter - connector.vcenter), 1.1,
							"connector vertically centered with anchor (rather than with tooltip)");
					});
			}
		},

		"reposition after content load": function () {
			return this.remote
				.findById("right").click().end()
				.sleep(600)
				.execute("return getPos('right')").then(function (res) {
					var anchor = res.anchor,
						tooltip = res.tooltip,
						connector = res.connector;

					assert.isBelow(tooltip.right - 0.1, anchor.right, "tooltip to left of anchor");
					assert.isBelow(Math.abs(anchor.vcenter - tooltip.vcenter),
						1.1, "tooltip vertically centered with anchor");
					assert.isBelow(Math.abs(connector.left - tooltip.right), 1.1,
						"connector to right of tooltip rectangle");
					assert.isBelow(Math.abs(anchor.vcenter - connector.vcenter), 1.1,
						"connector vertically centered with anchor");
				});
		},

		aria: function () {
			return this.remote
				// Open drop down.
				.findById("top").click().end()
				.execute("return document.getElementById('top').getAttribute('aria-describedby');")
						.then(function (val) {
					assert.strictEqual(val, "top-tooltip", "aria-describedby value");
				})

				// And then close it.
				.findById("top").click().end()
				.execute("return document.getElementById('top').hasAttribute('aria-describedby');")
						.then(function (val) {
					assert.isFalse(val,  "aria-describedby attribute removed");
				});
		}
	});
});
