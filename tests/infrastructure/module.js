define([
	"doh/main",
	"require",

	// Core methods/modules [temporarily in dui?]
	"./Stateful"
], function (doh, require) {

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
	doh.register("Widget-lifecycle", require.toUrl("./Widget-lifecycle.html"), 999999);
	doh.register("Widget-attr", require.toUrl("./Widget-attr.html"), 999999);
	doh.register("Widget-placeAt", require.toUrl("./Widget-placeAt.html"), 999999);
	doh.register("Widget-utility", require.toUrl("./Widget-utility.html"), 999999);
	doh.register("Widget-on", require.toUrl("./Widget-on.html"), 999999);

	// Mixins
	doh.register("Container", require.toUrl("./Container.html"), 999999);
	doh.register("_KeyNavContainer", require.toUrl("./_KeyNavContainer.html"), 999999);
	doh.register("HasDropDown", require.toUrl("./HasDropDown.html"), 999999);
	doh.register("CssState", require.toUrl("./CssState.html"), 999999);

	doh.register("Declaration", require.toUrl("./test_Declaration.html"), 999999);

	// Miscellaneous
	doh.register("NodeList-instantiate", require.toUrl("./NodeList-instantiate.html"), 999999);
	doh.register("Destroyable", require.toUrl("./Destroyable.html"), 999999);
	doh.register("robot.BgIframe", require.toUrl("./robot/BgIframe.html"), 999999);

});
