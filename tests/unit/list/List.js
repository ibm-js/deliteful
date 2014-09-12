define([
	"intern!object",
	"deliteful/list/List",
	"./resources/ListBaseTests"
], function (registerSuite, List, ListBaseTests) {

	registerSuite(ListBaseTests.buildSuite("list/List", List));

});
