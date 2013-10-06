define([
	"dojo/_base/array", // array.forEach
	"dojo/dom-attr", // domAttr.set
	"dojo/dom-style", // domStyle.get
	"dojo/_base/lang", // lang.hitch lang.isArray
	"dojo/mouse", // mouse.isLeft
	"dojo/on",
	"dojo/sniff", // has("webkit")
	"dojo/window", // winUtils.scrollIntoView
	"./a11y",    // a11y.hasDefaultTabStop
	"./register"
], function(array, domAttr, domStyle, lang, mouse, on, has, winUtils, a11y, register){

	// module:
	//		dui/form/_FormWidgetMixin

	return register("dui-formwidget-mixin", null, {
		// summary:
		//		Mixin for widgets corresponding to native HTML elements such as `<checkbox>` or `<button>`,
		//		which can be children of a `<form>` node or a `dui/form/Form` widget.
		//
		// description:
		//		Represents a single HTML element.
		//		All these widgets should have these attributes just like native HTML input elements.
		//		You can set them during widget construction or afterwards, via `dui/_WidgetBase.set()`.
		//
		//		They also share some common methods.

		// name: [const] String
		//		Name used when submitting form; same as "name" attribute or plain HTML elements
		name: "",

		// alt: String
		//		Corresponds to the native HTML `<input>` element's attribute.
		alt: "",

		// value: String
		//		Corresponds to the native HTML `<input>` element's attribute.
		value: "",

		// type: [const] String
		//		Corresponds to the native HTML `<input>` element's attribute.
		type: "text",

		// type: String
		//		Apply aria-label in markup to the widget's focusNode
		"aria-label": "focusNode",

		// tabIndex: String
		//		Order fields are traversed when user hits the tab key
		tabIndex: "0",
		_setTabIndexAttr: "focusNode", // force copy even when tabIndex default value, needed since Button is <span>

		// disabled: Boolean
		//		Should this widget respond to user input?
		//		In markup, this is specified as "disabled='disabled'", or just "disabled".
		disabled: false,

		// scrollOnFocus: Boolean
		//		On focus, should this widget scroll into view?
		scrollOnFocus: true,

		// Override _WidgetBase mapping id to this.domNode, needs to be on focusNode so <label> etc.
		// works with screen reader
		_setIdAttr: "focusNode",

		// TODO: trim or remove this function
		_setDisabledAttr: function(/*Boolean*/ value){
			this._set("disabled", value);
			this.runAfterRender(function(){
				domAttr.set(this.focusNode, 'disabled', value);
				if(this.valueNode){
					domAttr.set(this.valueNode, 'disabled', value);
				}
				this.focusNode.setAttribute("aria-disabled", value ? "true" : "false");

				if(value){
					// reset these, because after the domNode is disabled, we can no longer receive
					// mouse related events, see #4200
					this._set("hovering", false);
					this._set("active", false);

					// clear tab stop(s) on this widget's focusable node(s)  (ComboBox has two focusable nodes)
					var attachPointNames = this.focusNode ? ["focusNode"] : [];
					array.forEach(lang.isArray(attachPointNames) ? attachPointNames : [attachPointNames], function(attachPointName){
						var node = this[attachPointName];
						// complex code because tabIndex=-1 on a <div> doesn't work on FF
						if(has("webkit") || a11y.hasDefaultTabStop(node)){    // see #11064 about webkit bug
							node.setAttribute('tabIndex', "-1");
						}else{
							node.removeAttribute('tabIndex');
						}
					}, this);
				}else{
					if(this.tabIndex != ""){
						this.set('tabIndex', this.tabIndex);
					}
				}
			});
		},

		_onFocus: function(/*String*/ by){
			if(this.scrollOnFocus){
				this.defer(function(){
					winUtils.scrollIntoView(this.domNode);
				}); // without defer, the input caret position can change on mouse click
			}
			this.inherited(arguments);
		},

		isFocusable: function(){
			// summary:
			//		Tells if this widget is focusable or not.  Used internally by dui.
			// tags:
			//		protected
			return !this.disabled && this.focusNode && (domStyle.get(this.domNode, "display") != "none");
		},

		focus: function(){
			// summary:
			//		Put focus on this widget
			if(!this.disabled && this.focusNode.focus){
				try{
					this.focusNode.focus();
				}catch(e){
					// squelch errors from hidden nodes
				}
			}
		}
	});
});
