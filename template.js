define({
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

	// TODO: add data-dojo-attach-point support
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

	generateNodeChildrenCode: function(/*String*/ nodeName, /*Object[]*/ children){
		// summary:
		//		Return JS code to create and add children to a node named nodeName.

		var text = "";

		children.forEach(function(child, idx){
			var childName = nodeName + "c" + (i+1);
			if(child.branch){
				// {{#if ...}} in Handlebars syntax
				text += "if(this." + child.branch + "){\n";
				text += this.generateNodeChildrenCode(nodeName, child.children);
				text += "}\n";
			}else if(child.each){
				throw new Error("TODO: each not supported yet")
			}else if(child.tag){
				// Standard DOM node, recurse
				text += this.generateNodeCode(childName, child);
				text += nodeName + ".appendChild(" + childName + ");\n";
			}else if(child.property){
				// text node bound to a widget property, ex: this.label
				var textNodeName = childName + "t" + (idx+1);
				text += "var " + textNodeName + " = doc.createTextNode(this." + child.property + ");\n";
				text += nodeName + ".appendChild(" + textNodeName + ");\n";
				text += "this.watch('" + child.property + "', function(a,o,n){ " + textNodeName +
					".nodeValue = n; });\n";
			}else{
				// static text
				text += nodeName + ".appendChild(doc.createTextNode('" + child + "'));\n";
			}
		}, this);

		return text;
	},

	generateNodeCode: function(/*String*/ nodeName, /*Object*/ templateNode, /*Boolean*/ mayAlreadyExist){
		// summary:
		//		Return JS code to create a node called nodeName based on templateNode.
		//		Works recursively according to descendants of templateNode.
		// nodeName:
		//		The node will be created in a variable with this name.
		// templateNode:
		//		An object representing a node in the template, as described in module summary
		// mayAlreadyExist:
		//		Indicates that the variable nodeName already exists, and it may point to the DOMNode already.
		//		This happens in the case of declarative markup of web components.

		// Create node
		var text = mayAlreadyExist ?
			nodeName + " = " + nodeName + " || doc.createElement('" + templateNode.tag + "');\n" :
			"var " + nodeName + " = doc.createElement('" + templateNode.tag + "');\n";

		// Set attributes
		for(var attr in templateNode.attributes){
			var parts = templateNode.attributes[attr];

			// Get expression for the value of this attribute, ex: 'duiReset ' + this.baseClass.
			// Also get list of properties that we need to watch for changes.
			var properties = [], js = parts.map(function(part){
				if(part.property){
					properties.push(part.property);
					return "widget." + part.property;	// note: "this" not available in func passed to watch()
				}else{
					return "'" + part + "'";
				}
			}).join(" + ");

			if(properties.length){
				var funcName = nodeName + "_setattr_" + attr;
				text += "function " + funcName + "(){ " + nodeName +
					".setAttribute('" + attr + "', " + js + "); }\n";
				text += funcName + "();\n";
				properties.forEach(function(prop){
					text += "this.watch('" + prop + "', " + funcName + ");\n";
				});
			}else{
				text += nodeName + ".setAttribute('" + attr + "', " + js + ");\n";
			}
		}

		// Create descendant Elements and text nodes
		text += this.generateNodeChildrenCode(nodeName, templateNode.children);

		return text;
	},

	codegen: function(/*Object*/ tree){
		// summary:
		//		Given an object tree as described in the module summary,
		//		returns the text for a function to generate DOM corresponding to that template,
		//		and setup listeners (using `_WidgetBase.watch()`) to propagate changes in the widget
		//		properties to the templates.
		//
		//		Code assumes that the root of the object tree is called "root".

		return "var widget = this, doc = this.ownerDocument;\n" +
			this.generateNodeCode("root", tree, true) +
			"this.domNode = root;\n" +
			"return root;";
	},

	compile: function(tree){
		// summary:
		//		Given an object tree as described in the module summary,
		//		returns a function to generate DOM corresponding to that template,
		//		and setup listeners (using `Stateful.watch()`) to propagate changes in the widget
		//		properties to the templates.

		var text = this.codegen(tree);
		return new Function("root", text);
	}
});