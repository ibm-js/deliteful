---
layout: default
title: deliteful/Button
---

# deliteful/Button

The `deliteful/Button` widget indicates that a task is ongoing. It displays a round spinning graphical
representation. For a task whose end is determined, you can provide a number from 0 to 100 to indicate the level of 
progression.

##### Table of Contents
[Element Instantiation](#instantiation)  
[Element Configuration](#configuration)  
[Element Styling](#styling)  
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

TO BE COMPLETED

<a name="styling"></a>
## Element Styling

TO BE COMPLETED

<a name="enterprise"></a>
## Enterprise Use


