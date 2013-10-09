# dui/_WidgetBase

dui/_WidgetBase is a mixin used by all widgets.
It provides fine grained lifecycle methods, shorthand notation for declaring custom setters,
and code to read widget parameters specified as DOMNode attributes.

## Lifecycle methods

1. postMixInProperties()
2. buildRendering()
3. postCreate()
4. startup()
5. destroy()

Note that postMixInProperties(), postCreate(), startup(), and destroy() are automatically chained,
so you don't need to worry about setting up code to call the superclasses' methods w/the same names.
Automatic chaining: TODO

## Custom setters

`dui/_WidgetBase` also allows the shorthand syntax for declaring setters from Dijit V1 like:

	_setTabIndexAttr: "focusNode"
