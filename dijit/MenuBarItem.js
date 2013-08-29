define([
	"dojo/_base/declare", // declare
	"./MenuItem",
	"dojo/text!./templates/MenuBarItem.html"
], function(declare, MenuItem, template){

	// module:
	//		dui/MenuBarItem

	var _MenuBarItemMixin = declare("dui._MenuBarItemMixin", null, {
		templateString: template,

		// Map widget attributes to DOMNode attributes.
		_setIconClassAttr: null	// cancel MenuItem setter because we don't have a place for an icon
	});

	var MenuBarItem = declare("dui.MenuBarItem", [MenuItem, _MenuBarItemMixin], {
		// summary:
		//		Item in a MenuBar that's clickable, and doesn't spawn a submenu when pressed (or hovered)

	});
	MenuBarItem._MenuBarItemMixin = _MenuBarItemMixin;	// dui.mobile is accessing this


	return MenuBarItem;
});
