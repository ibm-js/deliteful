# dui/_WidgetBase

`dui/_WidgetBase` is a mixin used by all widgets.
It provides fine grained lifecycle methods, shorthand notation for declaring custom setters,
and code to read widget parameters specified as DOMNode attributes.

## Lifecycle

The startup lifecycle of a widget that extends `dui/_WidgetBase` is:

1. create element: If it doesn't already exist, custom tag (ex: `<dui-slider>`) is created.
2. upgrade element: Custom tag is upgraded to have all methods and properties of the widget.
3. mixin props: Parameters specified declaratively (ex: `<dui-slider max=10>`) or programatically
   (ex: `new MyWidget({title: "..."})`) are mixed into the widget, thus calling
   custom setters.
4. postMixInProperties() callback.
5. buildRendering() callback executed.   Note though that the root node already exists.
6. postCreate() callback.
7. startup() callback.

Note that if widget was created programatically, the app must manually call `startup()`
on the widget or its ancestor after inserting the widget into the document.

As mentioned above, there are currently five lifecycle methods which can be extended on the widget:

1. postMixInProperties()
2. buildRendering()
3. postCreate()
4. startup()
5. destroy()

Note that all of these methods except `buildRendering()` are automatically chained,
so you don't need to worry about setting up code to call the superclasses' methods w/the same names.


## Placement

DUI widgets are DOM Custom Elements.  That means they can be placed and manipulated just like other DOM elements.
Any DOM manipulation library should work well with instances of the widgets, but there is a helper function for
placing the widget in the DOM named `.placeAt()`.  This function takes one or two arguments.  The first argument is
node being referenced or the string ID of the node and the second argument is
where the widget should be positioned.

```js
// Place as last child of someNode
mywidget.placeAt('someNode');

// Place as third child of someNode
mywidget.placeAt('someNode', 3);

// Place before someNode
mywidget.placeAt('someNode', "before");
```

## Events

Assigning listeners to widget events is accomplished via the `.on()` function.  This function takes two arguments:

* `type` - The type of event being listened for.  (e.g. `'click'`)

* `listener` - The listener function to be called when the event is detected.

Listeners will be scoped so that `this` refers to the widget instance when called.
If you need to know specifically the target of the event, the listener should inspect the event object passed as an
argument to the listener.

TODO: event auto-attach not implemented [yet], this doc text from pidgin::::::

Events can be auto-attached during the insertion lifecycle.  There is a property of `.events`, which supplies a hash of
events to listen for and their listeners.  The each property key identifies the event type (and optionally the
selector).  The value of the property is the listener or the name of the listener in the class.  For example, if you
wanted to log click events to the console, you would do something like:

```js
{
	events: {
		'click': function (e) {
			console.log(e);
		}
	}
}
```

If your widget had a sub-element of a button, which you wanted to listen to on a method named `_onClick` you would want
to do something like:

```js
{
	events: {
		'button:click': '_onClick'
	},
	_onClick: function (e) {
		console.log(e);
	}
}
```

Synthetic events can be emitted on the widget or its sub-nodes via the `.emit()` function.  The function takes two
arguments:

* `type` - The type of the event being emitted. (e.g. `'click'`)

* `event` - The synthetic event object.

## Custom setters

Note that currently custom setters may be called before the DOM exists.
More precisely, they may be called when only the widget's root node exists.
Therefore, it's often useful to use the `runAfterRender()` helper:

```js
_setLabelAttr: function(val){
	this._set("label", val);	// to notify listeners
	this.runAfterRender(function(){
		this.label.textContent = val;	// update the DOM
	}
}
```

Also, note that `dui/_WidgetBase` also allows the shorthand syntax for declaring setters from Dijit V1 like:

```js
_setTabIndexAttr: "focusNode"
```

