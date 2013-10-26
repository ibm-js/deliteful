define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/dom",
	"dojo/dom-class",
	"dojo/dom-construct",
	"dojo/on",
	"dojo/topic",
	"dui/registry",
	"../Contained",
	"../Widget"
], function(declare, lang, dom, domClass, domConstruct, on, topic, registry, Contained, Widget){

	// module:
	//		dui/mobile/PageIndicator

	return declare("dui.mobile.PageIndicator", [Widget, Contained],{
		// summary:
		//		A current page indicator.
		// description:
		//		PageIndicator displays a series of gray and white dots to
		//		indicate which page is currently being viewed. It can typically
		//		be used with dui/mobile/SwapView.

		// refId: String
		//		An ID of a DOM node to be searched. Siblings of the reference
		//		node will be searched for views. If not specified, this.domNode
		//		will be the reference node.
		refId: "",

		// baseClass: String
		//		The name of the CSS class of this widget.
		baseClass: "duiPageIndicator",

		buildRendering: function(){
			this.inherited(arguments);
			this._tblNode = domConstruct.create("table", {className:"duiPageIndicatorContainer"}, this.domNode);
			this._tblNode.insertRow(-1);
			this.own(on(this.domNode, "click", lang.hitch(this, "_onClick")));
			this.own(topic.subscribe("/dui/mobile/viewChanged", lang.hitch(this, "reset")));
		},

		startup: function(){
			var _this = this;
			_this.defer(function(){ // to wait until views' visibility is determined
				_this.reset();
			});
		},

		reset: function(){
			// summary:
			//		Updates the indicator.
			var r = this._tblNode.rows[0];
			var i, c, a = [], dot;
			var refNode = (this.refId && dom.byId(this.refId)) || this.domNode;
			var children = refNode.parentNode.childNodes;
			for(i = 0; i < children.length; i++){
				c = children[i];
				if(this.isView(c)){
					a.push(c);
				}
			}
			if(r.cells.length !== a.length){
				domConstruct.empty(r);
				for(i = 0; i < a.length; i++){
					c = a[i];
					dot = domConstruct.create("div", {className:"duiPageIndicatorDot"});
					r.insertCell(-1).appendChild(dot);
				}
			}
			if(a.length === 0){ return; }
			var currentView = registry.byNode(a[0]).getShowingView();
			for(i = 0; i < r.cells.length; i++){
				dot = r.cells[i].firstChild;
				if(a[i] === currentView.domNode){
					domClass.add(dot, "duiPageIndicatorDotSelected");
				}else{
					domClass.remove(dot, "duiPageIndicatorDotSelected");
				}
			}
		},

		isView: function(node){
			// summary:
			//		Returns true if the given node is a view.
			return (node && node.nodeType === 1 && domClass.contains(node, "duiView")); // Boolean
		},

		_onClick: function(e){
			// summary:
			//		Internal handler for click events.
			// tags:
			//		private
			if(this.onClick(e) === false){ return; } // user's click action
			if(e.target !== this.domNode){ return; }
			if(e.layerX < this._tblNode.offsetLeft){
				topic.publish("/dui/mobile/prevPage", this);
			}else if(e.layerX > this._tblNode.offsetLeft + this._tblNode.offsetWidth){
				topic.publish("/dui/mobile/nextPage", this);
			}
		},

		onClick: function(/*Event*/ /*===== e =====*/){
			// summary:
			//		User-defined function to handle clicks.
			// tags:
			//		callback
		}
	});
});
