define([
	"intern!object",
	"deliteful/list/List",
	"./resources/ListBaseTestsObservableArray"
], function (registerSuite, List, ListBaseTestsObservableArray) {

	registerSuite(ListBaseTestsObservableArray.buildSuite("list/List-ObservableArray", List));

});
