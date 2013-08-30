dojo.addOnLoad(function(){
	var view = dui.byId("foo");

	var list = new dui.mobile.RoundRectList({iconBase:"../../images/i-icon-all.png"});
	view.addChild(list);

	var demoWidget = new dui.mobile.ListItem({iconPos:"0,87,29,29", moveTo:"general", label:"Sounds"});
	list.addChild(demoWidget);

	demoWidget = new dui.mobile.ListItem({iconPos:"0,116,29,29", moveTo:"general", label:"Brightness"});
	list.addChild(demoWidget);

	list = new dui.mobile.EdgeToEdgeList({iconBase:"../../images/i-icon-all.png"});
	demoWidget = new dui.mobile.ListItem({iconPos:"0,87,29,29", rightIcon:"duiDomButtonBluePlus", label:"XX Widget"});
	list.addChild(demoWidget);

	demoWidget = new dui.mobile.ListItem({iconPos:"0,116,29,29", rightIcon:"duiDomButtonRedMinus", label:"YY Widget"});
	list.addChild(demoWidget);

	view.addChild(list);
});
