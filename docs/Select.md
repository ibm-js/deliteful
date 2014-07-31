---
layout: default
title: deliteful/Select
---

# deliteful/Select

`deliteful/Select` is a form-aware and store-aware widget leveraging the native 
[HTML5 select element](http://www.w3.org/TR/html5/forms.html#the-select-element).


##### Table of Contents
[Element Instantiation ](#instantiation)  
[Using Select](#using)  
[Element Styling](#styling)  
[User Interactions](#interactions)  
[Events](#events)  
[Extending Select](#extending)  
[Enterprise Use](#enterprise)


<a name="instantiation"></a>
## Element Instantiation

For details on the instantiation lifecycle, see [`delite/Widget`](/delite/docs/master/Widget.md).

### Declarative Instantiation

Using the default store:

```js
require(["delite/register", "deliteful/Select", "requirejs-domready/domReady!"],
  function (register) {
    register.parse();
    select1.store.add({text: "Option 1", value: "1"});
    ...
});
```

```html
<html>
  <d-select id="select1"></d-select>
</html>
```

Using user's own store:

```js
require(["delite/register", "dstore/Memory", "dstore/Observable",
         "deliteful/Select", "requirejs-domready/domReady!"],
  function (register, Memory, Observable) {
    register.parse();
    var store = new (Memory.createSubclass(Observable))({});
    select1.store = store;
    store.add({text: "Option 1", value: "1"});
    ...
});
```

```html
<html>
  <d-select selectionMode="multiple" id="select1"></d-select>
</html>
```


### Programmatic Instantiation

Using the default store:

```js
require(["delite/register", "deliteful/Select", "requirejs-domready/domReady!"],
  function (register) {
    register.parse();
    var select = new Select({selectionMode: "multiple"});
    // add options to the Select widget
    select.store.add({text: "Option 1", value: "1"});
    
    select.placeAt(document.body);
    select.startup();
});
```
Using user's own store:

```js
require(["delite/register", "dstore/Memory", "dstore/Observable",
         "deliteful/Select", "requirejs-domready/domReady!"],
  function (register, Memory, Observable) {
    register.parse();
    var select = new Select({selectionMode: "multiple"});
    // Create the store
    var store = new (Memory.createSubclass(Observable))({});
    select.store = store;
    // add options to the Select widget
    store.add({text: "Option 1", value: "1"});
    ...
    select.placeAt(document.body);
    select.startup();
});
```

<a name="using"></a>
## Using Select

### Selection mode

The widget provides several selection modes through the `selectionMode` property
inherited from `delite/Selection`.
For details, see [`Using delite/Selection`](/delite/docs/master/Selection.md#using).

Note that `deliteful/Select` only supports for this property the values `single` and
`multiple`.

### Attribute mapping

Because `deliteful/Select` inherits from [`delite/StoreMap`](/delite/docs/master/StoreMap.md), 
the mapping between the attributes of the store items and the attributes used by `deliteful/Select`
can be redefined. 
See the [`delite/StoreMap`](/delite/docs/master/StoreMap.md) documentation for more information 
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

Right to left orientation is supported by setting the `dir` attribute to `rtl`on the
widget.

### Security

This class has no specific security concern.

### Browser Support

This class supports all supported browsers.
