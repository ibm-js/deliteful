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
		}
	});
});
