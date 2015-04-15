---
layout: doc
title: deliteful/ResponsiveColumns
---

# deliteful/ResponsiveColumns

A container that lays out its children according to the screen width. This widget relies on CSS media queries (http://www.w3.org/TR/css3-mediaqueries). You can define any number of screen classes by setting the breakpoints attribute. Then you must set the layout attribute on each child to configure a width for each screen class.
The following example defines two screen classes: "phone" and "other" with a breakpoint at 500px. If the "phone" class is active, the first child width is 100% and the second child is hidden. If the screen is larger than 500px then the first child width is 20% and the second one fill the remaining space.
```html
<d-responsive-columns breakpoints="{phone: '500px', other: ''}">
    <div layout="{phone: '100%', other: '20%'}">...</div>
    <div layout="{phone: 'hidden', other: 'fill'}">...</div>
</d-responsive-columns>
```
When the screen width changes (browser window resize or actual device orientation change) and if a new screen class is applied by the container, a "change" event is emitted with 2 specific properties: `screenClass` (the new screen class) and `mediaQueryList` (the MediaQueryList instance at the origin of the change).

<iframe width="100%" height="300" allowfullscreen="allowfullscreen" frameborder="0" 
src="http://jsfiddle.net/ibmjs/t3tbt7qt/embedded/result,html,css,js">
<a href="http://jsfiddle.net/ibmjs/t3tbt7qt/">checkout the sample on JSFiddle</a></iframe>

##### Table of Contents
[Element Instantiation](#instantiation)  
[Element Configuration](#configuration)  
[Events](#events)  
[Element Styling](#styling)  
[Enterprise Use](#enterprise)  

<a name="instantiation"></a>
## Element Instantiation

See [`delite/Widget`](/delite/docs/master/Widget.md) for full details on how instantiation lifecycle is working.

### Declarative Instantiation

```js
require(["deliteful/ResponsiveColumns", "requirejs-domready/domReady!"],
	function () {
	}
);
```

```html
<html>
	<d-responsive-columns breakpoints="{phone: '500px', other: ''}">
		<div layout="{phone: '100%', other: '20%'}">...</div>
		<div layout="{phone: 'hidden', other: 'fill'}">...</div>
	</d-responsive-columns>
</html>
```

### Programmatic Instantiation

```js
require([
	"deliteful/ResponsiveColumns",
	"requirejs-domready/domReady!"
], function(ResponsiveColumns){
	rc = new ResponsiveColumns();
	rc.breakpoints = "{'small': '500px', 'medium': '900px', 'large': ''}";
	var child = document.createElement("div");
	child.setAttribute("layout", "{'small': '100%', 'medium': '200px', 'large': '10%'}");
	child.innerHTML = "Child 1";
	rc.addChild(child);
	child = document.createElement("div");
	child.setAttribute("layout", "{'small': 'hidden', 'medium': 'fill', 'large': '30%'}");
	child.innerHTML = "Child 2";
	rc.addChild(child);
	child = document.createElement("div");
	child.innerHTML = "Child 3";
	child.setAttribute("layout", "{'small': 'hidden', 'medium': 'hidden', 'large': '60%'}");
	rc.addChild(child);
	rc.placeAt(document.body);
});
```

<a name="configuration"></a>
## Element Configuration

`deliteful/ResponsiveColumns` support `delite` display infrastructure by inheriting from `delite/DisplayContainer`. 
For more informations, see the [`delite/DisplayContainer`](/delite/docs/master/DisplayContainer.md) documentation.

### Defining screen classes and children layout

Screen classes represent the different types of layout to be managed by the container. You can define any number of screen classes by setting the `breakpoints` attribute. 

Children of the container must define their width for each screen class by setting their `layout` attribute.
For example if `breakpoints` is `'{small: "480px", medium: "1024px", large: ""}'`, this means that the class "small" is applied if the width is smaller than 480px, then the "medium" will be applied between 480px and 1024px. The class "large" is applied for larger screens. Defining the last class bound as an empty string is interpreted as +Infinity.
Each child must have a `layout` property that defines values for "small", "medium" and "large" keys. Here is the full example:
```
<d-responsive-columns id="rc" class="fill"
					  breakpoints="{'small': '500px', 'medium': '900px', 'large': ''}">
	<div layout="{'small': '100%', 'medium': '200px', 'large': '10%'}">A</div>
	<div layout="{'small': 'hidden', 'medium': 'fill', 'large': '30%'}">B</div>
	<div layout="{'small': 'hidden', 'medium': 'hidden', 'large': '60%'}">C</div>
</d-responsive-columns>
```

Both `breakpoints` and `layout` properties are strings parsed internally by the standard `JSON.parse()`. To facilitate writing markup you can use single quotes when defining these properties, single quotes will be replaced by double quotes before interpreted by `JSON.parse`.

Note that the widget computes the default value of its `breakpoints` property using the 
values of the breakpoins provided by the `deliteful/channelBreakpoints` module. 
See the [`deliteful/channelBreakpoints`](./channelBreakpoints.md) documentation
for information about how to statically customize these default breakpoint values.

<a name="events"></a>
## Events

The `delite/ResponsiveColumns` class provides the following event:

|event name|dispatched|cancelable|bubbles|properties|
|----------|----------|----------|-------|----------|
|change|the current screen class has changed|True|True|<ul><li>`screenClass`: the new screen class</li><li>`mediaQueryList`: the MediaQueryList that triggered the change</li></ul>|
 

<a name="styling"></a>
## Element Styling

The default height of a `deliteful/ResponsiveColumns` is ``100%``. As a consequence, you must ensure that the height of every parent is defined (this includes \<body> and \<html>). You can read this [external article](http://webdesign.about.com/od/csstutorials/f/set-css-height-100-percent.htm) for more information. 
You can set height of `<body>` and `<html>` to 100% by including [`defaultapp.css`](/delite/docs/master/defaultapp.md) 

<a name="enterprise"></a>
## Enterprise Use

### Accessibility

Relies on browser.

### Globalization

`deliteful/ResponsiveColumns` does not provide any internationalizable bundle.

### Security

This widget has no specific security concern. Refer to [`delite/Widget`](/delite/docs/master/Widget.md) for general security advice on this base class that `deliteful/ResponsiveColumns` is using.

### Browser Support

This widget supports all supported browsers except Internet Explorer 9.
