/** 
 * @module deliteful/list/_DefaultStore
 * @private
 */
define(["dcl/dcl",
], function (dcl) {
	
	var FilterAndRange = {

		filter: function () {
			var	result = this.slice();
			result.total = this.length;
			dcl.mix(result, FilterAndRange);
			return result;
		},

		range: function (start, end) {
			var result = this.slice(start, end || Infinity);
			result.total = this.length;
			result.ranged = {start: start, end: end};
			dcl.mix(result, FilterAndRange);
			return result;
		}

	};

	/**
	 * Default store implementation that a List widget uses as its model.
	 * 
	 * This is a simple memory store implementation that supports the before
	 * option when adding / putting an item.
	 * 
	 * This implementation does not supports the following optional attributes
	 * and methods defined by the store api:
	 * - model
	 * - sort(...) methods
	 * - range(...) method (but it is supported by the collection returned by the filter method)
	 * @class module:deliteful/list/_DefaultStore
	 * @private
	 */
	return dcl(null, /** @lends module:deliteful/list/_DefaultStore# */ {

		/**
		 * The array into which all items are stored
		 * @member {Object[]}
		 */
		data: null,

		/**
		 * The internal map that stores all the items ids: the key is
		 *  the id of an item, the value is its index in the data table.
		 * @member {Object}
		 */
		_index: null,

		/**
		 * Name of the item attribute that contains the item's id
		 * @member {string}
		 */
		idProperty: "id",

		/**
		 * The List that uses this default store instance as its store.
		 * Note that a single default store instance cannot be shared
		 * between list instances.
		 * @member {module:deliteful/list/List}
		 * @protected
		 */
		list: null,

		/**
		 * Indicates whether or not the store has already been queried
		 * @member {boolean}
		 * @private
		 */
		_queried: false,

		/**
		 * Called when an instance is created.
		 * @param {module:deliteful/list/List} list T
		 * The list that uses the default store instance.
		 */
		constructor: function (list) {
			this.list = list;
			this.data = [];
			dcl.mix(this.data, FilterAndRange);
			this._index = {};
		},

		/**
		 * Retrieves an item from the store.
		 * @param {Object} id The item id.
		 * @returns {Object}
		 */
		get: function (id) {
			if (id in this._index) {
				return this.data[this._index[id]];
			}
		},

		/**
		 * Retrieves all items from the store, ignoring any input parameter.
		 * @returns {module:dstore/api/Store.Collection}
		 */
		filter: function () {
			var result = this.data.filter();
			this._queried = true;
			return result;
		},

		/**
		 * Retrieves the id of an item
		 * @param {Object} item The item
		 * @returns {Object}
		 */
		getIdentity: function (item) {
			return item[this.idProperty];
		},

		/*jshint maxcomplexity:13*/
		/**
		 * Stores an item.
		 * @param {Object} item The item to store.
		 * @param {module:dstore/api/Store.PutDirectives?} directives Additional metadata
		 * for storing the object. Supported directives are id, overwrite and before.
		 * @returns {Object} The id of the item
		 */
		put: function (item, directives) {
			var id = item[this.idProperty] = (directives && "id" in directives)
				? directives.id : this.idProperty in item ? item[this.idProperty] : Math.random();
			if (directives && directives.before) {
				var beforeIndex = this._index[this.getIdentity(directives.before)];
			}
			if (id in this._index) {
				// item exists in store
				var existingIndex = this._index[id];
				if (directives && directives.overwrite === false) {
					throw new Error("Item already exists");
				}
				// update the item
				this.data[existingIndex] = item;
				if (beforeIndex !== undefined && beforeIndex !== existingIndex) {
					// move the item
					this.data.splice(beforeIndex - (existingIndex < beforeIndex ? 1 : 0),
							0, this.data.splice(existingIndex, 1)[0]);
					this._reindex(Math.min(beforeIndex, existingIndex), Math.max(beforeIndex, existingIndex));
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
				if (beforeIndex !== undefined) {
					this.data.splice(beforeIndex, 0, item);
					this._index[this.getIdentity(item)] = beforeIndex;
					this._reindex(beforeIndex, this.data.length - 1);
				} else {
					this.data.push(item);
					this._index[this.getIdentity(item)] = this.data.length - 1;
				}
				if (this._queried) {
					this.list.itemAdded(beforeIndex !== undefined ? beforeIndex : this.data.length - 1,
							this.list.itemToRenderItem(item), null);
				}
			}
			return id;
		},

		/**
		 * Re index
		 * @param {number} from from index
		 * @param {number} to to index
		 * @private
		 */
		_reindex: function (from, to) {
			for (var i = from; i <= to; i++) {
				this._index[this.getIdentity(this.data[i])] = i;
			}
		},

		/**
		 * Adds an item to the store.
		 * @param {Object} item The item to add to the store.
		 * @param {module:dojo/store/api/Store.PutDirectives?} directives Additional metadata
		 * for adding the object. Supported directives are id and before.
		 * @returns {Object} The id of the item.
		 */
		add: function (item, directives) {
			var opts = directives || {};
			opts.overwrite = false;
			return this.put(item, opts);
		},

		/**
		 * Removes an item from the store
		 * @param {Object} id The item id.
		 * @returns {boolean} true if the item was removed,
		 * a falsy value otherwise
		 */
		remove: function (id) {
			if (id in this._index) {
				var index = this._index[id];
				this.data.splice(index, 1)[0];
				delete this._index[id];
				this._reindex(index, this.data.length - 1);
				if (this._queried) {
					this.list.itemRemoved(index, null, false);
				}
				return true;
			}
		}
	});
});
