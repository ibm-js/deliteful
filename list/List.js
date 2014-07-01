/** @module deliteful/list/List */
define([
	"dcl/dcl",
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
	"requirejs-dplugins/has!dojo-bidi?delite/theme!./List/themes/{{theme}}/List_rtl_css"
], function (dcl, register, on, lang, when, domClass, keys, CustomElement, Selection, KeyNav, StoreMap,
		Invalidating, Scrollable, ItemRenderer, CategoryRenderer, DefaultStore, LoadingPanel) {

	// Register custom elements we use to support markup for adding items to the list store.
	register("d-list-store", [HTMLElement, CustomElement]);

	/**
	 * A widget that renders a scrollable list of items.
	 *
	 * The List widget renders a scrollable list of items that are retrieved from a Store.
	 * Its custom element tag is `d-list`.
	 *
	 * See the {@link https://github.com/ibm-js/deliteful/tree/master/docs/list/List.md user documentation}
	 * for more details.
	 *
	 * @class module:deliteful/list/List
	 * @augments module:delite/Invalidating
	 * @augments module:delite/Selection
	 * @augments module:delite/KeyNav
	 * @augments module:delite/StoreMap
	 * @augments module:delite/Scrollable
	 */
	var List = dcl([Invalidating, Selection, KeyNav, StoreMap, Scrollable], /** @lends module:deliteful/list/List# */ {

		/**
		 * Dojo object store that contains the items to render in the list.
		 * If no value is provided for this attribute, the List will initialize
		 * it with an internal store implementation. Note that this internal store
		 * implementation ignores any query options and returns all the items from
		 * the store, in the order they were added to the store.
		 * @member {module:dstore/Store} module:deliteful/list/List#store
		 * @default null
		 */

		/**
		 * Query to pass to the store to retrieve the items to render in the list.
		 * @member {Object} module:deliteful/list/List#query
		 * @default {}
		 */

		/**
		 * The widget class to use to render list items.
		 *	It MUST extend {@link module:deliteful/list/ItemRenderer deliteful/list/ItemRenderer}.
		 * @member {module:deliteful/list/ItemRenderer}
		 * @default module:deliteful/list/ItemRenderer
		 */
		itemRenderer: ItemRenderer,

		/**
		 * The widget class to use to render category headers when the list items are categorized.
		 * It MUST extend {@link module:deliteful/list/CategoryRenderer deliteful/list/CategoryRenderer}.
		 * @member {module:deliteful/list/CategoryRenderer}
		 * @default module:deliteful/list/CategoryRenderer
		 */
		categoryRenderer: CategoryRenderer,

		/**
		 * Default mapping between the attribute of the item retrieved from the store
		 * and the label attribute expected by the default renderer
		 * @member {string}
		 * @default "label"
		 */
		labelAttr: "label",

		/**
		 * Default mapping between the attribute of the item retrieved from the store
		 * and the icon attribute expected by the default renderer
		 * @member {string}
		 * @default "iconclass"
		 */
		iconclassAttr: "iconclass",

		/**
		 * Default mapping between the attribute of the item retrieved from the store
		 * and the righttext attribute expected by the default renderer
		 * @member {string}
		 * @default "righttext"
		 */
		righttextAttr: "righttext",

		/**
		 * Default mapping between the attribute of the item retrieved from the store
		 * and the righticon attribute expected by the default renderer
		 * @member {string}
		 * @default "righticonclass"
		 */
		righticonclassAttr: "righticonclass",

		/**
		 * Name of the list item attribute that define the category of a list item.
		 * If falsy and categoryFunc is also falsy, the list is not categorized.
		 * @member {string}
		 * @default ""
		 */
		categoryAttr: "",

		/**
		 * A function (or the name of a function) that extracts the category of a list item
		 * from the following input parameters:
		 * - `item`: the list item from the store
		 * - `store`: the store
		 * If falsy and `categoryAttr` is also falsy, the list is not categorized.
		 * see {@link module:delite/StoreMap delite/StoreMap}
		 * @member
		 * @default null
		 */
		categoryFunc: null,

		/**
		 *	The base class that defines the style of the list.
		 * Available values are:
		 * - `"d-list"` (default): render a list with no rounded corners and no left and right margins;
		 * - `"d-round-rect-list"`: render a list with rounded corners and left and right margins.
		 * @member {string}
		 * @default "d-list"
		 */
		baseClass: "d-list",

		// By default, letter search is one character only, so that it does not interfere with pressing
		// the SPACE key to (de)select an item.
		multiCharSearchDuration: 0,

		/**
		 * Defines the scroll direction: `"vertical"` for a scrollable List, `"none"` for a non scrollable List.
		 * @member {string} module:deliteful/list/List#scrollDirection
		 * @default "vertical"
		 */
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

		/**
		 * The selection mode for list items (see {@link module:delite/Selection delite/Selection}).
		 * @member {string}
		 * @default "none"
		 */
		selectionMode: "none",

		/**
		 * Optional message to display, with a progress indicator, when
		 * the list is loading its content.
		 * @member {string}
		 * @default ""
		 */
		loadingMessage: "",

		// CSS classes internally referenced by the List widget
		_cssClasses: {item: "d-list-item",
					  category: "d-list-category"},

		/**
		 * A panel that hides the content of the widget when shown, and displays a progress indicator
		 * and an optional message.
		 * @member {module:deliteful/list/_LoadingPanel} module:deliteful/list/List#_loadingPanel
		 * @private
		 */

		/**
		 * Handle for the selection click event handler
		 * @member {Function} module:deliteful/list/List#_selectionClickHandle
		 * @private
		 */

		/**
		 * Previous focus child before the list loose focus
		 * @member {Element} module:deliteful/list/List#_previousFocusedChild
		 * @private
		 */
		
		/**
		 * Flag set to a truthy value once the items have been loaded from the store
		 * @member {boolean} module:deliteful/list/List#_dataLoaded
		 * @private
		 */
		
		//////////// Widget life cycle ///////////////////////////////////////

		preCreate: function () {
			// Set invalidating properties.
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
			// Initialize the widget node and set the container and scrollable node.
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
			//	Assign a default store to the list.
			this.store = new DefaultStore(this);
			this._keyNavCodes[keys.PAGE_UP] = this._keyNavCodes[keys.HOME];
			this._keyNavCodes[keys.PAGE_DOWN] = this._keyNavCodes[keys.END];
			delete this._keyNavCodes[keys.HOME];
			delete this._keyNavCodes[keys.END];
		},

		startup: dcl.superCall(function (sup) {
			// Starts the widget: parse the content of the widget node to clean it,
			//	add items to the store if specified in markup.
			//	Using superCall() rather than the default chaining so that the code runs
			//	before StoreMap.startup()
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
			//	List attributes have been updated.
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
			//	List attributes have been updated.
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

		/**
		 *	Returns the renderer currently displaying an item with a specific id.
		 * @param {Object} id The id of the item displayed by the renderer.
		 * @returns {module:deliteful/list/Renderer}
		 */
		getRendererByItemId: function (id) {
			var renderers = this.containerNode.querySelectorAll("." + this._cssClasses.item);
			for (var i = 0; i < renderers.length; i++) {
				var renderer = renderers.item(i);
				if (this.getIdentity(renderer.item) === id) {
					return renderer;
				}
			}
			return null;
		},

		/**
		 * Returns the item renderer at a specific index in the List.
		 * @param {number} index The item renderer at the index (first item renderer index is 0).
		 * @returns {module:deliteful/list/ItemRenderer}
		 */
		getItemRendererByIndex: function (index) {
			return index >= 0 ? this.containerNode.querySelectorAll("." + this._cssClasses.item).item(index) : null;
		},

		/**
		 * Returns the index of an item renderer in the List, or -1 if
		 * the item renderer is not found in the list.
		 * @param {Object} renderer The item renderer.
		 * @returns {number}
		 */
		getItemRendererIndex: function (renderer) {
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

		/**
		 * Returns the renderer enclosing a dom node.
		 * @param {Element} node The dom node.
		 * @returns {module:deliteful/list/Renderer}
		 */
		getEnclosingRenderer: function (node) {
			var currentNode = node;
			while (currentNode) {
				if (currentNode.parentNode && currentNode.parentNode === this.containerNode) {
					break;
				}
				currentNode = currentNode.parentNode;
			}
			return currentNode;
		},

		//////////// delite/Selection implementation ///////////////////////////////////////

		/**
		 * Returns the identity of an item.
		 * @param {Object} item The item
		 * @returns {Object}
		 * @protected
		 */
		getIdentity: function (item) {
			return this.store.getIdentity(item);
		},

		/**
		 * Updates renderers when the selection has changed.
		 * @param {Object[]} items The items which renderers must be updated.
		 * @protected
		 */
		updateRenderers: function (items) {
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

		/**
		 * Always returns true so that no keyboard modifier is needed when selecting / deselecting items.
		 * @param {Event} event
		 * @return {boolean}
		 * @protected
		 */
		hasSelectionModifier: function (/*jshint unused: vars*/event) {
			return true;
		},

		/**
		 * Event handler that performs items (de)selection.
		 * @param {Event} event The event the handler was called for.
		 * @protected
		 */
		_handleSelection: function (/*Event*/event) {
			var eventRenderer = this.getEnclosingRenderer(event.target);
			if (eventRenderer) {
				this.selectFromEvent(event, eventRenderer.item, eventRenderer, true);
			}
		},

		//////////// Private methods ///////////////////////////////////////

		/**
		 * Sets the "busy" status of the widget.
		 * @param {boolean} status true if the list is busy loading and rendering its data.
		 * false otherwise.
		 * @param {boolean} hideContent true if the list should hide its content when it is busy,
		 * false otherwise
		 * @private
		 */
		_setBusy: function (status, hideContent) {
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

		/**
		 * Shows the loading panel
		 * @private
		 */
		_showLoadingPanel: function () {
			if (!this._loadingPanel) {
				this._loadingPanel = new LoadingPanel({message: this.loadingMessage});
				this.insertBefore(this._loadingPanel, this.containerNode);
				this._loadingPanel.startup();
			}
		},

		/**
		 * Hides the loading panel
		 * @private
		 */
		_hideLoadingPanel: function () {
			if (this._loadingPanel) {
				this._loadingPanel.destroy();
				this._loadingPanel = null;
			}
		},

		/**
		 * Returns wheher the list is categorized or not.
		 * @private
		 */
		_isCategorized: function () {
			return this.categoryAttr || this.categoryFunc;
		},

		/**
		 * Destroys all children of the list and empty it
		 * @private
		 */
		_empty: function () {
			this.findCustomElements(this.containerNode).forEach(function (w) {
				if (w.destroy) {
					w.destroy();
				}
			});
			this.containerNode.innerHTML = "";
			this._previousFocusedChild = null;
		},

		//////////// Renderers life cycle ///////////////////////////////////////

		/**
		 * Renders new items within the list widget.
		 * @param {Object[]} items The new items to render.
		 * @param {boolean} atTheTop If true, the new items are rendered at the top of the list.
		 * If false, they are rendered at the bottom of the list.
		 * @private
		 */
		_renderNewItems: function (/*Array*/ items, /*boolean*/atTheTop) {
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

		/**
		 * Creates renderers for a list of items (including the category renderers if the list
		 * is categorized).
		 * @param {Object[]} items Array An array that contains the items to create renderers for.
		 * @param {number} fromIndex The index of the first item in the array of items
		 * (no renderer will be created for the items before this index).
		 * @param {number} count The number of items to use from the array of items, starting
		 * from the fromIndex position
		 * (no renderer will be created for the items that follows).
		 * @param {Object} previousItem The item that precede the first one for which a renderer will be created.
		 * This is only usefull for categorized lists.
		 * @return {DocumentFragment}  A DocumentFragment that contains the renderers.
		 * The startup method of the renderers has not been called at this point.
		 * @private
		 */
		_createRenderers: function (items, fromIndex, count, previousItem) {
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
			return documentFragment;
		},

		/**
		 * Add an item renderer to the List, updating category renderers if needed.
		 * This method calls the startup method on the renderer after it has been
		 * added to the List.
		 * @param {module:deliteful/list/ItemRenderer} The renderer to add to the list.
		 * @param {number} atIndex The index (not counting category renderers) where to add
		 * the item renderer in the list.
		 * @private
		 */
		_addItemRenderer: function (renderer, atIndex) {
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

		/**
		 * Get a specification for the insertion of an item renderer in the list.
		 * @param {module:deliteful/list/ItemRenderer} renderer The renderer to add to the list.
		 * @param {number} atIndex The index (not counting category renderers) where to add
		 * the item renderer in the list.
		 * @return {Object} an object that contains the following attributes:
		 * - nodeRef: the node before which to insert the item renderer
		 * - addCategoryBefore: true if a category header should be inserted before the item renderer
		 * - addCategoryAfter: true if a category header should be inserted after the item renderer
		 * @private
		 */
		_getInsertSpec: function (renderer, atIndex) {
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
			return result;
		},

		/*jshint maxcomplexity:12*/
		/**
		 * Removes a renderer from the List, updating category renderers if needed.
		 * @param {module:deliteful/list/Renderer} renderer The renderer to remove from the list.
		 * @param {boolean} keepSelection Set to true if the renderer item should not be removed
		 * from the list of selected items.
		 * @private
		 */
		_removeRenderer: function (renderer, keepSelection) {
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

		/**
		 * Creates a renderer instance for an item.
		 * @param {Object} item The item to render.
		 * @returns {module:deliteful/list/ItemRenderer} An instance of item renderer that renders the item.
		 * @private
		 */
		_createItemRenderer: function (item) {
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
			return renderer;
		},

		/**
		 * Creates a category renderer instance for an item.
		 * @param {Object} item The item which category to render.
		 * @returns {module:deliteful/list/CategoryRenderer} An instance of category renderer
		 * that renders the category of the item.
		 * @private
		 */
		_createCategoryRenderer: function (item) {
			var renderer = new this.categoryRenderer({item: item, tabindex: "-1"});
			return renderer;
		},

		/**
		 * Returns whether a renderer is a category renderer or not
		 * @param {module:deliteful/list/Renderer} renderer the renderer to test
		 * @return {boolean}
		 * @private
		 */
		_isCategoryRenderer: function (/*deliteful/list/Renderer*/renderer) {
			return domClass.contains(renderer, this._cssClasses.category);
		},

		/**
		 * Returns whether two renderers have the same category or not
		 * @param {module:deliteful/list/Renderer} renderer1 The first renderer.
		 * @param {module:deliteful/list/Renderer} renderer2 The second renderer.
		 * @private
		 */
		_sameCategory: function (renderer1, renderer2) {
			return renderer1.item.category === renderer2.item.category;
		},

		/**
		 * Returns the renderer that comes immediately after of before another one.
		 * @param {module:deliteful/list/Renderer} renderer The renderer immediately before or after the one to return.
		 * @param {number} dir 1 to return the renderer that comes immediately after renderer, -1 to
		 * return the one that comes immediately before.
		 * @returns {module:deliteful/list/Renderer}
		 * @private
		 */
		_getNextRenderer: function (renderer, dir) {
			if (dir >= 0) {
				return renderer.nextElementSibling;
			} else {
				return renderer.previousElementSibling;
			}
		},

		/**
		 * Returns the first renderer in the list.
		 * @returns {module:deliteful/list/Renderer}
		 * @private
		 */
		_getFirstRenderer: function () {
			return this.containerNode.querySelector("." + this._cssClasses.item
					+ ", ." + this._cssClasses.category);
		},


		/**
		 * Returns the last renderer in the list.
		 * @returns {module:deliteful/list/Renderer}
		 * @private
		 */
		_getLastRenderer: function () {
			var renderers = this.containerNode
								.querySelectorAll("." + this._cssClasses.item + ", ." + this._cssClasses.category);
			return renderers.length ? renderers.item(renderers.length - 1) : null;
		},

		////////////delite/Store implementation ///////////////////////////////////////

		/**
		 * Populate the list using the items retrieved from the store.
		 * @param {Object[]} items items retrieved from the store.
		 * @protected
		 */
		initItems: function (items) {
			this._empty();
			this._renderNewItems(items, false);
			this._setBusy(false, true);
			this._dataLoaded = true;
		},

		/**
		 * Function to call when an item is removed from the store, to update
		 * the content of the list widget accordingly.
		 * @param {number} index The index of the render item to remove.
		 * @param {Object[]} renderItems Ignored by this implementation.
		 * @param {boolean} keepSelection Set to true if the item should not be removed from the list of selected items.
		 * @protected
		 */
		itemRemoved: function (index, renderItems, keepSelection) {
			var renderer = this.getItemRendererByIndex(index);
			if (renderer) {
				this._removeRenderer(renderer, keepSelection);
			}
		},

		/**
		 * Function to call when an item is added to the store, to update
		 * the content of the list widget accordingly.
		 * @param {number} index The index where to add the render item.
		 * @param {Object} renderItem The render item to be added.
		 * @param {Object[]} renderItems Ignored by this implementation.
		 * @private
		 */
		itemAdded: function (index, renderItem, /*jshint unused:vars*/renderItems) {
			var newRenderer = this._createItemRenderer(renderItem);
			this._addItemRenderer(newRenderer, index);
		},

		/**
		 * Function to call when an item is updated in the store, to update
		 * the content of the list widget accordingly.
		 * @param {number}  index The index of the render item to update.
		 * @param {Object} renderItem The render item data the render item must be updated with.
		 * @param {Object[]} renderItems Ignored by this implementation.
		 * @protected
		 */
		itemUpdated: function (index,  renderItem, /*jshint unused:vars*/renderItems) {
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

		/**
		 * Returns the distance between the top of a node and 
		 * the top of the scrolling container.
		 * @param {Node} node the node
		 * @protected
		 */
		getTopDistance: function (node) {
			return node.offsetTop - this.getCurrentScroll().y;
		},

		/**
		 * Returns the distance between the bottom of a node and
		 * the bottom of the scrolling container.
		 * @param {Node} node the node
		 * @protected
		 */
		getBottomDistance: function (node) {
			var clientRect = this.scrollableNode.getBoundingClientRect();
			return node.offsetTop +
				node.offsetHeight -
				this.getCurrentScroll().y -
				(clientRect.bottom - clientRect.top);
		},

		//////////// delite/KeyNav implementation ///////////////////////////////////////
		// Keyboard navigation is based on WIA ARIA Pattern for Grid:
		// http://www.w3.org/TR/2013/WD-wai-aria-practices-20130307/#grid

		/**
		 * @private
		 */
		childSelector: function (child) {
			return (child.getAttribute("role") === "gridcell" || child.hasAttribute("navindex"));
		},

		/*jshint maxcomplexity:15*/
		/**
		 * @method
		 * Handle keydown events
		 * @private
		 */
		_onContainerKeydown: dcl.before(function (evt) {
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

		/**
		 * @private
		 */
		_enterActionableMode: function () {
			var focusedRenderer = this._getFocusedRenderer();
			if (focusedRenderer) {
				var next = focusedRenderer._getFirst();
				if (next) {
					this.focusChild(next);
				}
			}
		},

		/**
		 * @private
		 */
		_leaveActionableMode: function () {
			this.focusChild(this._getFocusedRenderer().renderNode);
		},

		focus: function () {
			// Focus the previously focused child of the first visible grid cell
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

		/**
		 * @method
		 * Store a reference to the focused child
		 * @private
		 */
		_onBlur: dcl.superCall(function (sup) {
			return function () {
				this._previousFocusedChild = this.focusedChild;
				sup.apply(this, arguments);
			};
		}),

		// Page Up/Page down key support
		/**
		 * Returns the first cell in the list.
		 * @private
		 * @returns {Element}
		 */
		_getFirst: function () {
			return this.containerNode.querySelector("[role='gridcell']");
		},

		/**
		 * Returns the last cell in the list.
		 * @private
		 * @returns {Element}
		 */
		_getLast: function () {
			// summary:
			var cells = this.containerNode.querySelectorAll("[role='gridcell']");
			return cells.length ? cells.item(cells.length - 1) : null;
		},

		// Simple arrow key support.
		/**
		 * @private
		 */
		_onDownArrow: function () {
			if (this.focusedChild.hasAttribute("navindex")) {
				return;
			}
			var renderer = this._getFocusedRenderer();
			this.focusChild(renderer.nextElementSibling ? renderer.nextElementSibling.renderNode :
				this.containerNode.firstElementChild.renderNode);
		},

		/**
		 * @private
		 */
		_onUpArrow: function () {
			if (this.focusedChild.hasAttribute("navindex")) {
				return;
			}
			var renderer = this._getFocusedRenderer();
			this.focusChild(renderer.previousElementSibling ? renderer.previousElementSibling.renderNode :
				this.containerNode.lastElementChild.renderNode);
		},

		/**
		 * @param {Element} child
		 * @return {Element}
		 * @private
		 */
		_getNext: function (child) {
			// Letter key navigation support.
			var renderer = this.getEnclosingRenderer(child);
			return renderer.nextElementSibling ? renderer.nextElementSibling.renderNode : this._getFirst();
		},

		//////////// Extra methods for Keyboard navigation ///////////////////////////////////////

		/**
		 * Handles SPACE key keydown event
		 * @param {Event} evt the keydown event
		 * @private
		 */
		_spaceKeydownHandler: function (evt) {
			if (this.selectionMode !== "none") {
				evt.preventDefault();
				this._handleSelection(evt);
			}
		},

		/**
		 * Returns the renderer that currently has the focused or is
		 * an ancestor of the focused node.
		 * @return {module:deliteful/list/Renderer}
		 * @private
		 */
		_getFocusedRenderer: function () {
			return this.focusedChild ? this.getEnclosingRenderer(this.focusedChild) : null;
		}

	});

	return register("d-list", [HTMLElement, List]);

});
