define([
	"dojo/_base/kernel",
	"dojo/_base/declare",
	"dojo/dom-class",
	"dojo/dom-construct",
	"dui/form/_ComboBoxMenuMixin",
	"../Widget",
	"./_ListTouchMixin",
	"./scrollable",
	"dojo/has",
	"dojo/has!dojo-bidi?dui/mobile/bidi/_ComboBoxMenu"
],
	function(dojo, declare, domClass, domConstruct, ComboBoxMenuMixin, Widget, ListTouchMixin, Scrollable, has, BidiComboBoxMenu){
	// module:
	//		dui/mobile/_ComboBoxMenu

	var _ComboBoxMenu = declare(has("dojo-bidi") ? "dui.mobile._NonBidiComboBoxMenu" : "dui.mobile._ComboBoxMenu", [Widget, ListTouchMixin, ComboBoxMenuMixin], {
		// summary:
		//		Focus-less menu for internal use in dui/mobile/ComboBox.
		//		Abstract methods that must be defined externally:
		//
		//		- onChange: item was explicitly chosen (mousedown somewhere on the menu and mouseup somewhere on the menu);
		//		- onPage: next(1) or previous(-1) button pressed.
		// tags:
		//		private

		// baseClass: String
		//		The name of the CSS class of this widget.
		baseClass: "duiComboBoxMenu",
		
		// bgIframe: [private] Boolean
		//		Flag to prevent the creation of a background iframe, when appropriate. For internal usage. 
		bgIframe: true, // so it's not created for IE and FF

		buildRendering: function(){
			this.domNode = this.focusNode = domConstruct.create("div", { "class":"duiReset" });
			this.containerNode = domConstruct.create("div", { style: { position:"absolute", top:0, left:0 } }, this.domNode); // needed for scrollable
			this.previousButton = domConstruct.create("div", { "class":"duiReset duiComboBoxMenuItem duiComboBoxMenuPreviousButton", role:"option" }, this.containerNode);
			this.nextButton = domConstruct.create("div", { "class":"duiReset duiComboBoxMenuItem duiComboBoxMenuNextButton", role:"option" }, this.containerNode);
			this.inherited(arguments);
		},

		_createMenuItem: function(){
			// override of the method from dui/form/_ComboBoxMenu.
			return domConstruct.create("div", {
				"class": "duiReset duiComboBoxMenuItem" +(this.isLeftToRight() ? "" : " duiComboBoxMenuItemRtl"),
				role: "option"
			});
		},

		onSelect: function(/*DomNode*/ node){
			// summary:
			//		Add selected CSS.
			domClass.add(node, "duiComboBoxMenuItemSelected");
		},

		onDeselect: function(/*DomNode*/ node){
			// summary:
			//		Remove selected CSS.
			domClass.remove(node, "duiComboBoxMenuItemSelected");
		},

		onOpen: function(){
			// summary:
			//		Called when the menu opens.
			this.scrollable.init({
				domNode: this.domNode,
				containerNode: this.containerNode
			});
			this.scrollable.scrollTo({x:0, y:0});
		},

		onClose: function(){
			// summary:
			//		Called when the menu closes.
			this.scrollable.cleanup();
		},

		destroyRendering: function(){
			this.bgIframe = false; // no iframe to destroy
			this.inherited(arguments);
		},

		postCreate: function(){
			this.inherited(arguments);
			this.scrollable = new Scrollable();
			this.scrollable.resize = function(){}; // resize changes the height rudely
		}
	});
	return has("dojo-bidi") ? declare("dui.mobile._ComboBoxMenu", [_ComboBoxMenu, BidiComboBoxMenu]) : _ComboBoxMenu;
});
