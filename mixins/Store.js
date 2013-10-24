define(["dcl/dcl", "dojo/_base/lang", "dojo/when", "./Invalidating"], function (dcl, lang, when, Invalidating) {

	var isStoreInvalidated = function (props) {
		return props.store || props.query || props.queryOptions;
	};

	var setStoreValidate = function (props) {
		props.store = props.query = props.queryOptions = false;
	};

	return dcl(Invalidating, {

		// summary:
		//		Mixin for widgets for store management that creates widget render items from store items after
		//		querying the store. The receiving class must extend dojo/Stateful and dojo/Evented or
		//		dui/Widget.
		// description:
		//		Classes extending this mixin automatically create render items that are consumable by the widget
		//		from store items after querying the store. This happens each time the widget store, query or
		//		queryOptions properties are set. If that store is Observable it will be observed and render items
		//		will be automatically updated, added or deleted from the items property based on store notifications.

		// store: dojo/store/Store
		//		The store that contains the items to display.
		store: null,

		// query: Object
		//		A query that can be passed to when querying the store.
		query: {},

		// queryOptions: dojo/store/api/Store.QueryOptions?
		//		Options to be applied when querying the store.
		queryOptions: null,

		// items: Array
		//		The render items corresponding to the store items for this widget. This is filled from the store and
		//		is not supposed to be modified directly. Initially null.
		items: null,

		preCreate: function () {
			// we want to be able to wait for potentially several of those properties to be set before
			// actually firing the store request
			this.addInvalidatingProperties({
					"store": "invalidateProperty",
					"query": "invalidateProperty",
					"queryOptions": "invalidateProperty"
				}
			);
		},

		renderItemToItem: function (/*Object*/ renderItem) {
			// summary:
			//		Creates a store item from the render item. By default it returns the render item itself.
			// renderItem: Object
			//		The render item.
			// returns: Object
			return renderItem;
		},

		itemToRenderItem: function (item) {
			// summary:
			//		Returns the render item for a given store item. By default it returns the store item itself.
			// item: Object
			//		The store item.
			// tags:
			//		protected
			return item;
		},

		initItems: function (items) {
			// tags:
			//		protected
			this.items = items;
			this.emit("query-success", { items: items, cancelable: false, bubbles: true });
		},

		refreshProperties: function (props) {
			// summary:
			//		Actually refresh the rendering by querying the store.
			// tags:
			//		protected
			if (isStoreInvalidated(props)) {
				if (this._observeHandler) {
					this._observeHandler.remove();
					this._observeHandler = null;
				}
				setStoreValidate(props);
				var store = this.store;
				if (store != null) {
					var results = store.query(this.query, this.queryOptions);
					if (results.observe) {
						// user asked us to observe the store
						this._observeHandler = results.observe(lang.hitch(this, "_updateItem"), true);
					}
					// if we have a mapping function between store item and some intermediary items use it
					results = results.map(lang.hitch(this, function (item) {
						return this.itemToRenderItem(item, store);
					}));
					when(results, lang.hitch(this, this.initItems), lang.hitch(this, "_queryError"));
				} else {
					this.initItems([]);
				}
			}
		},

		_queryError: function (error) {
			this.emit("query-error", { error: error, cancelable: false, bubbles: true });
		},

		_updateItem: function (object, previousIndex, newIndex) {
			// tags:
			//		private

			var items = this.items;

			// if we have a mapping function between store item and some intermediary items use it
			var newItem = this.itemToRenderItem(object, this.store);

			if (previousIndex !== -1) {
				// this is a remove or a move
				if (newIndex !== previousIndex) {
					// remove
					this.removeItem(previousIndex, newItem, items);
				} else {
					// this is a put, previous and new index identical
					this.putItem(previousIndex, newItem, items);
				}
			} else if (newIndex !== -1) {
				// this is a add
				this.addItem(newIndex, newItem, items);

			}
			// set back the modified items property
			this.items = items;
		},

		destroy: function () {
			if (this._observeHandler) {
				this._observeHandler.remove();
				this._observeHandler = null;
			}
		},

		removeItem: function (index, item, items) {
			// summary:
			//		Remove a render item. This can be redefined but must not be called directly.
			// index: Number
			//		The index of the removed item.
			// item: Object
			//		The removed item.
			// items: Array
			//		The array of items to remove the item from.
			// tags:
			//		protected
			items.splice(index, 1);
		},

		putItem: function (index, item, items) {
			// summary:
			//		Modify a render item. This can be redefined but must not be called directly.
			// index: Number
			//		The index of the modified item.
			// item: Object
			//		The modified item.
			// items: Array
			//		The array of items in which the modified item is.
			// tags:
			//		protected

			// we want to keep the same item object and mixin new values into old object
			lang.mixin(items[index], item);
		},

		addItem: function (index, item, items) {
			// summary:
			//		Add a render item. This can be redefined but must not be called directly.
			// index: Number
			//		The index of the added item.
			// item: Object
			//		The added item.
			// items: Array
			//		The array of items in which to add the item.
			// tags:
			//		protected
			items.splice(index, 0, item);
		}
	});
});
