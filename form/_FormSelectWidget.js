define([
	"dojo/Deferred",
	"dojo/aspect", // aspect.after
	"dojo/_base/declare", // declare
	"dojo/dom", // dom.setSelectable
	"dojo/dom-class", // domClass.toggle
	"dojo/_base/kernel",	// _scopeName
	"dojo/_base/lang", // lang.delegate lang.isObject lang.hitch
	"dojo/query", // query
	"dojo/when",
	"dojo/store/util/QueryResults",
	"../FormValueWidget"
], function(Deferred, aspect, declare, dom, domClass, kernel, lang, query, when,
			QueryResults, FormValueWidget){

	// module:
	//		dui/form/_FormSelectWidget

	/*=====
	var __SelectOption = {
		// value: String
		//		The value of the option.  Setting to empty (or missing) will
		//		place a separator at that location
		// label: String
		//		The label for our option.  It can contain html tags.
		// selected: Boolean
		//		Whether or not we are a selected option
		// disabled: Boolean
		//		Whether or not this specific option is disabled
	};
	=====*/

	var _FormSelectWidget = declare("dui.form._FormSelectWidget", FormValueWidget, {
		// summary:
		//		Extends FormValueWidget in order to provide "select-specific"
		//		values - i.e., those values that are unique to `<select>` elements.
		//		This also provides the mechanism for reading the elements from
		//		a store, if desired.

		// multiple: [const] Boolean
		//		Whether or not we are multi-valued
		multiple: false,

		// options: __SelectOption[]
		//		The set of options for our select item.  Roughly corresponds to
		//		the html `<option>` tag.
		options: null,

		// store: dojo/store/api/Store
		//		A store to use for getting our list of options - rather than reading them
		//		from the `<option>` html tags.   Should support getIdentity().
		//		For back-compat store can also be a dojo/data/api/Identity.
		store: null,

		// query: object
		//		A query to use when fetching items from our store
		query: null,

		// queryOptions: object
		//		Query options to use when fetching from the store
		queryOptions: null,

		// labelAttr: String?
		//		The entries in the drop down list come from this attribute in the dojo.store items.
		//		If ``store`` is set, labelAttr must be set too.
		labelAttr: "",

		// loadChildrenOnOpen: Boolean
		//		By default loadChildren is called when the items are fetched from the
		//		store.  This property allows delaying loadChildren (and the creation
		//		of the options/menuitems) until the user clicks the button to open the
		//		dropdown.
		loadChildrenOnOpen: false,

		// onLoadDeferred: [readonly] dojo.Deferred
		//		This is the `dojo.Deferred` returned by setStore().
		//		Calling onLoadDeferred.then() registers your
		//		callback to be called only once, when the prior setStore completes.
		onLoadDeferred: null,

		getOptions: function(/*anything*/ valueOrIdx){
			// summary:
			//		Returns a given option (or options).
			// valueOrIdx:
			//		If passed in as a string, that string is used to look up the option
			//		in the array of options - based on the value property.
			//		(See dui/form/_FormSelectWidget.__SelectOption).
			//
			//		If passed in a number, then the option with the given index (0-based)
			//		within this select will be returned.
			//
			//		If passed in a dui/form/_FormSelectWidget.__SelectOption, the same option will be
			//		returned if and only if it exists within this select.
			//
			//		If passed an array, then an array will be returned with each element
			//		in the array being looked up.
			//
			//		If not passed a value, then all options will be returned
			//
			// returns:
			//		The option corresponding with the given value or index.
			//		null is returned if any of the following are true:
			//
			//		- A string value is passed in which doesn't exist
			//		- An index is passed in which is outside the bounds of the array of options
			//		- A dui/form/_FormSelectWidget.__SelectOption is passed in which is not a part of the select

			// NOTE: the compare for passing in a dui/form/_FormSelectWidget.__SelectOption checks
			//		if the value property matches - NOT if the exact option exists
			// NOTE: if passing in an array, null elements will be placed in the returned
			//		array when a value is not found.
			var opts = this.options || [];

			if(valueOrIdx == null){
				return opts; // __SelectOption[]
			}
			if(Array.isArray(valueOrIdx)){
				return valueOrIdx.map(function(item){
					return this.getOptions(item); 
				}, this); // __SelectOption[]
			}
			if(typeof valueOrIdx === "string"){
				valueOrIdx = { value: valueOrIdx };
			}
			if(lang.isObject(valueOrIdx)){ // TODO: call of lang.isObject to be addressed later
				// We were passed an option - so see if it's in our array (directly),
				// and if it's not, try and find it by value.

				if(!opts.some(function(option, idx){
					for(var a in valueOrIdx){
						if(!(a in option) || option[a] != valueOrIdx[a]){ // == and not === so that 100 matches '100'
							return false;
						}
					}
					valueOrIdx = idx;
					return true; // stops iteration through opts
				})){
					valueOrIdx = -1;
				}
			}
			if(valueOrIdx >= 0 && valueOrIdx < opts.length){
				return opts[valueOrIdx]; // __SelectOption
			}
			return null; // null
		},

		addOption: function(/*__SelectOption|__SelectOption[]*/ option){
			// summary:
			//		Adds an option or options to the end of the select.  If value
			//		of the option is empty or missing, a separator is created instead.
			//		Passing in an array of options will yield slightly better performance
			//		since the children are only loaded once.
			(Array.isArray(option) ? option : [option]).forEach(function(i){
				if(i && lang.isObject(i)){ // TODO: call of lang.isObject to be addressed later
					this.options.push(i);
				}
			}, this);
			this._loadChildren();
		},

		removeOption: function(/*String|__SelectOption|Number|Array*/ valueOrIdx){
			// summary:
			//		Removes the given option or options.  You can remove by string
			//		(in which case the value is removed), number (in which case the
			//		index in the options array is removed), or select option (in
			//		which case, the select option with a matching value is removed).
			//		You can also pass in an array of those values for a slightly
			//		better performance since the children are only loaded once.
			//		For numeric option values, specify {value: number} as the argument.
			var oldOpts = this.getOptions(Array.isArray(valueOrIdx) ? valueOrIdx : [valueOrIdx]);
			if(oldOpts){ // getOptions() can return null
				oldOpts.forEach(function(option){
					// We can get null back in our array - if our option was not found.  In
					// that case, we don't want to blow up...
					if(option){
						this.options = this.options ? this.options.filter(function(node){
							return (node.value !== option.value || node.label !== option.label);
						}) : [];
						this._removeOptionItem(option);
					}
				}, this);
			}
			this._loadChildren();
		},

		updateOption: function(/*__SelectOption|__SelectOption[]*/ newOption){
			// summary:
			//		Updates the values of the given option.  The option to update
			//		is matched based on the value of the entered option.  Passing
			//		in an array of new options will yield better performance since
			//		the children will only be loaded once.
			(Array.isArray(newOption) ? newOption : [newOption]).forEach(function(i){
				var oldOpt = this.getOptions({ value: i.value }), k;
				if(oldOpt){
					for(k in i){
						oldOpt[k] = i[k];
					}
				}
			}, this);
			this._loadChildren();
		},

		setStore: function(store, selectedValue, fetchArgs){
			// summary:
			//		Sets the store you would like to use with this select widget.
			//		The selected value is the value of the new store to set.  This
			//		function returns the original store, in case you want to reuse
			//		it or something.
			// store: dojo/store/api/Store
			//		The dojo.store you would like to use - it MUST implement getIdentity()
			//		and MAY implement observe().
			//		For backwards-compatibility this can also be a data.data store, in which case
			//		it MUST implement dojo/data/api/Identity,
			//		and MAY implement dojo/data/api/Notification.
			// selectedValue: anything?
			//		The value that this widget should set itself to *after* the store
			//		has been loaded
			// fetchArgs: Object?
			//		Hash of parameters to set filter on store, etc.
			//
			//		- query: new value for Select.query,
			//		- queryOptions: new value for Select.queryOptions,

			var oStore = this.store;
			fetchArgs = fetchArgs || {};
			this._set("store", store);

			// Remove existing options (if there are any)
			if(this.options && this.options.length){
				this.removeOption(this.options);
			}

			// Cancel listener for updates to new (dojo.store) store
			if(this._observeHandle && this._observeHandle.remove){
				this._observeHandle.remove();
				this._observeHandle = null;
			}

			// If user has specified new query and query options along with this new store, then use them.
			if(fetchArgs.query){
				this._set("query", fetchArgs.query);
				this._set("queryOptions", fetchArgs.queryOptions);
			}

			// Add our new options
			if(store){
				this._loadingStore = true;
				this.onLoadDeferred = new Deferred();

				// Run query
				// Save result in this._queryRes so we can cancel the listeners we register below
				this._queryRes = store.query(this.query, this.queryOptions);
				when(this._queryRes, lang.hitch(this, function(items){
					// TODO: Add these guys as a batch, instead of separately
					if(items){
						items.forEach(function(i){
							this._addOptionForItem(i);
						}, this);
					}

					// Register listener for store updates
					if(this._queryRes.observe){
						// observe returns yet another handle that needs its own explicit gc
						this._observeHandle = this._queryRes.observe(lang.hitch(this, function(object, deletedFrom, insertedInto){
							if(deletedFrom == insertedInto){
								this._onSetItem(object);
							}else{
								if(deletedFrom != -1){
									this._onDeleteItem(object);
								}
								if(insertedInto != -1){
									this._onNewItem(object);
								}
							}
						}), true);
					}

					// Set our value (which might be undefined), and then tweak
					// it to send a change event with the real value
					this._loadingStore = false;
					this.set("value", "_pendingValue" in this ? this._pendingValue : selectedValue);
					delete this._pendingValue;

					if(!this.loadChildrenOnOpen){
						this._loadChildren();
					}else{
						this._pseudoLoadChildren(items);
					}
					this.onLoadDeferred.resolve(true);
					this.onSetStore();
				}), function(err){
					console.error('dui.form.Select: ' + err.toString());
					this.onLoadDeferred.reject(err);
				});
			}
			return oStore;	// dojo/data/api/Identity
		},

		// TODO: implement set() and watch() for store and query, although not sure how to handle
		// setting them individually rather than together (as in setStore() above)

		_setValueAttr: function(/*anything*/ newValue, /*Boolean?*/ priorityChange){
			// summary:
			//		set the value of the widget.
			//		If a string is passed, then we set our value from looking it up.
			if(!this._onChangeActive){
				priorityChange = null;
			}
			if(this._loadingStore){
				// Our store is loading - so save our value, and we'll set it when
				// we're done
				this._pendingValue = newValue;
				return;
			}
			if(newValue == null){
				return;
			}
			if(Array.isArray(newValue)){
				newValue = newValue.map(function(value){
					// TODO: call of lang.isObject to be addressed later
					return lang.isObject(value) ? value : { value: value };
				}); // __SelectOption[]
			}else if(lang.isObject(newValue)){ // TODO: call of lang.isObject to be addressed later
				newValue = [newValue];
			}else{
				newValue = [
					{ value: newValue }
				];
			}
			newValue = (this.getOptions(newValue) || []).filter(function(i){
				return i && i.value;
			});
			var opts = this.getOptions() || [];
			if(!this.multiple && (!newValue[0] || !newValue[0].value) && !!opts.length){
				newValue[0] = opts[0];
			}
			if(Array.isArray(opts)){
				opts.forEach(function(opt){
					opt.selected = newValue.some(function(v){
						return v.value === opt.value;
					});
				});
			}
			var val = newValue.map(function(opt){
				return opt.value;
			});

			if(typeof val == "undefined" || typeof val[0] == "undefined"){
				return;
			} // not fully initialized yet or a failed value lookup
			var disp = newValue.map(function(opt){
				return opt.label;
			});
			this._setDisplay(this.multiple ? disp : disp[0]);
			this.inherited(arguments, [ this.multiple ? val : val[0], priorityChange ]);
			this._updateSelection();
		},

		_getDisplayedValueAttr: function(){
			// summary:
			//		returns the displayed value of the widget
			var ret = [].concat(this.get('selectedOptions')).map(function(v){
				if(v && "label" in v){
					return v.label;
				}else if(v){
					return v.value;
				}
				return null;
			}, this);
			return this.multiple ? ret : ret[0];
		},

		_setDisplayedValueAttr: function(label){
			// summary:
			//		Sets the displayed value of the widget
			this.set('value', this.getOptions(typeof label == "string" ? { label: label } : label));
		},

		_loadChildren: function(){
			// summary:
			//		Loads the children represented by this widget's options.
			//		reset the menu to make it populatable on the next click
			if(this._loadingStore){
				return;
			}
			this._getChildren().forEach(function(child){
				child.destroyRecursive();
			});
			// Add each menu item
			if(this.options){
				this.options.forEach(this._addOptionItem, this);
			}

			// Update states
			this._updateSelection();
		},

		_updateSelection: function(){
			// summary:
			//		Sets the "selected" class on the item for styling purposes
			this.focusedChild = null;
			this._set("value", this._getValueFromOpts());
			var val = [].concat(this.value);
			if(val && val[0]){
				var self = this;
				this._getChildren().forEach(function(child){
					var isSelected = val.some(function(v){
						return child.option && (v === child.option.value);
					});
					if(isSelected && !self.multiple){
						self.focusedChild = child;
					}
					domClass.toggle(child.domNode, this.baseClass.replace(/\s+|$/g, "SelectedOption "), isSelected);
					child.domNode.setAttribute("aria-selected", isSelected ? "true" : "false");
				}, this);
			}
		},

		_getValueFromOpts: function(){
			// summary:
			//		Returns the value of the widget by reading the options for
			//		the selected flag
			var opts = this.getOptions() || [];
			if(!this.multiple && opts.length){
				// Mirror what a select does - choose the first one
				var opt = opts.filter(function(i){
					return i.selected;
				})[0];
				if(opt && opt.value){
					return opt.value;
				}else{
					opts[0].selected = true;
					return opts[0].value;
				}
			}else if(this.multiple){
				// Set value to be the sum of all selected
				return opts.filter(function(i){
					return i.selected;
				}).map(function(i){
					return i.value;
				}) || [];
			}
			return "";
		},

		// Internal functions to call when we have store notifications come in
		_onNewItem: function(/*item*/ item, /*Object?*/ parentInfo){
			if(!parentInfo || !parentInfo.parent){
				// Only add it if we are top-level
				this._addOptionForItem(item);
			}
		},
		_onDeleteItem: function(/*item*/ item){
			var store = this.store;
			this.removeOption({value: store.getIdentity(item) });
		},
		_onSetItem: function(/*item*/ item){
			this.updateOption(this._getOptionObjForItem(item));
		},

		_getOptionObjForItem: function(item){
			// summary:
			//		Returns an option object based off the given item.  The "value"
			//		of the option item will be the identity of the item, the "label"
			//		of the option will be the label of the item.

			var store = this.store,
				label = item[this.labelAttr],
				value = (label ? store.getIdentity(item) : null);
			return {value: value, label: label, item: item}; // __SelectOption
		},

		_addOptionForItem: function(/*item*/ item){
			// summary:
			//		Creates (and adds) the option for the given item

			var newOpt = this._getOptionObjForItem(item);
			this.addOption(newOpt);
		},

		constructor: function(params /*===== , srcNodeRef =====*/){
			// summary:
			//		Create the widget.
			// params: Object|null
			//		Hash of initialization parameters for widget, including scalar values (like title, duration etc.)
			//		and functions, typically callbacks like onClick.
			//		The hash can contain any of the widget's properties, excluding read-only properties.
			// srcNodeRef: DOMNode|String?
			//		If a srcNodeRef (DOM node) is specified, replace srcNodeRef with my generated DOM tree

			//		Saves off our value, if we have an initial one set so we
			//		can use it if we have a store as well (see startup())
			this._oValue = (params || {}).value || null;
		},

		buildRendering: function(){
			this.inherited(arguments);
			dom.setSelectable(this.focusNode, false);
		},

		_fillContent: function(){
			// summary:
			//		Loads our options and sets up our dropdown correctly.  We
			//		don't want any content, so we don't call any inherit chain
			//		function.
			if(!this.options){
				this.options =
					this.srcNodeRef
						? query("> *", this.srcNodeRef).map(
						function(node){
							if(node.getAttribute("type") === "separator"){
								return { value: "", label: "", selected: false, disabled: false };
							}
							return {
								value: (node.getAttribute("data-" + kernel._scopeName + "-value") || node.getAttribute("value")),
								label: String(node.innerHTML),
								// FIXME: disabled and selected are not valid on complex markup children (which is why we're
								// looking for data-dojo-value above.  perhaps we should data-dojo-props="" this whole thing?)
								// decide before 1.6
								selected: node.getAttribute("selected") || false,
								disabled: node.getAttribute("disabled") || false
							};
						},
						this)
						: [];
			}
			if(!this.value){
				this._set("value", this._getValueFromOpts());
			}else if(this.multiple && typeof this.value == "string"){
				this._set("value", this.value.split(","));
			}
		},

		postCreate: function(){
			// summary:
			//		sets up our event handling that we need for functioning
			//		as a select
			this.inherited(arguments);

			// Make our event connections for updating state
			aspect.after(this, "onChange", lang.hitch(this, "_updateSelection"));

			// moved from startup
			//		Connects in our store, if we have one defined
			var store = this.store;
			if(store && store.getIdentity){
				// Temporarily set our store to null so that it will get set
				// and connected appropriately
				this.store = null;
				this.setStore(store, this._oValue);
			}
		},

		startup: function(){
			// summary:
			this._loadChildren();
			this.inherited(arguments);
		},

		destroy: function(){
			// summary:
			//		Clean up our connections

			// Cancel listener for store updates
			if(this._observeHandle && this._observeHandle.remove){
				this._observeHandle.remove();
				this._observeHandle = null;
			}

			this.inherited(arguments);
		},

		_addOptionItem: function(/*__SelectOption*/ /*===== option =====*/){
			// summary:
			//		User-overridable function which, for the given option, adds an
			//		item to the select.  If the option doesn't have a value, then a
			//		separator is added in that place.  Make sure to store the option
			//		in the created option widget.
		},

		_removeOptionItem: function(/*__SelectOption*/ /*===== option =====*/){
			// summary:
			//		User-overridable function which, for the given option, removes
			//		its item from the select.
		},

		_setDisplay: function(/*String or String[]*/ /*===== newDisplay =====*/){
			// summary:
			//		Overridable function which will set the display for the
			//		widget.  newDisplay is either a string (in the case of
			//		single selects) or array of strings (in the case of multi-selects)
		},

		_getChildren: function(){
			// summary:
			//		Overridable function to return the children that this widget contains.
			return [];
		},

		_getSelectedOptionsAttr: function(){
			// summary:
			//		hooks into this.attr to provide a mechanism for getting the
			//		option items for the current value of the widget.
			return this.getOptions({ selected: true });
		},

		_pseudoLoadChildren: function(/*item[]*/ /*===== items =====*/){
			// summary:
			//		a function that will "fake" loading children, if needed, and
			//		if we have set to not load children until the widget opens.
			// items:
			//		An array of items that will be loaded, when needed
		},

		onSetStore: function(){
			// summary:
			//		a function that can be connected to in order to receive a
			//		notification that the store has finished loading and all options
			//		from that store are available
		}
	});

	/*=====
	_FormSelectWidget.__SelectOption = __SelectOption;
	=====*/

	return _FormSelectWidget;
});
