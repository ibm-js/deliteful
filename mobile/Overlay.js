define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/sniff",
	"dojo/_base/window",
	"dojo/dom-class",
	"dojo/dom-geometry",
	"dojo/dom-style",
	"dojo/on",
	"dojo/window",
	"../Widget",
	"dui/registry",
	"dojo/touch",
	"./_css3"
], function(declare, lang, has, win, domClass, domGeometry, domStyle, on, windowUtils, Widget, registry, touch, css3){

	return declare("dui.mobile.Overlay", Widget, {
		// summary:
		//		A non-templated widget that animates up from the bottom, 
		//		overlaying the current content.

		// baseClass: String
		//		The name of the CSS class of this widget.
		baseClass: "duiOverlay duiOverlayHidden",

		buildRendering: function(){
			this.inherited(arguments);
			if(!this.containerNode){
				// set containerNode so that getChildren() works
				this.containerNode = this.domNode;
			}
		},

		_reposition: function(){
			// summary:
			//		Position the overlay at the bottom
			// tags:
			//		private
			var popupPos = domGeometry.position(this.domNode);
			var vp = windowUtils.getBox();
			if((popupPos.y+popupPos.h) != vp.h // TODO: should be a has() test for position:fixed not scrolling
				|| (domStyle.get(this.domNode, 'position') != 'absolute' && has('android') < 3)){ // android 2.x supports position:fixed but child transforms don't persist
				popupPos.y = vp.t + vp.h - popupPos.h;
				domStyle.set(this.domNode, { position: "absolute", top: popupPos.y + "px", bottom: "auto" });
			}
			return popupPos;
		},

		show: function(/*DomNode?*/aroundNode){
			// summary:
			//		Scroll the overlay up into view
			registry.findWidgets(this.domNode).forEach(function(w){
				if(w && w.height == "auto" && typeof w.resize == "function"){
					w.resize();
				}
			});
			var popupPos = this._reposition();
			if(aroundNode){
				var aroundPos = domGeometry.position(aroundNode);
				if(popupPos.y < aroundPos.y){ // if the aroundNode is under the popup, try to scroll it up
					win.global.scrollBy(0, aroundPos.y + aroundPos.h - popupPos.y);
					this._reposition();
				}
			}
			var _domNode = this.domNode;
			domClass.replace(_domNode, ["duiCoverv", "duiIn"], ["duiOverlayHidden", "duiRevealv", "duiOut", "duiReverse", "duiTransition"]);
			this.defer(function(){
				var handler = this.own(on(_domNode, css3.name("transitionEnd"), lang.hitch(this, function(){
					handler.remove();
					domClass.remove(_domNode, ["duiCoverv", "duiIn", "duiTransition"]);
					this._reposition();
				})))[0];
				domClass.add(_domNode, "duiTransition");
			}, 100);
			var skipReposition = false;

			this._moveHandle = this.own(on(win.doc.documentElement, touch.move, function(){
					skipReposition = true;
				}
			))[0];
			this._repositionTimer = setInterval(lang.hitch(this, function(){
				if(skipReposition){ // don't reposition if busy
					skipReposition = false;
					return;
				}
				this._reposition();
			}), 50); // yield a short time to allow for consolidation for better CPU throughput
			return popupPos;
		},

		hide: function(){
			// summary:
			//		Scroll the overlay down and then make it invisible
			var _domNode = this.domNode;
			if(this._moveHandle){
				this._moveHandle.remove();
				this._moveHandle = null;
				clearInterval(this._repositionTimer);
				this._repositionTimer = null;
			}
			if(has("css3-animations")){
				domClass.replace(_domNode, ["duiRevealv", "duiOut", "duiReverse"], ["duiCoverv", "duiIn", "duiOverlayHidden", "duiTransition"]);
				this.defer(function(){
					var handler = this.own(on(_domNode, css3.name("transitionEnd"), function(){
						handler.remove();
						domClass.replace(_domNode, ["duiOverlayHidden"], ["duiRevealv", "duiOut", "duiReverse", "duiTransition"]);
					}))[0];
					domClass.add(_domNode, "duiTransition");
				}, 100);
			}else{
				domClass.replace(_domNode, ["duiOverlayHidden"], ["duiCoverv", "duiIn", "duiRevealv", "duiOut", "duiReverse"]);
			}
		},

		onBlur: function(/*Event*/e){
			return false; // touching outside the overlay area does not call hide()
		}
	});
});
