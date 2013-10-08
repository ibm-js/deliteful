define(["doh/main", "require", "dojo/sniff"], function(doh, require){
	var userArgs = window.location.search.replace(/[\?&](dojoUrl|testUrl|testModule)=[^&]*/g,"").replace(/^&/,"?"),
		test_robot = true;
		
	if(test_robot){
		doh.registerUrl("dui.mobile.tests.robot.RoundRectList", require.toUrl("./RoundRectListConnect.html"), 999999);
		doh.registerUrl("dui.mobile.tests.robot.ButtonList", require.toUrl("./ButtonList.html"), 999999);
		doh.registerUrl("dui.mobile.tests.robot.ButtonList", require.toUrl("./ButtonList2.html"), 999999);
		doh.registerUrl("dui.mobile.tests.robot.switch", require.toUrl("./Switch.html"), 999999);
		doh.registerUrl("dui.mobile.tests.robot.switch", require.toUrl("./Switch2.html"), 999999);
		doh.registerUrl("dui.mobile.tests.robot.ListItem", require.toUrl("./ListItem.html"), 999999);
		doh.registerUrl("dui.mobile.tests.robot.tabBar", require.toUrl("./TabBar.html"), 999999);
		doh.registerUrl("dui.mobile.tests.robot.tabBar", require.toUrl("./TabBar2.html"), 999999);
//		doh.registerUrl("dui.mobile.tests.robot.IconItem", require.toUrl("./Icon.html",999999));
//		doh.registerUrl("dui.mobile.tests.robot.IconItem", require.toUrl("./Icon2.html",999999));
		doh.registerUrl("dui.mobile.tests.robot.Animation", require.toUrl("./Animation.html"),999999);
		if(!dojo.isSafari) {
			doh.registerUrl("dui.mobile.tests.robot.Settings", require.toUrl("./Settings.html"),999999);
//			doh.registerUrl("dui.mobile.tests.robot.Flippable", require.toUrl("./Flippable.html"),999999);
			doh.registerUrl("dui.mobile.tests.robot.Scrollable", require.toUrl("./ScrollableView.html"),999999);
			doh.registerUrl("dui.mobile.tests.robot.Scrollable", require.toUrl("./ScrollableView2.html"),999999);
			doh.registerUrl("dui.mobile.tests.robot.Scrollable", require.toUrl("./ScrollableView3.html"),999999);
		}
	}
});

