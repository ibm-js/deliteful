define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/dom-class",
	"dojo/aspect",
	"./_DatePickerMixin",
	"./SpinWheel",
	"./SpinWheelSlot"
], function(declare, lang, domClass, aspect, DatePickerMixin, SpinWheel, SpinWheelSlot){

	// module:
	//		dui/mobile/SpinWheelDatePicker

	return declare("dui.mobile.SpinWheelDatePicker", [SpinWheel, DatePickerMixin], {
		// summary:
		//		A SpinWheel-based date picker widget.
		// description:
		//		SpinWheelDatePicker is a date picker widget. It is a subclass of
		//		dui/mobile/SpinWheel. It has three slots: year, month, and day.

		slotClasses: [
			SpinWheelSlot,
			SpinWheelSlot,
			SpinWheelSlot
		],

		slotProps: [
			{labelFrom:1970, labelTo:2038},
			{},
			{}
		],

		buildRendering: function(){
			this.initSlots();
			this.inherited(arguments);
			domClass.add(this.domNode, "duiSpinWheelDatePicker");
			this._conn = [
				this.own(aspect.after(this.slots[0], "onFlickAnimationEnd", lang.hitch(this, "_onYearSet")))[0],
				this.own(aspect.after(this.slots[1], "onFlickAnimationEnd", lang.hitch(this, "_onMonthSet")))[0],
				this.own(aspect.after(this.slots[2], "onFlickAnimationEnd", lang.hitch(this, "_onDaySet")))[0]
			];
		},

		disableValues: function(/*Number*/daysInMonth){
			// summary:
			//		Disables the end days of the month to match the specified
			//		number of days of the month.
			this.slots[2].panelNodes.forEach(function(panel){
				for(var i = 27; i < 31; i++){
					domClass.toggle(panel.childNodes[i], "duiSpinWheelSlotLabelGray", i >= daysInMonth);
				}
			});
		}
	});
});
