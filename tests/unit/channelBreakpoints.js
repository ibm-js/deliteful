define(function () {
	"use strict";

	var registerSuite = intern.getPlugin("interface.object").registerSuite;
	var assert = intern.getPlugin("chai").assert;

	registerSuite("deliteful/channelBreakpoints", {
		"default values": function () {
			var dfd = this.async();

			requirejs(["deliteful/channelBreakpoints"], dfd.callback(function (channelBreakpoints) {
				assert.strictEqual(channelBreakpoints.smallScreen, "480px", "default value of smallScreen");
				assert.strictEqual(channelBreakpoints.mediumScreen, "1024px", "default value of mediumScreen");
			}));
		},

		"custom config": function () {
			var configRequire = requirejs.config({
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

			configRequire(["deliteful/channelBreakpoints"], dfd.callback(function (channelBreakpoints) {
				assert.strictEqual(channelBreakpoints.smallScreen, "314px", "custom config of smallScreen");
				assert.strictEqual(channelBreakpoints.mediumScreen, "514px", "custom config of mediumScreen");
			}));
		}
	});
});
