define(["dojo/_base/kernel", "dojo/dom-geometry"], function(dojo, geom){

	function duiById(id){
		return dojo.global.require("dui/registry").byId(id);
	}

	var exports = {
		checkInside: function(/*Widget*/ child, /*Widget*/ parent, /*String?*/ comment){
			// summary:
			//		Test that child is fully inside of parent
	
			child = duiById(child);
			parent = duiById(parent);
	
			var cp = geom.position(child.domNode, true),
				pp = geom.position(parent.domNode, true);
	
			doh.t(
				cp.y >= pp.y && cp.y+cp.h <= pp.y+pp.h &&
				cp.x >= pp.x && cp.x+cp.w <= pp.x+pp.w,
				(comment ? comment + ": " : "") + child.region + " inside " + parent.id + JSON.stringify(cp) + JSON.stringify(pp)
			);
		},

		checkAbove: function(/*String*/ comment, /*Widget*/ above, /*Widget*/ below){
			// summary:
			//		Test that child is fully above parent
	
			above = duiById(above);
			below = duiById(below);
	
			var ap = geom.position(above.domNode, true),
				bp = geom.position(below.domNode, true);
	
			doh.t(ap.y+ap.h < bp.y,
				comment + " " + above.region + " above " + below.region + JSON.stringify(ap) + JSON.stringify(bp)
			);
		},

		checkLeft: function(/*String*/ comment, /*Widget*/ left, /*Widget*/ right){
			// summary:
			//		Test that child is fully left of parent
	
			left = duiById(left);
			right = duiById(right);
	
			var lp = geom.position(left.domNode, true),
				rp = geom.position(right.domNode, true);
	
			doh.t(lp.x+lp.w < rp.x,
				comment + " " + left.region + " to left of " + right.region + JSON.stringify(lp) + JSON.stringify(rp)
			);
		},

		checkBCpanes: function(/*BorderContainer*/ bc, /*String*/ comment){
			// summary:
			//		Check that all the panes in this BorderContainer are in sane
			//		positions relative to each other.   Assumes at most one pane
			//		in each region.
			var children = bc.getChildren(),
				regions = {};
	
			// Check all panes inside BorderContainer
			children.forEach(function(child, comment){
				exports.checkInside(child, bc, comment);
				regions[child.region] = child;
			});
	
			// Check pane positions relative to each other
			children.forEach(function(child){
				switch(child.region){
					case "top":
						(bc.design == "sidebar" ? ["center", "bottom"] : ["left", "center", "right", "bottom"]).forEach(function(region){
							if(regions[region]){
								exports.checkAbove(bc.id, child, regions[region], comment);
							}
						});
						break;
					case "bottom":
						(bc.design == "sidebar" ? ["center", "top"] : ["left", "center", "right", "top"]).forEach(function(region){
							if(regions[region]){
								exports.checkAbove(bc.id, regions[region], child, comment);
							}
						});
						break;
					case "left":
						(bc.design == "sidebar" ? ["top", "center", "bottom", "right"] : ["right"]).forEach(function(region){
							if(regions[region]){
								exports.checkLeft(bc.id, child, regions[region], comment);
							}
						});
						break;
					case "right":
						(bc.design == "sidebar" ? ["top", "center", "bottom", "left"] : ["left"]).forEach(function(region){
							if(regions[region]){
								exports.checkLeft(bc.id, regions[region], child, comment);
							}
						});
						break;
				}
			});
		},

		within: function(/*Number*/ a, /*Number*/ b, /*Number*/ range){
			// summary:
			//		Returns true if a and b are within range
			return Math.abs(a-b) <= range;
		}
	};

	return exports;
});