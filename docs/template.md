# dui/template

`Dui/template` is a utility that takes an AST representing a widget template, and compiles it into
a function for creating a reactive template.   It's used by [dui/handlerbars!](handlebars.md) and designed
so it can be used with other template syntax parsers too.

An AST would look like:

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

It gets compiled into a function like:

	function buildRendering(root) {
		var widget = this, doc = this.ownerDocument;
		var rootc1 = doc.createElement('SPAN');
		function rootc1_setattr_class(){ rootc1.setAttribute('class', 'duiReset ' + widget.iconClass); }
		rootc1_setattr_class();
		this.watch('iconClass', rootc1_setattr_class);
		this.appendChild(rootc1);
		var rootc1t2 = doc.createTextNode(this.label);
		this.appendChild(rootc1t2);
		this.watch('label', function(a,o,n){ rootc1t2.nodeValue = n; });
	}

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

