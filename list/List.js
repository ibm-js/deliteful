define(["dcl/dcl",
	"delite/register",
	"dojo/on",
	"dojo/_base/lang",
	"dojo/when",
	"dojo/dom-class",
	"dojo/keys",
	"delite/CustomElement",
	"delite/Selection",
	"delite/KeyNav",
	"delite/StoreMap",
	"delite/Invalidating",
	"delite/Scrollable",
	"./ItemRenderer",
	"./CategoryRenderer",
	"./_DefaultStore",
	"./_LoadingPanel",
	"delite/theme!./List/themes/{{theme}}/List_css",
	"dojo/has!dojo-bidi?delite/theme!./List/themes/{{theme}}/List_rtl_css"
], function (dcl, register, on, lang, when, domClass, keys, CustomElement, Selection, KeyNav, StoreMap,
		Invalidating, Scrollable, ItemRenderer, CategoryRenderer, DefaultStore, LoadingPanel) {

	// module:
	//		deliteful/list/List

	// Register custom elements we use to support markup for adding items to the list store.
	register("d-list-store", [HTMLElement, CustomElement]);

	var List = dcl([Invalidating, Selection, KeyNav, StoreMap, Scrollable], {
		// summary:
		//		A widget that renders a scrollable list of items.
		//
		// description:
		//		The List widget renders a scrollable list of items that are retrieved from a Store.
		//		Its custom element tag is d-list.
		//
		//		See the user documentation at https://github.com/ibm-js/deliteful/tree/master/docs/list/List.md

		/*=====
		// store: dojo/store/Store
		//		Dojo object store that contains the items to render in the list.
		//		If no value is provided for this attribute, the List will initialize
		//		it with an internal store implementation. Note that this internal store
		//		implementation ignore any query options and return all the items from
		//		the store, in the order they were added to the store.
		store: null,

		// query: Object
		//		Query to pass to the store to retrieve the items to render in the list.
		query: {},
		=====*/

		// itemRenderer: deliteful/list/ItemRenderer
		//		The widget class to use to render list items.
		//		It MUST extend deliteful/list/ItemRenderer.
		itemRenderer: ItemRenderer,

		// categoryRenderer: deliteful/list/CategoryRenderer
		//		The widget class to use to render category headers when the list items are categorized.
		//		It MUST extend deliteful/list/CategoryRenderer.
		categoryRenderer: CategoryRenderer,

		// labelAttr: String
		// 		Default mapping between the attribute of the item retrieved from the store
		//		and the label attribute expected by the default renderer
		labelAttr: "label",

		// iconAttr: String
		//		Default mapping between the attribute of the item retrieved from the store
		//		and the icon attribute expected by the default renderer
		iconclassAttr: "iconclass",

		// righttextAttr: String
		//		Default mapping between the attribute of the item retrieved from the store
		//		and the righttext attribute expected by the default renderer
		righttextAttr: "righttext",

		// righticonAttr: String
		// 		Default mapping between the attribute of the item retrieved from the store
		//		and the righticon attribute expected by the default renderer
		righticonclassAttr: "righticonclass",

		// categoryAttr: String
		//		Name of the list item attribute that define the category of a list item.
		//		If falsy and categoryFunc is also falsy, the list is not categorized.
		categoryAttr: "",

		// categoryFunc: String
		//		A function that extract the category of a list item from the following input parameters/
		//		- item: the list item from the store
		//		- store: the store
		//		If falsy and categoryAttr is also falsy, the list is not categorized.
		categoryFunc: null,

		// baseClass: String
		//	The base class that defines the style of the list.
		//	Available values are:
		//		- "d-list" (default): render a list with no rounded corners and no left and right margins;
		//		- "d-round-rect-list": render a list with rounded corners and left and right margins.
		baseClass: "d-list",

		// By default, letter search is one character only, so that it does not interfere with pressing
		// the SPACE key to (de)select an item.
		multiCharSearchDuration: 0,

		/*=====
		// scrollDirection: String
		//		"vertical" for a scrollable List, "none" for a non scrollable List.
		scrollDirection: "vertical",
		=====*/
		_setScrollDirectionAttr: function (value) {
			if (value !== "vertical" && value !== "none") {
				throw new TypeError("'"
						+ value
						+ "' not supported for scrollDirection, keeping the previous value of '"
						+ this.scrollDirection
						+ "'");
			} else {
				this._set("scrollDirection", value);
			}
		},

		// selectionMode: String
		//		The selection mode for list items (see delite/Selection).
		selectionMode: "none",

		// loadingMessage: String
		//		Optional message to display, with a progress indicator, when
		//		the list is loading its content.
		loadingMessage: "",

		// CSS classes internally referenced by the List widget
		_cssClasses: {item: "d-list-item",
					  category: "d-list-category"},

		/*======
		// A panel that hides the content of the widget when shown, and displays a progress indicator
		// and an optional message.
		_loadingPanel: null,

		// Handle for the selection click event handler 
		_selectionClickHandle: null,
		
		// Previous focus child before the list loose focus
		_previousFocusedChild: null,
		
		// Flag set to a truthy value once the items have been loaded from the store
		_dataLoaded: undefined,
		=====*/
		
		//////////// Widget life cycle ///////////////////////////////////////

		preCreate: function () {
			// summary:
			//		Set invalidating properties.
			// tags:
			//		protected
			this.addInvalidatingProperties({
				"categoryAttr": "invalidateProperty",
				"categoryFunc": "invalidateProperty",
				"itemRenderer": "invalidateProperty",
				"categoryRenderer": "invalidateProperty",
				"selectionMode": "invalidateProperty",
				"selectionMarkBefore": "invalidateProperty"
			});
		},

		buildRendering: function () {
			// summary:
			//		Initialize the widget node and set the container and scrollable node.
			// tags:
			//		protected
			this.containerNode = this.scrollableNode = this.ownerDocument.createElement("div");
			// Firefox focus the scrollable node when clicking it or tabing: in this case, the list
			// widget needs to be focused instead.
			this.own(on(this.scrollableNode, "focus", function () {
				this.focus();
			}.bind(this)));
			this.containerNode.className = "d-list-container";
			this.appendChild(this.containerNode);
			// Aria attributes
			this.setAttribute("role", "grid");
			// Might be overriden at the gridcell (renderer) level when developing custom renderers
			this.setAttribute("aria-readonly", "true");
		},

		postCreate: function () {
			// summary:
			//		Assign a default store to the list.
			// tags:
			//		protected
			this.store = new DefaultStore(this);
			this._keyNavCodes[keys.PAGE_UP] = this._keyNavCodes[keys.HOME];
			this._keyNavCodes[keys.PAGE_DOWN] = this._keyNavCodes[keys.END];
			delete this._keyNavCodes[keys.HOME];
			delete this._keyNavCodes[keys.END];
		},

		startup: dcl.superCall(function (sup) {
			// summary:
			//		Starts the widget: parse the content of the widget node to clean it,
			//		add items to the store if specified in markup.
			//		Using superCall() rather than the default chaining so that the code runs
			//		before StoreMap.startup()
			return function () {
				// search for custom elements to populate the store
				this._setBusy(true, true);
				var children = Array.prototype.slice.call(this.children);
				if (children.length) {
					for (var i = 0; i < children.length; i++) {
						var child = children[i];
						if (child.tagName === "D-LIST-STORE") {
							var data = JSON.parse("[" + child.textContent + "]");
							for (var j = 0; j < data.length; j++) {
								this.store.add(data[j]);
							}
						}
						if (child !== this.containerNode && child !== this._loadingPanel) {
							child.destroy();
						}
					}
				}
				this.on("query-error", function () { this._setBusy(false, true); }.bind(this));
				if (sup) {
					sup.call(this, arguments);
				}
			};
		}),

		refreshRendering: dcl.superCall(function (sup) {
			// summary:
			//		List attributes have been updated.
			// tags:
			//		protected
			/*jshint maxcomplexity:11*/
			return function (props) {
				if (sup) {
					sup.call(this, props);
				}
				if (props.selectionMode) {
					// Update aria attributes
					this.removeAttribute("aria-selectable");
					this.removeAttribute("aria-multiselectable");
					if (this.selectionMode === "single") {
						this.setAttribute("aria-selectable", true);
						// update aria-selected attribute on unselected items
						for (var i = 0; i < this.containerNode.children.length; i++) {
							var child = this.containerNode.children[i];
							if (child.getAttribute("aria-selected") === "false") {
								child.removeAttribute("aria-selected");
							}
						}
					} else if (this.selectionMode === "multiple") {
						this.setAttribute("aria-multiselectable", true);
						// update aria-selected attribute on unselected items
						for (i = 0; i < this.containerNode.children.length; i++) {
							child = this.containerNode.children[i];
							if (domClass.contains(child, this._cssClasses.item)
									&& !child.hasAttribute("aria-selected")) {
								child.setAttribute("aria-selected", "false");
							}
						}
					} else {
						// update aria-selected attribute on unselected items
						for (i = 0; i < this.containerNode.children.length; i++) {
							child = this.containerNode.children[i];
							if (child.hasAttribute("aria-selected")) {
								child.removeAttribute("aria-selected", "false");
							}
						}
					}
				}
			};
		}),
		/*jshint maxcomplexity:10*/

		refreshProperties: dcl.superCall(function (sup) {
			// summary:
			//		List attributes have been updated.
			// tags:
			//		protected
			/*jshint maxcomplexity:11*/
			return function (props) {
				if (props.selectionMode) {
					if (this.selectionMode === "none") {
						if (this._selectionClickHandle) {
							this._selectionClickHandle.remove();
							this._selectionClickHandle = null;
						}
					} else {
						if (!this._selectionClickHandle) {
							this._selectionClickHandle = this.on("click", lang.hitch(this, "_handleSelection"));
						}
					}
				}
				if (props.itemRenderer
					|| (this._isCategorized()
							&& (props.categoryAttr || props.categoryFunc || props.categoryRenderer))) {
					if (this._dataLoaded) {
						this._setBusy(true, true);
						props.store = true; // to trigger a reload of the list.
					}
				}
				if (sup) {
					sup.call(this, props);
				}
			};
		}),

		destroy: function () {
			// Remove reference to the list in the default store
			if (this.store && this.store.list) {
				this.store.list = null;
			}
			this._hideLoadingPanel();
		},

		//////////// Public methods ///////////////////////////////////////

		getRendererByItemId: function (/*Object*/id) {
			// summary:
			//		Returns the renderer currently displaying an item with a specific id.
			// id: Object
			//		The id of the item displayed by the renderer.
			var renderers = this.containerNode.querySelectorAll("." + this._cssClasses.item);
			for (var i = 0; i < renderers.length; i++) {
				var renderer = renderers.item(i);
				if (this.getIdentity(renderer.item) === id) {
					return renderer; // deliteful/list/Renderer
				}
			}
			return null;
		},

		getItemRendererByIndex: function (/*int*/index) {
			// summary:
			//		Returns the item renderer at a specific index in the List.
			// index: int
			//		The item renderer at the index (first item renderer index is 0).
			return index >= 0 ? this.containerNode.querySelectorAll("." + this._cssClasses.item).item(index) : null;
		},

		getItemRendererIndex: function (/*Object*/renderer) {
			// summary:
			//		Returns the index of an item renderer in the List, or -1 if
			//		the item renderer is not found in the list.
			// renderer: Object
			//		The item renderer.
			var result = -1;
			if (renderer.item) {
				var id = this.getIdentity(renderer.item);
				var nodeList = this.containerNode.querySelectorAll("." + this._cssClasses.item);
				for (var i = 0; i < nodeList.length; i++) {
					var currentRenderer = nodeList.item(i);
					if (this.getIdentity(currentRenderer.item) === id) {
						result = i;
						break;
					}
				}
			}
			return result;
		},

		getEnclosingRenderer: function (/*Element*/node) {
			// summary:
			//		Returns the renderer enclosing a dom node.
			// node: Element
			//		The dom node.
			var currentNode = node;
			while (currentNode) {
				if (currentNode.parentNode && currentNode.parentNode === this.containerNode) {
					break;
				}
				currentNode = currentNode.parentNode;
			}
			return currentNode; // deliteful/list/Renderer
		},

		//////////// delite/Selection implementation ///////////////////////////////////////

		getIdentity: function (/*Object*/item) {
			// summary:
			//		Returns the identity of an item.
			// item: Object
			//		The item.
			// tags:
			//		protected
			return this.store.getIdentity(item); // Object
		},

		updateRenderers: function (/*Array*/items) {
			// summary:
			//		Update renderers when the selection has changed.
			// items: Array
			//		The items which renderers must be updated.
			// tags:
			//		protected
			if (this.selectionMode !== "none") {
				for (var i = 0; i < items.length; i++) {
					var currentItem = items[i];
					var renderer = this.getRendererByItemId(this.getIdentity(currentItem));
					if (renderer) {
						var itemSelected = !!this.isSelected(currentItem);
						if (this.selectionMode === "single") {
							if (itemSelected) {
								renderer.setAttribute("aria-selected", true);
							} else {
								renderer.removeAttribute("aria-selected");
							}
						} else {
							renderer.setAttribute("aria-selected", itemSelected);
						}
					}
				}
			}
		},

		hasSelectionModifier: function (/*Event*/ /*jshint unused: vars*/event) {
			// summary:
			//		Always return true so that no keyboard modifier is needed when selecting / deselecting items.
			// tags:
			//		protected.
			return true;
		},

		_handleSelection: function (/*Event*/event) {
			// summary:
			//		Event handler that performs items (de)selection.
			// event: Event
			//		The event the handler was called for.
			// tags:
			//		protected
			var eventRenderer = this.getEnclosingRenderer(event.target);
			if (eventRenderer) {
				this.selectFromEvent(event, eventRenderer.item, eventRenderer, true);
			}
		},

		//////////// Private methods ///////////////////////////////////////

		_setBusy: function (status, hideContent) {
			// summary:
			//		Set the "busy" status of the widget.
			// status: boolean
			//		true if the list is busy loading and rendering its data.
			//		false otherwise.
			// hideContent: boolean
			//		true if the list should hide its content when it is busy,
			//		false otherwise
			// tags:
			//		private
			if (status) {
				this.setAttribute("aria-busy", "true");
				if (hideContent) {
					this._showLoadingPanel();
				}
			} else {
				this.removeAttribute("aria-busy");
				this._hideLoadingPanel();
			}
		},

		_showLoadingPanel: function () {
			// summary:
			//		show the loading panel
			if (!this._loadingPanel) {
				this._loadingPanel = new LoadingPanel({message: this.loadingMessage});
				this.insertBefore(this._loadingPanel, this.containerNode);
				this._loadingPanel.startup();
			}
		},

		_hideLoadingPanel: function () {
			// summary:
			//		hide the loading panel
			if (this._loadingPanel) {
				this._loadingPanel.destroy();
				this._loadingPanel = null;
			}
		},

		_isCategorized: function () {
			return this.categoryAttr || this.categoryFunc;
		},

		_empty: function () {
			// summary:
			//		destroy all children of the list and empty it.
			this.findCustomElements(this.containerNode).forEach(function (w) {
				if (w.destroy) {
					w.destroy();
				}
			});
			this.containerNode.innerHTML = "";
			this._previousFocusedChild = null;
		},

		//////////// Renderers life cycle ///////////////////////////////////////

		_renderNewItems: function (/*Array*/ items, /*boolean*/atTheTop) {
			// summary:
			//		Render new items within the list widget.
			// items: Array
			//		The new items to render.
			// atTheTop:
			//		If true, the new items are rendered at the top of the list.
			//		If false, they are rendered at the bottom of the list.
			// tags:
			//		private
			if (!this.containerNode.firstElementChild) {
				this.containerNode.appendChild(this._createRenderers(items, 0, items.length, null));
			} else {
				if (atTheTop) {
					if (this._isCategorized()) {
						var firstRenderer = this._getFirstRenderer();
						if (this._isCategoryRenderer(firstRenderer)
								&& items[items.length - 1].category === firstRenderer.item.category) {
							// Remove the category renderer on top before adding the new items
							this._removeRenderer(firstRenderer);
						}
					}
					this.containerNode.insertBefore(this._createRenderers(items, 0, items.length, null),
							this.containerNode.firstElementChild);
				} else {
					this.containerNode.appendChild(this._createRenderers(items, 0, items.length,
							this._getLastRenderer().item));
				}
			}
			// start renderers
			this.findCustomElements(this.containerNode).forEach(function (w) {
				if (w.startup) {
					w.startup();
				}
			});
		},

		_createRenderers: function (/*Array*/ items, /*int*/fromIndex, /*int*/count, /*Object*/previousItem) {
			// summary:
			//		Create renderers for a list of items (including the category renderers if the list
			//		is categorized).
			// items: Array
			//		An array that contains the items to create renderers for.
			// fromIndex: int
			//		The index of the first item in the array of items
			//		(no renderer will be created for the items before this index).
			// count: int
			//		The number of items to use from the array of items, starting from the fromIndex position
			//		(no renderer will be created for the items that follows).
			// previousItem: Object
			//		The item that precede the first one for which a renderer will be created. This is only usefull for
			//		categorized lists.
			// returns:
			//		A DocumentFragment that contains the renderers. The startup method of the renderers has not
			//		been called at this point.
			var currentIndex = fromIndex,
				currentItem, toIndex = fromIndex + count - 1;
			var documentFragment = this.ownerDocument.createDocumentFragment();
			for (; currentIndex <= toIndex; currentIndex++) {
				currentItem = items[currentIndex];
				if (this._isCategorized()
					&& (!previousItem || currentItem.category !== previousItem.category)) {
					documentFragment.appendChild(this._createCategoryRenderer(currentItem));
				}
				documentFragment.appendChild(this._createItemRenderer(currentItem));
				previousItem = currentItem;
			}
			return documentFragment; // DocumentFragment
		},

		_addItemRenderer: function (/*deliteful/list/Renderer*/renderer, /*int*/atIndex) {
			// summary:
			//		Add an item renderer to the List, updating category renderers if needed.
			//		This method calls the startup method on the renderer after it has been
			//		added to the List.
			// renderer: List/ItemRenderer subclass
			//		The renderer to add to the list.
			// atIndex: int
			//		The index (not counting category renderers) where to add the item renderer in the list.
			var spec = this._getInsertSpec(renderer, atIndex);
			if (spec.nodeRef) {
				this.containerNode.insertBefore(renderer, spec.nodeRef);
				if (spec.addCategoryAfter) {
					var categoryRenderer = this._createCategoryRenderer(spec.nodeRef.item);
					this.containerNode.insertBefore(categoryRenderer, spec.nodeRef);
					categoryRenderer.startup();
				}
			} else {
				this.containerNode.appendChild(renderer);
			}
			if (spec.addCategoryBefore) {
				categoryRenderer = this._createCategoryRenderer(renderer.item);
				this.containerNode.insertBefore(categoryRenderer, renderer);
				categoryRenderer.startup();
			}
			renderer.startup();
		},

		_getInsertSpec: function (/*deliteful/list/ItemRenderer*/renderer, /*int*/atIndex) {
			// summary:
			//		Get a specification for the insertion of an item renderer in the list.
			// description:
			//		Returns an object that contains the following attributes:
			//		- nodeRef: the node before which to insert the item renderer
			//		- addCategoryBefore: true if a category header should be inserted before the item renderer
			//		- addCategoryAfter: true if a category header should be inserted after the item renderer
			// renderer: List/ItemRenderer subclass
			//		The renderer to add to the list.
			// atIndex: int
			//		The index (not counting category renderers) where to add the item renderer in the list.
			var result = {nodeRef: atIndex >= 0 ? this.getItemRendererByIndex(atIndex) : null,
						  addCategoryBefore: false,
						  addCategoryAfter: false};
			if (this._isCategorized()) {
				var previousRenderer = result.nodeRef
										? this._getNextRenderer(result.nodeRef, -1)
										: this._getLastRenderer();
				if (!previousRenderer) {
					result.addCategoryBefore = true;
				} else {
					if (!this._sameCategory(renderer, previousRenderer)) {
						if (this._isCategoryRenderer(previousRenderer)) {
							result.nodeRef = previousRenderer;
							previousRenderer = this._getNextRenderer(previousRenderer, -1);
							if (!previousRenderer
								|| (previousRenderer && !this._sameCategory(renderer, previousRenderer))) {
								result.addCategoryBefore = true;
							}
						} else {
							result.addCategoryBefore = true;
						}
					}
				}
				if (result.nodeRef
					&& !this._isCategoryRenderer(result.nodeRef)
					&& !this._sameCategory(result.nodeRef, renderer)) {
					result.addCategoryAfter = true;
				}
			}
			return result; // Object
		},

		/*jshint maxcomplexity:12*/
		_removeRenderer: function (/*deliteful/list/Renderer*/renderer, /*Boolean*/keepSelection) {
			// summary:
			//		Remove a renderer from the List, updating category renderers if needed.
			// renderer: List/ItemRenderer or List/CategoryRenderer subclass
			//		The renderer to remove from the list.
			// keepSelection: Boolean
			//		Set to true if the renderer item should not be removed from the list of selected items.
			if (this._isCategorized() && !this._isCategoryRenderer(renderer)) {
				// remove the previous category header if necessary
				var previousRenderer = this._getNextRenderer(renderer, -1);
				if (previousRenderer && this._isCategoryRenderer(previousRenderer)) {
					var nextRenderer = this._getNextRenderer(renderer, 1);
					if (!nextRenderer || !this._sameCategory(renderer, nextRenderer)) {
						this._removeRenderer(previousRenderer);
					}
				}
			}
			// Update focus if necessary
			if (this._getFocusedRenderer() === renderer) {
				var nextFocusRenderer = this._getNextRenderer(renderer, 1) || this._getNextRenderer(renderer, -1);
				if (nextFocusRenderer) {
					this.focusChild(nextFocusRenderer.renderNode);
				}
			}
			if (!keepSelection && !this._isCategoryRenderer(renderer) && this.isSelected(renderer.item)) {
				// deselect the item before removing the renderer
				this.selectFromEvent(null, renderer.item, renderer, true);
			}
			// remove and destroy the renderer
			if (this._previousFocusedChild && this.getEnclosingRenderer(this._previousFocusedChild) === renderer) {
				this._previousFocusedChild = null;
			}
			this.containerNode.removeChild(renderer);
			renderer.destroy();
		},
		/*jshint maxcomplexity:10*/

		_createItemRenderer: function (/*Object*/item) {
			// summary:
			//		Create a renderer instance for an item.
			// item: Object
			//		The item to render.
			// returns:
			//		An instance of item renderer that renders the item.
			var renderer = new this.itemRenderer({tabindex: "-1"});
			renderer.item = item;
			if (this.selectionMode !== "none") {
				var itemSelected = !!this.isSelected(item);
				if (this.selectionMode === "single") {
					if (itemSelected) {
						renderer.setAttribute("aria-selected", true);
					}
				} else {
					renderer.setAttribute("aria-selected", itemSelected);
				}
			}
			return renderer; // deliteful/list/ItemRenderer
		},

		_createCategoryRenderer: function (/*Object*/item) {
			// summary:
			//		Create a category renderer instance for an item.
			// item: String
			//		The item which category to render.
			// returns:
			//		An instance of category renderer that renders the category of the item.
			var renderer = new this.categoryRenderer({item: item, tabindex: "-1"});
			return renderer; // deliteful/list/CategoryRenderer
		},

		_isCategoryRenderer: function (/*deliteful/list/Renderer*/renderer) {
			// summary:
			//		test if a widget is a category renderer.
			return domClass.contains(renderer, this._cssClasses.category);
		},

		_sameCategory: function (/*deliteful/list/Renderer*/renderer1, /*deliteful/list/Renderer*/renderer2) {
			// summary:
			//		Returns true if two renderers have the same category, false otherwise
			// renderer1: deliteful/list/Renderer
			//		The first renderer.
			// renderer2: deliteful/list/Renderer
			//		The second renderer.
			return renderer1.item.category === renderer2.item.category; // boolean
		},

		_getNextRenderer: function (/*deliteful/list/Renderer*/renderer, /*int*/dir) {
			// summary:
			//		Returns the renderer that comes immediately after of before another one.
			// renderer: deliteful/list/Renderer
			//		The renderer immediately before or after the one to return.
			// dir: int
			//		1 to return the renderer that comes immediately after renderer, -1 to
			//		return the one that comes immediately before.
			if (dir >= 0) {
				return renderer.nextElementSibling; // deliteful/list/Renderer
			} else {
				return renderer.previousElementSibling; // deliteful/list/Renderer
			}
		},

		_getFirstRenderer: function () {
			// summary:
			//		Returns the first renderer in the list.
			return this.containerNode.querySelector("." + this._cssClasses.item
					+ ", ." + this._cssClasses.category); // deliteful/list/Renderer
		},


		_getLastRenderer: function () {
			// summary:
			//		Returns the last renderer in the list.
			var renderers = this.containerNode
								.querySelectorAll("." + this._cssClasses.item + ", ." + this._cssClasses.category);
			return renderers.length ? renderers.item(renderers.length - 1) : null; // deliteful/list/Renderer
		},

		////////////delite/Store implementation ///////////////////////////////////////

		initItems: function (/*Array*/items) {
			// summary:
			//		Populate the list using the items retrieved from the store.
			// tags:
			//		protected
			this._empty();
			this._renderNewItems(items, false);
			this._setBusy(false, true);
			this._dataLoaded = true;
		},

		itemRemoved: function (index, renderItems, keepSelection) {
			// summary:
			//		Function to call when an item is removed from the store, to update
			//		the content of the list widget accordingly.
			// index: Number
			//		The index of the render item to remove.
			// renderItems: Array
			//		Ignored by this implementation.
			// keepSelection: Boolean
			//		Set to true if the item should not be removed from the list of selected items.
			// tags:
			//		protected
			var renderer = this.getItemRendererByIndex(index);
			if (renderer) {
				this._removeRenderer(renderer, keepSelection);
			}
		},

		itemAdded: function (index, renderItem, /*jshint unused:vars*/renderItems) {
			// summary:
			//		Function to call when an item is added to the store, to update
			//		the content of the list widget accordingly.
			// index: Number
			//		The index where to add the render item.
			// renderItem: Object
			//		The render item to be added.
			// renderItems: Array
			//		Ignored by this implementation.
			// tags:
			//		private
			var newRenderer = this._createItemRenderer(renderItem);
			this._addItemRenderer(newRenderer, index);
		},

		itemUpdated: function (index,  renderItem, /*jshint unused:vars*/renderItems) {
			// summary:
			//		Function to call when an item is updated in the store, to update
			//		the content of the list widget accordingly.
			// index: Number
			//		The index of the render item to update.
			// renderItem: Object
			//		The render item data the render item must be updated with.
			// renderItems: Array
			//		Ignored by this implementation.
			// tags:
			//		protected
			var renderer = this.getItemRendererByIndex(index);
			if (renderer) {
				renderer.item = renderItem;
			}
		},

		itemMoved: function (previousIndex, newIndex, renderItem, renderItems) {
			// summary:
			//		Function to call when an item is moved in the store, to update
			//		the content of the list widget accordingly.
			// previousIndex: Number
			//		The previous index of the render item.
			// newIndex: Number
			//		The new index of the render item.
			// renderItem: Object
			//		The render item to be moved.
			// renderItems: Array
			//		Ignored by this implementation.
			// tags:
			//		protected
			this.itemRemoved(previousIndex, renderItems, true);
			this.itemAdded(newIndex - (previousIndex < newIndex ? 1 : 0), renderItem, renderItems);
		},

		//////////// delite/Scrollable extension ///////////////////////////////////////

		getTopDistance: function (node) {
			// summary:
			//		Returns the distance between the top of the node and 
			//		the top of the scrolling container.
			// tags:
			//		protected
			return node.offsetTop - this.getCurrentScroll().y;
		},

		getBottomDistance: function (node) {
			// summary:
			//		Returns the distance between the bottom of the node and 
			//		the bottom of the scrolling container.
			// tags:
			//		protected
			var clientRect = this.scrollableNode.getBoundingClientRect();
			return node.offsetTop +
				node.offsetHeight -
				this.getCurrentScroll().y -
				(clientRect.bottom - clientRect.top);
		},

		//////////// delite/KeyNav implementation ///////////////////////////////////////
		// Keyboard navigation is based on WIA ARIA Pattern for Grid:
		// http://www.w3.org/TR/2013/WD-wai-aria-practices-20130307/#grid

		childSelector: function (child) {
			// tags:
			//		private
			return (child.getAttribute("role") === "gridcell" || child.hasAttribute("navindex"));
		},

		/*jshint maxcomplexity:15*/
		_onContainerKeydown: dcl.before(function (evt) {
			// summary:
			//		Handle keydown events
			// tags:
			//		private
			if (!evt.defaultPrevented) {
				if ((evt.keyCode === keys.SPACE && !this._searchTimer)) {
					this._spaceKeydownHandler(evt);
				} else if (evt.keyCode === keys.ENTER || evt.keyCode === keys.F2) {
					if (this.focusedChild && !this.focusedChild.hasAttribute("navindex")) {
						// Enter Actionable Mode
						// TODO: prevent default ONLY IF autoAction is false on the renderer ?
						// See http://www.w3.org/TR/2013/WD-wai-aria-practices-20130307/#grid
						evt.preventDefault();
						this._enterActionableMode();
					}
				} else if (evt.keyCode === keys.TAB) {
					if (this.focusedChild && this.focusedChild.hasAttribute("navindex")) {
						// We are in Actionable mode
						evt.preventDefault();
						var renderer = this._getFocusedRenderer();
						var next = renderer[evt.shiftKey ? "_getPrev" : "_getNext"](this.focusedChild);
						while (!next) {
							renderer = renderer[evt.shiftKey ? "previousElementSibling" : "nextElementSibling"]
								|| this[evt.shiftKey ? "_getLast" : "_getFirst"]().parentNode;
							next = renderer[evt.shiftKey ? "_getLast" : "_getFirst"]();
						}
						this.focusChild(next);
					}
				} else if (evt.keyCode === keys.ESCAPE) {
					// Leave Actionable mode
					this._leaveActionableMode();
				}
			}
		}),
		/*jshint maxcomplexity:10*/

		_enterActionableMode: function () {
			var focusedRenderer = this._getFocusedRenderer();
			if (focusedRenderer) {
				var next = focusedRenderer._getFirst();
				if (next) {
					this.focusChild(next);
				}
			}
		},

		_leaveActionableMode: function () {
			this.focusChild(this._getFocusedRenderer().renderNode);
		},

		focus: function () {
			// summary:
			//		Focus the previously focused child of the first visible grid cell
			if (this._previousFocusedChild) {
				this.focusChild(this._previousFocusedChild);
			} else {
				var cell = this._getFirst();
				if (cell) {
					while (cell) {
						if (this.getTopDistance(cell) >= 0) {
							break;
						}
						var nextRenderer = cell.parentNode.nextElementSibling;
						cell = nextRenderer ? nextRenderer.renderNode : null;
					}
					this.focusChild(cell);
				}
			}
		},

		_onBlur: dcl.superCall(function (sup) {
			// summary:
			//		Store a reference to the focused child
			return function () {
				this._previousFocusedChild = this.focusedChild;
				sup.apply(this, arguments);
			};
		}),

		// Page Up/Page down key support
		_getFirst: function () {
			// summary:
			//		Returns the first cell in the list.
			return this.containerNode.querySelector("[role='gridcell']"); // Element
		},

		_getLast: function () {
			// summary:
			//		Returns the last cell in the list.
			var cells = this.containerNode.querySelectorAll("[role='gridcell']");
			return cells.length ? cells.item(cells.length - 1) : null; // Element
		},

		// Simple arrow key support.
		_onDownArrow: function () {
			if (this.focusedChild.hasAttribute("navindex")) {
				return;
			}
			var renderer = this._getFocusedRenderer();
			this.focusChild(renderer.nextElementSibling ? renderer.nextElementSibling.renderNode :
				this.containerNode.firstElementChild.renderNode);
		},

		_onUpArrow: function () {
			if (this.focusedChild.hasAttribute("navindex")) {
				return;
			}
			var renderer = this._getFocusedRenderer();
			this.focusChild(renderer.previousElementSibling ? renderer.previousElementSibling.renderNode :
				this.containerNode.lastElementChild.renderNode);
		},

		_getNext: function (/*Element*/child) {
			// Letter key navigation support.
			var renderer = this.getEnclosingRenderer(child);
			return renderer.nextElementSibling ? renderer.nextElementSibling.renderNode : this._getFirst(); // Element
		},

		//////////// Extra methods for Keyboard navigation ///////////////////////////////////////

		_spaceKeydownHandler: function (evt) {
			// summary:
			//		Handle SPACE key
			// tags:
			//		private
			if (this.selectionMode !== "none") {
				evt.preventDefault();
				this._handleSelection(evt);
			}
		},

		_getFocusedRenderer: function () {
			// summary:
			//		Returns the renderer that currently has the focused or is
			//		an ancestor of the focused node.
			// tags:
			//		private
			return this.focusedChild ? this.getEnclosingRenderer(this.focusedChild) : null; /*deliteful/list/Renderer*/
		}

	});

	return register("d-list", [HTMLElement, List]);

});