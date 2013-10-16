# dui/handlebars

`dui/handlebars` supports reactive templates,
so a template like below would automatically adjust the
DOM as the widget's `iconClass` and `label` properties were changed:

	<button>
		<span class="duiReset {{iconClass}}"></span>
		{{#if showLabel}}
			{{label}}
		{{/if}}
	</button>


The dui/handlebars! plugin returns a function to operate in the widget's context, so
for widgets to leverage the template engine, you put your template in a separate file,
and then define the widget like:

	define([..., "dui/handlebars!./templates/MyTemplate.html"], function(..., renderFunc){
		...
		buildRendering: renderFunc,
		...
	}

Handlebars can also be used as a plain AMD module, via the `compile()` method:

	define([..., "dui/handlebars"], function(..., handlebars){
		...
		buildRendering: handlebars.compile(
			'<span class="duiReset {{iconClass}}">{{label}}</span>'
		),
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

## Widgets in templates

A template can contain widgets in addition to plain DOM nodes.  In this case, the main widget
class is responsible for loading the supporting widgets before compiling the template.
Therefore, rather than using the plugin syntax, it must use the `compile()` method, for example:

	define([..., "dui/handlebars", "acme/SupportingWidget"], function(..., handlebars){
		...
		buildRendering: handlebars.compile(
			'<supporting-widget class="duiReset {{iconClass}}">{{label}}</supporting-widget>'
		),
		...
	}

Note that the template text can still be put into a file, and the file loaded with the text! plugin:

	define([..., "dui/handlebars", "text!./templates/myTemplate.html", "acme/SupportingWidget"],
			function(..., handlebars, text){
		...
		buildRendering: handlebars.compile(text),
		...
	}

## Implementation details

dui/handlebars! compiles the template into an AST format and then uses `dui/template` to generate
a function from it.


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
