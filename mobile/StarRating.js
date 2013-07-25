define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/string",
	"dojo/has",
	"dojo/on",
	"dojo/string",
	"dojo/touch",
	"dojo/keys",
	"dojo/dom-construct",
	"dojo/dom-geometry",
	"dijit/_WidgetBase",
	"dojo/has!dojo-bidi?dojox/mobile/bidi/StarRating",
	"dojo/i18n!./nls/StarRating"
], function(declare, lang, array, string, has, on, string, touch, keys, domConstruct, domGeometry, WidgetBase, BidiStarRating, messages){

	// module:
	//		dojox/mobile/StarRating

	var StarRating = declare(WidgetBase, {
		// summary:
		//		A widget that displays a rating, usually with stars, and that allows setting a different rating value
		//		by touching the stars.
		// description:
		//		This widget shows the rating using an image sprite that contains full stars, half stars and empty stars.
		//		The star displayed can be fully customized by redefining the following css classes in your application:
		//		- mblStarRatingStarIcon: defines the size of each star icon, and the css sprite to use as the background image stars;
		//		- mblStarRatingFullStar: defines the background-position of the css sprite to display a full star icon;
		//		- mblStarRatingHalfStar: defines the background-position of the css sprite to display a half star icon (ltr);
		//		- mblStarRatingHalfStarRtl: defines the background-position of the css sprite to display a half star icon (rtl);
		//		- mblStarRatingEmptyStar: defines the background-position of the css sprite to display an empty star icon.
		//		Note that if your using a different baseClass than the default one 'mblStarRating', you should replace 'mblStarRating'
		//		in the previous css class names with your baseClass value (for example, with a baseClass of 'myClass', the css classes to use
		//		will be myClassStarIcon, myClassFullStar, myClassHalfStar, myClassHalfStarRtl, myClassEmptyStar).
		//
		//		The widget can be used in read-only or in editable mode. In editable mode, the widget allows to set the
		//		rating to 0 stars or not using the zeroAreaWidth property. In this mode, it also allows to set
		//		half values or not using the editHalfValues property.
		//
		//		This widget supports right to left direction (using the HTML dir property on the widget dom node or a parent node).


		// baseClass: String
		//		The name of the CSS class of this widget.
		baseClass: "mblStarRating",

		// maximum: Number
		//		The maximum rating, that is also the number of stars to show.
		maximum: 5,

		// value: Number
		//		The current value of the Rating.
		value: 0,

		// editable: Boolean
		//		Is the user allowed to edit the value of the Rating by touching / clicking the stars ?
		editable: false,

		// editHalfValues: Boolean
		//		If the Rating is editable, is the user allowed to edit half values (0.5, 1.5, ...) or not ?
		editHalfValues: false,

		// zeroAreaWidth: Number
		//		The number of pixel to add to the left of the widget (or right if the direction is rtl) to allow setting the value to 0
		//		when editable is set to true. Default value is 0 if the widget is not editable, 20 if the widget is editable.
		//		Set this value to 0 to forbid the user from setting the value to zero during edition. Setting this attribute to a negative
		//		value is not supported.
		zeroAreaWidth: null,

		/* internal properties */

		_touchStartHandler: null,
		_otherEventsHandlers: [],
		_keyDownHandler: null,
		_incrementKeyCodes: [keys.RIGHT_ARROW, keys.UP_ARROW, keys.NUMPAD_PLUS], // keys to press to increment value
		_decrementKeyCodes: [keys.LEFT_ARROW, keys.DOWN_ARROW, keys.NUMPAD_MINUS], // keys to press to decrement value

		postMixInProperties: function(){
			if(this.zeroAreaWidth == null){
				this.zeroAreaWidth = this.editable ? 20 : 0;
			}
		},

		buildRendering: function(){
			this.inherited(arguments);
			this.domNode.style.display = "inline-block";
			// init WAI-ARIA attributes
			this.domNode.setAttribute('role', 'slider');
			this.domNode.setAttribute('aria-label', messages['aria-label']);
			this.domNode.setAttribute('aria-valuemin', 0);
			this.domNode.setAttribute('aria-valuemax', this.maximum);
			this.domNode.setAttribute('aria-valuenow', this.value);
			this.domNode.setAttribute('aria-valuetext', string.substitute(messages['aria-valuetext'], this));
			this.domNode.setAttribute('aria-disabled', !this.editable);
			// keyboard navigation
			this.domNode.setAttribute('tabindex', this.editable ? 0 : -1);
			this._keyDownHandler = this.on('keydown', lang.hitch(this, '_onKeyDown'));
		},

		_removeEventsHandlers: function(){
			while(this._otherEventsHandlers.length){
				this._otherEventsHandlers.pop().remove();
			}
		},

		_onTouchStart: function(/*Event*/ event){
			event.preventDefault();
			if(!this._otherEventsHandlers.length){
				// handle move on the stars strip
				this._otherEventsHandlers.push(this.on(touch.move, lang.hitch(this, '_onTouchMove')));
				// handle the end of the value editing
				this._otherEventsHandlers.push(this.on(touch.release, lang.hitch(this, '_onTouchEnd')));
				this._otherEventsHandlers.push(this.on(touch.cancel, lang.hitch(this, '_onTouchEnd')));
				if(!has('touch')){ // needed only on desktop, for the case when the mouse cursor leave the widget and mouseup is thrown outside of it
					this._otherEventsHandlers.push(this.on(touch.leave, lang.hitch(this, '_onTouchEnd')));
				}
			}else{
				// Remove event handlers (stopping the rating process)
				this._removeEventsHandlers();
			}
		},

		_onTouchMove: function(/*Event*/ event){
			this._setValueAttr(this._coordToValue(event));
		},

		_onTouchEnd: function(/*Event*/ event){
			this._setValueAttr(this._coordToValue(event));
			// Remove event handlers
			this._removeEventsHandlers();
		},

		_onKeyDown: function(/*Event*/ event){
			if(array.some(this._incrementKeyCodes, function(code){
				return event.keyCode === code;
			})){
				event.preventDefault();
				this._incrementValue();
			}else if(array.some(this._decrementKeyCodes, function(code){
				return event.keyCode === code;
			})){
				event.preventDefault();
				this._decrementValue();
			}
		},

		_incrementValue: function(){
			if(this.value < this.maximum){
				this.set('value', this.value + (this.editHalfValues ? 0.5 : 1));
			}
		},

		_decrementValue: function(){
			if(this.value > (this.zeroAreaWidth ? 0 : (this.editHalfValues ? 0.5 : 1))){
				this.set('value', this.value - (this.editHalfValues ? 0.5 : 1));
			}
		},

		_coordToValue: function(/*Event*/event){
			var box = domGeometry.position(this.domNode, false);
			var xValue = event.clientX - box.x;
			var rawValue = null, discreteValue;
			// fix off values observed on leave event
			if(xValue < 0){
				xValue = 0;
			}else if(xValue > box.w){
				xValue = box.w;
			}
			if(this._inZeroSettingArea(xValue, box.w)){
				return 0;
			}else{
				rawValue = this._xToRawValue(xValue, box.w);
			}
			if(rawValue != null){
				if(rawValue == 0){
					rawValue = 0.1; // do not allow setting the value to 0 when clicking on a star
				}
				discreteValue = Math.ceil(rawValue);
				if(this.editHalfValues && (discreteValue - rawValue) > 0.5){
					discreteValue -= 0.5;
				}
				return discreteValue;
			}
		},

		_inZeroSettingArea: function(/*Number*/x, /*Number*/domNodeWidth){
			return x < this.zeroAreaWidth;
		},

		_xToRawValue: function(/*Number*/x, /*Number*/domNodeWidth){
			var starStripLength = domNodeWidth - this.zeroAreaWidth;
			return (x - this.zeroAreaWidth) / (starStripLength / this.maximum);
		},

		_setMaximumAttr: function(/*Number*/value){
			this._set("maximum", value);
			this.domNode.setAttribute('aria-valuemax', this.maximum);
			// set value to trigger redrawing of the widget
			this.set("value", this.value);
		},

		_setValueAttr: function(/*Number*/value){
			// summary:
			//		Sets the value of the Rating.
			// tags:
			//		private
			var createChildren = this.domNode.children.length != this.maximum;
			this._set("value", value);
			if(createChildren){
				domConstruct.empty(this.domNode);
			}
			this._updateStars(value, createChildren);
			this.domNode.setAttribute('aria-valuenow', this.value);
			this.domNode.setAttribute('aria-valuetext', string.substitute(messages['aria-valuetext'], this));
		},

		_setEditableAttr: function(/*Boolean*/value){
			this._set("editable", value);
			this.domNode.setAttribute('tabindex', this.editable ? 0 : -1);
			if(this.editable && !this._keyDownHandler){
				this._keyDownHandler = this.on('keydown', lang.hitch(this, '_onKeyDown'));
			}else if(!this.editable && this._keyDownHandler){
				this._keyDownHandler.remove();
				this._keyDownHandler = null;
			}
			this.domNode.setAttribute('aria-disabled', !this.editable);
			if(this.editable && !this._touchStartHandler){
				this._touchStartHandler = this.on(touch.press, lang.hitch(this, '_onTouchStart'));
			}else if(!this.editable && this._touchStartHandler){
				this._touchStartHandler.remove();
				this._touchStartHandler = null;
			}
		},

		_setZeroAreaWidthAttr: function(/*Number*/value){
			this._set("zeroAreaWidth", value);
			this.domNode.style.paddingLeft = this.zeroAreaWidth + "px";
		},

		_updateStars: function(/*Number*/value, /*Boolean*/create){
			var i;
			var parent;
			var starClass;
			for(i = 0; i < this.maximum; i++){
				if(i <= value - 1){
					starClass = this.baseClass + "FullStar";
				}else if(i >= value){
					starClass = this.baseClass + "EmptyStar";
				}else{
					starClass = this.baseClass + "HalfStar";
				}
				if(create){
					parent = domConstruct.create("div", {
						style: {"float": "left"}
					}, this.domNode);
				}else{
					parent = this.domNode.children[i];
				}
				parent.className = this.baseClass +  "StarIcon " + starClass;
			}
		}
	});

	return has('dojo-bidi') ? declare([StarRating, BidiStarRating]) : StarRating;
});
