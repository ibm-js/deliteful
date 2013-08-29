define([
	"dojo/_base/declare",
	"./IconMenu"
], function(declare, IconMenu){
	// module:
	//		dojox/mobile/GridLayout

	return declare("dojox.mobile.GridLayout", IconMenu, {
		// summary:
		//		A container widget that places its children in a grid layout.

		// cols: Number
		//		The number of child items in a row.
		cols: 0,

		/* internal properties */
		
		// childItemClass: String
		//		The name of the CSS class of grid items.
		childItemClass: "duiGridItem",
		
		// baseClass: String
		//		The name of the CSS class of this widget.
		baseClass: "duiGridLayout",
		
		// _tags: [private] String
		_tags: "div",
		
		// _createTerminator: [private] Boolean
		_createTerminator: true
	});
});
