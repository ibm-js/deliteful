/** @module deliteful/list/List */
define([
	"dcl/dcl",
	"delite/Widget",
	"delite/register",
	"requirejs-dplugins/jquery!attributes/classes",
	"delite/CustomElement",
	"delite/Selection",
	"delite/KeyNav",
	"delite/StoreMap",
	"delite/Scrollable",
	"./ItemRenderer",
	"./CategoryRenderer",
	"delite/handlebars!./List/List.html",
	"requirejs-dplugins/i18n!./List/nls/List",
	"delite/theme!./List/themes/{{theme}}/List.css"
], function (dcl, Widget, register, $, CustomElement,
		Selection, KeyNav, StoreMap, Scrollable, ItemRenderer, CategoryRenderer, template, messages) {

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
	 * @augments module:delite/Selection
	 * @augments module:delite/KeyNav
	 * @augments module:delite/StoreMap
	 * @augments module:delite/Scrollable
	 */

	return register("d-list", [HTMLElement, Selection, KeyNav, StoreMap, Scrollable],
			/** @lends module:deliteful/list/List# */ {

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

		tabIndex: 0,

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
		 * If `true` and the list's store is empty, the NoItemContainer element will be shown.
		 * @member {boolean}
		 * @default false
		 */
		showNoItems: false,

		/**
		 * Message to display when the d-list-no-items node is shown.
		 * @member {string}
		 * @default "Nothing to show."
		 */
		noItemsInfo: messages["no-items-info"],

		/**
		 * Flag set to a truthy value once the items initialization starts.
		 * It is set to false when the initialization ends.
		 * Furthermore if `true`, a loading panel will be shown.
		 * @member {boolean}
		 * @private
		 */
		_busy: false,

		/**
		 * Specifies the role of list. It can be one of `grid`, `menu`, `listbox` or `list`.
		 * @type {string}
		 * @default "grid"
		 */
		type: "grid",

		/**
		 * Property responsible for managing the right view of the list. It can be one of
		 * `loading-panel`, `list`, `no-items`, `none`.
		 * When it is equal to `loading-panel` (as `busy` is equal to `true`), a `d-list-loading-panel`
		 * loading panel is shown.
		 * When it is equal to `list` (as `busy` is equal to `false` and the `containerNode` children length
		 * is greater than zero), the actual list is shown.
		 * When it is equal to `no-items` (only if `showNoItems` is set to `true`and the `containerNode`
		 * children length is equal to zero), a `d-list-no-items` is displayed.
		 * When it is `none` (as `showNoItems is set to `false` and `busy` not `true` and `containerNode`
		 * children length is equal to zero, nothing is shown.
		 * @type {String}
		 * @default ""
		 * @private
		 */
		_displayedPanel: "",

		template: template,

		/**
		 * Defines the scroll direction: `"vertical"` for a scrollable List, `"none"` for a non scrollable List.
		 * @member {string} module:deliteful/list/List#scrollDirection
		 * @default "vertical"
		 */
		scrollDirection: dcl.prop({
			set: function (value) {
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
			get: function () {
				return this._get("scrollDirection") || "vertical";
			},
			enumerable: true,
			configurable: true
		}),

		/**
		 * Defines the selection mode: `"none"` (not allowed if `role=listbox` or `role=list`),
		 * `"radio"`, `"single"` or `"multiple"`.
		 * @member {string} module:deliteful/list/List#selectionMode
		 * @default "none", or "single" if `role=listbox` or `role=list`.
		 */
		selectionMode: dcl.prop({
			set: dcl.superCall(function (sup) {
				return function (value) {
					if ((this.type === "listbox" || this.type === "list") && value === "none") {
						throw new TypeError("selectionMode 'none' is invalid for an aria listbox/list, "
							+ "keeping the previous value of '" + this.selectionMode + "'");
					} else {
						sup.apply(this, arguments);
					}
				};
			}),
			get: function () {
				return this._get("selectionMode") || "none";
			},
			enumerable: true,
			configurable: true
		}),

		////////////////////////////////////////////////////////////////////////////////////////////
		// Override setAttribute(), getAttribute(), hasAttribute() and removeAttribute to move down to
		// the containerNode any aria attribute set to the root.

		setAttribute: dcl.superCall(function (sup) {
			return function (name, value) {
				if (/^aria-/.test(name) && this.containerNode) {
					this.containerNode.setAttribute(name, value);
				} else {
					sup.call(this, name, value);
				}
			};
		}),

		getAttribute: dcl.superCall(function (sup) {
			return function (name) {
				if (/^aria-/.test(name) && this.containerNode) {
					return this.containerNode.getAttribute(name);
				} else {
					return sup.call(this, name);
				}
			};
		}),

		hasAttribute: dcl.superCall(function (sup) {
			return function (name) {
				if (/^aria-/.test(name) && this.containerNode) {
					return this.containerNode.hasAttribute(name);
				} else {
					return sup.call(this, name);
				}
			};
		}),

		removeAttribute: dcl.superCall(function (sup) {
			return function (name) {
				if (/^aria-/.test(name) && this.containerNode) {
					this.containerNode.removeAttribute(name);
				} else {
					sup.call(this, name);
				}
			};
		}),

		/**
		 * Optional message to display, with a progress indicator, when
		 * the list is loading its content.
		 * @member {string}
		 * @default ""
		 */
		loadingMessage: "",

		// CSS classes internally referenced by the List widget
		_cssClasses: {
			cell: "d-list-cell",
			selected: "d-selected",
			selectable: "d-selectable",
			multiselectable: "d-multiselectable"
		},

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

		constructor: function () {
			this.on("query-error", function () {
				this._busy = false;
			}.bind(this));
		},

		queryStoreAndInitItems: dcl.superCall(function (sup) {
			return function () {
				// Setting busy to true and showing the progress indicator.
				// It's removed in initItems(), after the query completes and busy is set to false.
				this._busy = true;
				sup.apply(this, arguments);
			};
		}),

		refreshRendering: function (props, isAfterInitialRendering) {
			//	List attributes have been updated.
			/*jshint maxcomplexity:15*/
			if ("selectionMode" in props) {
				// Update aria attributes
				$(this.containerNode).removeClass(this._cssClasses.selectable);
				$(this.containerNode).removeClass(this._cssClasses.multiselectable);
				this.containerNode.removeAttribute("aria-multiselectable");
				if (this.selectionMode === "none") {
					// update aria-selected attribute on unselected items
					for (var i = 0; i < this.containerNode.children.length; i++) {
						var child = this.containerNode.children[i];
						if (child.renderNode // no renderNode for the loading panel child
							&& child.renderNode.hasAttribute("aria-selected")) {
							child.renderNode.removeAttribute("aria-selected");
							$(child).removeClass(this._cssClasses.selected);
						}
					}
				} else {
					if (this.selectionMode === "single" || this.selectionMode === "radio") {
						$(this.containerNode).addClass(this._cssClasses.selectable);
					} else {
						$(this.containerNode).addClass(this._cssClasses.multiselectable);
						this.containerNode.setAttribute("aria-multiselectable", "true");
					}
					// update aria-selected attribute on unselected items
					if (this.type === "grid" || this.type === "listbox") {
						for (i = 0; i < this.containerNode.children.length; i++) {
							child = this.containerNode.children[i];
							if (child.tagName.toLowerCase() === this.itemRenderer.tag
									&& child.renderNode // no renderNode for the loading panel child
									&& !child.renderNode.hasAttribute("aria-selected")) {
								child.renderNode.setAttribute("aria-selected", "false");
								$(child).removeClass(this._cssClasses.selected); // TODO: NOT NEEDED ?
							}
						}
					}
				}
			}

			if ("type" in props) {
				this.getRenderers().forEach(function (renderer) {
					renderer.parentRole = this.type;
					if (renderer.deliver) {
						renderer.deliver();
					}
				}.bind(this));
				if (this.type === "grid") {
					this.containerNode.setAttribute("aria-readonly", true);
				} else {
					this.containerNode.removeAttribute("aria-readonly");
				}
			}

			if (("renderItems" in props && this.renderItems ||
					"_displayedPanel" in props) && !isAfterInitialRendering) {
				// notify the list content changed.
				this.emit("delite-size-change");
			}
		},

		computeProperties: function (props) {
			/*jshint maxcomplexity:13*/
			//	List attributes have been updated.
			if ("itemRenderer" in props
				|| (this._isCategorized()
						&& ("categoryAttr" in props || "categoryFunc" in props || "categoryRenderer" in props))) {
				if (this._dataLoaded) {
					this._busy = true;

					// trigger a reload of the list
					this.notifyCurrentValue("source");
				}
			}
			if (("renderItems" in props && this.renderItems) || "_busy" in props || "showNoItems" in props) {
				this._displayedPanel = (this._busy) ? "loading-panel" :
					(this.containerNode && this.containerNode.children.length > 0) ?
						"list" : ((this.showNoItems) ? "no-items" : "none");
			}
		},

		postRender: function () {
			// moving down to the containerNode any aria attribute that has been set to the root node.
			for (var i = 0; i < this.attributes.length; i++) {
				if (/^aria-/.test(this.attributes[i].name)) {
					this.containerNode.setAttribute(this.attributes[i].name, this.attributes[i].value);
					HTMLElement.prototype.removeAttribute.call(this, this.attributes[i].name);
				}
			}
		},

		destroy: function () {
			// Remove reference to the list in the default store
			if (this.source && this.source.list) {
				this.source.list = null;
			}
		},

		deliver: dcl.superCall(function (sup) {
			return function () {
				// Deliver pending changes to the list and its renderers
				sup.apply(this, arguments);
				this.getRenderers().forEach(function (renderer) {
					if (renderer.deliver) {
						renderer.deliver();
					}
				});
			};
		}),

		//////////// Public methods ///////////////////////////////////////

		/**
		 * Returns the renderers displayed by the list.
		 * @returns {module:deliteful/list/Renderer[]}
		 * @private
		 */
		getRenderers: function () {
			return [].slice.call(this.containerNode ? this.containerNode.childNodes : []);
		},

		/**
		 * Returns the item and category renderers displayed by the list.
		 * @returns {module:deliteful/list/Renderer[]}
		 * @private
		 */
		getItemAndCategoryRenderers: function () {
			return Array.prototype.filter.call(this.containerNode.childNodes, function (node) {
				return node.tagName.toLowerCase() === this.itemRenderer.tag
					|| node.tagName.toLowerCase() === this.categoryRenderer.tag;
			}, this);
		},

		/**
		 * Returns the item renderers displayed by the list.
		 * @returns {module:deliteful/list/ItemRenderer[]}
		 */
		getItemRenderers: function () {
			return Array.prototype.filter.call(this.containerNode.childNodes, function (node) {
				return node.tagName.toLowerCase() === this.itemRenderer.tag;
			}, this);
		},

		/**
		 * Returns the renderer currently displaying an item with a specific id, or
		 * null if there is no renderer displaying an item with this id.
		 * @param {Object} id The id of the item displayed by the renderer.
		 * @returns {module:deliteful/list/Renderer}
		 */
		getRendererByItemId: function (id) {
			var renderers = this.getItemRenderers();
			for (var i = 0; i < renderers.length; i++) {
				var renderer = renderers[i];
				if (this.getIdentity(renderer.item) === id) {
					return renderer;
				}
			}
			return null;
		},

		/**
		 * Returns the item renderer at a specific index in the List, or null if there is no
		 * renderer at this index.
		 * @param {number} index The item renderer at the index (first item renderer index is 0).
		 * @returns {module:deliteful/list/ItemRenderer}
		 */
		getItemRendererByIndex: function (index) {
			return this.getItemRenderers()[index] || null;
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
				var nodeList = this.getItemRenderers();
				for (var i = 0; i < nodeList.length; i++) {
					var currentRenderer = nodeList[i];
					if (this.getIdentity(currentRenderer.item) === id) {
						result = i;
						break;
					}
				}
			}
			return result;
		},

		/**
		 * Returns the renderer enclosing a dom node, or null
		 * if there is none.
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
		 * Updates renderers when the selection has changed.
		 * @param {Object[]} items The items which renderers must be updated.
		 * @protected
		 */
		updateRenderers: function (items) {
			if (this.selectionMode === "none") {
				return;
			}
			for (var i = 0; i < items.length; i++) {
				var currentItem = items[i];
				var renderer = this.getRendererByItemId(this.getIdentity(currentItem));
				if (renderer) {
					var itemSelected = !!this.isSelected(currentItem);
					if (this.type === "grid" || this.type === "listbox") {
						// According to https://www.w3.org/TR/wai-aria/states_and_properties#aria-selected
						// aria-selected shouldn't be set on role=menuitem nodes.  That's what the future
						// https://www.w3.org/TR/wai-aria-1.1/#aria-current role is for.
						renderer.renderNode.setAttribute("aria-selected", itemSelected ? "true" : "false");
					}
					$(renderer).toggleClass(this._cssClasses.selected, itemSelected);
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
		 * @returns {boolean} `true` if the event has been handled, that is if the
		 *    event target has an enclosing item renderer. Returns `false` otherwise.
		 * @protected
		 */
		handleSelection: function (/*Event*/event) {
			var eventRenderer = this.getEnclosingRenderer(event.target);
			if (eventRenderer) {
				if (!this.isCategoryRenderer(eventRenderer)) {
					this.selectFromEvent(event, eventRenderer.item, eventRenderer, true);
				}
				return true;
			}
			return false;
		},

		//////////// Private methods ///////////////////////////////////////

		/**
		 * Returns whether the list is categorized or not.
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
						if (this.isCategoryRenderer(firstRenderer)
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
				w.connectedCallback();
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
					categoryRenderer.connectedCallback();
				}
			} else {
				this.containerNode.appendChild(renderer);
			}
			if (spec.addCategoryBefore) {
				categoryRenderer = this._createCategoryRenderer(renderer.item);
				this.containerNode.insertBefore(categoryRenderer, renderer);
				categoryRenderer.connectedCallback();
			}
			renderer.connectedCallback();
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
						if (this.isCategoryRenderer(previousRenderer)) {
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
					&& !this.isCategoryRenderer(result.nodeRef)
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
			if (this._isCategorized() && !this.isCategoryRenderer(renderer)) {
				// remove the previous category header if necessary
				var previousRenderer = this._getNextRenderer(renderer, -1);
				if (previousRenderer && this.isCategoryRenderer(previousRenderer)) {
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
					this.navigateTo(nextFocusRenderer.renderNode);
				}
			}
			if (!keepSelection && !this.isCategoryRenderer(renderer) && this.isSelected(renderer.item)) {
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
			var renderer = new this.itemRenderer({
				item: item,
				parentRole: this.type,
				tabindex: "-1"
			});
			renderer.deliver();
			if (this.selectionMode !== "none" && (this.type === "grid" || this.type === "listbox")) {
				var itemSelected = !!this.isSelected(item);
				renderer.renderNode.setAttribute("aria-selected", itemSelected ? "true" : "false");
				$(renderer).toggleClass(this._cssClasses.selected, itemSelected);
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
			var renderer = new this.categoryRenderer({
				item: item,
				parentRole: this.type,
				tabindex: "-1"
			});
			return renderer;
		},

		/**
		 * Returns whether a renderer is a category renderer or not>.
		 * @param {module:deliteful/list/Renderer} renderer The renderer to test.
		 * @return {boolean}
		 */
		isCategoryRenderer: function (/*deliteful/list/Renderer*/renderer) {
			return renderer.tagName.toLowerCase() === this.categoryRenderer.tag;
		},

		/**
		 * Returns whether two renderers have the same category or not.
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
		 * Returns the first item or category renderer in the list.
		 * @returns {module:deliteful/list/Renderer}
		 * @private
		 */
		_getFirstRenderer: function () {
			return this.getItemAndCategoryRenderers()[0] || null;
		},

		/**
		 * Returns the last item or category renderer in the list.
		 * @returns {module:deliteful/list/Renderer}
		 * @private
		 */
		_getLastRenderer: function () {
			var renderers = this.getItemAndCategoryRenderers();
			return renderers[renderers.length - 1] || null;
		},

		////////////delite/Store implementation ///////////////////////////////////////

		/**
		 * Populate the list using the items retrieved from the store.
		 * @param {Object[]} items items retrieved from the store.
		 * @protected
		 * @fires module:delite/Store#query-success
		 */
		initItems: dcl.superCall(function (sup) {
			return function (items) {
				this._empty();
				this._renderNewItems(items, false);
				this._busy = false;
				this._dataLoaded = true;
				return sup.call(this, items);
			};
		}),

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
			this.notifyCurrentValue("renderItems");
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
			this.notifyCurrentValue("renderItems");
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
			this.itemAdded(newIndex, renderItem, renderItems);
		},

		//////////// delite/Scrollable extension ///////////////////////////////////////

		/**
		 * Returns the distance between the top of a node and
		 * the top of the scrolling container.
		 * @param {Node} node the node
		 * @protected
		 */
		getTopDistance: function (node) {
			// Need to use Math.round for IE
			return Math.round(node.offsetTop - this.getCurrentScroll().y);
		},

		/**
		 * Returns the distance between the bottom of a node and
		 * the bottom of the scrolling container.
		 * @param {Node} node the node
		 * @protected
		 */
		getBottomDistance: function (node) {
			var clientRect = this.getBoundingClientRect();
			// Need to use Math.round for IE
			return Math.round(node.offsetTop +
				node.offsetHeight -
				this.getCurrentScroll().y -
				(clientRect.bottom - clientRect.top));
		},

		//////////// delite/KeyNav implementation ///////////////////////////////////////
		// Keyboard navigation is based on WAI ARIA Pattern for Grid:
		// http://www.w3.org/TR/2013/WD-wai-aria-practices-20130307/#grid

		/**
		 * Test if the child is navigable.  Skips category renderers when role=listbox,
		 * role=list or role=menu.
		 * @private
		 */
		descendantSelector: function (child) {
			var enclosingRenderer = this.getEnclosingRenderer(child);
			return enclosingRenderer &&
				(this.type === "grid" || !this.isCategoryRenderer(enclosingRenderer)) &&
				($(child).hasClass(this._cssClasses.cell) || child.hasAttribute("navindex"));
		},

		/**
		 * Handle keydown events.
		 * @private
		 */
		_keynavKeyDownHandler: dcl.before(function (evt) {
			if (!evt.defaultPrevented) {
				if ((evt.key === "Spacebar" && !this._searchTimer)) {
					this._spaceKeydownHandler(evt);
				} else {
					if (this.type === "grid") {
						this._gridKeydownHandler(evt);
					}
				}
			}
		}),

		focus: function () {
			// Focus the previously focused child of the first visible grid cell
			if (this._previousFocusedChild) {
				this.navigateTo(this._previousFocusedChild);
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
					this.navigateTo(cell);
				}
			}
		},

		focusoutHandler: dcl.superCall(function (sup) {
			return function (evt) {
				// When focus moves outside of the List, save reference to previously focused child.
				if (!this.contains(evt.relatedTarget)) {
					this._previousFocusedChild = this.navigatedDescendant;
				}

				sup.apply(this, arguments);
			};
		}),

		/**
		 * Returns the first cell in the list.
		 * For role=listbox, role=list and role=menu, skips category renderers.
		 * However, it doesn't skip navigation renderers ("click to load previous rows ...").
		 * @private
		 * @returns {Element}
		 */
		_getFirst: function () {
			var firstRenderer = this.containerNode.childNodes[0],
				firstCell = firstRenderer && firstRenderer.renderNode;
			if (this.type !== "grid" && firstRenderer && this.isCategoryRenderer(firstRenderer)) {
				firstCell = this.getNext(firstCell, 1);
			}
			return firstCell;
		},

		/**
		 * Returns the last cell in the list.
		 * For role=listbox, role=list and role=menu, skips category renderers.
		 * However, it doesn't skip navigation renderers ("click to load more rows ...").
		 * @private
		 * @returns {Element}
		 */
		_getLast: function () {
			var lastRenderer = this.containerNode.childNodes[this.containerNode.childNodes.length - 1],
				lastCell = lastRenderer && lastRenderer.renderNode;
			if (this.type !== "grid" && lastRenderer && this.isCategoryRenderer(lastRenderer)) {
				lastCell = this.getNext(lastCell, -1);
			}
			return lastCell || null;
		},

		/**
		 * Get the next or previous cell, compared to the specified one.
		 * @param child
		 * @param dir
		 * @returns {Element}
		 */
		getNext: function (child, dir) {
			if (child === this.containerNode) {
				return dir > 0 ? this._getFirst() : this._getLast();
			}

			var renderer = this.getEnclosingRenderer(child);
			return dir > 0 ? renderer.nextElementSibling ? renderer.nextElementSibling.renderNode : this._getFirst() :
				renderer.previousElementSibling ? renderer.previousElementSibling.renderNode : this._getLast();
		},

		// Simple arrow key support.
		downKeyHandler: function (evt) {
			if (this.navigatedDescendant && this.navigatedDescendant.hasAttribute("navindex")) {
				return;
			}
			var focusedRenderer = this._getFocusedRenderer();
			var next = null;
			if (focusedRenderer) {
				next = focusedRenderer.nextElementSibling;
				if (next && this.type !== "grid" && this.isCategoryRenderer(next)) {
					next = next.nextElementSibling;
				}
			}
			this.navigateTo(next ? next.renderNode : this._getFirst(), false, evt);
		},

		upKeyHandler: function (evt) {
			if (this.navigatedDescendant && this.navigatedDescendant.hasAttribute("navindex")) {
				return;
			}
			var focusedRenderer = this._getFocusedRenderer();
			var next = null;
			if (focusedRenderer) {
				next = focusedRenderer.previousElementSibling;
				if (next && this.type !== "grid" && this.isCategoryRenderer(next)) {
					next = next.previousElementSibling;
				}
			}
			this.navigateTo(next ? next.renderNode : this._getLast(), false, evt);
		},

		// Remap Page Up -> Home and Page Down -> End

		pageUpKeyHandler: function (evt) {
			this.navigateToFirst(evt);
		},

		pageDownKeyHandler: function (evt) {
			this.navigateToLast(evt);
		},

		//////////// Extra methods for Keyboard navigation ///////////////////////////////////////

		/**
		 * Handles SPACE key keydown event
		 * @param {Event} evt the keydown event
		 * @private
		 */
		_spaceKeydownHandler: function (evt) {
			if (this.selectionMode !== "none" && this.getEnclosingRenderer(evt.target)) {
				evt.preventDefault();

				// Wait until keyup to fire the selection event, so widgets like ComboButton don't switch focus
				// too early, sending a stray keyup event to the ComboButton anchor node.
				var handle = this.on("keyup", function (evt2) {
					handle.remove();
					this.handleSelection(evt2);
				}.bind(this));
			}
		},

		/**
		 * Handles keydown events for the aria role grid
		 * @param {Event} evt the keydown event
		 * @private
		 */
		_gridKeydownHandler: function (evt) {
			// jshint maxcomplexity:12
			if (this.navigatedDescendant && this.navigatedDescendant.hasAttribute("navindex")) {
				// We are in Actionable mode
				if (evt.key === "Tab") {
					evt.preventDefault();
					evt.stopPropagation();
					var renderer = this._getFocusedRenderer();
					var next = renderer[evt.shiftKey ? "getPrev" : "getNext"](this.navigatedDescendant);
					while (!next) {
						renderer = renderer[evt.shiftKey ? "previousElementSibling" : "nextElementSibling"]
							|| this[evt.shiftKey ? "_getLast" : "_getFirst"]().parentNode;
						next = renderer[evt.shiftKey ? "getLast" : "getFirst"]();
					}
					this.navigateTo(next);
				} else if (evt.key === "Escape") {
					// Leave Actionable mode
					evt.preventDefault();
					evt.stopPropagation();
					this._leaveActionableMode();
				}
			} else if (evt.key === "Enter" || evt.key === "F2") {
				// Enter Actionable Mode
				// TODO: prevent default ONLY IF autoAction is false on the renderer ?
				// See http://www.w3.org/TR/2013/WD-wai-aria-practices-20130307/#grid
				evt.preventDefault();
				evt.stopPropagation();
				this._enterActionableMode();
			}
		},

		/**
		 * @private
		 */
		_enterActionableMode: function () {
			var focusedRenderer = this._getFocusedRenderer();
			if (focusedRenderer) {
				var next = focusedRenderer.getFirst();
				if (next) {
					this.navigateTo(next);
				}
			}
		},

		/**
		 * @private
		 */
		_leaveActionableMode: function () {
			this.navigateTo(this._getFocusedRenderer().renderNode);
		},

		/**
		 * Returns the renderer that currently has the focused or is
		 * an ancestor of the focused node.
		 * @return {module:deliteful/list/Renderer}
		 * @private
		 */
		_getFocusedRenderer: function () {
			return this.navigatedDescendant ? this.getEnclosingRenderer(this.navigatedDescendant) : null;
		}
	});
});
