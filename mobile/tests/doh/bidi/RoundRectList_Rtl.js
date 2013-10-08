
dojo.addOnLoad(function(){
	doh.register("dui.mobile.test.doh.RoundRectList", [
		{
			name: "RoundRectList Verification",
			timeout: 4000,
			runTest: function(){
				var d = new doh.Deferred();
				setTimeout(d.getTestCallback(function(){
					var demoWidget = registry.byId("Category");
					doh.assertEqual('duiRoundRectCategory duiRoundRectCategoryRtl', demoWidget.domNode.className);
					doh.assertEqual('Spaces', demoWidget.domNode.innerHTML);

					demoWidget = registry.byId("dui_mobile_RoundRectList_0");
					doh.assertEqual('duiRoundRectList duiRoundRectListRtl', demoWidget.domNode.className);
					verifyListItem("item1", 'u1space', 'Off', "duiDomButtonArrow", true, true, false);
					verifyListItem("item2", 'u2space', 'On', "duiDomButtonArrow", true, true, false);
					verifyListItem("item3", 'Wi-Fi', 'Off', "duiDomButtonArrow", false, true, false);
					
				}));
				return d;
			}
		},
		{
			name: "RoundRectList Verification2",
			timeout: 1000,
			runTest: function(){
				var d = new doh.Deferred();
				var demoWidget = registry.byId("dui_mobile_RoundRectList_0");
				demoWidget.set({transition :"flip"});
				doh.assertEqual("flip", demoWidget.get("transition"));
				demoWidget.set({transition :"fade"});
				doh.assertEqual("fade", demoWidget.get("transition"));

//				fireOnClick("item3");
				fireOnMouseDown("item3");
				fireOnMouseUp("item3");
				var view = registry.byId("foo");
				dojo.connect(view, "onAfterTransitionOut", this, d.getTestCallback(function(){
					var demoWidget = registry.byId("dui_mobile_RoundRectCategory_0");
					doh.assertEqual('duiRoundRectCategory duiRoundRectCategoryRtl', demoWidget.domNode.className);
					doh.assertEqual('Applications', demoWidget.domNode.innerHTML);

					demoWidget = registry.byId("dui_mobile_RoundRectList_1");
					doh.assertEqual('duiRoundRectList duiRoundRectListRtl', demoWidget.domNode.className);

					verifyListItem("dui_mobile_ListItem_0", 'Video', 'Off', "", false, true, false);
					verifyListItem("dui_mobile_ListItem_1", 'Maps', 'VPN', "", true, false, false);
					verifyListItem("dui_mobile_ListItem_2", 'Phone Number', 'Off', "", false, false, false);
				}));
				return d;
			}
		},
		{
			name: "RoundRectCategory getLabel",
			timeout: 1000,
			runTest: function(){
				doh.assertEqual("Spaces", registry.byId("Category").get("label")); 
			}
		},
		{
			name: "RoundRectCategory setLabel",
			timeout: 1000,
			runTest: function(){
				var demoWidget = registry.byId("Category");
				demoWidget.set({label :"Value Changed"});
				doh.assertEqual("Value Changed", demoWidget.get("label"));
				doh.assertEqual('Value Changed', demoWidget.domNode.innerHTML);
			}
		}
	]);
	doh.run();
});
