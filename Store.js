/** @module deliteful/Store */
define(["dcl/dcl", "delite/register", "delite/CustomElement", "dstore/Memory", "dstore/Trackable"],
	function (dcl, register, CustomElement, Memory, Trackable) {

	var Store = Memory.createSubclass([Trackable], {});

	var STORE_TYPES = [
		"add",
		"remove",
		"put",
		"delete",
		"refresh",
		"update"
	];

	/**
	 * Custom element to create an instance of a memory store object.
	 * It is particularly useful in markup, when creating store programatically, it's easier to just create a store
	 * instance directly rather than using the custom element.
	 * Note that it is only parsed once at attachment time. Further modifications to the store must be made through
	 * the store API instead of the DOM API.
	 * @example
	 * <body>
	 *   <d-store>
	 *    { "label": "France", "sales": 500, "profit": 50, "region": "EU" },
	 *    { "label": "Germany", "sales": 450, "profit": 48, "region": "EU" },
	 *    { "label": "UK", "sales": 700, "profit": 60, "region": "EU" }
	 *   </d-dstore>
	 * </body>
	 * @class module:deliteful/Store
	 * @augments module:delite/CustomElement
	 */
	return register("d-store", [HTMLElement, CustomElement], /** @lends module:deliteful/Store# */{
		createdCallback: function () {
			this.style.display = "none";
		},
		attachedCallback: function () {
			var store = new Store();
			var data = JSON.parse("[" + this.textContent + "]");
			for (var j = 0; j < data.length; j++) {
				if (!data[j][store.idProperty]) {
					data[j][store.idProperty] = Math.random();
				}
			}
			store.setData(data);
			// save store specific on/emit and later use them only for store specific events
			store._emit = store.emit;
			store._on = store.on;
			var include = store._includePropertyInSubCollection;
			// save custom element specific on/emit to restore them after mixin
			var emit = this.emit;
			var on = this.on;
			dcl.mix(this, store);
			// on iOS/Safari ctor is not copied but we need _meta for dstore/dojo declare to work
			if (!this.constructor._meta) {
				this.constructor._meta = store.constructor._meta;
			}
			// those were overriden by dcl.mix put them back
			this.emit = emit;
			this.on = on;
			// avoid issue with IE
			this._includePropertyInSubCollection = function (name) {
				return name !== "recordset" && include.apply(this, arguments);
			};
		},
		on: dcl.superCall(function (sup) {
			return function (type) {
				if (STORE_TYPES.indexOf(type) !== -1) {
					return this._on.apply(this, arguments);
				} else {
					return sup.apply(this, arguments);
				}
			};
		}),
		emit: dcl.superCall(function (sup) {
			return function (type) {
				if (STORE_TYPES.indexOf(type) !== -1) {
					return this._emit.apply(this, arguments);
				} else {
					return sup.apply(this, arguments);
				}
			};
		})
	});
});
