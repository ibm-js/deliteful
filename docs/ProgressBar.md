---
layout: default
title: deliteful/ProgressBar
---

# deliteful/ProgressBar

The `deliteful/ProgressBar` widget displays the completion progress of a task. The progress is either indeterminate,
indicating that progress is being made but that it is not clear how much more work remains to be done before the task
is complete, or the progress is a number in the range zero to a maximum, giving the fraction of work that has so far
been completed.

*Overview of the Progress Bar by theme (bootstrap, iOS, Holodark)*

![ProgressBar Bootstrap](images/ProgressBar1.png)
![ProgressBar iOS](images/ProgressBar2.png)
![ProgressBAr Holodark](images/ProgressBar3.png)

When the progress bar is determinate, a default message displays the percentage of progression. This message can be 
customized. ProgressBar theme style typically defines a looping animation to highlight its indeterminate state. 

##### Table of Contents
[Element Instantiation](#instantiation)  
[Element Configuration](#configuration)  
[Element Styling](#styling)
[Element Events](#events)
[Enteprise Use](#enterprise)
[See also](#seealso)

<a name="instantiation"></a>
## Element Instantiation

See [`delite/Widget`](/delite/docs/Widget) for full details on how instantiation lifecycle is working.

### Declarative Instantiation

```html
<html>
  <d-progress-bar message="Please wait..."></d-progress-bar>
</html>
```

```html
<html>
  <d-progress-bar value=0 max=100></d-progress-bar>
</html>
```

### Programmatic Instantiation

```js
  require([
    "delite/register",
    "deliteful/ProgressBar"
  ], function (register, ProgressBar) {
     register.parse();

     var pb = new ProgressBar({max:100, value: 0});
     pb.placeAt(document.body);
     pb.startup();
     pb.value = 20;
});
```

<a name="configuration"></a>
## Element Configuration
There are two properties that determine the current task completion represented by the element:
 
- the `value` property specifies how much of the task has been completed, 
- the `max` property specifies how much work the task requires in total.

The units are arbitrary and not specified. When `Value` isn't `NaN`, it always varies from 0 to `max`. 

### Determinate vs indeterminate
By default, `deliteful/ProgressBar` is indeterminate in a sense it doesn't indicate the level of completion of the
ongoing task.

- Set a value comprised between 0 and the `max` property to make the progress bar determinate. A value greater than 
`max` is converted to the `max` value. An invalid or negative value is converted to 0.

- Set `value = NaN` to make the progress bar indeterminate.

<iframe width="100%" height="300" allowfullscreen="allowfullscreen" frameborder="0" 
src="http://jsfiddle.net/ibmjs/58rt6/embedded/result,js,html">
<a href="http://jsfiddle.net/ibmjs/58rt6/">checkout the sample on JSFiddle</a></iframe>

### Default message
The default behavior of ProgressBar is to  displays the percentage of completion when the state is determinate, 
and to display no message when state is indeterminate.

The property `fractionDigits` allows to specify the number of fraction digits to display.

TODO: add JSFIDDLE (FractionDigit)

### Static custom message
Set the `message` property with a non-empty string to use a custom message.

TODO: add JSFIDDLE (set message)

### Dynamic custom message
You can override the method `formatMessage()` to generate a dynamic custom message.

TODO: add JSFIDDLE (override formatMessage)

### Additional message
Depending on the theme, an additional message may be displayed. For themes that display both messages, typically 
message is on one side and the additional message is on the other side. 

TODO: add image to illustrate additional message.

You can override the method `formatExtMsg()` to customize this additional message. It will be visible only on
supported themes.

TODO: add JSFIDDLE (force theme to ios and note NOT to use FF)


<a name="styling"></a>
## Element Styling

### Supported themes

This widget provides default styling for the following delite themes:

* bootstrap
* ios
* holodark

### CSS Classes
Style is defined by the CSS classes from the themes of the widget. CSS classes are bound to the
structure of the widget declared in its template `deliteful/ProgressBar/ProgressBar.html`

|class name|applies to|
|----------|----------|
|d-progress-bar|ProgressBar widget node|
|d-progress-bar-background|background node|
|d-progress-bar-msg|message node|
|d-progress-bar-msg-invert|inverted message node|
|d-progress-bar-indicator|indicator node|
|d-progress-bar-a11y|dedicated node used to show the indicator in contrast mode on supported browsers|

### Customizing the colors
ProgressBar provides a set of CSS classes with predefined colors:

![ProgressBar Bootstrap](images/ProgressBar4.png)
![ProgressBar iOS](images/ProgressBar5.png)
![ProgressBar Holodark](images/ProgressBar6.png)

<iframe width="100%" height="100" allowfullscreen="allowfullscreen" frameborder="0" 
src="http://jsfiddle.net/ibmjs/WALnB/embedded/result,html">
<a href="http://jsfiddle.net/ibmjs/WALnB/">checkout the sample on JSFiddle</a></iframe>

### Customizing the size
Default widget size is 100% of its container. You may use the `width` standard CSS properties to specify the width. 

```css
.d-progress-bar {
  width: 200px;
}
```

Due to the nature of ProgressBar, and to ensure it will adapt nicely whatever the theme, it is recommended to rely 
on `font-size` CSS property to act on the progress bar height.

TODO: add JSFIDDLE (font-size)

*Example of ProgressIndicator which fills its container*

```html
<d-progress-indicator style="width: 100%; height: 100%"></d-progress-indicator>
```
<iframe width="100%" height="150" allowfullscreen="allowfullscreen" frameborder="0" 
src="http://jsfiddle.net/ibmjs/qhSdW/embedded/result,html">
<a href="http://jsfiddle.net/ibmjs/qhSdW/WALnB/">checkout the sample on JSFiddle</a></iframe>

Note the the text size automatically stretch/expand itself, so you do not have to set/change the font size.

<a name="events"></a>
## Element Events
The widget `deliteful/ProgressBar` provides a `change` event when its value changes.

|event name|dispatched|cancelable|bubbles|properties|
|----------|----------|----------|-------|----------|
|change|on value change|No |Yes|<ul><li>`percent`: the percentage of progression.</li><li>`value`: the actual value.</li><li>`max`: the number which express the task as completed</li></ul>|

<a name="enterprise"></a>
## Enterprise Use
### Accessibility
|type|status|comment|
|----|------|-------|
|Keyboard|N/A|No user interaction|
|Visual Formatting|ok|Support high contrast on Firefox and Internet Explorer desktop browsers.|
|Screen Reader|yes|Supports ARIA role progressbar. Tested with JAWS and VoiceOver|

### Browser Support
This widget supports all supported browsers without any degraded behavior.

<a name="seealso"></a>
## See also
### Samples
- deliteful/samples/ProgressBar-basic.html
- deliteful/samples/ProgressBar-handler.html
- deliteful/samples/ProgressBar-messages.html
