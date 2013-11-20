define([
	"dcl/dcl",
	"dojo/has"
], function (dcl, has) {
	'use strict';

	var doc = document;

	// Workaround problem using dcl() on native DOMNodes on FF and IE,
	// see https://github.com/uhop/dcl/issues/9.
	// Fixes case where tabIndex is declared in a mixin that's passed to register().
	dcl.mix = function(a, b){
		for(var n in b){
			try {
				a[n] = b[n];
			} catch (e) {
				Object.defineProperty(a, n, {
					configurable: true,
					writable: true,
					enumerable: true,
					value: b[n]
				});
			}
		}
	};

	// Does platform have native support for document.register() or a polyfill to simulate it?
	has.add('document-register', !!document.register);

	// Can we use __proto__ to reset the prototype of DOMNodes?
	// It's not available on IE<11, and even on IE11 it makes the node's attributes (ex: node.attributes, node.textContent)
	// disappear, so disabling it on IE11 for now.
	has.add('dom-proto-set', function () {
		var node = document.createElement("div");
		if (!node.__proto__) {
			return false;
		}
		node.__proto__ = {};
		return !!node.attributes;
	});

	/**
	 * List of selectors that the parser needs to search for as possible upgrade targets.  Mainly contains
	 * the widget custom tags like d-accordion, but also selectors like button[is='d-button'] to find <button is="...">
	 * @type {String[]}
	 */
	var selectors = [];

	/**
	 * Internal registry of widget class metadata.
	 * Key is custom widget tag name, used as Element tag name like <d-accordion> or "is" attribute like
	 * <button is="d-accordion">).
	 * Value is metadata about the widget, including its prototype, ex: {prototype: object, extends: "button", ... }
	 * @type {Object}
	 */
	var registry = {};

	/**
	 * Create an Element.  Equivalent to document.createElement(), but if tag is the name of a widget defined by
	 * register(), then it upgrades the Element to be a widget.
	 * @param {String} tag
	 * @returns {Element} The DOMNode
	 */
	function createElement(tag) {
		var base = registry[tag] ? registry[tag].extends : null,
			element = doc.createElement(base || tag);
		if (base) {
			element.setAttribute('is', tag);
		}

		upgrade(element);

		return element;
	}

	function getPropDescriptors(proto) {
		// summary:
		//		Generate metadata about all the properties in proto, both direct and inherited.
		//		On IE<=10, these properties will be applied to a DOMNode via Object.defineProperties().
		//		Skips properties in the base element (HTMLElement, HTMLButtonElement, etc.)

		var props = {};

		do {
			var keys = Object.getOwnPropertyNames(proto);	// better than Object.keys() because finds hidden props too
			for (var i = 0, k; k = keys[i]; i++) {
				if (!props[k]) {
					props[k] = Object.getOwnPropertyDescriptor(proto, k);
				}
			}
			proto = Object.getPrototypeOf(proto);
		} while (!/HTML[a-zA-Z]*Element/.test(proto.constructor.toString()));

		return props;
	}

	/**
	 * Converts plain DOMNode of custom type into widget, by adding the widget's custom methods, etc.
	 * Does nothing if the DOMNode has already been converted or if it doesn't correspond to a custom widget.
	 * Roughly equivalent to dojo/parser::instantiate(), but for a single node, not an array
	 * @param {Element} inElement The DOMNode
	 */
	function upgrade(element) {
		if (!element.__upgraded__) {
			var widget = registry[element.getAttribute('is') || element.nodeName.toLowerCase()];
			if (widget) {
				if (has("dom-proto-set")) {
					// Redefine Element's prototype to point to widget's methods etc.
					element.__proto__ = widget.prototype;
				}
				else {
					// Mixin all the widget's methods etc. into Element
					Object.defineProperties(element, widget.props);
				}
				element.__upgraded__ = true;
				element._constructor = widget.constructor;	// _constructor b/c constructor is read-only on iOS
				if (element.createdCallback) {
					element.createdCallback.call(element, widget.prototype);
				}
				if (element.enteredViewCallback && doc.documentElement.contains(element)) {
					// Note: if app inserts an element manually it needs to call enteredViewCallback() manually
					element.enteredViewCallback.call(element, widget.prototype);
				}
			}
		}
	}

	/**
	 * Hash mapping of HTMLElement interfaces to tag names
	 * @type {Object}
	 */
	var tags = {
		HTMLAnchorElement: 'a',
		HTMLAppletElement: 'applet',
		HTMLAreaElement: 'area',
		HTMLAudioElement: 'audio',
		HTMLBaseElement: 'base',
		HTMLBRElement: 'br',
		HTMLButtonElement: 'button',
		HTMLCanvasElement: 'canvas',
		HTMLDataElement: 'data',
		HTMLDataListElement: 'datalist',
		HTMLDivElement: 'div',
		HTMLDListElement: 'dl',
		HTMLDirectoryElement: 'directory',
		HTMLEmbedElement: 'embed',
		HTMLFieldSetElement: 'fieldset',
		HTMLFontElement: 'font',
		HTMLFormElement: 'form',
		HTMLHeadElement: 'head',
		HTMLHeadingElement: 'h1',
		HTMLHtmlElement: 'html',
		HTMLHRElement: 'hr',
		HTMLIFrameElement: 'iframe',
		HTMLImageElement: 'img',
		HTMLInputElement: 'input',
		HTMLKeygenElement: 'keygen',
		HTMLLabelElement: 'label',
		HTMLLegendElement: 'legend',
		HTMLLIElement: 'li',
		HTMLLinkElement: 'link',
		HTMLMapElement: 'map',
		HTMLMediaElement: 'media',
		HTMLMenuElement: 'menu',
		HTMLMetaElement: 'meta',
		HTMLMeterElement: 'meter',
		HTMLModElement: 'ins',
		HTMLObjectElement: 'object',
		HTMLOListElement: 'ol',
		HTMLOptGroupElement: 'optgroup',
		HTMLOptionElement: 'option',
		HTMLOutputElement: 'output',
		HTMLParagraphElement: 'p',
		HTMLParamElement: 'param',
		HTMLPreElement: 'pre',
		HTMLProgressElement: 'progress',
		HTMLQuoteElement: 'quote',
		HTMLScriptElement: 'script',
		HTMLSelectElement: 'select',
		HTMLSourceElement: 'source',
		HTMLSpanElement: 'span',
		HTMLStyleElement: 'style',
		HTMLTableElement: 'table',
		HTMLTableCaptionElement: 'caption',
		HTMLTableDataCellElement: 'td',
		HTMLTableHeaderCellElement: 'th',
		HTMLTableColElement: 'col',
		HTMLTableRowElement: 'tr',
		HTMLTableSectionElement: 'tbody',
		HTMLTextAreaElement: 'textarea',
		HTMLTimeElement: 'time',
		HTMLTitleElement: 'title',
		HTMLTrackElement: 'track',
		HTMLUListElement: 'ul',
		HTMLUnknownElement: 'blink',
		HTMLVideoElement: 'video'
	};

	/**
	 * For a constructor function, attempt to determine name of the "class"
	 * @param  {Function} base The constructor function to identify
	 * @return {String}           The string name of the class
	 */
	function getBaseName(base) {
		// Try to use Function.name if available
		if (base && base.name) {
			return base.name;
		}
		var matches;
		// Attempt to determine the name of the "class" by either getting it from the "function Name()" or the
		// .toString() of the constructor function.  This is required on IE due to the fact that function.name is
		// not a standard property and is not implemented on IE
		if ((matches = base.toString().match(/^(?:function\s(\S+)\(\)\s|\[\S+\s(\S+)\])/))) {
			return matches[1] || matches[2];
		}
	}

	/**
	 * Registers the tag with the current document, and save tag information in registry.
	 * Handles situations where the base constructor inherits from
	 * HTMLElement but is not HTMLElement.
	 * @param  {String}   tag      The custom tag name for the element, or the "is" attribute value.
	 * @param  {String}   baseName The base "class" name that this custom element is being built on
	 * @param  {Function} baseCtor The constructor function
	 * @return {Function}          The "new" constructor function that can create instances of the custom element
	 */
	function getTagConstructor(tag, baseName, baseCtor) {
		var proto = baseCtor.prototype,
			config = registry[tag] = {
				constructor: baseCtor,
				prototype: proto
			};
		if (baseName !== 'HTMLElement') {
			config.extends = tags[baseName];
		}

		if (has("document-register")) {
			doc.register(tag, config);
		} else {
			if (!has("dom-proto-set")) {
				// Get descriptors for all the properties in the prototype.  This is needed on IE<=10 in upgrade().
				config.props = getPropDescriptors(proto);
			}

			// Register the selector to find this custom element
			selectors.push(config.extends ? config.extends + '[is="' + tag + '"]' : tag);

			// Note: if we wanted to support registering new types after the parser was called, then here we should
			// scan the document for the new type (selectors[length-1]) and upgrade any nodes found.
		}

		// Create a constructor method to return a DOMNode representing this widget.
		var tagConstructor = function (params, srcNodeRef) {
			// Create new widget node or upgrade existing node to widget
			var node;
			if (srcNodeRef) {
				node = typeof srcNodeRef == "string" ? document.getElementById(srcNodeRef) : srcNodeRef;
				upgrade(node);
			} else {
				node = createElement(tag);
			}

			// Set parameters on node
			for (var name in params || {}) {
				if ( name === "style" ) {
					node.style.cssText = params.style;
				} else {
					node[name] = params[name];
				}
			}

			return node;
		};

		// Add some flags for debugging and return the new constructor
		tagConstructor.tag = tag;
		tagConstructor._ctor = baseCtor;

		return tagConstructor;
	}

	/**
	 * Restore the "true" constructor when trying to recombine custom elements
	 * @param  {Function} extension A constructor function that might have a shadow property that contains the
	 *                              original constructor
	 * @return {Function}           The original construction function or the existing function/object
	 */
	function restore(extension) {
		return (extension && extension._ctor) || extension;
	}

	/**
	 * Declare a widget and register as a custom element.
	 *
	 * props{} can provide custom setters/getters for widget properties, which are called automatically when
	 * the widget properties are set.
	 * For a property XXX, define methods _setXXXAttr() and/or _getXXXAttr().
	 *
	 * @param  {String}               tag             The custom element's tag name
	 * @param  {Objects}              [extensions...] Any number of extensions to be built into the custom element
	 *                                                constructor.   But first one must be [descendant] of HTMLElement.
	 * @param  {Object}               props           Properties of this widget class
	 * @return {Function}                             A constructor function that will create an instance of the custom
	 *                                                element
	 */
	function register(tag, superclasses, props) {
		// Create the widget class by extending specified superclasses and adding specified properties.

		// Make sure all the bases have their proper constructors for being composited.
		// I.E. remove the wrapper added by getTagConstructor().
		var bases = (superclasses instanceof Array ? superclasses : superclasses ? [superclasses] : []).map(restore);

		var baseName, baseElement = bases[0];

		// Check to see if the custom tag is already registered
		if (tag in registry) {
			throw new TypeError('A widget is already registered with tag "' + tag + '".');
		}
		// Get name of root class: "HTMLElement", "HTMLInputElement", etc.
		if (!(baseName = (baseElement.prototype && baseElement.prototype._baseName) || getBaseName(baseElement))) {
			throw new TypeError(tag + ': Cannot determine class of baseElement');
		}
		baseName = baseName.replace(/Constructor$/, "");	// normalize HTMLElementConstructor --> HTMLElement on iOS

		// Check to see if baseElement is appropriate
		if (!/^HTML.*Element$/.test(baseName)) {
			throw new TypeError(tag + ': baseElement must have HTMLElement in its prototype chain');
		}

		props = props || {};

		// Get a composited constructor
		var ctor = dcl(bases, props),
			proto = ctor.prototype;
		proto._ctor = ctor;
		proto._baseName = baseName;

		// Run introspection to add ES5 getters/setters.
		// Doesn't happen automatically because Stateful's constructor isn't called.
		// Also, on IE this needs to happen before the getTagConstructor() call,
		// since getTagConstructor() scans all the properties on the widget prototype.
		proto._introspect(proto._getProps());
		ctor._introspected = true;

		// Save widget metadata to the registry and return constructor that creates an upgraded DOMNode for the widget
		/* jshint boss:true */
		return getTagConstructor(tag, baseName, ctor);
	}

	/**
	 * Parse the given DOM tree for any DOMNodes that need to be upgraded to widgets.
	 * @param {Element?} Root DOMNode to parse from
	 */
	function parse(root) {
		if (has("document-register")) {
			// If there's native support for custom elements then they are parsed automatically
			return;
		}

		// Otherwise, parse manually
		var node, idx = 0, nodes = (root || doc).querySelectorAll(selectors);
		while (node = nodes[idx++]) {
			upgrade(node);
		}

		// Call startup() on top level nodes.  Since I don't know which nodes are top level,
		// just call startup on all widget nodes.  Most of the calls will be ignored since the nodes
		// have already been started.
		idx = 0;
		while (node = nodes[idx++]) {
			if (node.startup) {
				node.startup();
			}
		}

	}

	// Setup return value as register() method, with other methods hung off it.
	register.upgrade = upgrade;
	register.createElement = createElement;
	register.parse = parse;

	// Add helpers from dcl for declaring classes.
	register.dcl = dcl;
	register.after = dcl.after;
	register.before = dcl.before;
	register.around = dcl.around;

	return register;
});
