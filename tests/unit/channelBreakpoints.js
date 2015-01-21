define([
	"intern!object",
	"intern/chai!assert"
], function (registerSuite, assert) {

	registerSuite({
		name: "deliteful/channelBreakpoints",
		
		"Default values" : function () {
			var dfd = this.async();

			require(["deliteful/channelBreakpoints"],
				dfd.callback(function (channelBreakpoints) {
					assert.strictEqual(channelBreakpoints.smallScreen, "480px",
						"default value of smallScreen");
					assert.strictEqual(channelBreakpoints.mediumScreen, "1024px",
						"default value of mediumScreen");
				}));
		},

		"Custom config" : function () {
			var configRequire = require.config({
				context: "configTest",
				// baseUrl is relative to deliteful/node_modules/intern/
				baseUrl: "../../..",
				config: {
					"deliteful/channelBreakpoints": {
						smallScreen: "314px",
						mediumScreen: "514px"
					}
				}
			});
			
			var dfd = this.async();

			configRequire(["deliteful/channelBreakpoints"],
				dfd.callback(function (channelBreakpoints) {
					assert.strictEqual(channelBreakpoints.smallScreen, "314px",
						"custom config of smallScreen");
					assert.strictEqual(channelBreakpoints.mediumScreen, "514px",
						"custom config of mediumScreen");
				}));
		}
	});
});
