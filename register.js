define([
	"dcl/dcl",
	"dojo/dom-attr", // domAttr.set domAttr.remove
	"dojo/dom-class" // domClass.add domClass.replace
], function (dcl, domAttr, domClass) {
	'use strict';

	function genSetter(/*String*/ attr, /*Object*/ commands){
		// summary:
		//		Return setter for a widget property, often mapping the property to a
		//		DOMNode attribute, innerHTML, or innerText.
		//		Note some attributes like "type" cannot be processed this way as they are not mutable.
		// attr:
		//		Name of widget property, ex: "label"
		// commands:
		//		A single command or array of commands.  A command is:
		//
		//			- null to indicate a plain setter that just saves the value and notifies listeners registered with watch()
		//			- a string like "focusNode" to set this.focusNode[attr]
		//			- an object like {node: "labelNode", type: "attribute", attribute: "role" } to set this.labelNode.role
		//			- an object like {node: "domNode", type: "class" } to set this.domNode.className
		//			- an object like {node: "labelNode", type: "innerHTML" } to set this.labelNode.innerHTML
		//			- an object like {node: "labelNode", type: "innerText" } to set this.labelNode.innerText

		function genSimpleSetter(command){
			var mapNode = command.node || command || "domNode";	// this[mapNode] is the DOMNode to adjust
			switch(command.type){
				case "innerText":
					return function(value){
						this.runAfterRender(function(){
							this[mapNode].innerHTML = "";
							this[mapNode].appendChild(this.ownerDocument.createTextNode(value));
						});
						this._set(attr, value);
					};
				case "innerHTML":
					return function(value){
						this.runAfterRender(function(){
							this[mapNode].innerHTML = value;
						});
						this._set(attr, value);
					};
				case "class":
					return function(value){
						this.runAfterRender(function(){
							domClass.replace(this[mapNode], value, this[attr]);
						});
						this._set(attr, value);
					};
				default:
					// Map to DOMNode attribute, or attribute on a supporting widget.
					// First, get the name of the DOM node attribute; usually it's the same
					// as the name of the attribute in the widget (attr), but can be overridden.
					// Also maps handler names to lowercase, like onSubmit --> onsubmit
					var attrName = command.attribute ? command.attribute :
						(/^on[A-Z][a-zA-Z]*$/.test(attr) ? attr.toLowerCase() : attr);

					return function(value){
						if(typeof value == "function"){ // functions execute in the context of the widget
							value = lang.hitch(this, value);
						}
						this.runAfterRender(function(){
							if(this[mapNode].tagName){
								// Normal case, mapping to a DOMNode.  Note that modern browsers will have a mapNode.setAttribute()
								// method, but for consistency we still call domAttr().  For 2.0 change to set property?
								domAttr.set(this[mapNode], attrName, value);
							}else{
								// mapping to a sub-widget
								this[mapNode][attrName] = value;
							}
						});
						this._set(attr, value);
					};
			}
		}

		if(commands instanceof Array){
			// Unusual case where there's a list of commands, ex: _setFooAttr: ["focusNode", "domNode"].
			var setters = array.map(commands, genSimpleSetter);
			return function(value){
				setters.forEach(function(setter){
					setter.call(this, value);
				}, this);
			}
		}else{
			return genSimpleSetter(commands);
		}
	}

	function register (tag, superclasses, props) {
		// summary:
		//		Declare a widget class.
		//		Eventually this will be for creating a custom element, hence the tag parameter.
		//
		//		props{} can provide custom setters/getters for widget properties, which are called automatically when
		//		the widget properties are set.
		//		For a property XXX, define methods _setXXXAttr() and/or _getXXXAttr().
		//
		//		_setXXXAttr can also be a string/hash/array mapping from a widget attribute XXX to the widget's DOMNodes:
		//
		//		- DOM node attribute
		// |		_setFocusAttr: {node: "focusNode", type: "attribute"}
		// |		_setFocusAttr: "focusNode"	(shorthand)
		// |		_setFocusAttr: ""		(shorthand, maps to this.domNode)
		//		Maps this.focus to this.focusNode.focus, or (last example) this.domNode.focus
		//
		//		- DOM node innerHTML
		//	|		_setTitleAttr: { node: "titleNode", type: "innerHTML" }
		//		Maps this.title to this.titleNode.innerHTML
		//
		//		- DOM node innerText
		//	|		_setTitleAttr: { node: "titleNode", type: "innerText" }
		//		Maps this.title to this.titleNode.innerText
		//
		//		- DOM node CSS class
		// |		_setMyClassAttr: { node: "domNode", type: "class" }
		//		Maps this.myClass to this.domNode.className
		//
		//		If the value of _setXXXAttr is an array, then each element in the array matches one of the
		//		formats of the above list.
		//
		//		If the custom setter is null, no action is performed other than saving the new value
		//		in the widget (in this), and notifying any listeners registered with watch()

		// Create the widget class by extending specified superclasses and adding specified properties.
		// Then create a a wrapper class around that, with native accessors and introspected metadata.

		props = props || {};
		props.tag = props.declaredClass = tag;	// for debugging

		// Generate class
		var ctor = dcl(superclasses, props),
			proto = ctor.prototype;

		// Convert shorthand notations like _setAltAttr: "focusNode" into real functions.
		for(var name in proto){
			if(/^_set[A-Z](.*)Attr$/.test(name) && typeof proto[name] != "function"){
				proto[name] = genSetter(name.charAt(4).toLowerCase() + name.substr(5, name.length - 9), proto[name]);
			}
		}

		return ctor;
	}

	// Export dcl methods for convenience, so other modules can just include dui/register.
	register.mix = dcl.mix;
	register.before = dcl.before;
	register.after = dcl.after;
	register.advise = dcl.advise;
	register.superCall = dcl.superCall;

	return register;
});