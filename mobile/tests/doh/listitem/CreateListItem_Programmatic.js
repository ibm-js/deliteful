dojo.addOnLoad(function(){
	var list = dijit.byId("dui_mobile_RoundRectList_0");
	var demoWidget = new dui.mobile.ListItem({icon:"../../images/i-icon-1.png", transition:"slide", url:"../../view1.html", label:"External View #1 (sync)"});
	list.addChild(demoWidget);

	demoWidget = new dui.mobile.ListItem({icon:"../../images/i-icon-2.png", transition:"flip", url:"../../view2.html", sync:false, label:"External View #2 (async)"});
	list.addChild(demoWidget);

	demoWidget = new dui.mobile.ListItem({icon:"../../images/i-icon-3.png", transition:"fade", url:"../../view3.html", label:"External View #3 (sync)"});
	list.addChild(demoWidget);

	demoWidget = new dui.mobile.ListItem({rightText:"Off", label:"Video"});
	list.addChild(demoWidget);

	demoWidget = new dui.mobile.ListItem({icon:"../../images/i-icon-1.png", rightText:"VPN", label:"Maps"});
	list.addChild(demoWidget);

	demoWidget = new dui.mobile.ListItem({label:"Jack Coleman"});
	list.addChild(demoWidget);

	list = dijit.byId("dui_mobile_RoundRectList_1");
	demoWidget = new dui.mobile.ListItem({iconPos:"0,87,29,29", moveTo:"general", label:"Sounds"});
	list.addChild(demoWidget);

	demoWidget = new dui.mobile.ListItem({iconPos:"0,116,29,29", moveTo:"general", label:"Brightness"});
	list.addChild(demoWidget);

	demoWidget = new dui.mobile.ListItem({iconPos:"29,0,29,29", moveTo:"general", label:"Wallpaper"});
	list.addChild(demoWidget);

	list = dijit.byId("dui_mobile_EdgeToEdgeList_0");
	demoWidget = new dui.mobile.ListItem({icon:"../../images/i-icon-1.png", rightIcon:"duiDomButtonBluePlus", label:"XX Widget"});
	list.addChild(demoWidget);

	demoWidget = new dui.mobile.ListItem({icon:"../../images/i-icon-2.png", rightIcon:"duiDomButtonRedMinus", label:"YY Widget"});
	list.addChild(demoWidget);

	list = dijit.byId("dui_mobile_EdgeToEdgeList_1");
	demoWidget = new dui.mobile.ListItem({rightIcon:"duiDomButtonCheckboxOff", variableHeight:"true"});
	dojo.create(dojo.doc.createTextNode("Use wireless networks"), null, demoWidget.labelNode, "before");
	var child = dojo.create("DIV", {className:"duiListItemSubText"}, demoWidget.labelNode, "before");
	child.appendChild(dojo.doc.createTextNode("See location in applications (such as Maps) using wireless networks"));
	list.addChild(demoWidget);

	demoWidget = new dui.mobile.ListItem({rightIcon:"duiDomButtonCheckboxOn", variableHeight:"true"});
	dojo.create(dojo.doc.createTextNode("Use GPS satellites"), null, demoWidget.labelNode, "before");
	child = dojo.create("DIV", {className:"duiListItemSubText", innerHTML:"When locating, accurate to street level (uncheck to conserve battery)"}, demoWidget.labelNode, "before");
	list.addChild(demoWidget);

	demoWidget = new dui.mobile.ListItem({label:" Set unlock pattern"});
	list.addChild(demoWidget);
});
