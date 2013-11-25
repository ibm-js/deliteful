define([
	"dojo/_base/declare",
	"../StoreMap",
	"./ListItem",
	"dojo/has",
	"dojo/has!dojo-bidi?dui/mobile/bidi/_StoreListMixin"
], function(declare, StoreMap, ListItem, has, BidiStoreListMixin){

	// module:
	//		dui/mobile/_StoreListMixin

	var _StoreListMixin = declare(StoreMap, {
		// summary:
		//		Mixin for widgets to generate the list items corresponding to
		//		the dojo/store data provider object.
		// description:
		//		Mixin for widgets to generate the list items corresponding to
		//		the dojo/store data provider object.
		//		By mixing this class into the widgets, the list item nodes are
		//		generated as the child nodes of the widget and automatically
		//		regenerated whenever the corresponding data items are modified.

		// append: Boolean
		//		If true, when a new store/query is set the existing items are not cleared before adding the new ones.
		append: false,

		// itemRenderer: ListItem class or subclass
		//		The class used to create list items. Default is dui/mobile/ListItem.
		itemRenderer: ListItem,

		labelAttr: "label",

		headerAttr: "header",

		constructor: function(){
			// if dojo has bidi we add a special mapping function
			if(has("dojo-bidi")){
				var self = this;
				this.dirFunc = function(item){
					if(typeof item["dir"] == "undefined"){
						return self.isLeftToRight()?"ltr":"rtl";
					}
					return item.dir;
				};
			}
		},

		createListItem: function(/*Object*/item){
			// summary:
			//		Creates a list item widget.
			return new this.itemRenderer(item);
		},

		initItems: function(/*Array*/items){
			// summary:
			//		Given the data, generates a list of items.
			if(!this.append){
				this.getChildren().forEach(function(child){
					child.destroyRecursive();
				});
			}
			items.forEach(function(item){
				this.addChild(this.createListItem(item));
				// TODO re-introduce child management
			}, this);
			this.inherited(arguments);
		},

		addItem: function(index, item, items){
			// summary:
			//		Calls createListItem and adds the new list item when a new data item has been added to the store.
			this.inherited(arguments);
			this.addChild(this.createListItem(item), index);
		},

		putItem: function(index, item, items){
			// summary:
			//		Updates an existing list item when a data item has been modified.
			this.inherited(arguments);
			this.getChildren()[index].set(item);
		},

		removeItem: function(index, item, items){
			// summary:
			//		Deletes an existing item.
			this.inherited(arguments);
			this.getChildren()[index].destroyRecursive();
		}
	});
	return has("dojo-bidi") ? declare([_StoreListMixin, BidiStoreListMixin]) : _StoreListMixin;
});
