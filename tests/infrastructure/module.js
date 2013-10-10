define([
	"doh/main",
	"require",

	// Core methods/modules [temporarily in dui?]
	"./Stateful"
], function(doh, require){

	// Utility methods (previously in dui/_base)
	doh.register("focus", require.toUrl("./focus.html"), 999999);
	doh.register("place", require.toUrl("./place.html"), 999999);
	doh.register("place-margin", require.toUrl("./place-margin.html"), 999999);
	doh.register("place-clip", require.toUrl("./place-clip.html"), 999999);
	doh.register("popup", require.toUrl("./popup.html"), 999999);
	doh.register("a11y", require.toUrl("./a11y.html"), 999999);
	doh.register("css", require.toUrl("./css.html"), 999999);
	doh.register("handlebars", require.toUrl("./handlebars.html"), 999999);
	doh.register("robot.typematic", require.toUrl("./robot/typematic.html"), 999999);

	// _Widget
	doh.register("_Widget-lifecycle", require.toUrl("./_Widget-lifecycle.html"), 999999);
	doh.register("_Widget-attr", require.toUrl("./_Widget-attr.html"), 999999);
	doh.register("_Widget-placeAt", require.toUrl("./_Widget-placeAt.html"), 999999);
	doh.register("_Widget-utility", require.toUrl("./_Widget-utility.html"), 999999);
	doh.register("robot._Widget-on", require.toUrl("./_Widget-on.html"), 999999);

	// Mixins
	doh.register("_Container", require.toUrl("./_Container.html"), 999999);
	doh.register("_KeyNavContainer", require.toUrl("./_KeyNavContainer.html"), 999999);
	doh.register("_HasDropDown", require.toUrl("./_HasDropDown.html"), 999999);

	doh.register("Declaration", require.toUrl("./test_Declaration.html"), 999999);

	// Miscellaneous
	doh.register("NodeList-instantiate", require.toUrl("./NodeList-instantiate.html"), 999999);
	doh.register("Destroyable", require.toUrl("./Destroyable.html"), 999999);
	doh.register("robot.BgIframe", require.toUrl("./robot/BgIframe.html"), 999999);

});
