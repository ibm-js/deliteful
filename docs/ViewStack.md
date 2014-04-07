---
layout: default
title: deliteful/ViewStack
---

# deliteful/ViewStack

`deliteful/ViewStack` is a container that has multiple children, but shows only one child at a time. Moving from one child to another is accomplished via a transition.

The transition types are described in the following picture:
 1. Slide (reverse=false)
 2. Reveal (reverse=false)
 3. Flip
 4. Fade

![ViewStack Transitions](images/ViewStack.png)

##### Table of Contents
[Element Instantiation](#instantiation)
[Element Configuration](#configuration)
[Element Styling](#styling)
[Enteprise Use](#enterprise)

<a name="instantiation"></a>
## Element Instantiation

See [`delite/Widget`](/delite/docs/Widget) for full details on how instantiation lifecycle is working.

### Declarative Instantiation

```js
require(["delite/register", "deliteful/ViewStack", "dojo/domReady!"], function (register) {
  register.parse();
});
```

```html
<html>
  <d-view-stack style="width:100%, height:200px">
    <div style="background-color: darkblue">Child 1 (Default visible child)</div>
    <div style="background-color: white">Child 2</div>
    <div style="background-color: crimson">Child 3</div>
  </d-view-stack>
</html>
```

### Programmatic Instantiation

```js
require(["deliteful/ViewStack", "dojo/domReady!"], function (ViewStack) {
  var vs = new ViewStack({width:"100%, height: 200px"});
  var child1 = document.createElement("div");
  var child2 = document.createElement("div");
  var child3 = document.createElement("div");
  vs.addChild(child1);
  vs.addChild(child2);
  vs.addChild(child3);
  vs.placeAt(document.body);
  vs.startup();
});
```


## Element Configuration

`deliteful/ViewStack` support `delite` display infrastructure by inheriting from `delite/DisplayContainer`. For more informations, see [`delite/DisplayContainer`](/delite/docs/DisplayContainer) documentation.

### Displaying a child

To display a child of the container, call the `show` method.
Example:
````js
  vs.show(child2, {transition: "reveal", reverse: true});

```

The `show` method takes as first argument a DOM node instance or id. The second argument is optional. Available properties are `transition` and\or `reverse`.

The `reverse` property applies only to Slide and Reveal transitions.

Set `transition` to `"none"` for disabling animated transition.

### Properties

If `show` method is called without a second argument, the transition is controlled by the `transition` and `reverse` properties.
Default values are `{transition: "slide", reverse: false}`.

## Element Styling

`deliteful/ViewStack` has no visual appearance, it does not provide any CSS class for styling.


### Styling Limitations

The `display` CSS attribute of this element must be set to `block` or `inline-block` (default).
The `position` CSS attribute of this element must be set to `absolute` or `relative` (default).

The following CSS layout attributes must **NOT** be changed. They are explicitly set by the container and are required for a correct behaviour of it.
 - ViewStack node:  `box-sizing`, `overflow-x`
 - ViewStack children:  `box-sizing`, `width`

<a name="enterprise"></a>
## Enterprise Use

### Accessibility

Rely on browser.

### Globalization

`deliteful/ViewStack` does not provide any internationalizable bundle.

Right to left orientation is supported by setting the `dir` attribute to `rtl`on the `deliteful/ViewStack` element. It affects Slide and Reveal transitions.

### Security

This widget has no specific security concern. Refer to `delite/Widget` documentation for general security advice on this base class that `deliteful/ViewStack` is using.

### Browser Support

This widget supports all supported browsers.
