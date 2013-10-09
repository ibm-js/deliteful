# Migrating from dijit and dojox/mobile to dui

## Notes for applications
1. In markup, widgets look like `<dui-starrating foo=bar>` rather than
	`<div data-dojo-type=dui/StarRating data-dojo-props="foo: bar">`.
	For widgets that enhance an existing tag, syntax is `<button is="dui-button">`.
2. Use `register.parse()` rather than `dojo/parser.parse()`.  There's no `parseOnLoad:true` or auto-loading
	or `data-dojo-mixins`.
3. Since each widget defines and loads its own CSS, you don't need to manually include dijit.css or claro.css;
   also, the theme is determined automatically so you don't need to add `class="claro"` to the `<body>` node.

## Notes for widget authors

1. Widgets are declared via `register()` rather than `dojo.declare()`, and must extend HTMLElement or a subclass;
   see the documentation for [register()](register.md) for details
2. `this.srcNodeRef` and `this.domNode` both replaced by `this`; for example `this.className = "myButton"`
3. `create()` renamed to `createdCallback()`
4. `constructor()` and `postscript()` no longer run; move custom code from constructor
	to `createdCallback()` as advice: `register.before(function(){  ... })`.
5. The `buildRendering()` method must not try to create the root DOMNode.  It already exists.
   It should just set attributes on the root node, and create subnodes and/or text inside it.
6. `_TemplatedMixin` is replaced by the [handlebars!](handlebars.md) plugin, see that page for details.
7. Resources are loaded through `i18n!` plugin rather than a loadResource() type method.
8. A widget should use [dui/themes/load!](load.md) or [dui/css!](css.md) to load its own CSS.

TODO: lifecycle, especially custom setters
