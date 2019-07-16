define(function (require) {
	"use strict";

	var registerSuite = intern.getPlugin("interface.object").registerSuite;
	var List = require("deliteful/list/List");
	var ListBaseTestsObservableArray = require("./resources/ListBaseTestsObservableArray");

	registerSuite("list/List-ObservableArray", ListBaseTestsObservableArray.buildSuite(List));

});
