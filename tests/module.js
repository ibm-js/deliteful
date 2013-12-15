define([
	"doh/main",
	"require",

	// Unit tests
	"./Invalidating"
], function (doh, require) {

	// Utility methods (previously in dui/_base)
	// doh.register("focus", require.toUrl("./focus.html"), 999999); // not working because it references old dijit widgets
	doh.register("place", require.toUrl("./place.html"), 999999);
	doh.register("place-margin", require.toUrl("./place-margin.html"), 999999);
	doh.register("place-clip", require.toUrl("./place-clip.html"), 999999);
	doh.register("popup", require.toUrl("./popup.html"), 999999);
	doh.register("css", require.toUrl("./css.html"), 999999);
	// doh.register("robot.typematic", require.toUrl("./robot/typematic.html"), 999999);	// comment out until converted to webdriver test
	// Mixins
	// doh.register("_KeyNavContainer", require.toUrl("./_KeyNavContainer.html"), 999999); // removed in 622fe52c7e0fe7466a375e23a18ddb6a12b9aaa6 but it should be restored!

	// Miscellaneous
	// doh.register("robot.BgIframe", require.toUrl("./robot/BgIframe.html"), 999999);	// comment out until converted to webdriver test
	doh.register("ExampleWidget", require.toUrl("./test_ExampleWidget.html"), 999999);

});
