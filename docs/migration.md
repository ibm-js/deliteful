# Migrating from dijit and dojox/mobile to dui

## Notes for applications

1. In markup, widgets look like `<d-star-rating foo=bar>` rather than
	`<div data-dojo-type=dui/StarRating data-dojo-props="foo: bar">`.
	For widgets that enhance an existing tag, syntax is `<button is="d-button">`.
2. Use `register.parse()` rather than `dojo/parser.parse()`.  There's no `parseOnLoad:true` or auto-loading
	or `data-dojo-mixins`.
3. Since each widget defines and loads its own CSS, you don't need to manually include dijit.css or claro.css;
   also, the theme is determined automatically so you don't need to add `class="claro"` to the `<body>` node.

## Notes for widget authors

### dcl()

dojo.declare() is replaced by [dcl()](http://www.dcljs.org/).   Its usage is similar except for super calls.
Rather than using `this.inherited()`, you use dcl.superCall().   So instead of:

```js
_inZeroSettingArea: function(/*Number*/ x, /*Number*/ domNodeWidth){
	if(this.isLeftToRight()){
		return this.inherited(arguments);
	}else{
		return x > (domNodeWidth - this.zeroAreaWidth);
	}
}
```

You would do:

```js
_inZeroSettingArea: dcl.superCall(function(sup){
	return function(/*Number*/ x, /*Number*/ domNodeWidth){
		if(this.isLeftToRight()){
			return sup.call(this, x, domNodeWidth);
		}else{
			return x > (domNodeWidth - this.zeroAreaWidth);
		}
	};
})
```

Often though it's simpler than this.   Many widget methods are automatically chained.  So a V1 `postCreate()`
method like:

```js
postCreate: function(){
    this.inherited(arguments);
    ... do stuff ...
}
```

can (and should) be replaced by:

```js
postCreate: function(){
    ... do stuff ...
}
```

Note also that dcl does have an [this.inherited() type feature](http://www.dcljs.org/docs/inherited_js/).
However, it's not recommended because:

1. `this.inherited()` will run slower than `dcl.superCall()` because it resolves
   at runtime rather than declare time
2. it's easier to step through super calls in the debugger when using `dcl.superCall()`.

### register()

Widgets are declared via `register()` rather than `dojo.declare()`, and must extend HTMLElement or a subclass;
   see the documentation for [register()](register.md) for details

### this

`this` points to the widget's root node.
`this.srcNodeRef` and `this.domNode` both replaced by `this`; for example `this.className = "myButton"`

### lifecycle methods

1. `create()` renamed to `createdCallback()`
2. `constructor()` and `postscript()` no longer run; move custom code from constructor
	to `preCreate()`.
3. The `buildRendering()` method must not try to create the root DOMNode.  It already exists.
   It should just set attributes on the root node, and create sub nodes and/or text inside the root node.
4. There's no `postMixInProperties()` method any more.   There is one called `preCreate()` that
   runs before rendering.
5. The widget initialization parameters are not applied until after `buildRendering()` completes.

TODO: more on lifecycle, especially custom setters

### templates

`_TemplatedMixin` is replaced by the [handlebars!](handlebars.md) plugin, see that page for details.

### i18n

Resources are loaded through `i18n!` plugin rather than a loadResource() type method.

### CSS
A widget should use [dui/themes/load!](load.md) or [dui/css!](css.md) to load its own CSS.

