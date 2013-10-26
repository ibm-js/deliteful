define([
	"dojo/_base/declare",
	"../Contained",
	"../Container",
	"../Widget"
], function(declare, Contained, Container, Widget){

	// module:
	//		dui/mobile/_PickerBase

	return declare("dui.mobile._PickerBase", [Widget, Container, Contained], {
		// summary:
		//		A base class for picker classes (e.g. SpinWheel, ValuePicker).

		/*=====
		// values: Array
		//		An array of slot values.
		//		Warning: Do not use this property directly, make sure to call set() or get() methods.
		values: "",
		=====*/
		
		/*=====
		// colors: Array
		//		An array of slot colors.
		//		Warning: Do not use this property directly, make sure to call set() or get() methods.
		colors: "",
		=====*/
		
		/* internal properties */

		// slotClasses: [protected] Array
		//		An array of slot classes. This property is intended to be used
		//		when you create a subclass of this widget that has specific slots.
		slotClasses: [],

		// slotProps: [protected] Array
		//		An array of property objects for each slot class specified in
		//		slotClasses. This property is intended to be used when you
		//		create a subclass of this widget that has specific slots.
		slotProps: [],

		// slotOrder: [protected] Array
		//		An array of index of slotClasses and slotProps.
		//		If there are three slots and slotOrder=[2,1,0], the slots are
		//		displayed in reversed order. This property is intended to be used
		//		when you create a subclass of this widget that has specific slots.
		slotOrder: [],

		buildRendering: function(){
			this.inherited(arguments);
			this.slots = [];
			for(var i = 0; i < this.slotClasses.length; i++){
				var idx = this.slotOrder.length ? this.slotOrder[i] : i;
				var slot = new this.slotClasses[idx](this.slotProps[idx]);
				this.addChild(slot);
				this.slots[idx] = slot;
			}
		},

		startup: function(){
			if(this._started){ return; }
			this._duringStartup = true;
			this.inherited(arguments);
			this.reset();
			delete this._duringStartup;
		},

		getSlots: function(){
			// summary:
			//		Returns an array of child slot widgets.
			return this.slots.length ? this.slots :
				this.getChildren().filter(function(c){
					return c.declaredClass.indexOf("Slot") !== -1;
				});
		},

		_getValuesAttr: function(){
			// summary:
			//		Returns an array of slot values.
			// tags:
			//		private
			return this.getSlots().map(function(w){
				return w.get("value");
			});
		},

		_setValuesAttr: function(/*Array*/a){
			// summary:
			//		Sets the slot values.
			// tags:
			//		private
			this.getSlots().forEach(function(w, i){
				w.set("value", a[i]);
			});
		},

		_setColorsAttr: function(/*Array*/a){
			// summary:
			//		Sets the slot colors.
			// tags:
			//		private
			this.getSlots().forEach(function(w, i){
				w.setColor && w.setColor(a[i]);
			});
		},

		reset: function(){
			// summary:
			//		Resets the picker to show the initial values.
			this.getSlots().forEach(function(w){
				w.setInitialValue();
			});
		}
	});
});
