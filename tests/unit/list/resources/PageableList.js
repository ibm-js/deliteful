define([
	"delite/register",
	"deliteful/list/List",
	"deliteful/list/Pageable"
], function (register, List, Pageable) {
	return register("d-pageable-list", [List, Pageable], {});
});