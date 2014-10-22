---
layout: default
title: deliteful/CheckBox
---

# deliteful/CheckBox

The `deliteful/CheckBox` widget represents a form-aware 2-state widget similar to the HTML5 input type="checkbox" element.
It provides all the standard facilities of a native input and supports deliteful theming capability.

*Example*

![CheckBox (Bootstrap)](images/CheckBox1.png)

##### Table of Contents
[Element Instantiation](#instantiation)  
[Element Configuration](#configuration)  
[Element Styling](#styling)  
[Element Events](#events)  
[Enterprise Use](#enterprise)  
[See also](#seealso)

<a name="instantiation"></a>
## Element Instantiation

See [`delite/Widget`](/delite/docs/master/Widget.md) for full details on how instantiation lifecycle is working.

### Declarative Instantiation

```html
<html>
  <d-checkbox checked="true"></d-checkbox>
  <d-checkbox disabled="true" name="option1"></d-checkbox>
</html>
```

### Programmatic Instantiation

```js
  require([
    "delite/register",
    "deliteful/CheckBox"
  ], function (register, CheckBox) {
     register.parse();

     var cb = new CheckBox({checked:true});
     cb.placeAt(document.body);
     cb.startup();
     cb = new CheckBox({disabled:true, name: "option1"});
     cb.placeAt(document.body);
     cb.startup();
});
```

<a name="configuration"></a>
## Element Configuration

The state of a CheckBox widget (checked or unchecked) is defined by the `checked` property, inherited from the 
`deliteful/Toggle` class.

In addition, the CheckBox widget supports the following form-related properties of an HTML5 input element of 
type "checkbox": `name`, `value`, `disabled` and `alt`, inherited from `delite/FormWidget`.

<a name="styling"></a>
## Element Styling

### Supported themes

This widget provides default styling for the following delite themes:

* bootstrap
* ios
* holodark

### CSS Classes

CSS classes are bound to the structure of the widget declared in its template `deliteful/CheckBox/CheckBox.html`.
The following table lists all the CSS classes that can be used to style the checkbox. 

|class name/selector|applies to|
|----------|----------|
|d-checkbox|CheckBox widget node
|d-checkbox::before|Checkmark node

In addition, the following classes are used in combination with the classes above:

|class name/selector|applies to|
|----------|----------|
|d-checked|CheckBox and checkmark nodes in checked state
|d-focused|CheckBox widget node in focus state
|d-disabled|CheckBox and checkmark nodes in disabled state
|d-rtl|CheckBox and checkmark nodes in right-to-left configuration

<a name="events"></a>
## Element Events
The widget `deliteful/CheckBox` provides a `change` event when its state is changed following a user interaction.

|event name|dispatched|cancelable|bubbles|properties|
|----------|----------|----------|-------|----------|
|change|on state change|No |Yes|standard HTML5 Event propeties|

<a name="enterprise"></a>
## Enterprise Use
### Accessibility
|type|status|comment|
|----|------|-------|
|Keyboard|N/A|No user interaction|
|Visual Formatting|ok|Support high contrast on Firefox and Internet Explorer desktop browsers.|
|Screen Reader|yes|Tested with JAWS and VoiceOver|

### Browser Support
This widget supports all supported browsers without any degraded behavior.

<a name="seealso"></a>
## See also
### Samples
- deliteful/samples/Buttons.html
