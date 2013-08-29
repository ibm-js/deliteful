dojo.provide("dui.mobile.tests.robot.module");

try{
	var userArgs = window.location.search.replace(/[\?&](dojoUrl|testUrl|testModule)=[^&]*/g,"").replace(/^&/,"?"),
		test_robot = true;
		
	if(test_robot){
		doh.registerUrl("dui.mobile.tests.robot.RoundRectList", dojo.moduleUrl("dui.mobile", "tests/robot/RoundRectListConnect.html"), 999999);
		doh.registerUrl("dui.mobile.tests.robot.ButtonList", dojo.moduleUrl("dui.mobile", "tests/robot/ButtonList.html"), 999999);
		doh.registerUrl("dui.mobile.tests.robot.ButtonList", dojo.moduleUrl("dui.mobile", "tests/robot/ButtonList2.html"), 999999);
		doh.registerUrl("dui.mobile.tests.robot.switch", dojo.moduleUrl("dui.mobile", "tests/robot/Switch.html"), 999999);
		doh.registerUrl("dui.mobile.tests.robot.switch", dojo.moduleUrl("dui.mobile", "tests/robot/Switch2.html"), 999999);
		doh.registerUrl("dui.mobile.tests.robot.ListItem", dojo.moduleUrl("dui.mobile", "tests/robot/ListItem.html"), 999999);
		doh.registerUrl("dui.mobile.tests.robot.tabBar", dojo.moduleUrl("dui.mobile", "tests/robot/TabBar.html"), 999999);
		doh.registerUrl("dui.mobile.tests.robot.tabBar", dojo.moduleUrl("dui.mobile", "tests/robot/TabBar2.html"), 999999);
//		doh.registerUrl("dui.mobile.tests.robot.IconItem", dojo.moduleUrl("dui.mobile", "tests/robot/Icon.html",999999));
//		doh.registerUrl("dui.mobile.tests.robot.IconItem", dojo.moduleUrl("dui.mobile", "tests/robot/Icon2.html",999999));
		doh.registerUrl("dui.mobile.tests.robot.Animation", dojo.moduleUrl("dui.mobile", "tests/robot/Animation.html"),999999);
		if(!dojo.isSafari) {
			doh.registerUrl("dui.mobile.tests.robot.Settings", dojo.moduleUrl("dui.mobile", "tests/robot/Settings.html"),999999);
//			doh.registerUrl("dui.mobile.tests.robot.Flippable", dojo.moduleUrl("dui.mobile", "tests/robot/Flippable.html"),999999);
			doh.registerUrl("dui.mobile.tests.robot.Scrollable", dojo.moduleUrl("dui.mobile", "tests/robot/ScrollableView.html"),999999);
			doh.registerUrl("dui.mobile.tests.robot.Scrollable", dojo.moduleUrl("dui.mobile", "tests/robot/ScrollableView2.html"),999999);
			doh.registerUrl("dui.mobile.tests.robot.Scrollable", dojo.moduleUrl("dui.mobile", "tests/robot/ScrollableView3.html"),999999);
		}
	}
}catch(e){
	doh.debug(e);
}
