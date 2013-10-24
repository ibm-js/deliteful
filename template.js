define(["./register"], function (register) {

	var attrMap = {};

	function getProp(tag, attrName) {
		// summary:
		//		Given a tag and attribute name, return the associated property name,
		//		or undefined if no such property exists, for example:
		//		Ex:
		//			- getProp("class") --> "className"
		//			- getProp("tabindex") --> "tabIndex"
		//			- getProp("role") --> undefined

		if (!(tag in attrMap)) {
			var proto = register.createElement(tag),
				map = attrMap[tag] = {};
			for (var prop in proto) {
				map[prop.toLowerCase()] = prop;
			}
			map["class"] = "className";
			map["style"] = "style.cssText";
		}
		return attrMap[tag][attrName];
	}

	return {
		// summary:
		//		Compile an object tree representing a template into a function to generate that DOM,
		//		and setup listeners to update the DOM as the widget properties change.
		//
		//		Object tree for a button would look like:
		//
		//	|	{
		//	|		tag: "button",
		//	|		attributes: {
		//	|			"class": ["duiReset ", {property: "baseClass"}]	// concatenate these values to get attr value
		//	|		},
		//	|		children: [
		//	|			{ tag: "span", ... },
		//	|			"some boilerplate text",
		//	|			{ property: "label" }	// text node bound to this.label
		//	|		]
		//	|	}

		// TODO: possibly add data-dojo-attach-point support
		// TODO: possibly add support to control which properties are / aren't bound (for performance)

		// Note: this is generating actual JS code since:
		// 		- that's 3x faster than looping over the object tree every time...
		//		- so the build system can eliminate this file (and just use the generated code
		//
		// But perhaps that is misguided.  The performance difference is probably insignificant
		// compared to the cost of creating DOM elements and/or the cost of actually rendering them, and the size
		// of the generated code compared to the size of the object tree may offset gains from including this file.

		// Note: JSONML (http://www.ibm.com/developerworks/library/x-jsonml/#c7) represents elements as a single array
		// like [tag, attributesHash, child1, child2, child3].  Should we do the same?   But attach points are tricky.

		generateNodeChildrenCode: function (/*String*/ nodeName, /*Object[]*/ children) {
			// summary:
			//		Return JS code to create and add children to a node named nodeName.

			var text = "";

			children.forEach(function (child, idx) {
				var childName = nodeName + "c" + (idx + 1);
				if (child.branch) {
					// {{#if ...}} in Handlebars syntax
					text += "if(this." + child.branch + "){\n";
					text += this.generateNodeChildrenCode(nodeName, child.children);
					text += "}\n";
				} else if (child.each) {
					throw new Error("TODO: each not supported yet")
				} else if (child.tag) {
					// Standard DOM node, recurse
					text += this.generateNodeCode(childName, child);
					text += nodeName + ".appendChild(" + childName + ");\n";
				} else if (child.property) {
					// text node bound to a widget property, ex: this.label
					var textNodeName = childName + "t" + (idx + 1);
					text += "var " + textNodeName + " = doc.createTextNode(this." + child.property + ");\n";
					text += nodeName + ".appendChild(" + textNodeName + ");\n";
					text += "this.watch('" + child.property + "', function(a,o,n){ " + textNodeName +
						".nodeValue = n; });\n";
				} else {
					// static text
					text += nodeName + ".appendChild(doc.createTextNode('" + child + "'));\n";
				}
			}, this);

			return text;
		},

		generateNodeCode: function (/*String*/ nodeName, /*Object*/ templateNode) {
			// summary:
			//		Return JS code to create a node called nodeName based on templateNode.
			//		Works recursively according to descendants of templateNode.
			// nodeName:
			//		The node will be created in a variable with this name.
			//		If "this", indicates that the node already exists and should be referenced as "this".
			// templateNode:
			//		An object representing a node in the template, as described in module summary

			var text = "";

			// Create node
			if (nodeName != "this") {
				text += "var " + nodeName + " = register.createElement('" + templateNode.tag + "');\n";
			}

			// Set attributes/properties
			for (var attr in templateNode.attributes) {
				// Get expression for the value of this property, ex: 'duiReset ' + this.baseClass.
				// Also get list of properties that we need to watch for changes.
				var parts = templateNode.attributes[attr];
				var watchProps = [], js = parts.map(function (part) {
					if (part.property) {
						watchProps.push(part.property);
						return "widget." + part.property;	// note: "this" not available in func passed to watch()
					} else {
						return "'" + part + "'";
					}
				}).join(" + ");

				// Generate code to set this property or attribute
				var propName = getProp(templateNode.tag, attr);
				var codeToSetProp = propName ? nodeName + "." + propName + "=" + js + ";" :
					nodeName + ".setAttribute('" + attr + "', " + js + ");";
				text += codeToSetProp + "\n";
				watchProps.forEach(function (wp) {
					text += "this.watch('" + wp + "', function(){ " + codeToSetProp + " });\n";
				});
			}

			// Create descendant Elements and text nodes
			text += this.generateNodeChildrenCode(nodeName, templateNode.children);

			return text;
		},

		codegen: function (/*Object*/ tree) {
			// summary:
			//		Given an object tree as described in the module summary,
			//		returns the text for a function to generate DOM corresponding to that template,
			//		and setup listeners (using `Widget.watch()`) to propagate changes in the widget
			//		properties to the templates.
			//
			//		Code assumes that the root node already exists as "this".

			return "var widget = this, doc = this.ownerDocument, register = this.register;\n" +
				this.generateNodeCode("this", tree);
		},

		compile: function (tree) {
			// summary:
			//		Given an object tree as described in the module summary,
			//		returns a function to generate DOM corresponding to that template,
			//		and setup listeners (using `Stateful.watch()`) to propagate changes in the widget
			//		properties to the templates.

			var text = this.codegen(tree);
			return new Function(text);
		}
	};
});