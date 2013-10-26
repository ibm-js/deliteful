define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/dom-construct",
	"dojo/on",
	"../Widget",
	"dui/form/_FormValueMixin",
	"dui/form/_TextBoxMixin",
	"dojo/has",
	"dojo/has!dojo-bidi?dui/mobile/bidi/TextBox"
], function(declare, lang, domConstruct, on, Widget, FormValueMixin, TextBoxMixin, has, BidiTextBox){

	var TextBox = declare(has("dojo-bidi") ? "dui.mobile.NonBidiTextBox" : "dui.mobile.TextBox", [Widget, FormValueMixin, TextBoxMixin],{
		// summary:
		//		A non-templated base class for textbox form inputs

		baseClass: "duiTextBox",

		// Override automatic assigning type --> node, it causes exception on IE8.
		// Instead, type must be specified as this.type when the node is created, as part of the original DOM
		_setTypeAttr: null,

		// Map widget attributes to DOMNode attributes.
		_setPlaceHolderAttr: function(/*String*/value){
			this._set("placeHolder", value);
			this.textbox.setAttribute("placeholder", value);
		},

		buildRendering: function(){
			if(!this.srcNodeRef){
				this.srcNodeRef = domConstruct.create("input", {"type":this.type});
			}
			this.inherited(arguments);
			this.textbox = this.focusNode = this.domNode;
		},

		postCreate: function(){
			this.inherited(arguments);
			this.own(on(this.textbox, "mouseup", lang.hitch(this, function(){ this._mouseIsDown = false; })));
			this.own(on(this.textbox, "mousedown", lang.hitch(this, function(){ this._mouseIsDown = true; })));
			this.own(on(this.textbox, "focus", lang.hitch(this, function(e){
				this._onFocus(this._mouseIsDown ? "mouse" : e);
				this._mouseIsDown = false;
			})));
			this.own(on(this.textbox, "blur", lang.hitch(this, "_onBlur")));
		}
	});
	return has("dojo-bidi") ? declare("dui.mobile.TextBox", [TextBox, BidiTextBox]) : TextBox;	
});
