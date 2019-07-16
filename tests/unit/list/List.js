define(function (require) {
	"use strict";

	var registerSuite = intern.getPlugin("interface.object").registerSuite;
	var List = require("deliteful/list/List");
	var ListBaseTests = require("./resources/ListBaseTests");

	registerSuite("list/List", ListBaseTests.buildSuite(List));

});
