define([
	"dojo/_base/array", // forEach()
	"dojo/aspect", // after()
	"dojo/_base/declare", // declare()
	"dojo/_base/lang",	// hitch()
	"dojo/parser" // parse()
], function(array, aspect, declare, lang, parser){

	// module:
	//		dijit/_WidgetsInTemplateMixin

	return declare("dijit._WidgetsInTemplateMixin", null, {
		// summary:
		//		Mixin to supplement _TemplatedMixin when template contains widgets

		// contextRequire: Function
		//		Used to provide a context require to the dojo/parser in order to be
		//		able to use relative MIDs (e.g. `./Widget`) in the widget's template.
		contextRequire: null,

		_beforeFillContent: function(){
			// Before copying over content, instantiate widgets in template
			var node = this.domNode;

			if(this.containerNode && !this.searchContainerNode){
				// Tell parse call below not to look for widgets inside of this.containerNode
				this.containerNode.stopParser = true;
			}

			parser.parse(node, {
				template: true,
				inherited: {dir: this.dir, lang: this.lang, textDir: this.textDir},
				propsThis: this,	// so data-dojo-props of widgets in the template can reference "this" to refer to me
				contextRequire: this.contextRequire
			}).then(lang.hitch(this, function(widgets){
				this._startupWidgets = widgets;

				// _WidgetBase::destroy() will destroy any supporting widgets under this.domNode.
				// If we wanted to, we could call this.own() on anything in this._startupWidgets that was moved outside
				// of this.domNode (like Dialog, which is moved to <body>).

				// Hook up attach points and events for nodes that were converted to widgets
				for(var i = 0; i < widgets.length; i++){
					this._processTemplateNode(widgets[i], function(n,p){
						// callback to get a property of a widget
						return n[p];
					}, function(widget, type, callback){
						// callback to do data-dojo-attach-event to a widget
						return widget.on(type, callback, true);
					});
				}

				// Cleanup flag set above, just in case
				if(this.containerNode && this.containerNode.stopParser){
					delete this.containerNode.stopParser;
				}
			}));

			if(!this._startupWidgets){
				throw new Error(this.declaredClass + ": parser returned unfilled promise (probably waiting for module auto-load), " +
					"unsupported by _WidgetsInTemplateMixin.   Must pre-load all supporting widgets before instantiation.");
			}
		},

		_processTemplateNode: function(/*DOMNode|Widget*/ baseNode, getAttrFunc, attachFunc){
			// Override _AttachMixin._processNode to skip DOMNodes with data-dojo-type set.   They are handled separately
			// in the _beforeFillContent() code above.

			if(baseNode.hasAttribute && baseNode.hasAttribute("data-dojo-type")){
				return true;
			}

			return this.inherited(arguments);
		},

		startup: function(){
			array.forEach(this._startupWidgets, function(w){
				if(w && !w._started && w.startup){
					w.startup();
				}
			});
			this._startupWidgets = null;
			this.inherited(arguments);
		}
	});
});
