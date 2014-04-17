---
layout: default
title: deliteful/SidePane
---

# deliteful/SidePane

`deliteful/SidePane` is a sliding pane displayed on the side of the screen. It can be displayed on top of the page (mode=overlay) or can push the content of the page (mode=push or mode=reveal). This widget is hidden by default. Its visibility is controlled by `open` and `close` methods.

*Push and Reveal mode (left), Overlay mode (right)*

![SidePane Example](images/SidePane.png)

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

```js
require(["delite/register", "deliteful/LinearLayout", "dojo/domReady!"], function (register) {
  register.parse();
});
```

```html
<html>
  <d-side-pane mode="overlay">
    Place content Here
  </d-side-pane>
  <div style="width: 100%; height: 100%">
    Main Page
  </div>
</html>
```

### Programmatic Instantiation

```js
require(["deliteful/SidePane", "dojo/domReady!"], function (SidePane) {
  var sp = new SidePane({mode: "overlay"});
  sp.placeAt(document.body);
  sp.startup();
});
```


## Element Configuration

This widget must be a sibling of html's body element.

The `position` attribute can be `start` or `end` which means left or right respectively in LTR mode. The resulting left or right position of the pane depends on the globalization configuration. See [Enteprise Use](#enterprise) for more informations.

If `mode` is set to `"push"` or `"reveal"`, the width of the SidePane can't be changed in the markup (15em by default). However it can be changed in `SidePane_template.less` file. See [LINK TO THEME GEN DOC].

For disabling sliding animated transition, set `animate` attribute to `false`.

<a name="styling"></a>
## Element Styling

`deliteful/SidePane` has no visual appearance, it does not provide any CSS class for styling.

The height of a `deliteful/LinearLayout` is set to `"100%"` by default. As a consequence, the height of all its ancestors (including `<body>`) must also be expressed as percentage.

### Styling Limitations

The following CSS layout attributes must **NOT** be changed. They are explicitly set by the container and are required for a correct behaviour of it: `position`, `height`, `width` (if `mode` is `"push"` or `"reveal"`).

<a name="interactions"></a>
## User Interactions

`deliteful/SidePane` can be closed using a swipe gesture. Set `swipeClosing` to `true`.

<a name="enterprise"></a>
## Enterprise Use

### Accessibility

Rely on browser.

### Globalization

`deliteful/LinearLayout` does not provide any internationalizable bundle.

Right to left orientation is supported by setting the `dir` attribute to `rtl`on the `deliteful/SidePane` element.


| Globalization Mode | `position` Value | Resulting position |
| ------------------ | ---------------- | ------------------ |
| LTR | `"start"` | Left |
| LTR | `"end"` | Right |
| RTL | `"start"` | Right |
| RTL | `"end"` | Left |


### Security

This widget has no specific security concern. Refer to `delite/Widget` documentation for general security advice on this base class that `deliteful/SidePane` is using.

### Browser Support

This widget supports all supported browsers.


