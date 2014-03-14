define(["dcl/dcl",
], function (dcl) {
	
	// module:
	//		deliteful/list/_DefaultStore

	var FilterAndRange = {

		filter: function () {
			var	result = this.slice();
			result.total = this.length;
			dcl.mix(result, FilterAndRange);
			return result; // dstore/api/Store.Collection
		},

		range: function (start, end) {
			var result = this.slice(start, end || Infinity);
			result.total = this.length;
			result.ranged = {start: start, end: end};
			dcl.mix(result, FilterAndRange);
			return result; // dstore/api/Store.Collection
		}

	};

	return dcl(null, {
		// summary:
		//		Default store implementation that a List widget uses as its model.
		// description:
		//		This is a simple memory store implementation that supports the before
		//		option when adding / putting an item.
		//		This implementation does not supports the following optional attributes
		//		and methods defined by the store api:
		//		- model
		//		- sort(...) methods
		//		- range(...) method (but it is supported by the collection returned by the filter method)

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
			dcl.mix(this.data, FilterAndRange);
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

		filter: function () {
			// summary:
			//		Retrieve all items from the store, ignoring any input parameter.
			var result = this.data.filter();
			this._queried = true;
			return result; // dstore/api/Store.Collection
		},

		getIdentity: function (item) {
			// summary:
			//		Retrieve the id of an item
			return item[this.idProperty];
		},

		/*jshint maxcomplexity:12*/
		put: function (item, directives) {
			// summary:
			//		Stores an item.
			// item: Object
			//		The item to store.
			// directives: dstore/api/Store.PutDirectives?
			//		Additional metadata for storing the object. Supported
			//		directives are id, overwrite and before.
			var beforeIndex = -1;
			var id = item[this.idProperty] = (directives && "id" in directives)
				? directives.id : this.idProperty in item ? item[this.idProperty] : Math.random();
			var existingIndex = this._ids.indexOf(id);
			if (directives && directives.before) {
				beforeIndex = this._ids.indexOf(directives.before[this.idProperty]);
			}
			if (existingIndex >= 0) {
				// item exists in store
				if (directives && directives.overwrite === false) {
					throw new Error("Item already exists");
				}
				// update the item
				this.data[existingIndex] = item;
				if (beforeIndex >= 0 && beforeIndex !== existingIndex) {
					// move the item
					this.data.splice(beforeIndex, 0, this.data.splice(existingIndex, 1)[0]);
					this._ids.splice(beforeIndex, 0, this._ids.splice(existingIndex, 1)[0]);
					if (this._queried) {
						this.list.itemMoved(existingIndex, beforeIndex, this.list.itemToRenderItem(item), null);
					}
				} else {
					if (this._queried) {
						this.list.itemUpdated(existingIndex, this.list.itemToRenderItem(item), null);
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
					this.list.itemAdded(beforeIndex >= 0 ? beforeIndex : this.data.length - 1,
							this.list.itemToRenderItem(item), null);
				}
			}
			return id;
		},

		add: function (item, directives) {
			// summary:
			//		Add an item to the store.
			// item: Object
			//		The item to ass to the store.
			// directives: dojo/store/api/Store.PutDirectives?
			//		Additional metadata for adding the object. Supported
			//		directives are id and before.
			var opts = directives || {};
			opts.overwrite = false;
			return this.put(item, opts);
		},

		remove: function (id) {
			// summary:
			//		Remove an item from the store
			// id: Object
			//		The item id.
			var index = this._ids.indexOf(id);
			if (index >= 0 && index < this.data.length) {
				this.data.splice(index, 1)[0];
				this._ids.splice(index, 1);
				if (this._queried) {
					this.list.itemRemoved(index, null, false);
				}
				return true;
			}
		}
	});
});
