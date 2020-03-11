define(function (require) {
	"use strict";

	var registerSuite = intern.getPlugin("interface.object").registerSuite;
	var assert = intern.getPlugin("chai").assert;
	var register = require("delite/register");
	var Renderer = require("deliteful/list/Renderer");

	registerSuite("list/Renderer", {
		"create subclass": function () {
			var CorrectRenderer = register("d-correct-renderer", [HTMLElement, Renderer], {});
			assert(CorrectRenderer, "subclass defined");
		}
	});
});
