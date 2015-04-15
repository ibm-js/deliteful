---
layout: doc
title: deliteful/Toaster
---

# deliteful/Toaster 

`deliteful/Toaster` is a widget that allows an application to notify the user
in a non obtrusive way (it will not steal the focus), through a quick little
message.  A toaster is an unobtrusive mechanism for displaying messages. Like
toasts, messages "pop up" in the window corner, temporarily overlaying any
content there. The message stays up for a certain duration, or until the user
dismisses it explicitly (with a swipe gesture or by clicking on the dismiss
button).

Toasters are preferable to alert boxes. Alerts must always be modal, meaning
all action on the page stops until the user clicks OK or Cancel. Toasters are
non-modal, so the user can continue working and finish their thought before
responding.

Note that the `Toaster` widget depends on the `ToasterMessage` widget.


<a name="behavior"></a>
### The behavior in a nutshell

The `Toaster` widget serves as a host for `ToasterMessage` instances, each with 
its own type, duration, etc.

When created, each instance goes through a lifecycle of 4 states:

1. *inserted*: the instance is inserted in the DOM but still invisible,
2. *shown*: the instance is made visible, with a fade-in animation,
3. *hidden*: the instance is made invisible, either because it expired or it was dismissed,
4. *removed*: the instance is removed from the DOM;

You can hook up animations on each of theses 4 states. (see [animations](#animations)).
Note that a message that is dismissed or that has expired is not immediately removed from DOM. First, it's only hidden, and stay
hidden until all the other *expirable* (and only expirable) messages reach the hidden state as well (either by being manually dismissed by the user
 or by expiring).

This prevents the message that haven't expired from moving around as some of them disappear, but at the same time,
it avoids having awkward permanent holes in between persistent messages as it ends up stacking them together.

![The messages are only hidden, they remain in the DOM till the other expirable messages are hidden](https://cloud.githubusercontent.com/assets/2982512/3255861/52c0ad34-f210-11e3-84b8-57d74ef367f8.gif)
![The non expirable messages are not awaited by expirable messages](https://cloud.githubusercontent.com/assets/2982512/3255860/4fe41bd2-f210-11e3-931b-0d4961bf1ce5.gif)

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
var mytoaster;
require([
	"deliteful/Toaster",
	"requirejs-domready/domReady!"
	], function(Toaster){
		// posting a message
		mytoaster.postMessage("Form submitted");
	});
```

```html
<d-toaster id="mytoaster"><d-toaster>
```

### Programmatic Instantiation

```js
var mytoaster;
require([
		"deliteful/Toaster",
		"requirejs-domready/domReady!"
		], function(Toaster){
			mytoaster = new Toaster();
			mytoaster.placeAt("container");

			// posting a message
			mytoaster.postMessage("Form submitted");
		});
```

```html
<div id="container"></div>
```

The `Toaster.postMessage()` also supports messages as widgets

```js
var mytoaster;
require([
	"deliteful/ToasterMessage",
	"deliteful/Toaster",
	"requirejs-domready/domReady!"
	], function(ToasterMessage, Toaster){
		mytoaster = new Toaster();
		mytoaster.placeAt("container");

		// defining the message as a widget
		var myMessage = new ToasterMessage("Form submitted");

		// posting
		mytoaster.postMessage(myMessage);
	});
```

<iframe width="100%" height="300" allowfullscreen="allowfullscreen" frameborder="0" 
src="http://jsfiddle.net/ibmjs/8mRrs/embedded/result,js,html">
<a href="http://jsfiddle.net/ibmjs/8mRrs/">checkout the sample on JSFiddle</a></iframe>


<a name="configuration"></a>
## Element Configuration

<a name="placement"></a>
### Placement of the toaster

The Toaster widget has a `placement` property which will determine where the
messages will appear on the screen (top-left corner, etc.). It is a string representing a
regular CSS class that is applied to the widget on creation.  If you choose not
to set this property, it will default to `"d-toaster-placement-default"`.

Note that the widget comes with 7 placement options (i.e. 7 CSS classes that
work right out of the box). It goes without saying that you can set this property to 
your own placement class.

<table align="center">
<tbody>
    <tr>
    	<td>
		<h6> top-left </h6>
		<p>
			<code> d-toaster-placement-tl </code>
		</p>
		</td>
		<td>
		<h6> top-center </h6>
        <p>
    		<code> d-toaster-placement-tc </code>
		</p>
		</td>
		<td>
		<h6> top-right </h6>
        <p>
    		<code> d-toaster-placement-tr </code>
		</p>
		</td>
	</tr>
    <tr>
        <td colspan="3">
		<h6> default </h6>
		<p>
			<code> d-toaster-placement-default </code>
		</p>
		</td>
	</tr>
	<tr>
		<td>
		<h6> bottom-left </h6>
		<p>
			<code> d-toaster-placement-bl </code>
		</p>
		</td>
		<td>
		<h6> bottom-center </h6>
		<p>
			<code> d-toaster-placement-bc </code>
		</p>
		</td>
		<td>
		<h6> bottom-right </h6>
		<p>
			<code> d-toaster-placement-br </code>
		</p>
		</td>
	</tr>
</tbody>
</table>


### Message types

The `type` property of `ToasterMessage` can be set to either `"info"`, `"error"`,
`"warning"` or `"success"`. In case no type or an incorrect type is provided, `"info"` type
is used by default.

```js
var m = new ToasterMessage({message: "content of my message", type: "success"});
mytoaster.postMessage(m);

// the shortcut
mytoaster.postMessage("content of my message", {type: "success"});

```

Each type is associated with a CSS class named `d-toaster-type-{{type}}` which defines its styling.

### Duration of a message

By default a message lasts for 2000ms after it is "posted" in the toaster. The property `duration` can be set to any positive integer.

However, if set to `-1` the message will remain visible until the user
explicitly dismisses it (by clicking the dismiss button or swiping it out of the screen).

NB: if `duration` is set to `-1` and `dismissible` to `false`, you'll obtain a persistent message
which your user has no way to dismiss - probably not ideal from
a user experience perspective.

```js
// a message that fades after 6s
var m1 = new ToasterMessage({message: "This will auto-destruct in 6s", duration: 6000});
mytoaster.postMessage(m1);

// a message that waits for the user to dismiss it manually
var m2 = new ToasterMessage({message: "This will always stay there", duration: -1});
mytoaster.postMessage(m2);

// the shortcut
mytoaster.postMessage("This will auto-destruct in 6s", {duration: 6000});
mytoaster.postMessage("This will always stay there", {duration: -1});
```

### Making a message dismissible

If `dismissible` is set to `"on"`, the user can dismiss the message (either
with a swipe or the dismiss button). If set to `"off"`, the user can only wait for the
message to disappear on its own.


When `dismissible` is set to `"auto"`, the behavior depends on whether the message expires:

* a message that expires (`duration >= 0`) will not be dismissible,
* a message that does not expire (`duration === -1`) will be dismissible.

```js
mytoaster.postMessage("content of my message", {dismissible: "off"});
```

NB: if `dismissible` is set to `"off"` on a persistent message, your user will have no way to dismiss it
and it will stay on the screen forever which probably is not ideal from a user experience perspective.

### Checking if a message is dismissible

This methods returns a boolean that indicates whether a message is dismissible.
If returns `true` (resp. `false`) when `dismissible` is set to `"on"` (resp. `"off"`).

If controls the visibility of the dismiss button and enables/disables the swipe-to-dismiss.

When `dismissible` is set to `"auto"`, the output of the method also depends on the `duration` property:

* a message that is expirable (`duration >= 0`) will have no dismiss button or swipe-to-dismiss (`isDismissible() === false`)
* a message that does not expire (`duration === -1`) will have a dismiss button and swipe-to-dismiss (`isDismissible() === true`)

| `dismissible` | `duration` | `isDismissible()` |
|---------------|------------|-------------------|
| `on`   | `*`    | `true`  |
| `off`  | `*`    | `false` |
| `auto` | `>= 0` | `false` |
| `auto` | `-1`   | `true`  |


<a name="animations"></a>
### animations
For each of the 4 states of a `ToasterMessage` instance, an animation class is added

```js
mytoaster = new Toaster({
	animationInitialClass: "d-toaster-initial",     // added on insertion
	animationEnterClass: "d-toaster-fadein",        // added on show
	animationQuitClass: "d-toaster-fadeout",        // added on hide
	animationEndClass: "d-toaster-fadefinish"       // added on removal
});
```

A fade-in/fade-out set of animation classes comes by default but you can define and use your own.
You need to make sure that `animationEnterClass` and `animationQuitClass` classes emit either a
`transitionend`or `animationend` sort of event, as moving from one state to the other requires animations ending
 to be properly detected.


### Message templating
The ToasterMessage widget comes with a default template

```html
<template class="{{ messageTypeClass }}" data-touch-action="none">
	<button type="button" class="d-toaster-dismiss" attach-point="_dismissButton"></button>
	<span class="d-toaster-icon"></span>
	<span class="d-toaster-message-content">
		{{ message }}
	</span>
</template>
```

Currently, there is no way to set up your own template as the template file
path is hard coded in the widget. If you want to set up your own template, one
way to do it could be to create your own widget inheriting from `ToasterMessage`.

<a name="styling"></a>
## Element Styling

### Supported themes

This widget provides default styling for the following delite themes:

* bootstrap
* ios
* holodark

### CSS classes

- *Placement of the Toaster*  
all placement classes `d-toaster-placement-*` are documented in this [section](#placement).
```css
.d-toaster-placement-default .d-toaster-inner {
	left: 20%;
	bottom: 10%;
	width: 60%;
}
```

- *Message types*  
there is one class for each message type allowed.

```css
.d-toaster-type-error {
	background-color: #d9edf7;
	border-color: #bce8f1;
	color: #31708f;
}
.d-toaster-type-info    {...}
.d-toaster-type-warning {...}
.d-toaster-type-success {...}
```

- *The dismiss button*  
this class allows to set its position and any property a button can take.
Use the `content` property to change the character used to represent the button.
	
```css
.d-toaster-dismiss {...}

.d-toaster-dismiss::before {
	content: "×";
}
```


- *Entering/Leaving animations*  
Regarding the animations used by default when a message enters/leavers the screen. Though you can easily override 
theses classes, it is probably better to define your own and set your instance of Toaster to use them 
see [configuration section)(#animations).

```css
.d-toaster-initial { // sets the initial state
	opacity: 0;
	transition-property: opacity;
	transition-timing-function: linear;
}

.d-toaster-fadein {
	opacity: 1;
	transition-duration: 700ms
}

.d-toaster-fadeout {
	opacity: 0;
	transition-duration: 1000ms
}
```

Regarding the swipe-to-dismiss animation, it is controlled by:

```css
.d-toaster-swipeout {
	animation-name: d-toaster-swipeout; /* you can reference here your own @keyframes */
	animation-timing-function: linear;
	animation-duration: 700ms;
	animation-fill-mode: both;
	/* omitting their -webkit- prefixed equivalent */
}
```

<a name="interactions"></a>
## User interaction

### Dismissal of a message
A user can dismiss a message either by clicking on the dismiss button, or swiping the message off the screen.

You can control this through the `dismissible` property.

You can call `ToasterMessage.dismiss()` anytime to dismiss a message - regardless of the fact that
the `dismissible` property was set to `"on"` or `"off"`. The message will enter the hidden state and disappear from the screen.
This is the very same method called after a swipe is detected or the dismiss button is clicked.

You can also provide an animation class to accompany the dismissal, such as a slide-out animation.

```js
var m = new ToasterMessage({message: "content of my message", dismissible: "off"});
...
m.dismiss("slide-out");
```
<a name="events"></a>
## Element Events
|event name|dispatched|cancelable|bubbles|properties|
|----------|----------|----------|-------|----------|
|messageInserted|When a new message is inserted in the toaster|Yes|Yes|<ul><li>message: the instance of ToasterMessage that was inserted</li></ul>|
|messageExpired|When a message expires|Yes|Yes|<ul><li>message: the instance of ToasterMessage that expired</li></ul>|
|messageRemoved|When a message is removed|Yes|Yes|<ul><li>message: the instance of ToasterMessage that was removed</li></ul>|

<a name="enterprise"></a>
## Enterprise Use
### Accessibility
|type|status|comment|
|----|------|-------|
|Keyboard|none| The widget does not provide with any kind of interaction through the keyboard, besides |
|Visual Formatting|partial| The message type information, which is conveyed only through color, disappears in high contrast mode. A few options are to be considered to solve this: the developer could use icons or explicitly indicate the type in the content of the message. |
|Screen Reader|ok|Tested on JAWS 15 and iOS 6 VoiceOver.|

### Globalization
Nothing in particular here.


## Security

This widget has no specific security concern. Refer to [`delite/Widget`](/delite/docs/master/Widget.md) for general
security advice on this base class.

## Browser Support

This widget supports all supported browsers without any degraded behavior.
