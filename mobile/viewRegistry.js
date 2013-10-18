define([
	"dojo/dom-class",
	"dui/registry"
], function(domClass, registry){

	// module:
	//		dui/mobile/viewRegistry

	return {
		// summary:
		//		A registry of existing views.

		// length: Number
		//		The number of registered views.
		length: 0,
		
		// hash: [private] Object
		//		The object used to register views.
		hash: {},
		
		// initialView: [private] dui/mobile/View
		//		The initial view.
		initialView: null,

		add: function(/*dui/mobile/View*/ view){
			// summary:
			//		Adds a view to the registry.
			this.hash[view.id] = view;
			this.length++;
		},

		remove: function(/*String*/ id){
			// summary:
			//		Removes a view from the registry.
			if(this.hash[id]){
				delete this.hash[id];
				this.length--;
			}
		},

		getViews: function(){
			// summary:
			//		Gets all registered views.
			// returns: Array
			var arr = [];
			for(var i in this.hash){
				arr.push(this.hash[i]);
			}
			return arr;
		},

		getParentView: function(/*dui/mobile/View*/ view){
			// summary:
			//		Gets the parent view of the specified view.
			// returns: dui/mobile/View
			for(var v = view.getParent(); v; v = v.getParent()){
				if(domClass.contains(v.domNode, "duiView")){ return v; }
			}
			return null;
		},

		getChildViews: function(/*dui/mobile/View*/ parent){
			// summary:
			//		Gets the children views of the specified view.
			// returns: Array
			return this.getViews().filter(function(v){ return this.getParentView(v) === parent; }, this);
		},

		getEnclosingView: function(/*DomNode*/ node){
			// summary:
			//		Gets the view containing the specified DOM node.
			// returns: dui/mobile/View
			for(var n = node; n && n.tagName !== "BODY"; n = n.parentNode){
				if(n.nodeType === 1 && domClass.contains(n, "duiView")){
					return registry.byNode(n);
				}
			}
			return null;
		},

		getEnclosingScrollable: function(/*DomNode*/ node){
			// summary:
			//		Gets the dui/mobile/scrollable object containing the specified DOM node.
			// returns: dui/mobile/scrollable
			for(var w = registry.getEnclosingWidget(node); w; w = w.getParent()){
				if(w.scrollableParams && w._v){ return w; }
			}
			return null;
		}
	};
});
