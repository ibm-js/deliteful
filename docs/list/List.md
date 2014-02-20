# deliteful/list/List


The List widget renders a scrollable list of items that are retrieved from a [Store]().

Its custom element tag is `d-list`.

TODO: INSERT SCREENSHOT(S) HERE
##### Table of content

- [Scroll capabilities](#scroll)
- [Store capabilities](#store)
- [Categorized items](#categories)
- [Selection support](#selection)
- [Keyboard navigation](#keynav)
- [Styling](#style)

<a name="scroll"/>
## Scroll capabilities

If you do not want the list to be scrollable, you can set its `scrollDirection` attribute
to `"none"` in order to remove the default scrolling capability.

TODO: INSERT SCREENSHOT(S) HERE

<a name="store"/>
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

This default store can be populated programmatically using the `add` and `put` methods
defined by the [store API](), and it supports the `before` options in both methods to easily
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
another store implementation to do this ([Memory store](), for example)._

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

TODO: REWRITE THE FOLLOWING DOCUMENTATION TO BETTER EXPLAIN THE AVAILABLE OPTIONS, AND THE FACT THAT YOU MUST EITHER DEFINE THE MAPPING BETWEEN STORE ITEMS AND ITEMS EXPECTED BY THE RENDERER OR USE THE copyAllItemProps ATTRIBUTE.

```

If you are using a custom type of items but want to render them using the default renderer,
you can redefine the `itemToRenderItem(item)` method (inherited from [delite/Store]()) so that it creates
items for the default renderer, as in the following example:

```js
require([
		"delite/register",
		"deliteful/list/List"
	], function (register, List) {
		var list = register.createElement("d-list");
		list.itemToRenderItem = function (item) {
			var itemForDefaultRenderer = {};
			itemForDefaultRenderer.label = item.title;
			...
			return itemForDefaultRenderer;
		};
});
//```

Because the List widget inherit from [delite/StoreMap](), you can also define the mapping between
your store items and the ones expected by the renderer as in the following example:

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
//```

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

<a name="categories"/>
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

<a name="selection"/>
## Selection support

The list uses the [delite/Selection]() mixin to provides support for selectable items. By default, items
in the list are not selectable, but you can change this behaviour using the selectionMode attribute
of the widget:

```js
var list = register.createElement("d-list");
list.selectionMode = "multiple";
```

TODO: INSERT SCREENSHOT(S) HERE

When the selection mode is `"single"`, a click or tap on a item (or a press on the ENTER or SPACE key
when an item has the focus) select it and de-select any previously selected item. When the selection
mode is `"multiple"`, a click or tap on an item (or a press on the ENTER or SPACE key when an item has
the focus) toggle its selected state.

When the current selection changes, a `"selection-change"` event is emitted. Its `oldValue` attribute
contains the previous selection, and its `newValue` attribute contains the new selection.

When the selectionMode of a List is different than `"none"`, the `d-selectable` CSS class is applied to it. When an item is selected in such a list, the `d-selected` CSS class is applied to the item node.

<a name="keynav"/>
## Keyboard navigation

The List widget uses [delite/KeyNav]() to provide keyboard navigation. When the widget get focus via
keyboard navigation, the first item displayed at the top of the scroll viewport is focused.

The list items can then be navigated using the UP and DOWN arrow keys, and the List will scroll
accordingly when you reach the top or the bottom of the scroll viewport. Pressing the DOWN arrow
while the last item has focus will focus the first item. Pressing the UP arrow while the first item
has the focus will focus the next item.

When a List item has the focus, you can also use the LEFT and RIGHT keys to navigate
within it. Pressing the UP or ARROW key again will set the focus to the previous or next item.

Pressing the HOME key will focus the first item of the list, while pressing the END key will focus
the last one.

You can also search for items by typing letters on the keyboard, and the next item element which text
begins with the letters will get the focus.

<a name="style"/>
## Styling

The List widget comes with two different styling that are applied by setting the `baseClass` attribute
to one of the following values:

- `"d-list"`: the list is displayed with an edge to edge layout. This is the default `baseClass`;

TODO: INSERT SCREENSHOT(S) HERE

- `"d-rounded-list"`: the list has rounded corners and both a left and right margin.

TODO: INSERT SCREENSHOT(S) HERE

