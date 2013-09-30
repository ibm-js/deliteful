define([
	"dojo/_base/array",
	"dojo/_base/connect",
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/window",
	"dojo/sniff",
	"dojo/query",
	"dojo/dom-class",
	"dojo/dom-construct",
	"dojo/dom-geometry",
	"dojo/dom-style",
	"dojo/keys",
	"dojo/touch",
	"dojo/on",
	"dui/_WidgetBase",
	"dui/_AttachMixin",
	"dui/_WidgetsInTemplateMixin",
	"dui/_FormWidgetMixin",
	"dui/_FormValueMixin",
	"./themes/load!common,Slider"           // common for duiInline etc., Slider for duiSlider etc.
],
	function(array, connect, declare, lang, win, has, query, domClass, domConstruct, domGeometry, domStyle, keys, touch, on, WidgetBase, AttachMixin, WidgetsInTemplateMixin, FormWidgetMixin, FormValueMixin){

	return declare("dui.Slider", [WidgetBase, FormWidgetMixin, FormValueMixin, AttachMixin, WidgetsInTemplateMixin], {
		// summary:
		//		A non-templated Slider widget similar to the HTML5 INPUT type=range.

		// value: Number
		//		The current slider value.
		value: 0,

		// min: [const] Number
		//		The first value the slider can be set to.
		min: 0,

		// max: [const] Number
		//		The last value the slider can be set to.
		max: 100,

		// step: [const] Number
		//		The delta from 1 value to another.
		//		This causes the slider handle to snap/jump to the closest possible value.
		//		A value of 0 means continuous (as much as allowed by pixel resolution).
		step: 1,

		// baseClass: [const] String
		//		The name of the CSS class of this widget.
		baseClass: "duiSlider",

		// flip: [const] Boolean
		//		Specifies if the slider should change its default: ascending <--> descending.
		flip: false,

		// orientation: [const] String
		//		The slider direction.
		//
		//		- "H": horizontal
		//		- "V": vertical
		orientation: "H",

		// isRange: [const] Boolean
		//		True if there's a visible min AND max slider handle
		isRange: false,

		_setTabIndexAttr: "handle",

		buildRendering: function(){
			var toCSS = lang.hitch(this, function(modifier){
				return array.map(this.baseClass.split(" "), function(c){
					return c + modifier;
				}).join(" ");
			});
			this.domNode = this.srcNodeRef || domConstruct.create("div", {});
			if(this.domNode.tagName.toUpperCase() == "INPUT"){
				// single INPUT specified in markup
				this.valueNode = this.domNode;
				this.srcNodeRef = this.domNode = domConstruct.create("div", {}, this.valueNode, "after");
				domStyle.set(this.valueNode, "display", "none"); // value node is always hidden
			}else{
				// look for child INPUT node under root node
				this.valueNode = query("> INPUT", this.domNode)[0];
				if(!this.valueNode){
					this.domNode.removeAttribute("name");
					this.valueNode = domConstruct.create("input", this.name ? { "type":"text", name:this.name, readOnly:true } : { "type":"text", readOnly:true });
					this.domNode.appendChild(this.valueNode);
				}
			}
			if(!isNaN(parseFloat(this.valueNode.value))){ // browser back button or value coded on INPUT
				this.value = this.params["value"] = this.valueNode.value;
			}
			this.containerNode = domConstruct.create("div", { "class":toCSS("RemainingBar")+" "+toCSS("Bar") });
			this.domNode.appendChild(this.containerNode);
			var n = this.domNode.firstChild;
			while(n){
				var next = n.nextSibling;
				if(n != this.valueNode && n != this.containerNode){
					// move all extra markup nodes to the containerNode for relative sizing and placement
					this.containerNode.appendChild(n);
				}
				n = next;
			}
			this.progressBar = domConstruct.create("div", { "class":toCSS("Bar")+" "+toCSS("ProgressBar") });
			this.containerNode.appendChild(this.progressBar);
			var handles = query("> DIV", this.progressBar);
			if(this.isRange){
				if(!this.handleMin){
					if(handles && handles[0]){
						this.handleMin = handles[0];
					}else{
						this.handleMin = domConstruct.create("div", { "class":toCSS("Handle")+" "+toCSS("HandleMin"), "tabIndex":0 });
						this.progressBar.appendChild(this.handleMin);
					}
				}
				this._setTabIndexAttr = ["handleMin", "handle"];
			}
			var idx = this.isRange ? 1 : 0;
			if(handles && handles[idx]){
				this.handle = handles[idx];
			}else{
				this.handle = domConstruct.create("div", { "class":toCSS("Handle")+" "+toCSS("HandleMax"), "tabIndex":0 });
				this.progressBar.appendChild(this.handle);
			}
			this.inherited(arguments);
			this.textbox = this.domNode;
			this.focusNode = this.handle;

			// prevent browser scrolling on IE10 (evt.preventDefault() is not enough)
			if(typeof this.domNode.style.msTouchAction != "undefined"){
				this.domNode.style.msTouchAction = "none";
			}
		},

		_refreshState: function(/*Boolean?*/ priorityChange){
			var values = String(this.value).split(',');
			if(values.length == 1){
				values = [this.min, values[0]];
			}
			var	toPercent = (values[1] - this.min) * 100 / (this.max - this.min),
				toPercentMin = (values[0] - this.min) * 100 / (this.max - this.min),
				// now perform visual slide
				horizontal = this.orientation != "V",
				s = {};
			domClass.toggle(this.progressBar, "duiSliderTransition", priorityChange);
			s[this._attrs.progressBarSize] = (toPercent-toPercentMin) + "%";
			s[this._attrs.progressBarStart] = (this._reversed ? (100-toPercent) : toPercentMin) + "%";
			domStyle.set(this.progressBar, s);
		},

		_setValueAttr: function(/*Number or Number,Number*/ value, /*Boolean?*/ priorityChange){
			// summary:
			//		Hook such that set('value', value) works.
			// tags:
			//		private
			var values = String(value).split(',');
			if(values.length == 1){
				values = [this.min, values[0]];
			}
			var	minValue = Math.max(Math.min(Math.min(values[0], values[1]), this.max), this.min),
				maxValue = Math.max(Math.min(Math.max(values[0], values[1]), this.max), this.min);
			value = this.isRange ? (minValue+","+maxValue) : maxValue; // in case the values were outside min/max
			this.valueNode.value = String(value);
			this._set('value', value);
			if(this.isRange){
				this.handleMin.setAttribute("aria-valuenow", minValue);
			}
			this.handle.setAttribute("aria-valuenow", maxValue);
			if(!this._created){ return; } // don't move images until all the properties are set
			this._refreshState(priorityChange);
		},

		postCreate: function(){
			this.inherited(arguments);

			var	beginDrag = lang.hitch(this, function(e){
					e.preventDefault();
					var	setValue = lang.hitch(this, function(priorityChange){
							var values = String(this.value).split(',');
							value -= offsetValue;
							this.set('value', this.isRange ? (isMax ? (values[0]+","+value) : (value+","+values[1])) : value, priorityChange);
						}),
						getEventData = lang.hitch(this, function(e){
							point = isMouse ? e[this._attrs.pageX] : ((e.touches && e.touches[0]) ? e.touches[0][this._attrs.pageX] : e[this._attrs.clientX]);
							pixelValue = point - startPixel;
							pixelValue = Math.min(Math.max(pixelValue, 0), maxPixels);
							var discreteValues = this.step ? ((this.max - this.min) / this.step) : maxPixels;
							if(discreteValues <= 1 || discreteValues == Infinity ){ discreteValues = maxPixels; }
							var wholeIncrements = Math.round(pixelValue * discreteValues / maxPixels);
							value = (this.max - this.min) * wholeIncrements / discreteValues;
							value = this._reversed ? (this.max - value) : (this.min + value);
						}),
						continueDrag = lang.hitch(this, function(e){
							e.preventDefault();
							getEventData(e);
							setValue(false);
						}),
						endDrag = lang.hitch(this, function(e){
							e.preventDefault();
							array.forEach(actionHandles, function(h){ h.remove(); });
							actionHandles = [];
							getEventData(e);
							setValue(true);
						}),
						isMouse = e.type == "mousedown",
						// get the starting position of the content area (dragging region)
						box = domGeometry.position(this.containerNode, false), // can't use true since the added docScroll and the returned x are body-zoom incompatibile
						bodyZoom = has("ie") ? 1 : (domStyle.get(win.body(), "zoom") || 1),
						nodeZoom = has("ie") ? 1 : (domStyle.get(node, "zoom") || 1);
					if(isNaN(bodyZoom)){ bodyZoom = 1; }
					if(isNaN(nodeZoom)){ nodeZoom = 1; }
					var startPixel = box[this._attrs.x] * nodeZoom * bodyZoom + domGeometry.docScroll()[this._attrs.x];
					var maxPixels = box[this._attrs.w] * nodeZoom * bodyZoom;
					var offsetValue = 0;
					getEventData(e);
					var values = String(this.value).split(',');
					var isMax = !this.isRange || (Math.abs(value - values[0]) > Math.abs(value - values[1]));
					if(e.target != this.handle && e.target != this.handleMin){
						setValue(true);
					}else{
						offsetValue = value - ((isMax && this.isRange) ? values[1] : values[0]);
					}
					if(isMax){
						this.handle.focus();
					}else{
						this.handleMin.focus();
					}
					array.forEach(actionHandles, function(h){ h.remove(); });
					actionHandles = this.own(
						on(root, touch.move, continueDrag),
						on(root, touch.release, endDrag)
					);
				}),

				keyDown = lang.hitch(this, function(/*Event*/ e){
					if(this.disabled || this.readOnly || e.altKey || e.ctrlKey || e.metaKey){ return; }
					var	step = this.step,
						multiplier = 1,
						newValue,
						idx,
						values = String(this.value).split(',');
					if(values.length == 1){
						values = [this.min, values[0]];
					}
					if(e.target == this.handle){
						idx = 1;
					}else if(e.target == this.handleMin){
						idx = 0;
					}else{
						return;
					}
					switch(e.keyCode){
						case keys.HOME:
							if(e.target == this.handle){
								values[1] = values[0];
							}else{
								values[0] = this.min;
							}
							break;
						case keys.END:
							if(e.target == this.handle){
								values[1] = this.max;
							}else{
								values[0] = values[1];
							}
							break;
						case keys.RIGHT_ARROW:
							multiplier = -1;
						case keys.LEFT_ARROW:
							values[idx] = parseFloat(values[idx]) + multiplier * ((flip && horizontal) ? step : -step);
							break;
						case keys.DOWN_ARROW:
							multiplier = -1;
						case keys.UP_ARROW:
							values[idx] = parseFloat(values[idx]) + multiplier * ((!flip || horizontal) ? step : -step);
							break;
						default:
							return;
					}
					e.preventDefault();
					this.set('value', this.isRange ? values.join(',') : values[1], false);
				}),

				keyUp = lang.hitch(this, function(/*Event*/ e){
					if(this.disabled || this.readOnly || e.altKey || e.ctrlKey || e.metaKey){ return; }
					this.set('value', this.value, true); // fire onChange
				}),

				point, pixelValue, value,
				node = this.domNode;
			// add V or H suffix to baseClass for styling purposes
			var	horizontal = this.orientation != "V",
				ltr = horizontal ? this.isLeftToRight() : false,
				actionHandles = [],
				root = win.doc.documentElement,
				self = this,
				flip = !!this.flip;
			// _reversed is complicated since you can have flipped right-to-left and vertical is upside down by default
			this._reversed = !((horizontal && ((ltr && !flip) || (!ltr && flip))) || (!horizontal && flip));
			this._attrs =
				horizontal ? { x:'x', w:'w', l:'l', r:'r', pageX:'pageX', clientX:'clientX', progressBarStart:"left", progressBarSize:"width" }
				: { x:'y', w:'h', l:'t', r:'b', pageX:'pageY', clientX:'clientY', progressBarStart:"top", progressBarSize:"height" };
			var dir = { "H": { false: "Ltr", true: "Rtl" }, "V": { false: "Ttb", true: "Btt" } };
			domClass.add(this.domNode, array.map(this.baseClass.split(" "), function(c){ return c+self.orientation+" "+c+dir[self.orientation][self._reversed]; }));
			this.own(
				on(this.domNode, touch.press, beginDrag),
				on(this.domNode, "keydown", keyDown), // for desktop a11y
				on(self.handle, "keyup", keyUp) // fire onChange on desktop
			);
			this._refreshState(null);
		},

		destroyRendering: function(/*Boolean*/ preserveDom){
			if(!preserveDom && this.valueNode.parentNode != this.domNode){
				domConstruct.destroy(this.valueNode);
			}
			this.inherited(arguments);
		}
	});
});
