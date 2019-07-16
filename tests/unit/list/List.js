define(function (require) {
	"use strict";

	var registerSuite = require("intern!object");
	var List = require("deliteful/list/List");
	var ListBaseTests = require("./resources/ListBaseTests");

	registerSuite(ListBaseTests.buildSuite("list/List", List));

});
