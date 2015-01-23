---
layout: doc
title: deliteful/StarRating
---

#deliteful/StarRating

The `StarRating` widget displays a rating, usually with stars, that can be edited by touching or clicking the stars.

![StarRating Example](images/StarRating.png)

The `StarRating` widget is a form field, which means that when included in an HTML form, its value will be submitted with those of the other form fields, under the name defined by its `name`attribute.

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

See [`delite/Widget`](/delite/docs/master/Widget.md) for full details on how instantiation lifecycle is working.

### Declarative Instantiation

```html
<!-- Editable StarRating with: -->
<!-- * a minimum value of 0 -->
<!-- * a maximum value of 7 -->
<!-- * an initial value of 3.5 -->
<!-- * values set by increments of .5 -->
<d-star-rating name="rating" max="7" value="3.5" editHalfValues="true"></d-star-rating>
 ```
### Programmatic Instantiation

```js
require(["deliteful/StarRating", "requirejs-domready/domReady!"], function (StarRating) {
  var starRating = new StarRating({max: 7, value: 3.5, editHalfValues: true});
  starRating.placeAt(document.body);
});
```

<a name="configuration"></a>
## Element Configuration

### Using StarRating in a Form

The `StarRating` widget is a form field, which means that when included in an HTML form, its value will be submitted with those of the other form fields, under the name defined by its `name`attribute.

Here is an example of a `StarRating` widget included in a form, under the name _rating_:

```html
<form action="...">
	<span id="lb1">Rating:</span><d-star-rating id="input1" name="rating" value="4" aria-labelledby="lb1"></d-star-rating>
	<input type="submit">
</form>
```

Note that is the `StarRating` is disabled, its value will not be submited.

### Properties

The following properties can be set on a `StarRating` instance:

- `max`: the maximum rating, that is also the number of stars to show.
- `value`: the current value of the Rating.
- `readOnly`: if false, the widget is editable and allows editing the value of the Rating by touching / clicking the stars
- `name`: mandatory if using the star rating widget in a form, in order to have its value submited
- `disabled`: if true, the widget is disabled (its value will not be submited if it is included in a form)
- `editHalfValues`: if the Rating is not read only, define if the user is allowed to set half values (0.5, 1.5, ...)
- `allowZero`: if false, the user is not allowed to set the value to 0 (default is true)

<a name="styling"></a>
## Element Styling

### Supported themes

This widget provides default styling for the following delite themes:

* bootstrap
* ios
* holodark

### CSS Classes

The star characters displayed for an empty star and a full star are font characters.
Half stars are created by displaying the first half of a full star character followed by the second half of an empty star character.

The stars displayed can be fully customized by using the following CSS selectors:

```css
.d-star-rating-star-icon {
	font-size: 150%;
}

.d-star-rating-empty::before {
	content: "\2605"; /* The font character to use to display an empty star */
	color: #CCC; /* The color of an empty star */
}

.d-star-rating-full::before {
	content: "\2605"; /* The font character to use to display a full star */
	color: yellow; /* The color of a full star */
}
```

It is also possible to use an image stripes to render the stars, using a few more CSS selectors, as demonstrated in the following sample:

<iframe width="100%" height="300" allowfullscreen="allowfullscreen" frameborder="0" 
src="http://jsfiddle.net/ibmjs/3eu6v/embedded/result,html,js,css">
<a href="http://jsfiddle.net/ibmjs/3eu6v/">checkout the sample on JSFiddle</a></iframe>

<a name="interactions"></a>
## User Interactions

If the `StarRating` widget properties `readOnly` and / or `disabled` are not set to `true`, the value of the widget can be edited by:

* Touching the stars on a touch screen device;
* Clicking the stars when using a mouse. When the stars are hovered by the mouse pointer, the widget highlight the value that will be set if the user click the mouse at the current position, as in the following picture:

    ![StarRating Hovered](images/StarRatingHovered.png)
* Using the `arrow up`, `arrow down`, `arrow left` and `arrow right` keys when the widget has the keyboard focus.

<a name="mixins"></a>
## Mixins

No mixin currently available for this widget.

<a name="events"></a>
## Element Events

This widget emits a `change` event when its value is updated following a user action on the widget node. No `change` event is emitted if the value is updated programmatically. 

<a name="enterprise"></a>
## Enterprise Use

### Accessibility

The `StarRating` widget has an ARIA role of `slider`.

It is keyboard navigable: unless it is read only, its value can be edited using the arrow keys (see [User Interactions](#interactions)).

#### Limitation when using Apple VoiceOver

When a `deliteful/StarRating` widget is selected in Safari while VoiceOver is on:

* The rating value is announced as a percentage instead as a number of stars ;
*  VoiceOver announce that the widget value can be adjusted by swiping up or down, but this is not the case. To edit the widget value,
you must double tap the widget and keep pressing. When VoiceOver announce that the widget is _editable_, you can adjust the value by
moving left and right. 

### Globalization

`deliteful/StarRating` provide an internationalizable bundle that contains only one message, with the key `aria-valuetext`.
This message supports the keyword `${value}`, that is replaced by the current value of the widget to set its `aria-valuetext`
property every time that the value is updated.

Right to left orientation is supported.

### Security

This widget has no specific security concern. Refer to [`delite/FormValueWidget`](/delite/docs/master/FormValueWidget.md) documentation for general security advice on this base class.

### Browser Support

This widget supports all supported browsers without any degraded behavior.
