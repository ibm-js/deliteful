dojo.addOnLoad(function(){
	doh.register("dojox.mobile.test.ToolBarButton", [
		function test_Heading_Verification(){
			var demoWidget = dijit.byId("btn1");

			doh.assertEqual('Edit', demoWidget.labelNode.innerHTML, "id= "+ demoWidget.domNode.id);

			demoWidget = dijit.byId("dojox_mobile_ToolBarButton_0");
			doh.assertTrue(demoWidget.iconNode, "there is no iconNode. id= "+ demoWidget.domNode.id);
			doh.assertTrue(demoWidget.iconNode.childNodes, "there is no iconNode.childNodes. id= "+ demoWidget.domNode.id);
			doh.assertEqual('duiDomButtonWhitePlus duiDomButton', demoWidget.iconNode.childNodes[0].className, "id= "+ demoWidget.domNode.id);
			
			demoWidget = dijit.byId("dojox_mobile_ToolBarButton_1");
			doh.assertEqual('Edit', demoWidget.labelNode.innerHTML, "id= "+ demoWidget.domNode.id);

			demoWidget = dijit.byId("dojox_mobile_ToolBarButton_2");
			doh.assertTrue(demoWidget.iconNode, "there is no iconNode. id= "+ demoWidget.domNode.id);
			doh.assertTrue(demoWidget.iconNode.childNodes, "there is no iconNode.childNodes. id= "+ demoWidget.domNode.id);
			doh.assertEqual('duiDomButtonWhitePlus duiDomButton', demoWidget.iconNode.childNodes[0].className, "id= "+ demoWidget.domNode.id);

			demoWidget = dijit.byId("dojox_mobile_ToolBarButton_3");
			doh.assertEqual('Speaker', demoWidget.labelNode.innerHTML, "id= "+ demoWidget.domNode.id);

			demoWidget = dijit.byId("dojox_mobile_ToolBarButton_4");
			doh.assertEqual('Done', demoWidget.labelNode.innerHTML, "id= "+ demoWidget.domNode.id);

			demoWidget = dijit.byId("dojox_mobile_ToolBarButton_5");
			doh.assertEqual('Update All', demoWidget.labelNode.innerHTML, "id= "+ demoWidget.domNode.id);

			demoWidget = dijit.byId("dojox_mobile_ToolBarButton_6");
			doh.assertEqual('duiToolBarButton duiToolBarButtonRtl duiToolBarButtonHasRightArrow', demoWidget.domNode.className, "id= "+ demoWidget.domNode.id);
			doh.assertEqual('Bookmarks', demoWidget.labelNode.innerHTML);

			demoWidget = dijit.byId("dojox_mobile_ToolBarButton_7");
			doh.assertEqual('Done', demoWidget.labelNode.innerHTML, "id= "+ demoWidget.domNode.id);

			demoWidget = dijit.byId("dojox_mobile_ToolBarButton_8");
			doh.assertEqual('Done', demoWidget.labelNode.innerHTML, "id= "+ demoWidget.domNode.id);

			demoWidget = dijit.byId("dojox_mobile_ToolBarButton_9");
			doh.assertEqual('New Folder', demoWidget.labelNode.innerHTML, "id= "+ demoWidget.domNode.id);

			demoWidget = dijit.byId("dojox_mobile_ToolBarButton_10");
			doh.assertEqual('New', demoWidget.labelNode.innerHTML, "id= "+ demoWidget.domNode.id);

			demoWidget = dijit.byId("dojox_mobile_ToolBarButton_11");
			doh.assertEqual('Toggle', demoWidget.labelNode.innerHTML, "id= "+ demoWidget.domNode.id);

			demoWidget = dijit.byId("dojox_mobile_ToolBarButton_12");
			if(!dojo.isIE){
				doh.assertTrue(demoWidget.iconNode.src.search(/a-icon-12.png/) != -1, "a-icon-12.png", "id= "+ demoWidget.domNode.id);
			}

			demoWidget = dijit.byId("dojox_mobile_ToolBarButton_13");
			doh.assertTrue(demoWidget.iconNode, "there is no iconNode. id= "+ demoWidget.domNode.id);
			doh.assertTrue(demoWidget.iconNode.childNodes, "there is no iconNode.childNodes. id= "+ demoWidget.domNode.id);
			doh.assertEqual('duiSpriteIcon', demoWidget.iconNode.childNodes[0].className, "id= "+ demoWidget.domNode.id);
			verifyRect(demoWidget.iconNode.childNodes[0], "29px", "29px", "58px", "0px");
			doh.assertEqual('-29px', demoWidget.iconNode.childNodes[0].style.top, "id= "+ demoWidget.domNode.id);
			doh.assertEqual('0px', demoWidget.iconNode.childNodes[0].style.left, "id= "+ demoWidget.domNode.id);

			demoWidget = dijit.byId("dojox_mobile_ToolBarButton_14");
			doh.assertTrue(demoWidget.iconNode, "there is no iconNode. id= "+ demoWidget.domNode.id);
			doh.assertTrue(demoWidget.iconNode.childNodes, "there is no iconNode.childNodes. id= "+ demoWidget.domNode.id);
			doh.assertEqual('duiDomButtonWhitePlus duiDomButton', demoWidget.iconNode.childNodes[0].className, "id= "+ demoWidget.domNode.id);

			demoWidget = dijit.byId("dojox_mobile_ToolBarButton_15");
			doh.assertTrue(demoWidget.iconNode, "there is no iconNode. id= "+ demoWidget.domNode.id);
			doh.assertTrue(demoWidget.iconNode.childNodes, "there is no iconNode.childNodes. id= "+ demoWidget.domNode.id);
			doh.assertEqual('duiDomButtonWhiteSearch duiDomButton', demoWidget.iconNode.childNodes[0].className, "id= "+ demoWidget.domNode.id);

			demoWidget = dijit.byId("dojox_mobile_ToolBarButton_16");
			doh.assertTrue(demoWidget.iconNode, "there is no iconNode. id= "+ demoWidget.domNode.id);
			doh.assertTrue(demoWidget.iconNode.childNodes, "there is no iconNode.childNodes. id= "+ demoWidget.domNode.id);
			doh.assertEqual('duiDomButtonWhitePlus duiDomButton', demoWidget.iconNode.childNodes[0].className, "id= "+ demoWidget.domNode.id);

			demoWidget = dijit.byId("dojox_mobile_ToolBarButton_17");
			doh.assertTrue(demoWidget.iconNode, "there is no iconNode. id= "+ demoWidget.domNode.id);
			doh.assertEqual('duiImageIcon', demoWidget.iconNode.className, "id= "+ demoWidget.domNode.id);
			if(!dojo.isIE){
				doh.assertTrue(demoWidget.iconNode.src.search(/tab-icon-15h.png/) != -1, "tab-icon-15h.png");
			}

			demoWidget = dijit.byId("dojox_mobile_ToolBarButton_18");
			doh.assertEqual('duiToolBarButton duiToolBarButtonRtl duiToolBarButtonHasRightArrow', demoWidget.domNode.className, "id= "+ demoWidget.domNode.id);
			doh.assertEqual('Top', demoWidget.labelNode.innerHTML);

			demoWidget = dijit.byId("dojox_mobile_ToolBarButton_19");
			doh.assertTrue(demoWidget.iconNode, "there is no iconNode. id= "+ demoWidget.domNode.id);
			doh.assertTrue(demoWidget.iconNode.childNodes, "there is no iconNode.childNodes. id= "+ demoWidget.domNode.id);
			doh.assertEqual('duiDomButtonWhiteSearch duiDomButton', demoWidget.iconNode.childNodes[0].className, "id= "+ demoWidget.domNode.id);

			demoWidget = dijit.byId("dojox_mobile_ToolBarButton_20");
			doh.assertTrue(demoWidget.iconNode, "there is no iconNode. id= "+ demoWidget.domNode.id);
			doh.assertTrue(demoWidget.iconNode.childNodes, "there is no iconNode.childNodes. id= "+ demoWidget.domNode.id);
			doh.assertEqual('duiDomButtonWhiteUpArrow duiDomButton', demoWidget.iconNode.childNodes[0].className, "id= "+ demoWidget.domNode.id);

			demoWidget = dijit.byId("dojox_mobile_ToolBarButton_21");
			doh.assertTrue(demoWidget.iconNode, "there is no iconNode. id= "+ demoWidget.domNode.id);
			doh.assertTrue(demoWidget.iconNode.childNodes, "there is no iconNode.childNodes. id= "+ demoWidget.domNode.id);
			doh.assertEqual('duiDomButtonWhiteDownArrow duiDomButton', demoWidget.iconNode.childNodes[0].className, "id= "+ demoWidget.domNode.id);
		},
		function test_Heading_Set(){
			demoWidget = dijit.byId("dojox_mobile_ToolBarButton_4");
			demoWidget.set({label: "New Value"});
			doh.assertEqual('New Value', demoWidget.labelNode.innerHTML, "id= "+ demoWidget.domNode.id);
			
			demoWidget = dijit.byId("dojox_mobile_ToolBarButton_2");
			demoWidget.set({icon: "duiDomButtonBlueCirclePlus"});
			doh.assertTrue(demoWidget.iconNode, "there is no iconNode. id= "+ demoWidget.domNode.id);
			doh.assertTrue(demoWidget.iconNode.childNodes, "there is no iconNode.childNodes. id= "+ demoWidget.domNode.id);
			doh.assertEqual('duiDomButtonBlueCirclePlus duiDomButton', demoWidget.iconNode.childNodes[0].className, "id= "+ demoWidget.domNode.id);
		}
	]);
	doh.run();
});

