/** @module deliteful/list/List */
import dcl from "dcl/dcl";
import { html } from "lit-html";
import { classMap } from "lit-html/directives/class-map";
import { ifDefined } from "lit-html/directives/if-defined";
import { repeat } from "lit-html/directives/repeat";
import a11y from "delite/a11y";
import register from "delite/register";
import LitWidget from "delite/LitWidget";
import Selection from "delite/Selection";
import KeyNav from "delite/KeyNav";
import StoreMap from "delite/StoreMap";
import Scrollable from "delite/Scrollable";
import messages from "requirejs-dplugins/i18n!./List/nls/List";
import "./List/List.css";

// Used in template.
import "../ProgressIndicator";
import "delite/a11yclick";

/**
 * A widget that renders a scrollable list of items.
 *
 * The List widget renders a scrollable list of items that are retrieved from a Store.
 * Its custom element tag is `d-list`.
 *
 * @class module:deliteful/list/List
 * @augments module:delite/Selection
 * @augments module:delite/KeyNav
 * @augments module:delite/StoreMap
 */

var mixins = [ HTMLElement, LitWidget, Selection, KeyNav, StoreMap, Scrollable ];
export default register("d-list", mixins, /** @lends module:deliteful/list/List# */ {
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
	 * Mapping between the attribute of the item retrieved from the store
	 * and the label attribute expected by the default renderer
	 * @member {string}
	 * @default "label"
	 */
	labelAttr: "label",

	/**
	 * Mapping between the attribute of the item retrieved from the store
	 * and the icon attribute expected by the default renderer
	 * @member {string}
	 * @default "iconclass"
	 */
	iconclassAttr: "iconclass",

	/**
	 * Mapping between the attribute of the item retrieved from the store
	 * and the righttext attribute expected by the default renderer
	 * @member {string}
	 * @default "righttext"
	 */
	righttextAttr: "righttext",

	/**
	 * Mapping between the attribute of the item retrieved from the store
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
	 * If `true` and the list's store is empty, a "no items" message will be shown.
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
	 * When it is equal to `list` (as `busy` is equal to `false`), the actual list is shown.
	 * When it is equal to `no-items` (only if `showNoItems` is set to `true`and there are no itesm),
	 * a `d-list-no-items` is displayed.
	 * When it is `none` (as `showNoItems is set to `false` and `busy` not `true` and there are no items,
	 * nothing is shown.
	 * @type {String}
	 * @default ""
	 * @private
	 */
	_displayedPanel: "",

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

	/**
	 * Optional message to display, with a progress indicator, when
	 * the list is loading its content.
	 * @member {string}
	 * @default ""
	 */
	loadingMessage: "",

	/**
	 * Hook to set aria-label on node with listbox etc. role.
	 */
	ariaLabel: "",

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

	// eslint-disable-next-line complexity
	computeProperties: function (props) {
		//	List attributes have been updated.
		if ("renderItem" in props
			|| (this._isCategorized()
				&& ("categoryAttr" in props || "categoryFunc" in props || "renderCategory" in props))) {
			if (this._dataLoaded) {
				this._busy = true;

				// trigger a reload of the list
				this.notifyCurrentValue("source");
			}
		}

		if (("renderItems" in props && this.renderItems) || "_busy" in props || "showNoItems" in props) {
			this._displayedPanel = (this._busy) ? "loading-panel" :
				(this.renderItems && this.renderItems.length > 0) ?
					"list" : ((this.showNoItems) ? "no-items" : "none");

			// The previously focused child is probably about to be removed, so remove reference.
			this._previousFocusedChild = null;
		}

		// Set descendantSelector() to navigate to cells, except when the cells contain a single control, in which
		// case navigate directly to the control.  See https://www.w3.org/TR/wai-aria-practices/#gridNav_focus.
		// Note: descendantSelector() should match the cell or the embedded control, but not both
		// Most of this fancy CSS is to skip cells and controls in nested lists/tables.
		// Also skips category renderers when role=listbox, role=list or role=menu.
		if ("widgetId" in props || "type" in props) {
			const widgetId = this.widgetId;
			const selectors = this.type === "grid" ? [
				`#${widgetId}-container > [role=row] > *:not(.d-list-control-cell)`,
				`#${widgetId}-container > [role=row] > .d-list-control-cell > *`,
				`#${widgetId}-container > [role=rowgroup] > [role=row] > *:not(.d-list-control-cell)`,
				`#${widgetId}-container > [role=rowgroup] > [role=row] > .d-list-control-cell > *`
			] : [
				`#${widgetId}-container > [role=option]:not(.d-list-control-cell)`,
				`#${widgetId}-container > [role=menuitem]:not(.d-list-control-cell)`,
				`#${widgetId}-container > [role=listitem]:not(.d-list-control-cell)`,
				`#${widgetId}-container > .d-list-control-cell > *`
			];

			this.descendantSelector = selectors.join(", ");
		}

		if (this.selectionMode === "none" && this.selectedItems.length) {
			this.selectedItems = [];
		}
	},

	/**
	 * Top level method to render the list.
	 * @returns {TemplateResult}
	 */
	render: function () {
		switch (this._displayedPanel) {
		case "loading-panel":
			return this.renderLoadingPanel();
		case "no-items":
			return this.renderNoItems();
		case "list":
			return this.renderList();
		}
	},

	/**
	 * Render the loading panel.  Used while waiting for data to download from server.
	 * @returns {TemplateResult}
	 */
	renderLoadingPanel: function () {
		const { _busy, loadingMessage, widgetId } = this;

		return html`
			<div class="d-list-loading-panel"
					aria-hidden="${!_busy}" aria-labelledby="${widgetId}-loadingIndicatorLabel">
				<div class="d-list-loading-panel-info">
					<d-progress-indicator active="${_busy}"></d-progress-indicator>
					<div class="d-list-loading-panel-info-label" id="${widgetId}-loadingIndicatorLabel">
						${loadingMessage}
					</div>
				</div>
			</div>
		`;
	},

	/**
	 * Called when there are no items in the list.
	 * @returns {TemplateResult}
	 */
	renderNoItems: function () {
		const { noItemsInfo } = this;

		return html`
			<div class="d-list-no-items">
				<div class="d-list-no-item-info">${noItemsInfo}</div>
			</div>
		`;
	},

	/**
	 * Render the list content.
	 * @returns {TemplateResult}
	 */
	renderList: function () {
		const { _busy, ariaLabel, renderItems, selectionMode, tabIndex, type, widgetId } = this;

		const classes = {
			"d-list-container": true,
			[this._cssClasses.selectable]: this.selectionMode === "single" || this.selectionMode === "radio",
			[this._cssClasses.multiselectable]: this.selectionMode === "multiple"
		};

		const firstInCategory = idx => this._isCategorized() &&
			(idx === 0 || renderItems[idx].category !== renderItems[idx - 1].category);

		return html`
			<div id="${widgetId}-container" role="${type}" class="${classMap(classes)}" tabindex="${tabIndex}"
				 aria-readonly="${ifDefined(type === "grid" ? "true" : undefined)}" aria-busy="${_busy}"
				 aria-multiselectable="${ifDefined(selectionMode === "multiple" ? "true" : undefined)}"
				 aria-label="${ifDefined(ariaLabel || undefined)}"
			>
				 ${ repeat(renderItems, item => this.getIdentity(item), (item, idx) => html`
					${ firstInCategory(idx) ? this.renderCategory(item) : null }
					${ this.renderItem(item) }
				`) }
			</div>
		`;
	},

	renderCategory: function (item) {
		if (this.type === "grid") {
			return html`
				<div role="row" class="d-list-category" .item="${item}">
					<div role="columnheader" class="d-list-cell" tabindex="-1">${item.category}</div>
				</div>
			`;
		} else {
			return html`
				<div role="heading" class="d-list-category d-list-cell" .item="${item}">${item.category}</div>
			`;
		}
	},

	renderItem: function (item) {
		// According to https://www.w3.org/TR/wai-aria/states_and_properties#aria-selected
		// aria-selected shouldn't be set on role=menuitem nodes.  That's what the future
		// https://www.w3.org/TR/wai-aria-1.1/#aria-current role is for.  So set to undefined
		// for that case, rather than true or false, and leverage ifDefined().
		const ariaSelected = this.selectionMode !== "none" && (this.type === "grid" || this.type === "listbox") ?
			"" + !!this.isSelected(item) : undefined;

		// On the other hand, menu items can get the selected CSS class.
		const cssSelected = !!this.isSelected(item);

		if (this.type === "grid") {
			const classes = {
				"d-list-item": true,
				[this._cssClasses.selected]: cssSelected
			};

			return html`
				<div role="row" aria-selected="${ifDefined(ariaSelected)}" class="${classMap(classes)}"
						@click="${evt => this.handleSelection(evt, item, evt.currentTarget)}"
						d-keyboard-click="true" .item="${item}">
					<div role="gridcell" class="d-list-cell" tabindex="-1">
						<div class="d-list-item-icon ${item.iconclass}" aria-hidden="true" role="presentation"></div>
						<div class="d-list-item-label">${item.label}</div>
						<div class="d-spacer"></div>
						<div class="d-list-item-right-text">${item.righttext}</div>
						<div class="d-list-item-right-icon ${item.righticonclass}" aria-hidden="true"
							role="presentation"></div>
					</div>
				</div>
			`;
		} else {
			const role = {
				grid: "row",
				listbox: "option",
				menu: "menuitem",	// there's also menuitemcheckbox and menuitemradio
				list: "listitem"
			}[this.type];

			const classes = {
				"d-list-item": true,
				"d-list-cell": true,
				[this._cssClasses.selected]: cssSelected
			};

			return html`
				<div role="${role}" aria-selected="${ifDefined(ariaSelected)}" class="${classMap(classes)}"
						tabindex="-1"
						@click="${evt => this.handleSelection(evt, item, evt.currentTarget)}"
						d-keyboard-click="true" .item="${item}">
					<div class="d-list-item-icon ${item.iconclass}" aria-hidden="true" role="presentation"></div>
					<div class="d-list-item-label">${item.label}</div>
					<div class="d-spacer"></div>
					<div class="d-list-item-right-text">${item.righttext}</div>
					<div class="d-list-item-right-icon ${item.righticonclass}" aria-hidden="true"
						role="presentation"></div>
				</div>
			`;
		}
	},

	//////////// Public methods ///////////////////////////////////////

	/**
	 * Returns the renderer enclosing an Element, or null.
	 * if there is none.
	 * @param {Element} node The dom node.
	 * @returns {Element}
	 */
	getEnclosingRenderer: function (node) {
		const containerId = `${this.widgetId}-container`;
		while (node && node.parentNode) {
			if (node.parentNode.id === containerId) {
				return node;
			} else {
				node = node.parentNode;
			}
		}
		return null;
	},

	/**
	 * Returns the row enclosing a dom node, or null if there is none.
	 *
	 * For non-grid type Lists, same as getEnclosingRenderer().
	 *
	 * @param {Element} node The dom node.
	 * @returns {Element}
	 */
	getEnclosingRow: function (node) {
		if (this.type === "grid") {
			var currentCell = this.getEnclosingCell(node);
			return currentCell ? currentCell.parentNode : null;
		} else {
			return this.getEnclosingRenderer(node);
		}
	},

	/**
	 * For type=grid Lists, returns the cell enclosing a dom node, or null if there is none.
	 * Otherwise, just return the renderer.
	 * @param {Element} node The dom node.
	 * @returns {Element}
	 */
	getEnclosingCell: function (node) {
		const isContainer = containerNode => containerNode && containerNode.id === `${this.widgetId}-container`;
		if (this.type === "grid") {
			while (node) {
				var parent = node.parentNode,
					grandparent = parent.parentNode;
				// Don't match gridcell in nested Lists, only for this List.  However, account
				// for both case when renderer is "rowgroup" containing a "row", or it's just a "row".
				if (/^(gridcell|columnheader|rowheader)$/.test(node.getAttribute("role")) &&
					(isContainer(grandparent) || isContainer(grandparent.parentNode))) {
					break;
				}
				node = parent;
			}
			return node;
		} else {
			return this.getEnclosingRenderer(node);
		}
	},

	//////////// delite/Selection implementation ///////////////////////////////////////

	/**
	 * Always returns true so that no keyboard modifier is needed when selecting / deselecting items.
	 * @param {Event} event
	 * @return {boolean}
	 * @protected
	 */
	hasSelectionModifier: function (/*event*/) {
		return true;
	},

	/**
	 * Event handler that performs items (de)selection.
	 * @protected
	 */
	handleSelection: function (event, item, renderer) {
		this.selectFromEvent(event, item, renderer, true);
	},

	//////////// Private methods ///////////////////////////////////////

	/**
	 * Returns whether the list is categorized or not.
	 * @private
	 */
	_isCategorized: function () {
		return this.categoryAttr || this.categoryFunc;
	},

	//////////// Renderers life cycle ///////////////////////////////////////

	/**
	 * Adds page of items to the renderItems[] array, triggering them to render.
	 * @param {Object[]} newItems - The new items to render.
	 * @param {boolean} atTheTop - If true, the new items are rendered at the top of the list.
	 * If false, they are rendered at the bottom of the list.
	 * @private
	 */
	_addPage: function (newItems, atTheTop) {
		const oldItems = this.renderItems || [];
		this.renderItems = atTheTop ? [...newItems, ...oldItems] : [...oldItems, ...newItems];
	},

	////////////delite/Store implementation ///////////////////////////////////////

	queryStoreAndInitItems: dcl.superCall(function (sup) {
		return function () {
			// Setting busy to true and showing the progress indicator.
			// It's removed in initItems(), after the query completes and busy is set to false.
			this._busy = true;
			sup.apply(this, arguments);
		};
	}),

	/**
	 * Populate the list using the items retrieved from the store.
	 * @param {Object[]} items items retrieved from the store.
	 * @protected
	 * @fires module:delite/Store#query-success
	 */
	initItems: dcl.superCall(function (sup) {
		return function (items) {
			this._addPage(items, false);
			this._busy = false;
			this._dataLoaded = true;
			return sup.call(this, items);
		};
	}),

	itemRemoved: dcl.superCall(function (sup) {
		return function (index, renderItems, keepSelection) {
			// If the removed item is selected, then deselect it.
			// Call selectFromEvent() to fire selection-change event.
			const item = renderItems[index];
			if (this.isSelected(item) && !keepSelection) {
				this.selectFromEvent(null, item, null, true);
			}

			sup.apply(this, arguments);
		};
	}),

	// Override Store#itemMoved() so moved item is *not* deselected.
	itemMoved: function (previousIndex, newIndex, renderItem, renderItems) {
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

	focus: function () {
		// Focus the previously focused child or the first visible row.
		if (this._previousFocusedChild) {
			this.navigateTo(this._previousFocusedChild);
		} else {
			const firstVisibleRow = this.getNavigableRows().find(renderer => this.getTopDistance(renderer) >= 0);
			if (firstVisibleRow) {
				this.navigateTo(this.getRowCell(firstVisibleRow, 0));
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
	 * For type=grid, returns the [role=row] nodes, excluding nodes in child lists.
	 *
	 * For other List types, simply returns the list of navigable renderers, i.e. the renderers
	 * that aren't categories.
	 */
	getNavigableRows: function () {
		const widgetId = this.widgetId;
		const rendererSelectors = this.type === "grid" ? [
			`#${widgetId}-container > [role=row]`,
			`#${widgetId}-container > [role=rowgroup] > [role=row]`
		] : [
			`#${widgetId}-container > [role=option]`,
			`#${widgetId}-container > [role=menuitem]`,
			`#${widgetId}-container > [role=listitem]`
		];

		return Array.from(this.querySelectorAll(rendererSelectors.join(", ")));
	},

	/**
	 * For type=grid, returns the next [role=row], which is generally the next renderer,
	 * unless the current renderer is a [role=rowgroup] with multiple rows.
	 *
	 * For other List types, simply returns the next navigable renderer, i.e. the next renderer
	 * that isn't a category.
	 *
	 * @param {Element} child
	 * @param {Number} dir - 1 for next, -1 for previous
	 */
	getNextNavigableRow: function (child, dir) {
		var rows = this.getNavigableRows();

		var currentRow = child && this.getEnclosingRow(child);
		var idx = Array.prototype.indexOf.call(rows, currentRow) + dir;

		return rows[idx];
	},

	/**
	 * Return the nth cell of the specified row, or if no such cell exists, then the last cell of the row.
	 * @param row
	 * @param idx
	 * @returns {Element}
	 */
	getRowCell: function (row, idx) {
		if (this.type === "grid") {
			return row.children[idx] || row.lastElementChild;
		} else {
			return row;
		}
	},

	// Override KeyNav#navigateTo() to focus the control inside of a control cell rather than the cell itself.
	// descendantSelector() should match either the cell or the control inside it, but not both.
	navigateTo: dcl.superCall(function (sup) {
		return function (child, triggerEvent) {
			if (!this.isNavigable(child)) {
				child = child.querySelector(this.descendantSelector);
			}
			return sup.call(this, child, triggerEvent);
		};
	}),

	// Simple arrow key support.

	upDownKeyHandler: function (evt, dir) {
		// Ignore arrow keys if not focused on an element inside a grid cell.  But don't ignore
		// them in the Combobox case, where arrow key is forwarded from the Combobox's <input> node.
		if (this.focusDescendants && !this.isNavigable(evt.target)) {
			return;
		}

		var focusedCell = this._getFocusedCell();
		if (focusedCell) {
			var newRow = this.getNextNavigableRow(focusedCell, dir);

			if (newRow) {
				var idx = Array.prototype.indexOf.call(focusedCell.parentNode.children, focusedCell),
					newCell = this.getRowCell(newRow, idx);
				this.navigateTo(newCell, false, evt);
			}
		} else {
			// Handle down-arrow from Combobox where there's no initially selected value.
			this.focus();
		}
	},

	downKeyHandler: function (evt) {
		this.upDownKeyHandler(evt, 1);
	},

	upKeyHandler: function (evt) {
		this.upDownKeyHandler(evt, -1);
	},

	previousKeyHandler: function (evt) {
		if (this.type !== "grid") {
			return false;		// indicates key not handled
		}
		// Ignore arrow keys if not focused on a grid cell.
		if (!this.isNavigable(evt.target)) {
			return false;		// indicates key not handled
		}

		var focusedCell = this._getFocusedCell();
		if (focusedCell.previousElementSibling) {
			this.navigateTo(focusedCell.previousElementSibling);
		}
	},

	nextKeyHandler: function (evt) {
		if (this.type !== "grid") {
			return false;		// indicates key not handled
		}

		// Ignore arrow keys if not focused on a grid cell.
		if (!this.isNavigable(evt.target)) {
			return false;		// indicates key not handled
		}

		var focusedCell = this._getFocusedCell();
		if (focusedCell.nextElementSibling) {
			this.navigateTo(focusedCell.nextElementSibling);
		}
	},

	// Remap Page Up -> Home and Page Down -> End

	pageUpKeyHandler: function (evt) {
		this.navigateToFirst(evt);
	},

	pageDownKeyHandler: function (evt) {
		this.navigateToLast(evt);
	},

	//////////// Extra methods for Keyboard navigation ///////////////////////////////////////

	tabKeyHandler: function (evt) {
		if (this.isNavigable(evt.target)) {
			// We are in grid navigation mode, so this tab key needs to send focus past the entire List.

			// Make sure we don't get stuck on tab stops internal to this list by temporarily setting
			// all tab-navigable nodes to tabindex=-1.
			var navigableNodes = this.keyNavContainerNode.querySelectorAll(
				"[tabindex], a, area, button, input, object, select, textarea, iframe");
			var removeTabIndex = [],
				restoreTabIndex = [];
			Array.prototype.forEach.call(navigableNodes, function (node) {
				if (node === this.ownerDocument.activeElement || node.getAttribute("tabindex") === "-1") {
					return;
				} else if (node.hasAttribute("tabindex")) {
					restoreTabIndex.push({
						node: node,
						originalTabindex: node.getAttribute("tabindex")
					});
				} else {
					removeTabIndex.push(node);
				}
				node.setAttribute("tabindex", "-1");
			}, this);
			this.defer(function () {
				removeTabIndex.forEach(function (node) {
					node.removeAttribute("tabindex");
				});
				restoreTabIndex.forEach(function (x) {
					x.node.setAttribute("tabindex", x.originalTabindex);
				});
			}, 10);

			// Then, let browser handle tab key.  In simple case it will go to the element after the list,
			// but if this is the end of the document then it will go to the address bar etc.
			return false;
		} else {
			// We are in navigating inside a cell.
			// Let tab keep work naturally except when we hit first or last tab stop in the cell,
			// and then loop around, ala the Dialog behavior.
			var cell = this._getFocusedCell();
			var tabStops = a11y.getTabNavigable(cell);
			var index = tabStops.indexOf(evt.target),
				newIndex = (index + tabStops.length + (evt.shiftKey ? -1 : 1)) % tabStops.length;
			tabStops[newIndex].focus();
			return true;
		}
	},

	enterKeyHandler: function (evt) {
		if (this.type === "grid") {
			if (this.isNavigable(evt.target)) {
				// Switch from grid navigation mode to navigation inside cell.
				this._enterActionableMode();
			}
		}
	},

	escapeKeyHandler: function (evt) {
		if (this.type === "grid" && !this.isNavigable(evt.target)) {
			// We are in navigating inside a cell.  Return focus to the cell.
			this._leaveActionableMode();
		} else {
			// Emit the ESCAPE key so that you can Combobox multiselect dropdown
			// will close, and also a dialog containing a List.
			this.emit("keydown", evt);
		}
	},

	f2KeyHandler: function (evt) {
		if (this.type === "grid") {
			if (this.isNavigable(evt.target)) {
				// Switch from grid navigation mode to navigation inside cell.
				this._enterActionableMode();
			} else {
				// We are in navigating inside a cell.  Return focus to the cell.
				this._leaveActionableMode();
			}
		}
	},

	/**
	 * Switch to navigation inside a cell.
	 */
	_enterActionableMode: function () {
		var cell = this._getFocusedCell();
		var firstTabStop = a11y.getFirstInTabbingOrder(cell);
		if (firstTabStop) {
			firstTabStop.focus();
		}
	},

	/**
	 * Switch back to grid navigation, i.e. navigating between cells.
	 */
	_leaveActionableMode: function () {
		var cell = this._getFocusedCell();
		this.navigateTo(cell);
	},

	/**
	 * Returns the renderer that currently has the focus or is
	 * an ancestor of the focused node.
	 * @return {Element}
	 * @private
	 */
	_getFocusedRenderer: function () {
		return this.navigatedDescendant ? this.getEnclosingRenderer(this.navigatedDescendant) : null;
	},

	/**
	 * For type=grid Lists, returns the cell that currently has the focus or is
	 * an ancestor of the focused cell.
	 * @return {Element}
	 * @private
	 */
	_getFocusedCell: function () {
		return this.navigatedDescendant ? this.getEnclosingCell(this.navigatedDescendant) : null;
	}
});

