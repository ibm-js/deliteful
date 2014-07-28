---
layout: default
title: deliteful/Button
---

# deliteful/Button

The `deliteful/Button` widget is a push button that can display a label and / or an icon. It extends the HTML 5 `button` element. 

![Button Example](images/Button.png)

##### Table of Contents
[Element Instantiation](#instantiation)  
[Element Configuration](#configuration)  
[Element Styling](#styling)  
[User Interactions](#interactions)  
[Mixins](#mixins)  
[Element Events](#events)  
[Enterprise Use](#enterprise)  

<a name="instantiation"></a>
## Element Instantiation

See [`delite/Widget`](/delite/docs/Widget) for full details on how instantiation lifecycle is working.

### Declarative Instantiation

```html
<html>
  <button is="d-button">I am a Button!</button>
</html>
```

### Programmatic Instantiation

```js
  require([
    "delite/register",
    "deliteful/Button"
  ], function (register, button) {
     var b = new Button({label: "I am a Button"});
     b.placeAt(document.body);
     b.startup();
});
```

<a name="configuration"></a>
## Element Configuration

The following properties can be set on the widget to configure it:

* `label`: the label to display in the button;
* `iconClass`: DOM class to apply to a DOM node before the label in order to render an icon;
* `showLabel`: set it to true so that the button only displays an icon (especially usefull for buttons in toolbars).

The `disabled` attribute is also supported, in order to disable the button. A disabled button appears as disabled and does not emit any event when clicked.

<a name="styling"></a>
## Element Styling

### Supported themes

This widget provides default styling for the following delite themes:

* bootstrap
* ios
* holodark

### CSS Classes

The base class for a button is `d-button`.

The appearance of a button can be customized by adding extra classes to it:

* `d-button-blue` can be added to render a blue button;
* `d-button-red` can be added to render a red button.

Custom classes can also be added, as in the following example:

<iframe width="100%" height="300" src="http://jsfiddle.net/ibmjs/NHft7/embedded/result,html,js,css" allowfullscreen="allowfullscreen" frameborder="0"></iframe>
<a href="http://jsfiddle.net/ibmjs/NHft7">checkout the sample on JSFiddle</a></iframe>

<a name="interactions"></a>
## User Interactions

The only user interaction with a button is to activate it by:
* clicking it using a mouse;
* tapping it on a touch screen;
* pressing the SPACE key when the button has keyboard focus.

<a name="mixins"></a>
## Mixins

No mixin currently available for this widget.

<a name="events"></a>
## Element Events

This widget does not emit any custom event.

<a name="enterprise"></a>
## Enterprise Use

### Accessibility

The widget has the same accessibility than a standard HTML 5 `<button>` element.

### Globalization

This widget does not provide any internationalizable bundle. The only string displayed by the button is the one defined by its `label` property.

This widget supports both left to right and right to left orientation.

### Security

This widget has no specific security concern. Refer to `delite/FormValueWidget` documentation for general security advice on this base class.

### Browser Support

This widget supports all supported browsers without any degrated behavior.


