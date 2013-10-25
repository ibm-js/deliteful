# dui/register

**register** is a utility module for creating widgets.  It allows for the registration of widgets as well as has some
class decorators for creating properties, and methods for chaining method calls

## Usage

You declare a new widget that is based off a DOM object that either is
`HTMLElement` or implements `HTMLElement`, and also includes `Widget` directly or indirectly.
To register the most basic of widgets, you would do the following:

```js
require(['dui/register', 'dui/Widget'], function (register, Widget) {
	var MyWidget = register('my-widget', [HTMLElement, Widget], {
		foo: 'bar'
	});

	var mywidget1 = new MyWidget();
});
```

You can also instantiate widgets using the custom tag in your HTML as well, for example, to instantiate the above
widget, you could have used the following:

```html
<my-widget></my-widget>
```

You can think of `register` as a combination of a class declaration system (internally it uses [dcl](http://dcljs.org),
and [document.register](http://www.w3.org/TR/custom-elements/) from the new custom elements proposed standards.

Note that the `register` module has a `createElement()` method, and new MyWidget() calls that method.


`.register()` takes three arguments:

* `tag` - Is a string that provides the custom element tag name which can be used to instantiate the widget.  The string
  should be unique and should contain at least one dash (`-`).  If there is already a widget
  registered with that tag name, `.register()` will throw an exception.

* `extensions...` - An array of constructor functions which are used
  to create the prototype of the widget class.  They are mixed in left to right.  The first
  class/constructor function must have `HTMLElement` in its prototype chain.  This serves as the
  foundation for the widget.   Widget should typically be directly or indirectly pulled in too.

* `props` - A set of properties for the widget

## Extensions

As mentioned above, the first extension must be a class/constructor function that has `HTMLElement` in its prototype
chain.  This will serve as the base element for the custom element that is part of your widget.  `HTMLElement` has an
interface that is roughly equivalent to the `<div>` tag and is the ancestor of all the HTML* DOM Elements.  If your
widget doesn't need any special features offered by other tags, `HTMLElement` is likely your best base for your widget.

If your widget through is designed to be an "extension" of another HTML element, like for example a `<button>`, then you
should consider utilising a different base for your widget.  This will ensure your widget will "behave" like that other
root HTML element.  For example, to create something that extends a `<button>`, you would do something like this:

```js
require(['dui/register', 'dui/Widget'], function (register, _Widget) {
	var MyButton = register('my-widget', [HTMLButtonElement, Widget], {
		foo: 'bar'
	});

	var mywidget1 = new MyButton();
});
```

TODO: document manual call to startup()

And if you then wanted to instantiate this widget in HTML, you would use the following in markup:

```html
<button is="my-button"></button>
```

You can also descend from other widgets, but not mixins like `dui/Widget` that don't have HTMLElement in their
prototype chain.  If you are descending from another widget, you should just use that as the base instead of one of the
`HTML*` elements.  For example, to create your own descendant of `dui/Button`:

```js
require(['dui/register', 'dui/Button'], function (register, Button) {
	var MyButtonSubClass = register('my-button-subclass', Button, {
		foo: 'bar'
	});

	var mybutton1 = new MyButtonSubClass();
});
```

And instantiating via HTML is:

```html
<button is="my-button-subclass"></button>
```

Because `dui/Button` has `HTMLButtonElement` as its base, it means that any descendants need to utilise that root
tag when instantiating via element creation.  This means you should know if the widget you are descending from builds
on top of a base other than `HTMLElement`.

## Lifecycle

First of all, note that no constructor methods are called when a widget is created.
Rather, createdCallback() and enterViewCallback() are called.
Generally though, you will extend `dui/Widget` which provides more specific lifecycle methods.

## Rendering a widget

Unlike Dijit V1, by the time `createdCallback()` is called (and in `dui/Widget` extensions: `buildRendering()`),
the widget's root node already exists.  Either it's the original root node from the markup
(ex: `<button is="d-button">`) or it was created via the internal `register.createElement()` call.

You cannot change the root node, although you can set attributes on it and setup event listeners.
In addition, you will often create subnodes underneath the root node.

Also note that the root node is `this`.   So putting those concepts together, a trivial `buildRendering()` method
in a `dui/Widget` subclass would be:

```js
buildRendering: function(){
	this.className = "duiButton";
}
```

## OOP

As mentioned earlier, `register()` is built on [dcl](http://dcljs.org), and it also exposes some methods
from dcl for calling subclass methods.   For example:

```js
open: register.after(function(){
	// first the superclass open() call will run, then this code
})
```

## Parsing

If you've declared widgets in markup, then you need to instantiate them by calling `register.parse()`.

Eventually browsers will support custom elements natively, and then this step will not be necessary.

## Standards

`register()` tries to conform to the proposed custom elements standard.   Internally, it will call `document.register()`
on platforms that support it.

## Implementation details

dui/register shims custom element support in a manner similar to Polymer.

If the browser supports `document.register()`, then dui/register just uses that.

Otherwise:

1. If the Element doesn't already exist it's created via document.createElement().
   This will create an Element with the right tag name (ex: `<d-star-rating>`) but
   without any of the behaviors associated with that widget.

2. It calls the `upgrade()` method that converts the plain Element
   into a "widget" by adding all the methods and properties of the widget.

On most platforms upgrading is done by "prototype swizzling",
i.e. swapping the Element's prototype with the widget's prototype:

```js
element.__proto__ = widget.prototype;
```

That's why the widget's prototype must extend `HTMLElement` or something
similar like `HTMLButtonElement`.

On IE, it's not possible to swizzle the prototype, so `upgrade()` calls
`Object.defineProperties()` to manually adjust every property that the widget
has added or overridden (compared to a plain Element):

```js
Object.defineProperties(element, widget.props)
```

Note that `widget.props`, along with some other metadata, is (pre)computed
when the widget is registered, so it's not possible to dynamically add properties
to the widget.




