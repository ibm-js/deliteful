define([
	"dojo/_base/declare",
	"dui/_WidgetBase",
	"dui/_TemplatedMixin"
], function(declare, _WidgetBase, _TemplatedMixin){
	return declare([_WidgetBase, _TemplatedMixin], {
		templateString: '<div data-dojo-attach-point="fooNode">TestWidget</div>',
		foo: "bar"
	});
});