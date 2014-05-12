---
layout: default
title: deliteful/StarRating
---

#deliteful/StarRating

The StarRating widget displays a rating, usually with stars, that can be edited by touching or clicking the stars.

Its custom element tag is `d-star-rating`.

TODO: INSERT SCREENSHOT(S) HERE

## Using StarRating in a Form

The StarRating widget is a Form field, which means that when included in an HTML form, its value will be submitted with those of the other form fields, under the name defined by its `name`attribute.

Here is an example of a StarRating widget included in a form, under the name _rating_:

```html
<form action="...">
	<label for="input1">Rating:</label><d-star-rating id="input1" name="rating" value="4"></d-star-rating>
	<input type="submit">
</form>
```

Note that is the StarRating is disabled, its value will not be submited.

## Attributes

StarRating defines the following attributes:

- `max`: the maximum rating, that is also the number of stars to show.
- `value`: the current value of the Rating.
- `readOnly`: if false, the widget is editable and allows editing the value of the Rating by touching / clicking the stars
- `name`: mandatory if using the star rating widget in a form, in order to have it value submited
- `disabled`: if true, the widget is disabled (its value will not be submited if it is included in a form)
- `editHalfValues`: if the Rating is not read only, define if the user is allowed to set half values (0.5, 1.5, ...)
- `allowZero`: true to allow setting a value of zero, false otherwise

## Customization

This widget shows the rating using an image sprite that contains full stars, half stars and empty stars.

TODO: INSERT AN IMAGE HERE

The star displayed can be fully customized by redefining the following css classes in your application:

```css
 .d-star-rating-star-icon:before {
 	content: url(@url_to_the_stars_sprite);
 }
 
.d-star-rating-disabled .d-star-rating-star-icon:before {
	content: url(@url_to_the_disabled_stars_sprite);
}
```

If the custom stars size is not 40px X 40px, you also have to redefine the following CSS classes:

```css
.d-star-rating-star-icon {
	height: @iconSize;
	width: @iconSize;
}

.d-star-rating-zero {
	height: @iconSize;
	width: @iconSize/2;
}

.d-star-rating-empty-star:before {
	margin-left: -@iconSize;
}

.d-star-rating-half-star:before {
	margin-left: -2*@iconSize;
}

```

To support Right To Left direction (BIDI) with a custom star size, you also need to define the following CSS:

```css
.d-star-rating.d-rtl .d-star-rating-full-star:before {
	margin-left: 0px;
	margin-right: -3*@iconSize;
}

.d-star-rating.d-rtl .d-star-rating-empty-star:before {
	margin-left: 0px;
	margin-right: -2*@iconSize;
}

.d-star-rating.d-rtl .d-star-rating-half-star:before {
	margin-left: 0px;
}
```

Last, to support Right To Left direction in Internet Explorer 9, the following extra rules are necessary:

```css
.dj_ie9 .d-star-rating.d-rtl .d-star-rating-full-star:before{
	margin-left: 0px;
	margin-right: 0px;
}

.dj_ie9 .d-star-rating.d-rtl .d-star-rating-empty-star:before{
	margin-left: 0px;
	margin-right: -@iconSize;
}

.dj_ie9 .d-star-rating.d-rtl .d-star-rating-half-star:before {
	margin-left: 0px;
	margin-right: -2*iconSize);
}
```

## Accessibility

The StarRating widget has an ARIA role of slider.

It is keyboard navigable: unless it is read only, its value can be edited using the arrow keys.

