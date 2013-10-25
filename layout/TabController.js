define([
	"dojo/_base/declare", // declare
	"dojo/dom", // dom.setSelectable
	"dojo/dom-attr", // domAttr.attr
	"dojo/dom-class", // domClass.toggle
	"dojo/has",
	"dojo/_base/lang", // lang.hitch
	"./StackController",
	"../registry",
	"../dui/Menu",
	"../dui/MenuItem",
	"dojo/text!./templates/_TabButton.html",
	"dojo/i18n!../nls/common"
], function(declare, dom, domAttr, domClass, has, lang, StackController, registry, Menu, MenuItem, template, nlsCommon){

	// module:
	//		dui/layout/TabController

	var TabButton = declare("dui.layout._TabButton" + (has("dojo-bidi") ? "_NoBidi" : ""), StackController.StackButton, {
		// summary:
		//		A tab (the thing you click to select a pane).
		// description:
		//		Contains the title of the pane, and optionally a close-button to destroy the pane.
		//		This is an internal widget and should not be instantiated directly.
		// tags:
		//		private

		// baseClass: String
		//		The CSS class applied to the domNode.
		baseClass: "duiTab",

		// Apply duiTabCloseButtonHover when close button is hovered
		cssStateNodes: {
			closeNode: "duiTabCloseButton"
		},

		templateString: template,

		// Button superclass maps name to a this.valueNode, but we don't have a this.valueNode attach point
		_setNameAttr: "focusNode",

		// Override _FormWidget.scrollOnFocus.
		// Don't scroll the whole tab container into view when the button is focused.
		scrollOnFocus: false,

		buildRendering: function(){
			this.inherited(arguments);

			dom.setSelectable(this.containerNode, false);
		},

		_setCloseButtonAttr: function(/*Boolean*/ disp){
			// summary:
			//		Hide/show close button
			this._set("closeButton", disp);
			domClass.toggle(this.domNode, "duiClosable", disp);
			this.closeNode.style.display = disp ? "" : "none";
			if(disp){
				if(this.closeNode){
					domAttr.set(this.closeNode, "title", nlsCommon.itemClose);
				}
			}
		},

		_setDisabledAttr: function(/*Boolean*/ disabled){
			// summary:
			//		Make tab selected/unselectable

			this.inherited(arguments);

			// Don't show tooltip for close button when tab is disabled
			if(this.closeNode){
				if(disabled){
					domAttr.remove(this.closeNode, "title");
				}else{
					domAttr.set(this.closeNode, "title", nlsCommon.itemClose);
				}
			}
		},

		_setLabelAttr: function(/*String*/ content){
			// summary:
			//		Hook for set('label', ...) to work.
			// description:
			//		takes an HTML string.
			//		Inherited ToggleButton implementation will Set the label (text) of the button;
			//		Need to set the alt attribute of icon on tab buttons if no label displayed
			this.inherited(arguments);
			if(!this.showLabel && !this.params.title){
				this.iconNode.alt = (this.containerNode.innerText || this.containerNode.textContent || '').trim();
			}
		}
	});

	if(has("dojo-bidi")){
		TabButton = declare("dui.layout._TabButton", TabButton, {
			_setLabelAttr: function(/*String*/ content){
				this.inherited(arguments);
				this.applyTextDir(this.iconNode, this.iconNode.alt);
			}
		});
	}

	var TabController = declare("dui.layout.TabController", StackController, {
		// summary:
		//		Set of tabs (the things with titles and a close button, that you click to show a tab panel).
		//		Used internally by `dui/layout/TabContainer`.
		// description:
		//		Lets the user select the currently shown pane in a TabContainer or StackContainer.
		//		TabController also monitors the TabContainer, and whenever a pane is
		//		added or deleted updates itself accordingly.
		// tags:
		//		private

		baseClass: "duiTabController",

		templateString: "<div role='tablist' data-dojo-attach-event='onkeydown:onkeydown'></div>",

		// tabPosition: String
		//		Defines where tabs go relative to the content.
		//		"top", "bottom", "left-h", "right-h"
		tabPosition: "top",

		// buttonWidget: Constructor
		//		The tab widget to create to correspond to each page
		buttonWidget: TabButton,

		// buttonWidgetCloseClass: String
		//		Class of [x] close icon, used by event delegation code to tell when close button was clicked
		buttonWidgetCloseClass: "duiTabCloseButton",

		postCreate: function(){
			this.inherited(arguments);

			// Setup a close menu to be shared between all the closable tabs (excluding disabled tabs)
			var closeMenu = new Menu({
				id: this.id + "_Menu",
				ownerDocument: this.ownerDocument,
				dir: this.dir,
				lang: this.lang,
				textDir: this.textDir,
				targetNodeIds: [this.domNode],
				selector: function(node){
					return domClass.contains(node, "duiClosable") && !domClass.contains(node, "duiTabDisabled");
				}
			});
			this.own(closeMenu);

			var controller = this;
			closeMenu.addChild(new MenuItem({
				label: nlsCommon.itemClose,
				ownerDocument: this.ownerDocument,
				dir: this.dir,
				lang: this.lang,
				textDir: this.textDir,
				onClick: function(evt){
					var button = registry.byNode(this.getParent().currentTarget);
					controller.onCloseButtonClick(button.page);
				}
			}));
		}
	});

	TabController.TabButton = TabButton;	// for monkey patching

	return TabController;
});
