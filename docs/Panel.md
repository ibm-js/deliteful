---
layout: doc
title: deliteful/Panel
---

# deliteful/Panel

`deliteful/Panel` is a container widget used inside of an [`deliteful/Accordion`](/deliteful/docs/master/Accordion.md).


##### Table of Contents
[Element Instantiation](#instantiation)  
[Element Configuration](#configuration)  
[Element Styling](#styling)  
[User Interactions](#interactions)  
[Element Events](#events)  
[Enterprise Use](#enterprise)  

<a name="instantiation"></a>
## Element Instantiation

See [`delite/Widget`](/delite/docs/master/Widget.md) for full details on how instantiation lifecycle works.

### Declarative Instantiation

```js
require(["deliteful/Panel", "requirejs-domready/domReady!"], function () {
});
```

```html
<html>
	<d-panel id="panel">
		<div>Content - Panel</div>
	</d-panel>
</html>
```

### Programmatic Instantiation

```js
require([
	"deliteful/Panel", "requirejs-domready/domReady!"
], function(Panel) {
	var panel = new Panel({label: "panel"});
	var content = document.createElement("div");
	panel.addChild(content);
    panel.placeAt(document.body);
});
```

<a name="configuration"></a>
## Element Configuration
The following properties can be set on the widget to configure it, assuming that it's used inside of
a [`deliteful/Accordion`](/deliteful/docs/master/Accordion.md):

* `label`: the label to display in the panel header
* `openIconClass`: CSS class for the icon to display in the panel header when the panel is open
* `closedIconClass`: CSS class for the icon to display in the panel header when the panel is closed


<a name="styling"></a>
## Element Styling

### Widget CSS Classes

The following CSS classes are automatically set by the widget and can be reused for overriding the default style.

CSS Class          | Description
-----------------  | -------------
`d-panel`          | The panel container

### Styling CSS classes

The following CSS classes provided by the widget can be set explicitly on the element itself:

CSS Class          | Description
-------------------| -------------
`d-panel-success`  | Indicates a successful or positive information
`d-panel-info`     | Indicates a neutral informative change or information
`d-panel-warning`  | Indicates a warning that might need attention
`d-panel-danger`   | Indicates a dangerous or potentially negative information

<a name="interactions"></a>
## User Interactions
`deliteful/Panel` does not provide any predefined interactions.

<a name="enterprise"></a>
## Enterprise Use

### Accessibility

N/A

### Globalization

`deliteful/Panel` does not provide any internationalizable bundle.

### Security

This widget has no specific security concern.
Refer to [`delite/Widget`](/delite/docs/master/Widget.md) for general security advice on this base class.

### Browser Support

This widget supports all supported browsers.