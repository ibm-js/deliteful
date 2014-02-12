define(["dcl/dcl",
], function (dcl) {
	
	// module:
	//		deliteful/list/_DefaultStore

	return dcl(null, {
		// summary:
		//		Default store implementation that a List widget uses as its model.
		// description:
		//		This is a simple memory store implementation that supports the before
		//		option when adding / putting an item.
		
		// data: Array
		//		The array into which all items are stored
		data: null,
		
		// _ids: Array
		//		The internal array that stores all the items ids, in the
		//		same order than the items are store in the data array.
		_ids: null,
		
		// idProperty: String
		//		Name of the item attribute that contains the item's id
		idProperty: "id",

		// list: deliteful/list/List
		//		The List that uses this default store instance as its store.
		//		Note that a single default store instance cannot be shared
		//		between list instances.
		// tags:
		//		protected
		list: null,

		// _queried: boolean
		//		true if the store has already been queried, false otherwise
		_queried: false,

		constructor: function (/*deliteful/list/List*/list) {
			// summary:
			//		called when an instance is created.
			// list: deliteful/list/List
			//		the list that uses the default store instance.
			this.list = list;
			this.data = [];
			this._ids = [];
		},

		get: function (id) {
			// summary:
			//		Retrieve an item from the store.
			// id: object
			//		The item id.
			var index = this._ids.indexOf(id);
			if (index >= 0) {
				return this.data[index]; // Object
			}
		},

		query: function (query, options) {
			// summary:
			//		Retrieve items from the store.
			// query: Object
			//		The query to run to retrieve item. This
			//		argument is ignored by this implementation.
			// options: dojo/store/api/Store.QueryOptions?
			//		Optional query options. Only start and count are
			//		supported by this implementation.
			var results;
			if (options && (options.start || options.count)) {
				results = this.data.slice(options.start || 0,
						(options.start || 0) + (options.count || Infinity));
			} else {
				results = this.data.slice();
			}
			results.total = this.data.length;
			this._queried = true;
			return results; // Array
		},

		getIdentity: function (item) {
			// summary:
			//		Retrieve the id of an item
			return item[this.idProperty];
		},

		put: function (item, options) {
			// summary:
			//		Stores an item.
			// item: Object
			//		The item to store.
			// options: dojo/store/api/Store.PutDirectives?
			//		Additional metadata for storing the object. Supported
			//		options are id, overwrite and before.
			var beforeIndex = -1;
			var itemBeforeUpdate;
			var id = item[this.idProperty] = (options && "id" in options)
				? options.id : this.idProperty in item ? item[this.idProperty] : Math.random();
			var existingIndex = this._ids.indexOf(id);
			if (options && options.before) {
				beforeIndex = this._ids.indexOf(options.before[this.idProperty]);
			}
			if (existingIndex >= 0) {
				// item exists in store
				if (options && options.overwrite === false) {
					throw new Error("Item already exists");
				}
				// update the item
				itemBeforeUpdate = this.data[existingIndex];
				this.data[existingIndex] = item;
				if (beforeIndex >= 0 && beforeIndex !== existingIndex) {
					// move the item
					this.data.splice(beforeIndex, 0, this.data.splice(existingIndex, 1)[0]);
					this._ids.splice(beforeIndex, 0, this._ids.splice(existingIndex, 1)[0]);
					if (this._queried) {
						this.list.removeItem(existingIndex,
								this.list.itemToRenderItem(itemBeforeUpdate), null, true);
						this.list.addItem(beforeIndex, this.list.itemToRenderItem(item), null);
					}
				} else {
					if (this._queried) {
						this.list.putItem(existingIndex, this.list.itemToRenderItem(item), null);
					}
				}
			} else {
				// new item to add to store
				if (beforeIndex >= 0) {
					this.data.splice(beforeIndex, 0, item);
					this._ids.splice(beforeIndex, 0, id);
				} else {
					this.data.push(item);
					this._ids.push(id);
				}
				if (this._queried) {
					this.list.addItem(beforeIndex >= 0 ? beforeIndex : this.data.length - 1,
							this.list.itemToRenderItem(item), null);
				}
			}
			return id;
		},

		add: function (item, options) {
			// summary:
			//		Add an item to the store.
			// item: Object
			//		The item to ass to the store.
			// options: dojo/store/api/Store.PutDirectives?
			//		Additional metadata for adding the object. Supported
			//		options are id and before.
			var opts = options || {};
			opts.overwrite = false;
			return this.put(item, opts);
		},

		remove: function (id) {
			// summary:
			//		Remove an item from the store
			// id: Object
			//		The item id.
			var index = this._ids.indexOf(id), item;
			if (index >= 0 && index < this.data.length) {
				item = this.data.splice(index, 1)[0];
				this._ids.splice(index, 1);
				if (this._queried) {
					this.list.removeItem(index, this.list.itemToRenderItem(item), null, false);
				}
				return true;
			}
		}
	});
});
