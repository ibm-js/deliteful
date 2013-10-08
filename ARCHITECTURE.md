[Temporary?] place to hold DUI design decisions and architecture notes.

# CSS theme loader

TODO: document

# dui/Stateful

The goal is to dui/Stateful is three-fold:

1. declare a class where properties are set and gotten using standard notation:

	myWidget.label = "hello";
	console.log(myWidget.label);

instead of:

	myWidget.set("label", "hello");
	console.log(myWidget.get("label"));

2. be able to watch for changes to [a subset of] instance properties:

   	myWidget.watch("label", callback);

3. allow the class to define custom getters/setters for some (but not necessarily all) of the properties

	MyClass = dcl(Stateful, {
		label: "Press",
		_setLabelAttr: function(val){
				this._set("label", ...);
				...
			}
		}
	});

Ideally ES5 native accessors would be supported via [dcl](http://www.dcljs.org/) but we are
[still waiting for that](https://github.com/uhop/dcl/issues/2).  It's not supported
by [ComposeJS](https://github.com/kriszyp/compose) either, although Kitson has
[a branch](https://github.com/kitsonk/core/blob/master/compose.js#L373) that supports it,
so using his branch is another option, if we could live with ComposeJS's limited features like
lack of C3MRO.


As for implementing watch(), we would ideally use
[Object.observe()](http://updates.html5rocks.com/2012/11/Respond-to-change-with-Object-observe)
or some similar functionality like
[Firefox's watch() method](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/watch)
or [IE's onpropertychange listener](http://msdn.microsoft.com/en-us/library/ie/ms536956.aspx).
Unfortunately there is no support for any of these on current versions of Webkit.  Even when Webkit starts
to support Object.observe() (in its production release, without flipping an switch to
"turn on experimental features"), it will be a while before the change trickles down to the mobile devices
we want to support.

Polymer tries to polyfill this functionality with it's [observe-js](https://github.com/Polymer/observe-js)
library.  However, after changing an object property (or set of object properties) the app needs to call
`Platform.performMicroTaskCheckpoint()`, or a similar method like `observer.deliver()`, so this hardly seems
like an acceptable solution.


So, the implementation is that dui/Stateful will note all the properties defined in the prototype, direct and inherited,
and call Object.defineProperty() on the prototype to add native ES5 setters and getters for those properties.
For properties where the subclass doesn't define a custom setter, Stateful will generate one on-the-fly
that just calls this._set(...) to save the new value and announce the change to any listeners registered
via watch().

# register()
Dui/register is for declaring widgets and is meant (in the future) to specify the widget's custom tag:

	register("dui-button", ... {
		label: "Press",
		_setLabelAttr: function(val){
				this._set("label", ...);
				...
			}
		}
	});

It also allows the shorthand syntax for declaring setters from Dijit V1 like:

	_setTabIndexAttr: "focusNode"

# Reactive templates

TODO: merge from wkeese/handlebars branch

# Reactive templates

The goal was to support reactive templates so that a template like below would automatically adjust the
DOM as the widget's `iconClass` and `label` properties were changed:

	<button>
		<span class="duiReset {{iconClass}}"></span>
		{{#if showLabel}}
			{{label}}
		{{/if}}
	</button>

The implementation consists of two parts:

1. code in dui/handlebars that compiles the above template into an AST:

		{
			tag: "BUTTON",
			attributes: {},
			children: [
				{
					tag: "SPAN",
					attributes: {
						class: ["duiReset ", {property: "iconClass"}]
					},
					children: []
				},
				{property: "label"}
			]
		}

2. code in dui/template that uses code generation to compile the above AST into a function:

		function buildRendering(root) {
			var widget = this, doc = this.ownerDocument;
			root = root || doc.createElement('BUTTON');
			var rootc1 = doc.createElement('SPAN');
			function rootc1_setattr_class(){ rootc1.setAttribute('class', 'duiReset ' + widget.iconClass); }
			rootc1_setattr_class();
			this.watch('iconClass', rootc1_setattr_class);
			root.appendChild(rootc1);
			var rootc1t2 = doc.createTextNode(this.label);
			root.appendChild(rootc1t2);
			this.watch('label', function(a,o,n){ rootc1t2.nodeValue = n; });
			this.domNode = root;
			return root;
		}

The dui/handlebars! plugin returns a function to operate in the widget's context, so
for widgets to leverage the template engine, you put your template in a separate file,
and then define the widget like:

	define([..., "./handlebars!./templates/MyTemplate.html"], function(..., renderFunc){
		...
		buildRendering: renderFunc,
		...
	}


## Supported Handlebars constructs

Supported constructs:

1. {{ text }} - substitution variables in DOMNode attributes (ex: `class="duiReset {{iconClass}}"`)
   and as a DOMNode child (ex: `<span>Hello {{name}}</span>`.
2. `{{#if condition}} ... {{/if}}` - However, no plans to support `{{else}}`, and no plans for the IF blocks to be
   reactive.

Will support in the future:

1. `{{#each array}} ... {{/each}}` - However, the {{#each}} must be the only child of its parent node, for example
   `<ul> {{#each array}} <li>name {{/each}} </ul>`.   Also, no plans to support ``{{else}}`.  Reactive support for
   `{{#each}}` is complex as the array data could be changed like `this.array = newArray` or `this.array.push(...)`
   or `this.array[1].name = "Bob"`.

Unsupported constructs:

1. `{{{ HTML }}}` - We only support insertion of plain text like {{ text }}.
2. Paths like `{{ foo.bar }}`
3. Helpers like `{{fullName author}}``

Partly these are unsupported because they are difficult for reactive templates,
and partly to keep the code size of the Handlebars and template engine minimal.

## Notes on template format

There were a number of possible syntaxes proposed for the templates, including:

* [MDV](http://www.polymer-project.org/platform/template.html) -
  Pure HTML version of templates, possibly will become a new standard, supported natively by browsers
* [Mustache](http://mustache.github.io/mustache.5.html) / [Handlebars](http://handlebarsjs.com/) -
  What our users are used to.  Note that the Mustach and Handlebars syntaxes are the same except
  for complicated things like branching/looping.
* [JADE](http://jade-lang.com/)-like syntax based on Kris' put-selector code

The JADE like syntax is probably the easiest to write, and the MDV syntax fits the best within the HTML
paradigm, but initially I just programmed a subset of the Handlebars syntax because it's what our users
are used to.   However, given the separation between dui/handlebars and dui/template, any number of template
engines could be easily written.

## Notes on AST format

The AST format (the JSON shown above) is custom-designed.  The alternative was to use
[JSONML](http://www.ibm.com/developerworks/library/x-jsonml/#c7).  It's a slightly terser syntax
(which would be important if we are sending templates over the wire), but I worry slightly that
it's hard to insert new features into that syntax like:

* data-dojo-attach-point
* marking which properties need to track changes, vs. which properties can just be read when the
  template is initially instantiated


## Notes on template compilation

Libraries like Mustache typically use code generation to compile a template into pure javascript,
and that's what dui/template is currently doing.

The advantage of this approach is that:

* running the generated code is 3x faster than a building a template based off of an AST like the JSON shown above
* in a build, there's no library code needed besides the generated code above

However, its unlikely that the speed of the template code is significant compared to the cost of
creating and inserting DOM nodes.   Also, the code to render a template from an AST like above is pretty small.
So, perhaps that implementation will change.

# Custom elements

TODO: implement and document
