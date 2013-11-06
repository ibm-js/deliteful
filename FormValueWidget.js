define([
	"dcl/dcl",
	"dojo/dom-attr", // domAttr.set
	"./FormWidget"
], function (dcl, domAttr, FormWidget) {

	// module:
	//		dui/FormValueWidget

	return dcl(FormWidget, {
		// summary:
		//		Mixin for widgets corresponding to native HTML elements such as `<input>` or `<select>`
		//		that have user changeable values.
		// description:
		//		Each _FormValueMixin represents a single input value, and has a (possibly hidden) `<input>` element,
		//		to which it serializes it's input value, so that form submission
		//		(either normal submission or via FormBind?) works as expected.
		//		After an onBlur event, onChange fires if the serialized widget value has changed from value
		//		at the time of onFocus.

		// intermediateChanges: Boolean
		//		Fires onChange for each value change or only on demand
		intermediateChanges: false,

		// readOnly: Boolean
		//		Should this widget respond to user input?
		//		In markup, this is specified as "readOnly".
		//		Similar to disabled except readOnly form values are submitted.
		readOnly: false,
		_setReadOnlyAttr: function (/*Boolean*/ isReadOnly) {
			this._set("readOnly", isReadOnly);
			if (this.valueNode && this.valueNode !== this) {
				this.valueNode.readOnly = isReadOnly; // inform screen reader
			}
			if (!isReadOnly) {
				this.removeAttribute("readonly");
			}
		},

		// previousOnChangeValue: anything
		//		The last value fired to onChange.
		previousOnChangeValue: undefined,

		compare: function (/*anything*/ val1, /*anything*/ val2) {
			// summary:
			//		Compare 2 values (as returned by get('value') for this widget).
			// tags:
			//		protected
			if (typeof val1 === "number" && typeof val2 === "number") {
				return (isNaN(val1) && isNaN(val2)) ? 0 : val1 - val2;
			} else if (val1 > val2) {
				return 1;
			} else if (val1 < val2) {
				return -1;
			} else {
				return 0;
			}
		},

		_handleOnChange: function (/*anything*/ newValue, /*Boolean?*/ priorityChange) {
			// summary:
			//		Called when the value of the widget is set.  Calls onChange() if appropriate
			// newValue:
			//		the new value
			// priorityChange:
			//		For a slider, for example, dragging the slider is priorityChange==false,
			//		but on mouse up, it's priorityChange==true.  If intermediateChanges==false,
			//		onChange is only called form priorityChange=true events.
			// tags:
			//		private

			this._pendingOnChange = this._pendingOnChange
				|| (typeof newValue !== typeof this.previousOnChangeValue)
				|| (this.compare(newValue, this.previousOnChangeValue) !== 0);
			if ((this.intermediateChanges || priorityChange || priorityChange === undefined) && this._pendingOnChange) {
				this.previousOnChangeValue = newValue;
				this._pendingOnChange = false;
				if (this._onChangeHandle) {
					this._onChangeHandle.remove();
				}
				// defer allows hidden value processing to run and
				// also the onChange handler can safely adjust focus, etc
				this._onChangeHandle = this.defer(
					function () {
						this._onChangeHandle = null;
						this.emit("change");
					}
				); // try to collapse multiple onChange's fired faster than can be processed
			}
		}
	});
});
