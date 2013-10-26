define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/window",
	"dojo/dom-construct",
	"dojo/dom-attr",
	"dojo/on",
	"dojo/topic",
	"../Contained",
	"../Container",
	"../Widget"
], function(declare, lang, win, domConstruct, domAttr, on, topic, Contained, Container, Widget){

	// module:
	//		dui/mobile/RoundRectList

	return declare("dui.mobile.RoundRectList", [Widget, Container, Contained], {
		// summary:
		//		A rounded rectangle list.
		// description:
		//		RoundRectList is a rounded rectangle list, which can be used to
		//		display a group of items. Each item must be a dui/mobile/ListItem.

		// transition: String
		//		The default animated transition effect for child items.
		transition: "slide",

		// iconBase: String
		//		The default icon path for child items.
		iconBase: "",

		// iconPos: String
		//		The default icon position for child items.
		iconPos: "",

		// select: String
		//		Selection mode of the list. The check mark is shown for the
		//		selected list item(s). The value can be "single", "multiple", or "".
		//		If "single", there can be only one selected item at a time.
		//		If "multiple", there can be multiple selected items at a time.
		//		If "", the check mark is not shown.
		select: "",

		// stateful: Boolean
		//		If true, the last selected item remains highlighted.
		stateful: false,

		// syncWithViews: [const] Boolean
		//		If true, this widget listens to view transition events to be
		//		synchronized with view's visibility.
		//		Note that changing the value of the property after the widget
		//		creation has no effect.
		syncWithViews: false,

		// editable: [const] Boolean
		//		If true, the list can be reordered.
		//		Note that changing the value of the property after the widget
		//		creation has no effect.
		editable: false,

		// tag: String
		//		A name of html tag to create as domNode.
		tag: "ul",

		/* internal properties */
		// editableMixinClass: String
		//		The name of the mixin class.
		editableMixinClass: "dui/mobile/_EditableListMixin",
		
		// baseClass: String
		//		The name of the CSS class of this widget.
		baseClass: "duiRoundRectList",
		
		// filterBoxClass: String
		//		The name of the CSS class added to the DOM node inside which is placed the 
		//		dui/mobile/SearchBox created when mixing dui/mobile/FilteredListMixin.
		//		The default value is "duiFilteredRoundRectListSearchBox".  
		filterBoxClass: "duiFilteredRoundRectListSearchBox",

		buildRendering: function(){
			this.domNode = this.srcNodeRef || domConstruct.create(this.tag);
			if(this.select){
				domAttr.set(this.domNode, "role", "listbox");
				if(this.select === "multiple"){
					domAttr.set(this.domNode, "aria-multiselectable", "true");
				}
			}
			this.inherited(arguments);
		},

		postCreate: function(){
			if(this.editable){
				require([this.editableMixinClass], lang.hitch(this, function(module){
					declare.safeMixin(this, new module());
				}));
			}
			this.own(on(this.domNode, "selectstart", function(e){
				e.preventDefault();
				e.stopPropagation();
			}));

			if(this.syncWithViews){ // see also TabBar#postCreate
				var f = function(view, moveTo, dir, transition, context, method){
					var child = this.getChildren().filter(function(w){
						return w.moveTo === "#" + view.id || w.moveTo === view.id; })[0];
					if(child){ child.set("selected", true); }
				};
				this.own(topic.subscribe("/dui/mobile/afterTransitionIn", lang.hitch(this, f)));
				this.own(topic.subscribe("/dui/mobile/startView", lang.hitch(this, f)));
			}
		},

		resize: function(){
			// summary:
			//		Calls resize() of each child widget.
			this.getChildren().forEach(function(child){
				if(child.resize){ child.resize(); }
			});
		},

		onCheckStateChanged: function(/*Widget*//*===== listItem, =====*/ /*String*//*===== newState =====*/){
			// summary:
			//		Stub function to connect to from your application.
			// description:
			//		Called when the check state has been changed.
		},

		_setStatefulAttr: function(stateful){
			// tags:
			//		private
			this._set("stateful", stateful);
			this.selectOne = stateful;
			this.getChildren().forEach(function(child){
				child.setArrow && child.setArrow();
			});
		},

		deselectItem: function(/*dui/mobile/ListItem*/item){
			// summary:
			//		Deselects the given item.
			item.set("selected", false);
		},

		deselectAll: function(){
			// summary:
			//		Deselects all the items.
			this.getChildren().forEach(function(child){
				child.set("selected", false);
			});
		},

		selectItem: function(/*ListItem*/item){
			// summary:
			//		Selects the given item.
			item.set("selected", true);
		}
	});
});
