define([
	"dojo/_base/array",
	"dojo/_base/declare",
	"../mixins/StoreMap",
	"./ListItem",
	"dojo/has",
	"dojo/has!dojo-bidi?dojox/mobile/bidi/_StoreListMixin"
], function(array, declare, StoreMap, ListItem, has, BidiStoreListMixin){

	// module:
	//		dojox/mobile/_StoreListMixin

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
		//		The class used to create list items. Default is dojox/mobile/ListItem.
		itemRenderer: ListItem,

		labelAttr: "label",

		copyAllItemProps: true,

		createListItem: function(/*Object*/item){
			// summary:
			//		Creates a list item widget.
			return new this.itemRenderer(item);
		},

		// TODO bidi code?
		// if(has("dojo-bidi") && typeof props["dir"] == "undefined"){
		// props["dir"] = this.isLeftToRight() ? "ltr" : "rtl";
		// }

		_setDirAttr: function(props){
			// summary:
			//		Set the 'dir' attribute to support Mirroring.
			//		To be implemented by the bidi/_StoreLisMixin.js
			return props;
		},

		initItems: function(/*Array*/items){
			// summary:
			//		Given the data, generates a list of items.
			if(!this.append){
				array.forEach(this.getChildren(), function(child){
					child.destroyRecursive();
				});
			}
			array.forEach(items, function(item){
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
