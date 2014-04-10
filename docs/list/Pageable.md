# deliteful/list/Pageable

The Pageable mixin adds paging capabilities to the [deliteful/list/List](./List.md) widget.

A pageable list does not load and display its content all at once, but only loads and displays a subset of the content while providing user controls to load and display more data.

TODO: INSERT SCREENSHOT(S) HERE

A pageable list is defined and created using the following piece of code:

```js
		require([
		    "delite/register",
			"deliteful/list/List",
			"deliteful/list/Pageable",
			"dojo/domReady!"
		], function (register, List, Pageable) {
			var PageableList = register("d-pageable-list", [List, Pageable], {});
			var pageableList = new PageableList();
			...
			pageableList.startup();
		});
```

This can also be done using a mix of javascript code and markup, as in the following example:

```html
<head>
	...
	<script>
		require([
		    "delite/register",
			"deliteful/list/List",
			"deliteful/list/Pageable",
			"dojo/domReady!"
		], function (register, List, Pageable) {
			register("d-pageable-list", [List, Pageable], {});
			register.parse();
		});
	</script>
</head>
<body>
	<d-pageable-list store="...">
	</d-pageable-list>
</body>
```

##### Table of content

- [Defining the length of pages](#defining-the-length-of-pages)
- [Defining the maximum number of pages to display at once](#defining-the-maximum-number-of-pages-to-display-at-once)
- [User controls to load and display more data](#user-controls-to-load-and-display-more-data)
- [Hiding the list while it is busy loading and displaying a page of items](#hiding-the-list-while-it-is-busy-loading-and-displaying-a-page-of-items)

## Defining the length of pages

When started, a pageable list will load and display only one page of data, and will provide user controls to load and display more pages of data (if there is more data).

The `pageLength` property of a pageable list defines the number of items in a page of data. Note that this number is a maximum, and that a page can contains less items.

If this property is set to 0 or less, the list will load and display all the items from the store (as a non pageable list does).

Here is an example of setting a pageLength of 100 items:

```js
		require([
		    "delite/register",
			"deliteful/list/List",
			"deliteful/list/Pageable",
			"dojo/domReady!"
		], function (register, List, Pageable) {
			var PageableList = register("d-pageable-list", [List, Pageable], {});
			var pageableList = new PageableList();
			pageableList.pageLength = 100;
			...
			this.ownerDocument.body.appendChild(pageableList);
			pageableList.startup();
		});
```

Here is the same example using a mix of javascript code and markup:

```html
<head>
	...
	<script>
		require([
		    "delite/register",
			"deliteful/list/List",
			"deliteful/list/Pageable",
			"dojo/domReady!"
		], function (register, List, Pageable) {
			register("d-pageable-list", [List, Pageable], {});
			register.parse();
		});
	</script>
</head>
<body>
	<d-pageable-list store="..." pageLength="100">
	</d-pageable-list>
</body>
```
In this example, the list will load (up to) the first 100 items from the store, display them, and provide user controls to load another page of (up to) 100 items if there are more items in the store.

## Defining the maximum number of pages to display at once

The property `maxPages` defines the maximum number of pages to display at the same time, allowing to keep the size of the DOM under control when using very large lists of items.

When a pageable list loads and displays a new page of data, it makes sure not to display more pages than the maximum number of pages allowed by unloading some other pages.

Here is an example that illustrates the unloading mechanism, using a pageable list on a store of 1000 items, with a page length of 50 and a maximum number of 2 pages displayed at the same time:

1. Initially, the list loads and displays the 50 first items of the store (index 0 to 49), and creates a user control to load the following page;
1. When the user control is activated, the following 50 items (index 50 to 99) are loaded from the store and appended to the list (the list now displays the 100 first items from the store);
1. When the user control is activated once again:
    1. the following 50 items (index 100 to 149) are loaded from the store and appended to the list;
    1. the first page of items (index 0 to 49) is removed from the DOM, and a user control is created to load the previous page.

If the `maxPages` property is set to 0 or less, there is no maximum number of pages (pages are never unloaded).

## User controls to load and display more data

The list provides up to two user controls to load and display more data:

1. A user control to load the next page of data from the store. It is only present if there is more data to load from the store.
1. A user control to load the previous page of data from the store. It is only present if there is previous data to load from the store.

The user controls can be activated using one of the following interactions, as described in the next sections:

1. Activation with a mouse click / the keyboard SPACE key
1. Activation by scrolling

### Activation with a mouse click / the keyboard SPACE key

The user controls for loading pages are clickable (or activable using the SPACE key when navigating the list using the keyboard).

If there is a next page of data in the store, the user control is displayed at the end of the list:

TODO: INSERT SCREENSHOT HERE

The message that is displayed by the control can be customized using the `loadNextMessage` of a pageable List (see the API documentation for more information).

When the user control is activated, its appearance changes while the list is busy retrieving data from the store and displaying it:

TODO: INSERT SCREENSHOT HERE

The message that is displayed when the list is busy can also be customized, using the `loadingMessage` property of a pageable list.

When the new page of items is displayed, the first new item gains the focus and the user control is either deleted (if there is no more data in the store) or moved to the end of the list:

TODO: INSERT SCREENSHOT HERE

The user control to load the previous page of data follows the same pattern, except that it is displayed at the top of the list rather than at the end of the list,
and that the property `loadPreviousMessage` defines what it displays:

TODO: INSERT SCREENSHOT HERE

### Activation by scrolling

The user controls, when they exist, can be automatically activated when the user scrolls to the top of the bottom of the list.

To activate this behavior, the `autoPaging` property must be set to `true` on the pageable list.

## Hiding the list while it is busy loading and displaying a page of items

The pageable list provides the options to hides its content when loading a page of data. This is activated by setting the `hideOnPageLoad` property to `true`.
