define([
	"dojo/_base/array",
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/dom-class",
	"dojo/dom-construct",
	"dojo/on",
	"dijit/_WidgetBase",
	"dijit/form/_ButtonMixin",
	"dijit/form/_FormWidgetMixin",
	"dojo/has",
	"dojo/has!dojo-bidi?dui/mobile/bidi/Button"
	],
	function(array, declare, lang, domClass, domConstruct, on, WidgetBase, ButtonMixin, FormWidgetMixin, has, BidiButton){

	var Button = declare(has("dojo-bidi") ? "dui.mobile.NonBidiButton" : "dui.mobile.Button", [WidgetBase, FormWidgetMixin, ButtonMixin], {
		// summary:
		//		Non-templated BUTTON widget with a thin API wrapper for click 
		//		events and for setting the label.
		//
		//		Buttons can display a label, an icon, or both.
		//		A label should always be specified (through innerHTML) or the label
		//		attribute.  It can be hidden via showLabel=false.
		// example:
		//	|	<button data-dojo-type="dui/mobile/Button" onClick="...">Hello world</button>

		// baseClass: String
		//		The name of the CSS class of this widget.
		baseClass: "duiButton",

		// _setTypeAttr: [private] Function 
		//		Overrides the automatic assignment of type to nodes, because it causes
		//		exception on IE. Instead, the type must be specified as this.type
		//		when the node is created, as part of the original DOM.
		_setTypeAttr: null,

		// duration: Number
		//		The duration of selection, in milliseconds, or -1 for no post-click CSS styling.
		duration: 1000,

		/*=====
		// label: String
		//		The label of the button.
		label: "",
		=====*/
		
		_onClick: function(e){
			// tags:
			//		private
			var ret = this.inherited(arguments);
			if(ret && this.duration >= 0){ // if its not a button with a state, then emulate press styles
				var button = this.focusNode || this.domNode;
				var newStateClasses = (this.baseClass+' '+this["class"]).split(" ");
				newStateClasses = array.map(newStateClasses, function(c){ return c+"Selected"; });
				domClass.add(button, newStateClasses);
				this.defer(function(){
					domClass.remove(button, newStateClasses);
				}, this.duration);
			}
			return ret;
		},

		isFocusable: function(){ 
			// Override of the method of dijit/_WidgetBase.
			return false; 
		},

		buildRendering: function(){
			if(!this.srcNodeRef){
				this.srcNodeRef = domConstruct.create("button", {"type": this.type});
			}
			this.inherited(arguments);
			this.focusNode = this.domNode;
		},

		postCreate: function(){
			this.inherited(arguments);
			this.own(on(this.domNode, "click", lang.hitch(this, "_onClick")));
		},

		_setLabelAttr: function(/*String*/ content){
			// tags:
			//		private
			this.inherited(arguments, [content]);
		}
	});

	return has("dojo-bidi") ? declare("dui.mobile.Button", [Button, BidiButton]) : Button;
});
