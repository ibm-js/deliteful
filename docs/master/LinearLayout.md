---
layout: default
title: deliteful/LinearLayout
---

# deliteful/LinearLayout

`deliteful/LinearLayout` is a CSS layout container based on the [CSS3 Flexible Box Layout Module](http://www.w3.org/TR/css3-flexbox/) . The children of a `deliteful/LinearLayout` container can be laid out horizontally or vertically, and can fill unused space. Children of a `deliteful/LinearLayout` widget support the following sizing constraints:

| Constraint                            | Example              |
| ------------------------------------- | -------------------  |
| Natural Size (no size set explicitly) |                      |
| Fixed Size                            | style="width: 150px" |
| Percentage Size                       | style="width: 30%"   |
| Fill Available Space                  | class="fill"         |

These constraints can be mixed together in the same container.

Note: When using a vertical (respectively horizontal) LinearLayout, do NOT specify height:100% (respectively width:100%) on children that have the `fill` class.

![LinearLayout example](images/LinearLayout.png)

##### Table of Contents
[Element Instantiation](#instantiation)  
[Element Configuration](#configuration)  
[Element Styling](#styling)  
[Enterprise Use](#enterprise)  

<a name="instantiation"></a>
## Element Instantiation

See [`delite/Widget`](/delite/docs/Widget) for full details on how instantiation lifecycle is working.

### Declarative Instantiation

```js
require(["delite/register", "deliteful/LinearLayout", "dojo/domReady!"], function (register) {
  register.parse();
});
```

```html
<html>
  <d-linear-layout vertical="false" style="width:100%, height:50px">
    <div style="width: 20%">Left (20%)</div>
    <div class="fill">Center (Fill Space)</div>
    <div style="width: 50px">Right (50px)</div>
  </d-linear-layout>
</html>
```

### Programmatic Instantiation

```js
require(["deliteful/LinearLayout", "dojo/domReady!"], function (LinearLayout) {
  var layout = new LinearLayout({vertical: false, width:"100%"});
  var leftChild = document.createElement("div");
  var centerChild = document.createElement("div");
  var rightChild = document.createElement("div");
  leftChild.style.width = "20%";
  centerChild.class = "fill";
  rightChild.style.width = "50px";
  layout.addChild(leftChild);
  layout.addChild(centerChild);
  layout.addChild(rightChild);
  layout.placeAt(document.body);
  layout.startup();
});
```

<a name="configuration"></a>
## Element Configuration

### Properties

The layout direction is controlled by the `vertical` property which is `true` by default.

In addition to the `fill` CSS class, this element provides two utility CSS classes: `width100` and `height100` that respectively set width and height to 100%.

<a name="styling"></a>
## Element Styling

`deliteful/LinearLayout` has no visual appearance, it does not provide any CSS class for styling.

If `vertical` is `true`, the height of `deliteful\LinearLayout` must be explicitly set, otherwise the width must be explictly set.

To set the height of a `deliteful/LinearLayout` using a percentage expression, the height of all its ancestors (including `<body>`) must also be expressed as percentage.

### Styling Limitations

Using `padding-top` and `padding-bottom` on the `deliteful/LinearLayout` is discouraged since it's not well supported on Firefox.


<a name="enterprise"></a>
## Enterprise Use

### Accessibility

Rely on browser.

### Globalization

`deliteful/LinearLayout` does not provide any internationalizable bundle.

Right to left orientation is supported by setting the `dir` attribute to `rtl`on the `deliteful/LinearLayout` element:

```html
<d-linear-layout dir="rtl"></d-linear-layout>
```

### Security

This widget has no specific security concern. Refer to `delite/Widget` documentation for general security advice on this base class that `deliteful/LinearLayout` is using.

### Browser Support

This widget supports all supported browsers except Internet Explorer 9.
