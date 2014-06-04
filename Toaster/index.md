--- 
layout: default
title: deliteful/Toaster
---

# deliteful/Toaster 

`deliteful/Toaster` is a widget that allows an application to notify the user
in a non obstrusive way (it will not steal the focus), through a quick little
message.  A toaster is an unobtrusive mechanism for displaying messages. Like
toast, the message "pops up" in the window corner, temporarily overlaying any
content there. The message stays up for a certain duration, or until the user
dimisses it explicitely (with a swipe gesture or by clicking on the dismiss
button).

Toasters are preferable to alert() boxes. Alert() must always be modal, meaning
all action on the page stops until the user clicks OK or Cancel. Toasters are
non-modal, so the user can continue working and finish their thought before
responding.

Note that the `Toaster` widget depends on the `ToasterMessage` widget.

### The behaviour explained

The `Toaster` widget serves as a host for `ToasterMessage` instances, each with 
its own type, duration, etc.

When created, each instance goes through as lifecycle of 4 states:

1. inserted: the instance is inserted in the DOM but still invisible;
2. showed: the instance is made visible;
3. hidden: the instance is made invisible;
4. removed: the instance is removed from the DOM and destroyed;




##### Table of Contents
[Element Instantiation](#instantiation)  
[Element Instantiation](#instantiation)  
[Element Configuration](#configuration)  
[Element Styling](#styling)  
[User Interactions](#interactions)  
[Mixins](#mixins)  
[Element Events](#events)  
[Enteprise Use](#enterprise)  

<a name="instantiation"></a>
## Element Instantiation

See [`delite/Widget`](/delite/docs/Widget) for full details on how instantiation lifecycle is working.

### Declarative Instantiation

```js
var mytoaster;
require([
		"delite/register",
		"deliteful/Toaster",
		"dojo/domReady!"
		], function(register, Toaster){
			register.parse()

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
		"delite/register",
		"deliteful/Toaster",
		"dojo/domReady!"
		], function(register, Toaster){
			mytoaster = new Toaster();
			mytoaster.startup();
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
		"delite/register",
		"deliteful/ToasterMessage",
		"deliteful/Toaster",
		"dojo/domReady!"
		], function(register, ToasterMessage, Toaster){
			mytoaster = new Toaster();
			mytoaster.startup();
			mytoaster.placeAt("container");

			// defining the message as a widget
			var myMessage = new ToasterMessage("Form submitted");

			// posting
			mytoaster.postMessage(myMessage);
		});
```


<a name="configuration"></a>
## Element Configuration

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

### Placement

The Toaster widget has a placement property which will determine where the
messages will appear on the screen (top-left corner, etc.). It is a string representing a
regular CSS class that is applied to the widget on creation.  If you choose not
to set this property, it will default to `"d-toaster-placement-default"`.

Note that the widget comes with 7 placement options (i.e. 7 CSS classes that
work right out of the box). It goes without saying that you can set this property to 
your own placement class.

<table>
<tbody align="center">
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

The `type` property of `ToasterMessage`, which is either `info`, `error`,
`warning` or `success`. In case no type or an incorrect type is provided, `info` type
is used by default.

```js
mytoaster.postMessage("content of my message", {type: "info"});
```

### duration

By default a message lasts for 2000ms after it is "posted" in the toaster
-- through `Toaster.postMessage`. The property `duration` can be set to any positive integer. 

However, if set to `-1` the message will remain visible until the user
explicitly dismisses it (by clicking the dismiss button or swiping it out).

NB: if `duration` is set to `-1` and `dismissible` to `false`, the message will
persist and the user has no way to dismiss it, which probably is not ideal from
a user experience perspective.

```js
mytoaster.postMessage("content of my message", {duration: 6000});
mytoaster.postMessage("content of my message", {duration: -1});
```


### isDismissible

This method controls the visibility of the dismiss button. Its output is a boolean which depends on both `dismissible` and `duration`.

By default (when `dismissible` is not set) 

- a message that is expirable (`duration >= 0`) has no dismiss button (`isDismissible() === false`)
- a message that does not expire (`duration === -1`) has a dismiss button (`isDismissible() === true`) 

The visibility of the dimiss button can always be forced with the `dismissible` property.

| dismissible| duration			| isDismissible() |
|------------|------------------|-----------------|
| `undefined`| `undefined`		| `true`		  |
| `undefined`| `>= 0`			| `false`	 	  |
| `undefined`| `-1`				| `true`	 	  |
| `false`	 | `*`				| `false`	 	  |
| `true`	 | `*`				| `false`	 	  |


### dismissible

If `dismissible` is set to `true`, the user can to dismiss the message (either
with a swipe or the dismiss button). If set to `false`, the user can only wait for the
message to disppear on its own.

```js
mytoaster.postMessage("content of my message", {dismissible: false});
```

Note that this property does not directly control the visibility of the dismiss button. 
The latter is controlled by `isDismissible()` which also implements a default behaviour in case 
`dismissible` is not set.

NB: if `duration` is set to `-1` and `dismissible` to `false`, the message will
persist and the user has no way to dismiss it, which probably is not ideal from
a user experience perspective.

### dismiss
This method triggers the message dimissal and destruction.
This method can always be called to dismiss a message -- )egardless of the fact that
`dismissible` property of the message was set to `true` or `false`.

If the message template contains a button of class `.d-toaster-dismiss`
By default it is 

```html
<button class="d-toaster-dismiss">x</button>
```

### Message template
The ToasterMessage widget comes with a default template 

```html
<div id="{{ messageId }}" class="{{ messageTypeClass }}" data-touch-action="none">
	<div class="d-toaster-icon-col">
		<span class="d-toaster-icon"></span>
	</div>
	<div class="d-toaster-message-col">
		<span class="d-toaster-message-content" >		
			{{ message }} 
		</span>
	</div>
	<div class="d-toaster-dismiss-col">
		<button class="d-toaster-dismiss">x</button>
	</div>
</div>
```

Currently, there is no way to set up your own template as the template file
path is hard coded in the widget. If you want to set up your own template, one
way could be to create your own widget, inheriting from `ToasterMessage`.


