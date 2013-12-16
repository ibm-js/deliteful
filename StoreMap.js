define(["dcl/dcl", "dojo/_base/lang", "./Store"], function (dcl, lang, Store) {

	var getvalue = function (map, item, key, store) {
		if (map[key + "Func"]) {
			return map[key + "Func"](item, store);
		} else if (map[key + "Attr"]) {
			return item[map[key + "Attr"]];
		} else {
			return item[key];
		}
	};

	var setvalue = function (map, item, key, store, value) {
		if (map[key + "Func"]) {
			map[key + "Func"](item, store, value);
		} else if (map[key + "Attr"]) {
			item[map[key + "Attr"]] = value;
		} else {
			item[key] = value;
		}
	};

	var propregexp = /^(?!_)(\w)+(?=Attr$|Func$)/;

	var attrregexp = /^(?!_)(\w)+(?=attr$|func$)/;

	var capitalize = /f(?=unc$)|a(?=ttr$)/;

	return dcl(Store, {

		// summary:
		//		Mixin providing store binding management for widgets that extend dui/mixins/Store. Classes extending
		//		this mixin can easily define how store items properties are mapped in the render items properties
		//		consumable by the widget. The mapping can either occur by property (property A in store item
		//		corresponds to property B in render item) or by function (a function is specified that mapped the
		//		store item into the value of a property of the render item).
		// description:
		//		For each mapped property "foo" from the render item one can provide:
		//			* fooAttr property in which case the mapping is looking into the store item property specified
		//				by fooAttr
		//			* fooFunc property function in which case the mapping is delegating the mapping operation to the
		//				fooFunc function.
		//			  fooFunc is of the following signature (value must be passed only for set operations:
		//				fooFunc(item, store, value)
		//			* if none of this is provided the mapping is looking into store item "foo" property
		//		Mapping property are meant to be added to the widget class using the mixin. One can directly add the
		// 		mapping properties to an instance but in this cases there are two limitations:
		//			* The property must be added before the widget is started
		//			* If the property is added in the markup only fully lower case properties are supported
		// 				(e.g. foobar not fooBar)

		// allowRemap: Boolean
		//		Whether the created render items will be updated when call the remap() function on the component
		//		allowing the consuming component to re-perform the mapping on demand. This property must not be
		//		changed after the initialization cycle.
		//		Default is false.
		allowRemap: false,

		// _mappedKeys: [private] Array?
		//		Array of item keys to be considered for mapping. The component will be introspected to find
		//		all the properties ending with "Attr" or "Func" and provide mapping for those.
		_mappedKeys: null,

		// copyAllItemProps: Boolean
		//		If true, in addition to the mapped properties copy all the other properties of the store item into
		//		the render item with direct mapping. This property must not be changed after the initialization cycle.
		//		Default is false.
		copyAllItemProps: false,

		startup: function () {
			var match, attr, idx = 0, value;
			var mappedKeys = [];
			// look into properties of the instance for keys to map
			for (var prop in this) {
				match = null;
				if ((match = propregexp.exec(prop)) && mappedKeys.indexOf(match[0]) === -1) {
					mappedKeys.push(match[0]);
				}
			}
			// look into attributes as well because only pre-declared properties are mapped from attr -> prop
			while ((attr = this.attributes[idx++])) {
				var name = attr.name.toLowerCase();	// note: will be lower case already except for IE9
				match = null;
				if ((match = attrregexp.exec(name))) {
					name = name.replace(capitalize, capitalize.exec(name)[0].toUpperCase());
					mappedKeys.push(match[0]);
					value = attr.value;
					if (name.lastIndexOf("Attr") === name.length - 4) {
						this[name] = value;
					} else {
						/* jshint evil:true */
						// This will be executed only if you use StoreMap mapping by function in your tag attributes:
						// <my-tag labelFunc="myfunc"></my-tag>
						// This can be avoided by using mapping by function progammatically or by not using it at all.
						// This is harmless if you make sure the JavaScript code that is passed to the attribute
						// is harmless.
						this[name] = lang.getObject(value, false) || new Function(value);
					}
				}
			}
			// which are the considered keys in the store item itself
			if (this.copyAllItemProps) {
				this._itemKeys = [];
				for (var i = 0; i < mappedKeys.length; i++) {
					this._itemKeys.push(this[mappedKeys[i] + "Attr"] ?
						this[mappedKeys[i] + "Attr"] : mappedKeys[i]);
				}
			}
			this._mappedKeys = mappedKeys;
			this.validateProperties();
		},


		validateProperties: dcl.superCall(function (sup) {
			return function (props) {
				// if we are not yet started we delay the validation because we need the mapping to be configured first
				if (this._started) {
					sup.call(this, props);
				}
			};
		}),

		validateRendering: dcl.superCall(function (sup) {
			return function (props) {
				// if we are not yet started we delay the validation because we need the mapping to be configured first
				if (this._started) {
					sup.call(this, props);
				}
			};
		}),

		renderItemToItem: function (/*Object*/ renderItem) {
			// summary:
			//		Create a store item based from the widget internal item. By default it returns the widget
			//		internal item itself.
			// renderItem: Object
			//		The render item.
			// returns: Object
			var item = {}, store = this.store;
			// special id case
			item[store.idProperty] = renderItem.id;
			for (var key in renderItem) {
				setvalue(this, item, key, store, renderItem[key]);
			}
			return lang.mixin(store.get(renderItem[store.idProperty]), item);
		},

		itemToRenderItem: function (item) {
			// summary:
			//		Returns the widget internal item for a given store item. By default it returns the store
			//		item itself.
			// item: Object
			//		The store item.
			// tags:
			//		protected

			var renderItem = {};
			var mappedKeys = this._mappedKeys;
			var store = this.store;

			if (this.allowRemap) {
				// if we allow remap we need to store the initial item
				// we need this to be enumerable for dealing with update case (where only enumerable
				// properties are copied)
				renderItem.__item = item;
			}

			// special id case
			renderItem.id = store.getIdentity(item);
			// general mapping case
			for (var i = 0; i < mappedKeys.length; i++) {
				renderItem[mappedKeys[i]] = getvalue(this, item, mappedKeys[i], store);
			}
			if (this.copyAllItemProps) {
				for (var key in item) {
					if (this._itemKeys.indexOf(key) === -1) {
						renderItem[key] = item[key];
					}
				}
			}

			return renderItem;
		},

		remap: function () {
			var items = this.items;
			var mappedKeys = this._mappedKeys;
			for (var i = 0; i < items.length; i++) {
				for (var j = 0; j < mappedKeys.length; j++) {
					items[i][mappedKeys[j]] = getvalue(this, items[i].__item, mappedKeys[j], this.store);
				}
			}
		}
	});
});
