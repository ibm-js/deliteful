define(["dcl/dcl", "dojo/_base/lang", "./Store"],
	function(dcl, lang, Store){

	var getvalue = function(map, item, key, store){
		if(map[key+"Func"]){
			return map[key+"Func"](item, store);
		}else if(map[key+"Attr"]){
			return item[map[key+"Attr"]];
		}else{
			return item[key];
		}
	};

	var setvalue = function(map, item, key, store, value){
		if(map[key+"Func"]){
			map[key+"Func"](item, store, value);
		}else if(map[key+"Attr"]){
			item[map[key+"Attr"]] = value;
		}else{
			item[key] = value;
		}
	};

	var attrregexp = /^(?!_set)(\w)+(?=Attr$|Func$)/;

	return dcl(Store, {

		// summary:
		//		Mixin providing store binding management for widgets that extend dui/mixins/Store. Classes extending
		//		this mixin can easily define how store items properties are mapped in the render items properties consumable
		// 		by the widget. The mapping can either occur by property (property A in store item corresponds to property B
		//		in render item) or by function (a function is specified that mapped the store item into the value of a
		//		property of the render item).
		// description:
		//		For each mapped property "foo" from the render item one can provide:
		//			* fooAttr property in which case the mapping is looking into the store item property specified by fooAttr
		//			* fooFunc property function in which case the mapping is delegating the mapping operation to the fooFunc function.
		//			  fooFunc is of the following signature (value must be passed only for set operations:
		//				fooFunc(item, store, value)
		//			* if none of this is provided the mapping is looking into store item "foo" property

		// mapAtInit: Boolean
		//		Whether the mapping occurs once when store items are loaded or on demand each time a property is accessed.
		// 		This can only makes an actual difference if you are using a binding function which behavior varies over time. Default is true.
		mapAtInit: true,

		// mappedKeys: Array?
		//		Array of item keys to be considered for mapping. If null the component will be introspected to find all the properties
		// 		ending with "Attr" or "Func" and provide mapping for those. Default is null.
		mappedKeys: null,

		// copyAllItemProps: Boolean
		//		If true, in addition to the mapped properties copy all the other properties of the store item into the render item
		// 		with direct mapping. Default is false.
		copyAllItemProps: false,

		postMixInProperties: function(){
			var match;
			if(!this.mappedKeys){
				this.mappedKeys = [];
				for(var prop in this){
					match = null;
					if((match = attrregexp.exec(prop)) && match && this.mappedKeys.indexOf(match[0]) == -1){
						this.mappedKeys.push(match[0]);
					}
				}
			}
			// which are the considered keys in the store item itself
			this._itemKeys = [];
			for(var key in this.mappedKeys){
				this._itemKeys.push(this[key+"Attr"]?this[key+"Attr"]:key);
			}
		},

		renderItemToItem: function(/*Object*/ renderItem){
			// summary:
			//		Create a store item based from the widget internal item. By default it returns the widget internal item itself.
			// renderItem: Object
			//		The render item.
			// returns: Object
			var item, store = this.store;
			if(this.mapAtInit){
				item = {};
				// special id case
				item[store.idProperty] = renderItem.id;
				for(var key in renderItem){
					setvalue(this, item, key, store, renderItem[key]);
				}
			}else{
				// mapping has already been done onto the original item
				// just use it
				item = renderItem.__item;
			}
			return lang.mixin(store.get(renderItem[store.idProperty]), item);
		},

		itemToRenderItem: function(item){
			// summary:
			//		Returns the widget internal item for a given store item. By default it returns the store item itself.
			// item: Object
			//		The store item.
			// tags:
			//		protected

			var renderItem = {};
			var mappedKeys = this.mappedKeys?this.mappedKeys:Object.keys(item);
			var self = this, store = this.store;

			if(!this.mapAtInit){
				Object.defineProperty(renderItem, "__item", {
					value: lang.clone(item),
					enumerable: false
				});
			}

			// special id case
			renderItem.id = store.getIdentity(item);
			// general mapping case
			for(var i = 0; i < mappedKeys.length; i++){
				if(this.mapAtInit){
					renderItem[mappedKeys[i]] = getvalue(this, item, mappedKeys[i], store);
				}else{
					(function(key){
						Object.defineProperty(renderItem, key, {
							get: function(){ return getvalue(self, this.__item, key, store); },
		    				set: function(value){ setvalue(self, this.__item, key, store, value); }
						});
					})(mappedKeys[i]);
				}
			}
			if(this.copyAllItemProps){
				for(var key in item){
					if(this._itemKeys.indexOf(key) == -1){
						renderItem[key] = item[key];
					}
				}
			}

			return renderItem;
		}
	});
});
