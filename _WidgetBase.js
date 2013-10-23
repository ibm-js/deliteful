define([
	"require", // require.toUrl
	"dcl/dcl",
	"dojo/aspect",
	"dojo/_base/config", // config.blankGif
	"dojo/Deferred",
	"dojo/dom", // dom.byId
	"dojo/dom-attr", // domAttr.set domAttr.remove
	"dojo/dom-class", // domClass.add domClass.replace
	"dojo/dom-construct", // domConstruct.destroy domConstruct.place
	"dojo/dom-geometry", // isBodyLtr
	"dojo/dom-style", // domStyle.set, domStyle.get
	"dojo/has",
	"dojo/_base/kernel",
	"dojo/_base/lang", // mixin(), isArray(), etc.
	"dojo/on",
	"dojo/_base/window", // win.body()
	"./Destroyable",
	"./Stateful",
	"./register",
	"dojo/has!dojo-bidi?./_BidiMixin"
], function (require, dcl, aspect, config, Deferred,
			dom, domAttr, domClass, domConstruct, domGeometry, domStyle, has, kernel,
			lang, on, win, Destroyable, Stateful, register, _BidiMixin) {

	// module:
	//		dui/_WidgetBase

	// Flag to enable support for textdir attribute
	has.add("dojo-bidi", false);


	// Nested hash listing attributes for each tag, all strings in lowercase.
	// ex: {"div": {"style": true, "tabindex" true}, "form": { ...
	/*
	var tagAttrs = {};

	function getAttrs(obj) {
		var ret = {};
		for (var attr in obj) {
			ret[attr.toLowerCase()] = true;
		}
		return ret;
	}

	function nonEmptyAttrToDom(attr) {
		// summary:
		//		Returns a setter function that sets the attribute on the root DOM node,
		//		or removes the attribute, depending on whether the
		//		value is defined or not.
		return function (val) {
			domAttr[val ? "set" : "remove"](this, attr, val);
			this._set(attr, val);
		};
	}
	*/

	function genSetter(/*String*/ attr, /*Object*/ commands) {
		// summary:
		//		Return setter for a widget property, often mapping the property to a
		//		DOMNode attribute, innerHTML, or innerText.
		//		Note some attributes like "type" cannot be processed this way as they are not mutable.
		// attr:
		//		Name of widget property, ex: "label"
		// commands:
		//		A single command or array of commands.  A command is:
		//
		//			- null to indicate a plain setter that just saves the value and notifies listeners
		//				registered with watch()
		//			- a string like "focusNode" to set this.focusNode[attr]
		//			- an object like {node: "labelNode", type: "attribute", attribute: "role" } to set
		//				this.labelNode.role
		//			- an object like {node: "focusNode", type: "class" } to set this.focusNode.className
		//			- an object like {node: "labelNode", type: "innerHTML" } to set this.labelNode.innerHTML
		//			- an object like {node: "labelNode", type: "innerText" } to set this.labelNode.innerText
		//
		//		If an object doesn't specify a node, it maps to the root node.

		function genSimpleSetter(command) {
			// Setup mapNode(this) method that returns the node to map to.  Does late resolution, i.e. doesn't
			// lookup this.focusNode until it's called.
			var mapNodeName = command.node || (command && typeof command === "string" ? command : "domNode"),
				mapNode = mapNodeName === "domNode" ? function (x) { return x; } :
					function (x) { return x[mapNodeName]; };
			switch (command.type) {
				case "innerText":
					return function (value) {
						mapNode(this).innerHTML = "";
						mapNode(this).appendChild(this.ownerDocument.createTextNode(value));
						this._set(attr, value);
					};
				case "innerHTML":
					return function (value) {
						mapNode(this).innerHTML = value;
						this._set(attr, value);
					};
				case "class":
					return function (value) {
						domClass.replace(mapNode(this), value, this[attr]);
						this._set(attr, value);
					};
				default:
					// Map to DOMNode property.   DOMNode is possibly a widget.
					var attrName = command.attribute || attr;
					return function (value) {
						if (typeof value === "function") { // functions execute in the context of the widget
							value = lang.hitch(this, value);
						}
						mapNode(this)[attrName] = value;
						this._set(attr, value);
					};
			}
		}

		if (commands instanceof Array) {
			// Unusual case where there's a list of commands, ex: _setFooAttr: ["focusNode", "domNode"].
			var setters = commands.map(genSimpleSetter);
			return function (value) {
				setters.forEach(function (setter) {
					setter.call(this, value);
				}, this);
			};
		} else {
			return genSimpleSetter(commands);
		}
	}

	var _widgetTypeCtr = {};
	function getUniqueId(/*String*/ tag) {
		// summary:
		//		Generates a unique id for a given widget type.
		//		Note: doesn't work for multi-document case.

		var id;
		do {
			id = tag + "-" +
				(tag in _widgetTypeCtr ?
					++_widgetTypeCtr[tag] : _widgetTypeCtr[tag] = 0);
		} while (dom.byId(tag));
		return id; // String
	}

	var _WidgetBase = dcl([Stateful, Destroyable], {
		// summary:
		//		Base class for all widgets.
		//
		//		Provides stubs for widget lifecycle methods for subclasses to extend, like  buildRendering(),
		//		postCreate(), startup(), and destroy(), and also public API methods like watch().
		//
		//		Widgets can provide custom setters/getters for widget attributes, which are called automatically
		//		by set(name, value).  For an attribute XXX, define methods _setXXXAttr() and/or _getXXXAttr().
		//
		//		_setXXXAttr can also be a string/hash/array mapping from a widget attribute XXX to the
		//		widget's DOMNodes:
		//
		//		- DOM node attribute
		// |		_setFocusAttr: {node: "focusNode", type: "attribute"}
		// |		_setFocusAttr: "focusNode"	(shorthand)
		// |		_setFocusAttr: ""		(shorthand, maps to root node)
		//		Maps this.focus to this.focusNode.focus, or (last example) to widget root node.
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
		// |		_setMyClassAttr: { node: "labelNode", type: "class" }
		//		Maps this.myClass to this.labelNode.className
		//
		//		If the value of _setXXXAttr is an array, then each element in the array matches one of the
		//		formats of the above list.

		// baseClass: [protected] String
		//		Root CSS class of the widget (ex: duiTextBox), used to construct CSS classes to indicate
		//		widget state.
		baseClass: "",

		// focused: [readonly] Boolean
		//		This widget or a widget it contains has focus, or is "active" because
		//		it was recently clicked.
		focused: false,

/*=====
		// containerNode: [readonly] DomNode
		//		Designates where children of the source DOM node will be placed.
		//		"Children" in this case refers to both DOM nodes and widgets.
		//		For example, for myWidget:
		//
		//		|	<div data-dojo-type=myWidget>
		//		|		<b> here's a plain DOM node
		//		|		<span data-dojo-type=subWidget>and a widget</span>
		//		|		<i> and another plain DOM node </i>
		//		|	</div>
		//
		//		containerNode would point to:
		//
		//		|		<b> here's a plain DOM node
		//		|		<span data-dojo-type=subWidget>and a widget</span>
		//		|		<i> and another plain DOM node </i>
		//
		//		In templated widgets, "containerNode" is set via a
		//		data-dojo-attach-point assignment.
		//
		//		containerNode must be defined for any widget that accepts innerHTML
		//		(like ContentPane or BorderContainer or even Button), and conversely
		//		is null for widgets that don't, like TextBox.
		containerNode: null,

		// _started: [readonly] Boolean
		//		startup() has completed.
		_started: false,
=====*/

		// _blankGif: [protected] String
		//		Path to a blank 1x1 image.
		//		Used by `<img>` nodes in templates that really get their image via CSS background-image.
		_blankGif: config.blankGif || require.toUrl("dojo/resources/blank.gif"),

		// register: dui/register
		//		Convenience pointer to register class.   Used by buildRendering() functions produced from
		//		handlebars! / template.
		register: register,

		_getProps: function () {
			// override _Stateful._getProps() to ignore properties from the HTML*Element superclasses

			var list = [], proto = this, ctor;

			do {
				Object.keys(proto).forEach(function(prop){
					if(typeof proto[prop] != "function" && !/^_/.test(prop)){
						list.push(prop);
					}
				});

				proto = Object.getPrototypeOf(proto);
				ctor = proto && proto.constructor;
			} while(proto && !/HTML[a-zA-Z]*Element/.test(ctor.name || ctor.toString()));

			return list;
		},

		_introspect: function (/*String[]*/ props) {
			// Various introspection to be done on my prototype.
			// "this" refers to my prototype.

			var pcm = this._propCaseMap = {},
				onmap = this._onMapHash = {};

			// Setup mapping from lowercase property name to actual name, ex: iconclass --> iconClass.
			// Doesn't handle attribute names with dashes.
			// This is the list of properties returned from getProp(); it intentionally doesn't
			// include props like "style" that are merely inherited from HTMLElement.   You would need to
			// explicitly declare style: "" in your widget to get it here.
			props.forEach(function(key){
				pcm[key.toLowerCase()] = key;
			});

			// Legacy stuff.  Revisit later to see if we really need this.
			for(var key in this){
				// on mapping, ex: click --> onClick
				if (/^on/.test(key)) {
					onmap[key.substr(2).toLowerCase()] = key;
				}

				// Convert shorthand notations like _setAltAttr: "focusNode" into real functions.
				if(/^_set[A-Z](.*)Attr$/.test(key) && typeof this[key] !== "function"){
					this[key] = genSetter(key.charAt(4).toLowerCase() + key.substr(5, key.length - 9), this[key]);
				}
			}
		},

		//////////// INITIALIZATION METHODS ///////////////////////////////////////

		createdCallback: function () {
			// summary:
			//		Kick off the life-cycle of a widget
			// description:
			//		Create calls a number of widget methods (buildRendering, postCreate,
			//		etc.), some of which of you'll want to override.
			//		See http://dojotoolkit.org/reference-guide/dui/_WidgetBase.html
			//		for a discussion of the widget creation lifecycle.
			//
			//		Of course, adventurous developers could override create entirely, but this should
			//		only be done as a last resort.
			// params: Object|null
			//		Hash of initialization parameters for widget, including scalar values (like title, duration etc.)
			//		and functions, typically callbacks like onClick.
			//		The hash can contain any of the widget's properties, excluding read-only properties.
			// tags:
			//		private

			// Get parameters that were specified declaratively on the widget DOMNode.
			var params = this.mapAttributes();

			this.preCreate();

			// Render the widget
			this.buildRendering();

			this.postCreate();

			this._created = true;

			// data-dojo-id specifies that a global variable should be created to point to this widget
			if (this.hasAttribute("data-dojo-id")) {
				window[this.getAttribute("data-dojo-id")] = this;
			}

			// Now that creation has finished, apply parameters that were specified declaratively.
			// This is consistent with the timing that parameters are applied for programmatic creation.
			dcl.mix(this, params);
		},

		/**
		 * Get declaratively specified attributes to widget properties
		 */
		mapAttributes: function () {
			var pcm = this._propCaseMap,
				attr,
				idx = 0,
				props = {};

			// inner functions useful to reduce cyclomatic complexity when using jshint
			function stringToObject(value) {
				var obj;

				try {
					/* jshint evil:true */
					// This is only called when complex parameters are used in markup, ex: constraints="max: 3, min: 2"
					// TODO: remove this code if it isn't being used, so we don't scare people that are afraid of eval.
					obj = eval("(" + (value[0] === "{" ? "" : "{") + value + (value[0] === "{" ? "" : "}") + ")");
				}
				catch (e) {
					throw new SyntaxError('Error in attribute conversion to object: ' + e.message + '\nAttribute Value: "' +
						value + '"');
				}
				return obj;
			}
			function setTypedValue(widget, name, value) {
				switch (typeof widget[name]) {
					case "string":
						props[name] = value;
						break;
					case "number":
						props[name] = value - 0;
						break;
					case "boolean":
						props[name] = value !== "false";
						break;
					case "object":
						props[name] = (widget[name] instanceof Array)
							? (value
								? value.split(/\s+/)
								: [])
							: stringToObject(value);
						break;
					case "function":
						/* jshint evil:true */
						props[name] = lang.getObject(value, false) || new Function(value);
				}
			}

			while ((attr = this.attributes[idx++])) {
				var name = attr.name.toLowerCase();	// note: will be lower case already except for IE9
				if (name in pcm) {
					setTypedValue(this, pcm[name]/* convert to correct case for widget */, attr.value);
				}
			}
			return props;
		},

		preCreate: function () {
			// summary:
			//		Processing before buildRendering()
			// tags:
			//		protected

			// FF has a native watch() method that overrides our Stateful.watch() method and breaks custom setters,
			// so that any command like this.label = "hello" sets label to undefined instead.  Try to workaround.
			this.watch = Stateful.prototype.watch;
		},

		buildRendering: dcl.after(function () {
			// summary:
			//		Construct the UI for this widget, filling in subnodes and/or text inside of this.
			//		Most widgets will leverage dui/handlebars! to implement this method.
			// tags:
			//		protected

			// baseClass is a single class name or occasionally a space-separated list of names.
			// Add those classes to the DOMNode.  If RTL mode then also add with Rtl suffix.
			// TODO: baseClass no longer needed?   just use tag name itself, right?
			if (this.baseClass) {
				var classes = this.baseClass.split(" ");
				if (!this.isLeftToRight()) {
					classes = classes.concat(classes.map(function (name) {
						return name + "Rtl";
					}));
				}
				domClass.add(this, classes);
			}
		}),

		postCreate: function () {
			// summary:
			//		Processing after the DOM fragment is created
			// description:
			//		Called after the DOM fragment has been created, but not necessarily
			//		added to the document.  Do not include any operations which rely on
			//		node dimensions or placement.
			// tags:
			//		protected
		},

		startup: function () {
			// summary:
			//		Processing after the DOM fragment is added to the document
			// description:
			//		Called after a widget and its children have been created and added to the page,
			//		and all related widgets have finished their create() cycle, up through postCreate().
			//
			//		Note that startup() may be called while the widget is still hidden, for example if the widget is
			//		inside a hidden dui/Dialog or an unselected tab of a dui/layout/TabContainer.
			//		For widgets that need to do layout, it's best to put that layout code inside resize(), and then
			//		extend dui/layout/_LayoutWidget so that resize() is called when the widget is visible.
			if (this._started) {
				return;
			}

			// Generate an id for the widget if one wasn't specified, or it was specified as id: undefined.
			// Used by focus.js etc.
			// TODO: this will be problematic for form widgets that want to put the id on the nested <input>
			if (!this.id) {
				this.id = getUniqueId(this.nodeName.toLowerCase());
			}

			// TODO: Maybe startup() should call enteredViewCallback.

			this._started = true;
			this.getChildren().forEach(function (obj) {
				if (!obj._started && !obj._destroyed && lang.isFunction(obj.startup)) {
					obj.startup();
					obj._started = true;
				}
			});
		},

		//////////// DESTROY FUNCTIONS ////////////////////////////////
		destroy: function (/*Boolean*/ preserveDom) {
			// summary:
			//		Destroy this widget and its descendants.
			// preserveDom: Boolean
			//		If true, this method will leave the original DOM structure alone.

			this._beingDestroyed = true;

			// Destroy child widgets
			this.findWidgets(this).forEach(function (w) {
				if (w.destroy) {
					w.destroy();
				}
			});

			// Destroy this widget
			this.destroyRendering(preserveDom);
			this._destroyed = true;
		},

		destroyRendering: function (/*Boolean?*/ preserveDom) {
			// summary:
			//		Destroys the DOM nodes associated with this widget.
			// preserveDom:
			//		If true, this method will leave the original DOM structure alone
			//		during tear-down. Note: this will not work with _Templated
			//		widgets yet.
			// tags:
			//		protected

			if (this.bgIframe) {
				this.bgIframe.destroy(preserveDom);
				delete this.bgIframe;
			}

			if (!preserveDom) {
				domConstruct.destroy(this);
			}
		},

		emit: function (/*String*/ type, /*Object?*/ eventObj, /*Array?*/ callbackArgs) {
			// summary:
			//		Used by widgets to signal that a synthetic event occurred, ex:
			//	|	myWidget.emit("attrmodified-selectedChildWidget", {}).
			//
			//		Emits an event of specified type, based on eventObj.
			//		Also calls onType() method, if present, and returns value from that method.
			//		By default passes eventObj to callback, but will pass callbackArgs instead, if specified.
			//		Modifies eventObj by adding missing parameters (bubbles, cancelable, widget).
			// tags:
			//		protected

			// Specify fallback values for bubbles, cancelable in case they are not set in eventObj.
			// Also set pointer to widget, although since we can't add a pointer to the widget for native events
			// (see #14729), maybe we shouldn't do it here?
			eventObj = eventObj || {};
			if (eventObj.bubbles === undefined) {
				eventObj.bubbles = true;
			}
			if (eventObj.cancelable === undefined) {
				eventObj.cancelable = true;
			}
			if (!eventObj.detail) {
				eventObj.detail = {};
			}
			eventObj.detail.widget = this;

			// Call onType() method.   TODO: remove this for 2.0?  In general we won't have such methods anymore.
			// See on() method below, which has the same code.
			var ret, callback = this["on" + type];
			if (callback) {
				ret = callback.apply(this, callbackArgs ? callbackArgs : [eventObj]);
			}

			// Emit event, but avoid spurious emit()'s as parent sets properties on child during startup/destroy
			if (this._started && !this._beingDestroyed) {
				// TODO: won't this cause an infinite loop? dojo/on.emit() will presumably delgate to this func.
				on.emit(this, type, eventObj);
			}

			return ret;
		},

		on: function (/*String|Function*/ type, /*Function*/ func) {
			// summary:
			//		Call specified function when event occurs, ex: myWidget.on("click", function () { ... }).
			// type:
			//		Name of event (ex: "click") or extension event like touch.press.
			// description:
			//		Call specified function when event `type` occurs, ex: `myWidget.on("click", function () { ... })`.
			//		Note that the function is not run in any particular scope, so if (for example) you want it to run
			//		in the widget's scope you must do `myWidget.on("click", lang.hitch(myWidget, func))`.

			// For backwards compatibility, if there's an onType() method in the widget then connect to that.
			// Remove in 2.0.
			var widgetMethod = this._onMapHash[typeof type === "string" && type.toLowerCase()];
			if (widgetMethod) {
				return aspect.after(this, widgetMethod, func, true);
			}

			// Otherwise, just listen for the event on the widget's root node.
			return this.own(on(this, type, func))[0];
		},

		toString: function () {
			// summary:
			//		Returns a string that represents the widget.
			// description:
			//		When a widget is cast to a string, this method will be used to generate the
			//		output. Currently, it does not implement any sort of reversible
			//		serialization.
			return "[Widget " + this.nodeName.toLowerCase() + ", " + (this.id || "NO ID") + "]"; // String
		},

		getChildren: function () {
			// summary:
			//		Returns all direct children of this widget, i.e. all widgets or DOM node underneath
			//		this.containerNode whose parent is this widget.  Note that it does not return all
			//		descendants, but rather just direct children.
			//
			//		The result intentionally excludes internally created widgets (a.k.a. supporting widgets)
			//		outside of this.containerNode.

			// use Array.prototype.slice to transform the live HTMLCollection into an Array
			return this.containerNode ? Array.prototype.slice.call(this.containerNode.children) : []; // []
		},

		getParent: function () {
			// summary:
			//		Returns the parent widget of this widget.

			return this.getEnclosingWidget(this.parentNode);
		},

		isLeftToRight: function () {
			// summary:
			//		Return this widget's explicit or implicit orientation (true for LTR, false for RTL)
			// tags:
			//		protected
			return this.dir ? (this.dir === "ltr") : domGeometry.isBodyLtr(this.ownerDocument); //Boolean
		},

		isFocusable: function () {
			// summary:
			//		Return true if this widget can currently be focused
			//		and false if not
			return this.focus && (domStyle.get(this, "display") !== "none");
		},

		placeAt: function (/* String|DomNode|_WidgetBase */ reference, /* String|Int? */ position) {
			// summary:
			//		Place this widget somewhere in the DOM based
			//		on standard domConstruct.place() conventions.
			// description:
			//		A convenience function provided in all _Widgets, providing a simple
			//		shorthand mechanism to put an existing (or newly created) Widget
			//		somewhere in the dom, and allow chaining.
			// reference:
			//		Widget, DOMNode, or id of widget or DOMNode
			// position:
			//		If reference is a widget (or id of widget), and that widget has an ".addChild" method,
			//		it will be called passing this widget instance into that method, supplying the optional
			//		position index passed.  In this case position (if specified) should be an integer.
			//
			//		If reference is a DOMNode (or id matching a DOMNode but not a widget),
			//		the position argument can be a numeric index or a string
			//		"first", "last", "before", or "after", same as dojo/dom-construct::place().
			// returns: dui/_WidgetBase
			//		Provides a useful return of the newly created dui._Widget instance so you
			//		can "chain" this function by instantiating, placing, then saving the return value
			//		to a variable.
			// example:
			//	|	// create a Button with no srcNodeRef, and place it in the body:
			//	|	var button = new Button({ label:"click" }).placeAt(win.body());
			//	|	// now, 'button' is still the widget reference to the newly created button
			//	|	button.on("click", function (e) { console.log('click'); }));
			// example:
			//	|	// create a button out of a node with id="src" and append it to id="wrapper":
			//	|	var button = new Button({},"src").placeAt("wrapper");
			// example:
			//	|	// place a new button as the first element of some div
			//	|	var button = new Button({ label:"click" }).placeAt("wrapper","first");
			// example:
			//	|	// create a contentpane and add it to a TabContainer
			//	|	var tc = dui.byId("myTabs");
			//	|	new ContentPane({ href:"foo.html", title:"Wow!" }).placeAt(tc)

			reference = dom.byId(reference);

			if (reference && reference.addChild && (!position || typeof position === "number")) {
				// Use addChild() if available because it skips over text nodes and comments.
				reference.addChild(this, position);
			} else {
				// "reference" is a plain DOMNode, or we can't use refWidget.addChild().   Use domConstruct.place() and
				// target refWidget.containerNode for nested placement (position==number, "first", "last", "only"), and
				// refWidget otherwise ("after"/"before"/"replace").
				var ref = reference ?
					(reference.containerNode && !/after|before|replace/.test(position || "") ?
						reference.containerNode : reference) : dom.byId(reference, this.ownerDocument);
				domConstruct.place(this, ref, position);

				// Start this iff it has a parent widget that's already started.
				// TODO: for 2.0 maybe it should also start the widget when this.getParent() returns null??
				if (!this._started && (this.getParent() || {})._started) {
					this.startup();
				}
			}
			return this;
		},

		defer: function (fcn, delay) {
			// summary:
			//		Wrapper to setTimeout to avoid deferred functions executing
			//		after the originating widget has been destroyed.
			//		Returns an object handle with a remove method (that returns null) (replaces clearTimeout).
			// fcn: Function
			//		Function reference.
			// delay: Number?
			//		Delay, defaults to 0.
			// tags:
			//		protected

			var timer = setTimeout(lang.hitch(this,
				function () {
					if (!timer) {
						return;
					}
					timer = null;
					if (!this._destroyed) {
						lang.hitch(this, fcn)();
					}
				}),
				delay || 0
			);
			return {
				remove: function () {
					if (timer) {
						clearTimeout(timer);
						timer = null;
					}
					return null; // so this works well: handle = handle.remove();
				}
			};
		},

		// Utility functions previously in registry.js

		findWidgets: function (root) {
			// summary:
			//		Search subtree under root returning widgets found.
			//		Doesn't search for nested widgets (ie: widgets inside other widgets).
			// root: DOMNode
			//		Node to search under.

			var outAry = [];

			function getChildrenHelper(root) {
				for (var node = root.firstChild; node; node = node.nextSibling) {
					if (node.nodeType === 1 && node.buildRendering) {
						outAry.push(node);
					} else {
						getChildrenHelper(node);
					}
				}
			}

			getChildrenHelper(root || document.body);
			return outAry;
		},

		getEnclosingWidget: function (/*DOMNode*/ node) {
			// summary:
			//		Returns the widget whose DOM tree contains the specified DOMNode, or null if
			//		the node is not contained within the DOM tree of any widget
			do {
				if (node.nodeType === 1 && node.buildRendering) {
					return node;
				}
			} while ((node = node.parentNode));
			return null;
		},

		// Focus related methods.   Used by focus.js and _FocusMixin but listed here
		// so they become part of every widget.
		onFocus: function () {
			// summary:
			//		Called when the widget becomes "active" because
			//		it or a widget inside of it either has focus, or has recently
			//		been clicked.
			// tags:
			//		callback
		},

		onBlur: function () {
			// summary:
			//		Called when the widget stops being "active" because
			//		focus moved to something outside of it, or the user
			//		clicked somewhere outside of it, or the widget was
			//		hidden.
			// tags:
			//		callback
		},

		_onFocus: function () {
			// summary:
			//		This is where widgets do processing for when they are active,
			//		such as changing CSS classes.  See onFocus() for more details.
			// tags:
			//		protected
			this.onFocus();
		},

		_onBlur: function () {
			// summary:
			//		This is where widgets do processing for when they stop being active,
			//		such as changing CSS classes.  See onBlur() for more details.
			// tags:
			//		protected
			this.onBlur();
		}
	});

	if (has("dojo-bidi")) {
		_WidgetBase = dcl(_WidgetBase, _BidiMixin);
	}

	// Setup automatic chaining for lifecycle methods, except for buildRendering()
	dcl.chainAfter(_WidgetBase, "preCreate");
	dcl.chainAfter(_WidgetBase, "postCreate");
	dcl.chainAfter(_WidgetBase, "startup");
	dcl.chainBefore(_WidgetBase, "destroy");

	return _WidgetBase;
});
