define(function (require) {
	"use strict";

	var registerSuite = require("intern!object");
	var List = require("deliteful/list/List");
	var ListBaseTestsObservableArray = require("./resources/ListBaseTestsObservableArray");

	registerSuite(ListBaseTestsObservableArray.buildSuite("list/List-ObservableArray", List));

});
