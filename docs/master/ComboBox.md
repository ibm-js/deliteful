---
layout: default
title: deliteful/ComboBox
---

# deliteful/ComboBox

`deliteful/ComboBox` is a form-aware and store-aware widget leveraging the 
[`deliteful/list/List`](/deliteful/docs/master/list/List.html) widget for
displaying the list of options. 

Characteristics:
* It allows to benefit from the customization mechanism of the list item rendering.
* Provides single and multiple selection modes.
* Provides optional interactive filtering of list of options (single selection mode only).  
* The rendering of the popup is multi-channel responsive: the popup is displayed below/above
the main button.

*Example of deliteful/ComboBox (single choice mode, on desktop browser):*

![Example of ComboBox (single choice mode)](images/ComboBox-single.png)

*Example of deliteful/ComboBox (multiple choice mode, on mobile browser):*

![Example of ComboBox (multiple choice mode)](images/ComboBox-multiple.png)


##### Table of Contents
[Element Instantiation ](#instantiation)  
[Using ComboBox](#using)  
[Element Styling](#styling)  
[Enterprise Use](#enterprise)


<a name="instantiation"></a>
## Element Instantiation

For details on the instantiation lifecycle, see [`delite/Widget`](/delite/docs/master/Widget.html).

### Declarative Instantiation

```js
require(["delite/register", "deliteful/Store",
  "deliteful/ComboBox", "requirejs-domready/domReady!"],
  function (register) {
    register.parse();
  });
```

```html
<html>
  <d-combo-box>
    <d-list store="store"></d-list>
  </d-combo-box>
  <d-store id="store">
    { "label": "France", ... },
      ...
  </d-store>
</html>
```

<iframe width="100%" height="300" allowfullscreen="allowfullscreen" frameborder="0" 
src="http://jsfiddle.net/ibmjs/d1sj0fkp/embedded/result,js,html">
<a href="http://jsfiddle.net/ibmjs/d1sj0fkp/">checkout the sample on JSFiddle</a></iframe>


### Programmatic Instantiation


```js
require(["delite/register", "dstore/Memory", "dstore/Trackable",
         "deliteful/Combobox", "deliteful/list/List",
         "requirejs-domready/domReady!"],
  function (register, Memory, Trackable, ComboBox, List) {
    register.parse();
    // Create the store
    var dataStore = new (Memory.createSubclass(Trackable))({});
    // Add options
    dataStore.add(...);
    ...
    // Create the List
    var list = new List({store: dataStore, ...});
    // Create the ComboBox
    var combobox = new ComboBox({list: list, selectionMode: "multiple"});
    combobox.placeAt(document.body);      
    combobox.startup();
});
```

<iframe width="100%" height="300" allowfullscreen="allowfullscreen" frameborder="0" 
src="http://jsfiddle.net/ibmjs/s2fzabtb/embedded/result,js,html">
<a href="http://jsfiddle.net/ibmjs/s2fzabtb/">checkout the sample on JSFiddle</a></iframe>


Note that the `list` property is set by default to a newly created instance of
`deliteful/list/List`. Hence, applications can write:

```js
    var comboBox = new ComboBox();
    // Create the store
    comboBox.list.store = ...;
    ...
```

<a name="using"></a>
## Using ComboBox

### Selection Mode

The widget provides two selection modes through the `selectionMode` property: 
"single" (only one option can be selected at a time) and "multiple" (one or more
options can be selected).

### Auto Filtering

In single selection mode, if the property `autoFilter` is set to `true` (default is `false`)
the widget allows to type one or more characters which are used for filtering 
the list of shown list items. The filtering is case-insensitive. An item is shown
if the `label` property of the corresponding data item contains the entered string.
(More options will be added in a next release.)

### Attribute Mapping

The customization of the mapping of data store item attributes into render item attributes
can be done on the List instance using the mapping API of 
[`deliteful/list/List`](/deliteful/docs/master/list/List.html) inherited from its superclass
`delite/StoreMap`.

See the [`delite/StoreMap`](/delite/docs/master/StoreMap.html) documentation for
more information about the available mapping options.

<a name="styling"></a>
## Element Styling

### Supported themes

This widget provides default styling for the following delite theme:

* bootstrap

### CSS Classes

CSS classes are bound to the structure of the widget declared in its template `deliteful/ComboBox/ComboBox.html`.
The following table lists the CSS classes that can be used to style the ComboBox widget.

|Class name/selector|Applies to|
|----------|----------|
|d-combo-box|ComboBox widget node.
|d-combo-box-input|The inner native `<input>` node on desktop.
|d-combo-box-popup-input|The inner native `input` node inside the centered popup displayed on mobile.
|d-combo-box-list|The List widget displayed inside the popup.


<a name="enterprise"></a>
## Enterprise Use

### Accessibility

Keyboard and screen reader accessibility will be supported in the next release.

### Globalization

`deliteful/ComboBox` provides an internationalizable bundle that contains the following
messages:
		
|Key|Role|
|----------|----------|
|"multiple-choice"|Text written in the combo in multiple selection mode if more than one item is selected.
|"search-placeholder"|Set as placeholder attribute of the input element used for filtering the list of options.

Right to left orientation is supported by setting the `dir` attribute to `rtl` on the
widget. An issue with the arrow decoration of the combo in RTL will be fixed in the next release. 

### Security

This class has no specific security concern.

### Browser Support

This class supports all supported browsers.
