define([
	"dojo/_base/declare",
	"dojo/_base/window",
	"dojo/dom-construct",
	"../Contained",
	"../Widget",
	"dojo/has",
	"dojo/has!dojo-bidi?dui/mobile/bidi/RoundRectCategory"
], function(declare, win, domConstruct, Contained, Widget, has, BidiRoundRectCategory){

	// module:
	//		dui/mobile/RoundRectCategory

	var RoundRectCategory = declare(has("dojo-bidi") ? "dui.mobile.NonBidiRoundRectCategory" : "dui.mobile.RoundRectCategory", [Widget, Contained], {
		// summary:
		//		A category header for a rounded rectangle list.

		// label: String
		//		A label of the category. If the label is not specified,
		//		innerHTML is used as a label.
		label: "",

		// tag: String
		//		A name of html tag to create as domNode.
		tag: "h2",

		/* internal properties */	
		
		// baseClass: String
		//		The name of the CSS class of this widget.
		baseClass: "duiRoundRectCategory",

		buildRendering: function(){
			var domNode = this.domNode = this.containerNode = this.srcNodeRef || domConstruct.create(this.tag);
			this.inherited(arguments);
			if(!this.label && domNode.childNodes.length === 1 && domNode.firstChild.nodeType === 3){
				// if it has only one text node, regard it as a label
				this.label = domNode.firstChild.nodeValue;
			}
		},

		_setLabelAttr: function(/*String*/label){
			// summary:
			//		Sets the category header text.
			// tags:
			//		private
			this.label = label;
			this.domNode.innerHTML = label;
		}
	});

	return has("dojo-bidi") ? declare("dui.mobile.RoundRectCategory", [RoundRectCategory, BidiRoundRectCategory]) : RoundRectCategory;	
});
