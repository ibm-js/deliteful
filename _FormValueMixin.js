define([
	"dojo/_base/declare", // declare
	"dojo/dom-attr" // domAttr.set
], function(declare, domAttr){

	// module:
	//		dui/_FormValueMixin

	return declare("dui.form._FormValueMixin", null, {
		// summary:
		//		Mixin for widgets corresponding to native HTML elements such as `<input>` or `<select>`
		//		that have user changeable values.
		// description:
		//		Each _FormValueMixin represents a single input value, and has a (possibly hidden) `<input>` element,
		//		to which it serializes it's input value, so that form submission (either normal submission or via FormBind?)
		//		works as expected.
		//		After an onBlur event, onChange fires if the serialized widget value has changed from value at the time of onFocus.

		// readOnly: Boolean
		//		Should this widget respond to user input?
		//		In markup, this is specified as "readOnly".
		//		Similar to disabled except readOnly form values are submitted.
		readOnly: false,

		_setReadOnlyAttr: function(/*Boolean*/ value){
			domAttr.set(this.focusNode, 'readOnly', value);
			this._set("readOnly", value);
		},

		// previousOnChangeValue: anything
		//		The last value fired to onChange.
		previousOnChangeValue: undefined,

		set: function(/*String*/ name, /*anything*/ newValue, /*Boolean?*/ priorityChange){
			// summary:
			//		Called when the value of the widget is set.  Calls onChange() if appropriate
			// newValue:
			//		the new value
			// priorityChange:
			//		For a slider, for example, dragging the slider is priorityChange==false,
			//		but on mouse up, it's priorityChange==true.
			//		onChange is only called when priorityChange=true.
			// tags:
			//		private

			if(priorityChange != null){
				this._lastValueAttr = name;
				if(this.previousOnChangeValue === undefined){
					this.previousOnChangeValue = this[name];
				}
			}else if(name == this._lastValueAttr){
				this.previousOnChangeValue = undefined;
			}

			this.inherited(arguments);

			if(priorityChange === true){
				if(this.previousOnChangeValue !== newValue){
					this.previousOnChangeValue = newValue;
					if(this._onChangeHandle){
						this._onChangeHandle.remove();
					}
					// defer allows hidden value processing to run and
					// also the onChange handler can safely adjust focus, etc
					this._onChangeHandle = this.defer(
						function(){
							this._onChangeHandle = null;
							this.onChange(newValue);
						}
					); // try to collapse multiple onChange's fired faster than can be processed
				}
			}
		}
	});
});
