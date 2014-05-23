---
layout: default
title: deliteful/list/List
---

# deliteful/list/List


The List widget renders a scrollable list of items that are retrieved from a [Store](https://github.com/SitePen/dstore).

Its custom element tag is `d-list`.

TODO: INSERT SCREENSHOT(S) HERE
##### Table of content

- [Scroll capabilities](#scroll-capabilities)  
- [Store capabilities](#store-capabilities)  
- [Categorized items](#categorized-items)  
- [Selection support](#selection-support)  
- [Keyboard navigation](#keyboard-navigation)  
- [Styling](#styling)  

## Scroll capabilities

If you do not want the list to be scrollable, you can set its `scrollDirection` attribute
to `"none"` in order to remove the default scrolling capability.

TODO: INSERT SCREENSHOT(S) HERE

## Store capabilities

If the store the items are retrieved from is [observable](), the widget will react to addition,
deletion, move and update of the store content to refresh its rendering accordingly.

If you do not specify the store to retrieve the items from, the widget uses a default
in memory store implementation that can be retrieved in the `store` attribute, as in
the following example:

```js
var list = register.createElement("d-list");
var defaultStore = list.store;
```

This default store can be populated programmatically using the `add` method
defined by the [dstore Store API](https://github.com/SitePen/dstore/blob/master/docs/Store.md), and it supports the `before` options to easily
order elements in the list, as in the following example:

```js
var list = register.createElement("d-list");
var defaultStore = list.store;
var item1 = {...};
var item2 = {...};
defaultStore.add(item1);
defaultStore.add(item2, {before: item1});
```

_Note that the default store does not support ordering and filtering, so you must use
another store implementation to do this ([Memory store](https://github.com/SitePen/dstore/blob/master/docs/Stores.md#memory), for example)._

When creating a list widget declaratively, it is possible to use JSON markup to add items to
the list store using the `d-list-store` tag, as in the following
example:

```html
<d-list>
	<d-list-store>
		{"label": "First item", "iconClass": "my-icon-class-a"},
		{"label": "Second item", "iconClass": "my-icon-class-b"},
		...,
		{"label": "Last item", "iconClass": "my-icon-class-z"}
	</d-list-store>
</d-list>
```

_Note that items are appended to the store in the order they are declared in the JSON markup._

The actual rendering of the items in the list is performed by an item renderer widget.
The default one is [deliteful/list/ItemRenderer](ItemRenderer.md), but another one can be specified
using the `itemRenderer` attribute of the list, as in the following example:

```js
define(["delite/register", "deliteful/list/ItemRenderer"],
	function (register, ItemRenderer) {
		var MyCustomRenderer = register("d-book-item", [HTMLElement, ItemRenderer], {
			render: function () {
				this.renderNode.innerHTML = "<div class='title' navindex='0'>" + this.item.title + "</div><div class='isbn' navindex='0'>ISBN: " + this.item.isbn + "</div>";
			}
		});
		var list = register.createElement("d-list");
		list.itemRenderer = myCustomRenderer;
});
```

TODO: INSERT SCREENSHOT(S) HERE

Because the List widget inherit from [delite/StoreMap](), you can redefine at will the mapping between
your store items and the ones expected by the renderer using mapping attributes and functions, as in the following example:

```js
require([
		"delite/register",
		"deliteful/list/List"
	], function (register, List) {
		var list = register.createElement("d-list");
		list.labelAttr = "title";
		list.righttextFunc = function (item, store, value) {
			return item.title.split(" ")[0];
		};
		list.store.add({title: "first item"});
		...
		document.body.appendChild(list);
		list.startup();
});
```

See the [delite/StoreMap]() documentation for more information about all the available mapping options.

If you were not to use the StoreMap capabilities but decided to redefine the `itemToRenderItem(item)` method (inherited from [delite/Store]()),
be aware that your custom implementation of the method MUST return items that have the same identity than the corresponding store items, as the List
is relying on it.

Here is an example of redefinition of the `itemToRenderItem(item)` method, using the default store with an `identityAttribute` value set to the default one, _"id"_:

```js
require([
		"delite/register",
		"deliteful/list/List"
	], function (register, List) {
		var list = register.createElement("d-list");
		list.itemToRenderItem = function () {
			// The list expect an identity for the item so is MUST be copied in the render item.
			return {id: item.id, righttext: item.label};
		}
});
```

Errors encountered when querying the store are reported by the widget through a `"query-error"` event.
It should be listened to in order to react to it in the application, as in the following example:

```js
var list = register.createElement("d-list");
list.on("query-error", function (error) {
	// Report the error to the user
	...
});
```

## Categorized items

The List widget supports categorized items, that are rendered with a category header that separates
each category of items in the list. To enable this feature, use the `categoryAttr` attribute to
define the name of the item attribute that holds the category of the item, as in the following
example:

```js
var list = register.createElement("d-list");
list.categoryAttribute = "category";
list.store.add({label: "first item", category: "Category A"});
list.store.add({label: "second item", category: "Category A"});
list.store.add({label: "third item", category: "Category B"});
```

TODO: INSERT SCREENSHOT(S) HERE

An alternative is to set `categoryFunc` to a function that extract the category from the store item,
as in the following example:

```js
var list = register.createElement("d-list");
list.categoryFunc = function(item, store) {
	return item.category;
});
list.store.add({label: "first item", category: "Category A"});
list.store.add({label: "second item", category: "Category A"});
list.store.add({label: "third item", category: "Category B"});
```

The actual rendering of the categories in the list is performed by a category renderer widget.
The default one is [deliteful/list/CategoryRenderer](CategoryRenderer.md), but another one can be specified
using the `categoryRenderer` attribute of the list, as in the following example:

```js
require([
	"delite/register",
	"deliteful/list/CategoryRenderer",
	"deliteful/list/List"
], function (register, CategoryRenderer) {
	var MyCustomRenderer = register("d-cust-category", [HTMLElement, CategoryRenderer], {
		render: function () {
			this.renderNode.innerHTML = "<div class='categoryName' navindex='0'>" + this.item.category + "</div><div class='categoryLink' navindex='0'><a href='http://en.wikipedia.org/wiki/Special:Search?search=" + this.item.category + "&go=Go'>Wikipedia</a></div>";
		}
	});
	var list = register.createElement("d-list");
	list.categoryAttr = "cat";
	list.categoryRenderer = MyCustomRenderer;
	list.store.add({label: "Apple", cat: "Fruit"});
	...
	list.store.add({label: "Brussel sprout", cat: "Vegetable"});
	...
	document.body.appendChild(list);
	list.startup();
});
```

TODO: INSERT SCREENSHOT(S) HERE

## Selection support

The list uses the [delite/Selection]() mixin to provides support for selectable items. By default, items
in the list are not selectable, but you can change this behaviour using the selectionMode attribute
of the widget:

```js
var list = register.createElement("d-list");
list.selectionMode = "multiple";
```

TODO: INSERT SCREENSHOT(S) HERE

When the selection mode is `"single"`, a click or tap on a item (or a press on the Space key
when an item has the focus) select it and de-select any previously selected item. When the selection
mode is `"multiple"`, a click or tap on an item (or a press on the Space key when an item has
the focus) toggle its selected state.

When the current selection changes, a `"selection-change"` event is emitted. Its `oldValue` attribute
contains the previous selection, and its `newValue` attribute contains the new selection.

When the `selectionMode` of a List is different than `"none"`, its `aria-selectable` (for selection mode `"single"`) or `aria-multiselectable` (for selection mode `"multiple"`) attribute is set to `"true"`.
When an item is selected in such a list, its `aria-selected` attribute is set to the value `"true"`.

By default, selectable List displays a selection mark before each list item. The CSS can be customized to display the selection mark after each list item, using the following rules:

```css
	[aria-selectable="true"] .d-list-item::before,[aria-multiselectable="true"] .d-list-item::before {
		display: none;
	}
	[aria-selectable="true"] .d-list-item::after,[aria-multiselectable="true"] .d-list-item::after {
		display: block;
	}
```

TODO: INSERT SCREENSHOT(S) HERE

## Keyboard navigation

The List widget implements a single column grid navigation pattern as defined in the [WAI-ARIA 1.0 Authoring Practices](http://www.w3.org/TR/2013/WD-wai-aria-practices-20130307/#grid),
except for the selection / deselection of item, that is performed using the Space key on a focused item (no support for Ctrl+Space,  Shift+Space, Control+A, Shift+Arrow and Shift+F8).

The list items can then be navigated using the UP and DOWN arrow keys, and the List will scroll
accordingly when you reach the top or the bottom of the scroll viewport. Pressing the DOWN arrow
while the last item has focus will focus the first item. Pressing the UP arrow while the first item
has the focus will focus the next item.

When a List item has the focus, you can press the ENTER or F2 keys to focus its first actionable node (if any), and then use the (Shift+)TAB key to move from one actionable node to the (previous)next.
Pressing the ESC key will end actionable nodes navigation and resume to the previous mode.

Note that Enter and F2 only activate the Actionable Mode when using a custom renderer that render DOM nodes with a ```navindex``` attribute,
as the default renderers do not render any actionable nodes (see [deliteful/list/ItemRenderer](ItemRenderer.md) and [deliteful/list/CategoryRenderer](CategoryRenderer.md) for more information).

Pressing the PAGE UP key will focus the first item of the list, while pressing the PAGE DOWN key will focus
the last one.

You can also search for items by typing their first letter on the keyboard, and the next item element which text
begins with the letters will get the focus.

## Styling

The List widget comes with two different styling that are applied by setting the `baseClass` attribute
to one of the following values:

- `"d-list"`: the list is displayed with an edge to edge layout. This is the default `baseClass`;

TODO: INSERT SCREENSHOT(S) HERE

- `"d-rounded-list"`: the list has rounded corners and both a left and right margin.

TODO: INSERT SCREENSHOT(S) HERE

