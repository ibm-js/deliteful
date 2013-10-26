define([
	"dui/registry",
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/dom-class",
	"dojo/dom-construct",
	"dojo/dom-geometry",
	"dojo/dom-style",
	"dui/place",
	"../Widget",
	"dojo/has",
	"dojo/has!dojo-bidi?dui/mobile/bidi/Tooltip"
], function(registry, declare, lang, domClass, domConstruct, domGeometry, domStyle, place, Widget, has, BidiTooltip){

	var Tooltip = declare(has("dojo-bidi") ? "dui.mobile.NonBidiTooltip" : "dui.mobile.Tooltip", Widget, {
		// summary:
		//		A non-templated popup bubble widget

		baseClass: "duiTooltip duiTooltipHidden",

		buildRendering: function(){
			// create the helper nodes here in case the user overwrote domNode.innerHTML
			this.inherited(arguments);
			this.anchor = domConstruct.create("div", {"class":"duiTooltipAnchor"}, this.domNode, "first");
			this.arrow = domConstruct.create("div", {"class":"duiTooltipArrow"}, this.anchor);
			this.innerArrow = domConstruct.create("div", {"class":"duiTooltipInnerArrow"}, this.anchor);
			if(!this.containerNode){
				// set containerNode so that getChildren() works
				this.containerNode = this.domNode;
			}
		},

		show: function(/*DomNode*/ aroundNode, /*Array*/positions){
			// summary:
			//		Pop up the tooltip and point to aroundNode using the best position
			// positions:
			//		Ordered list of positions to try matching up.
			//
			//		- before-centered: places drop down before the aroundNode
			//		- after-centered: places drop down after the aroundNode
			//		- above-centered: drop down goes above aroundNode
			//		- below-centered: drop down goes below aroundNode

			var domNode = this.domNode;
			var connectorClasses = {
				"MRM": "duiTooltipAfter",
				"MLM": "duiTooltipBefore",
				"BMT": "duiTooltipBelow",
				"TMB": "duiTooltipAbove",
				"BLT": "duiTooltipBelow",
				"TLB": "duiTooltipAbove",
				"BRT": "duiTooltipBelow",
				"TRB": "duiTooltipAbove",
				"TLT": "duiTooltipBefore",
				"TRT": "duiTooltipAfter",
				"BRB": "duiTooltipAfter",
				"BLB": "duiTooltipBefore"
			};
			domClass.remove(domNode, ["duiTooltipAfter","duiTooltipBefore","duiTooltipBelow","duiTooltipAbove"]);
			registry.findWidgets(domNode).forEach(function(widget){
				if(widget.height == "auto" && typeof widget.resize == "function"){
					if(!widget._parentPadBorderExtentsBottom){
						widget._parentPadBorderExtentsBottom = domGeometry.getPadBorderExtents(domNode).b;
					}
					widget.resize();
				}
			});
			var best = place.around(domNode, aroundNode, positions || ["below-centered", "above-centered", "after-centered", "before-centered"], this.isLeftToRight());
			var connectorClass = connectorClasses[best.corner + best.aroundCorner.charAt(0)] || "";
			domClass.add(domNode, connectorClass);
			var pos = domGeometry.position(aroundNode, true);
			domStyle.set(this.anchor, (connectorClass == "duiTooltipAbove" || connectorClass == "duiTooltipBelow")
				? { top: "", left: Math.max(0, pos.x - best.x + (pos.w >> 1) - (this.arrow.offsetWidth >> 1)) + "px" }
				: { left: "", top: Math.max(0, pos.y - best.y + (pos.h >> 1) - (this.arrow.offsetHeight >> 1)) + "px" }
			);
			domClass.replace(domNode, "duiTooltipVisible", "duiTooltipHidden");
			this.resize = lang.hitch(this, "show", aroundNode, positions); // orientation changes
			return best;
		},

		hide: function(){
			// summary:
			//		Pop down the tooltip
			this.resize = undefined;
			domClass.replace(this.domNode, "duiTooltipHidden", "duiTooltipVisible");
		},

		onBlur: function(/*Event*/e){
			return true; // touching outside the overlay area does call hide() by default
		},

		destroy: function(){
			if(this.anchor){
				this.anchor.removeChild(this.innerArrow);
				this.anchor.removeChild(this.arrow);
				this.domNode.removeChild(this.anchor);
				this.anchor = this.arrow = this.innerArrow = undefined;
			}
			this.inherited(arguments);
		}
	});
	
	return has("dojo-bidi") ? declare("dui.mobile.Tooltip", [Tooltip, BidiTooltip]) : Tooltip;		
});
