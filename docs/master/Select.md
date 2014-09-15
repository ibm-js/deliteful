---
layout: default
title: deliteful/Select
---

# deliteful/Select

`deliteful/Select` is a form-aware and store-aware widget leveraging the native 
[HTML5 select element](http://www.w3.org/TR/html5/forms.html#the-select-element).

*Example of deliteful/Select (single choice mode):*

![Example of Select (single choice mode)](images/Select-single.png)

*Example of deliteful/Select (multiple choice mode):*

![Example of Select (multiple choice mode)](images/Select-multiple.png)


##### Table of Contents
[Element Instantiation ](#instantiation)  
[Using Select](#using)  
[Element Styling](#styling)  
[Enterprise Use](#enterprise)


<a name="instantiation"></a>
## Element Instantiation

For details on the instantiation lifecycle, see [`delite/Widget`](/delite/docs/master/Widget.html).

### Declarative Instantiation

Using the default store:

```js
require(["delite/register", "deliteful/Select", "requirejs-domready/domReady!"],
  function (register) {
    register.parse();
    select1.store.addSync({text: "Option 1", value: "1"});
    ...
});
```

```html
<html>
  <d-select id="select1"></d-select>
</html>
```

<iframe width="100%" height="300" allowfullscreen="allowfullscreen" frameborder="0" 
src="http://jsfiddle.net/ibmjs/nB8BK/1/embedded/result,js,html">
<a href="http://jsfiddle.net/ibmjs/nB8BK/1/">checkout the sample on JSFiddle</a></iframe>


Using user's own store:

```js
require(["delite/register", "dstore/Memory", "dstore/Trackable",
         "deliteful/Select", "requirejs-domready/domReady!"],
  function (register, Memory, Trackable) {
    register.parse();
    var store = new (Memory.createSubclass(Trackable))({});
    select1.store = store;
    store.addSync({text: "Option 1", value: "1"});
    ...
});
```

```html
<html>
  <d-select selectionMode="multiple" id="select1"></d-select>
</html>
```

<iframe width="100%" height="300" allowfullscreen="allowfullscreen" frameborder="0" 
src="http://jsfiddle.net/ibmjs/nqM5G/embedded/result,js,html">
<a href="http://jsfiddle.net/ibmjs/nqM5G/">checkout the sample on JSFiddle</a></iframe>


### Programmatic Instantiation

Using the default store:

```js
require(["delite/register", "deliteful/Select", "requirejs-domready/domReady!"],
  function (register) {
    register.parse();
    var select = new Select({selectionMode: "multiple"}); 
    select.placeAt(document.body);
    select.startup(); // must be called before using select.store
    
    // add options to the Select widget
    select.store.addSync({text: "Option 1", value: "1"});
});
```

<iframe width="100%" height="300" allowfullscreen="allowfullscreen" frameborder="0" 
src="http://jsfiddle.net/ibmjs/8Ccfm/embedded/result,js,html">
<a href="http://jsfiddle.net/ibmjs/8Ccfm/">checkout the sample on JSFiddle</a></iframe>


Using user's own store:

```js
require(["delite/register", "dstore/Memory", "dstore/Trackable",
         "deliteful/Select", "requirejs-domready/domReady!"],
  function (register, Memory, Trackable) {
    register.parse();
    var select = new Select({selectionMode: "multiple"});
    // Create the store
    var store = new (Memory.createSubclass(Trackable))({});
    select.store = store;
    // add options to the Select widget
    store.addSync({text: "Option 1", value: "1"});
    ...
    select.placeAt(document.body);
    select.startup();
});
```

<iframe width="100%" height="300" allowfullscreen="allowfullscreen" frameborder="0" 
src="http://jsfiddle.net/ibmjs/59LP6/embedded/result,js,html">
<a href="http://jsfiddle.net/ibmjs/59LP6/">checkout the sample on JSFiddle</a></iframe>


<a name="using"></a>
## Using Select

### Selection Mode

The widget provides several selection modes through the `selectionMode` property
inherited from `delite/Selection`.
For details, see [`Using delite/Selection`](/delite/docs/master/Selection.html#using).

Note that `deliteful/Select` only supports for this property the values `single` and
`multiple`.

### Attribute Mapping

Because `deliteful/Select` inherits from [`delite/StoreMap`](/delite/docs/master/StoreMap.html), 
the mapping between the attributes of the store items and the attributes used by `deliteful/Select`
can be redefined. 
See the [`delite/StoreMap`](/delite/docs/master/StoreMap.html) documentation for more information 
about all the available mapping options.


<a name="enterprise"></a>
## Enterprise Use

### Accessibility

Keyboard accessibility is supported. All supported desktop browsers provide keyboard accessibility
for elements using the native 
[HTML5 select element](http://www.w3.org/TR/html5/forms.html#the-select-element).

Screen reader accessibility relies on screen reader's ability to work with HTML elements using the 
native [HTML5 select element](http://www.w3.org/TR/html5/forms.html#the-select-element).

### Globalization

`deliteful/Select` does not provide any internationalizable bundle. The only strings displayed 
by the widget are coming from the user data through the store from which the options are retrieved.

Right to left orientation is supported by setting the `dir` attribute to `rtl` on the
widget.

### Security

This class has no specific security concern.

### Browser Support

This class supports all supported browsers.
