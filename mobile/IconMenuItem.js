define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/dom-class",
	"dojo/dom-construct",
	"dojo/dom-attr",
	"dojo/on",
	"./iconUtils",
	"./_ItemBase"
], function(declare, lang, domClass, domConstruct, domAttr, on, iconUtils, ItemBase){
	// module:
	//		dui/mobile/IconMenuItem

	return declare("dui.mobile.IconMenuItem", ItemBase, { 
		// summary:
		//		An item of IconMenu.
		// description:
		//		IconMenuItem represents a menu item of dui/mobile/MenuItem. 
		//		This widget inherits from dui/mobile/_ItemBase. Its basic usage is 
		//		similar to other subclasses such as dui/mobile/ListItem.

		// closeOnAction: Boolean
		//		If true, the internal handler of click events calls the hide() method 
		//		of the parent widget, which is typically a dui/mobile/SimpleDialog.
		//		The default value is false.
		closeOnAction: false,

		// tag: String
		//		The name of the HTML tag to create as domNode.
		tag: "li",

		/* internal properties */
		// Note these are overrides for similar properties defined in _ItemBase.
		baseClass: "duiIconMenuItem",
		selColor: "duiIconMenuItemSel",
		_selStartMethod: "touch",
		_selEndMethod: "touch",

		buildRendering: function(){
			this.domNode = this.srcNodeRef || domConstruct.create(this.tag);
			domAttr.set(this.domNode, "role", "menuitemcheckbox");
			domAttr.set(this.domNode, "aria-checked", "false");
			this.inherited(arguments);
			if(this.selected){
				domClass.add(this.domNode, this.selColor);
			}

			if(this.srcNodeRef){
				if(!this.label){
					this.label = this.srcNodeRef.innerHTML.trim();
				}
				this.srcNodeRef.innerHTML = "";
			}

			var a = this.anchorNode = this.containerNode = domConstruct.create("a", {
				className: "duiIconMenuItemAnchor",
				role: "presentation"
			});
			var tbl = domConstruct.create("table", {
				className: "duiIconMenuItemTable",
				role: "presentation"
			}, a);
			var cell = this.iconParentNode = tbl.insertRow(-1).insertCell(-1);
			this.iconNode = domConstruct.create("div", {
				className: "duiIconMenuItemIcon"
			}, cell);
			this.labelNode = this.refNode = domConstruct.create("div", {
				className: "duiIconMenuItemLabel"
			}, cell);
			this.position = "before";
			this.domNode.appendChild(a);
		},

		startup: function(){
			if(this._started){ return; }

			this.own(on(this.domNode, "keydown", lang.hitch(this, "_onClick"))); // for desktop browsers

			this.inherited(arguments);
			if(!this._isOnLine){
				this._isOnLine = true;
				// retry applying the attribute for which the custom setter delays the actual 
				// work until _isOnLine is true. 
				this.set("icon", this._pendingIcon !== undefined ? this._pendingIcon : this.icon);
				// Not needed anymore (this code executes only once per life cycle):
				delete this._pendingIcon; 
			}
		},

		_onClick: function(e){
			// summary:
			//		Internal handler for click events.
			// tags:
			//		private
			if(e && e.type === "keydown" && e.keyCode !== 13){ return; }
			if(this.onClick(e) === false){ return; } // user's click action
			if(this.closeOnAction){
				var p = this.getParent(); // maybe SimpleDialog
				if(p && p.hide){
					p.hide();
				}
			}
			this.defaultClickAction(e);
		},

		onClick: function(/*Event*/ /*===== e =====*/){
			// summary:
			//		User-defined function to handle clicks.
			// tags:
			//		callback
		},

		_setSelectedAttr: function(/*Boolean*/selected){
			// summary:
			//		Makes this widget in the selected or unselected state.
			// tags:
			//		private
			this.inherited(arguments);
			domClass.toggle(this.domNode, this.selColor, selected);
			domAttr.set(this.domNode, "aria-checked", selected ? "true" : "false");
		}
	});
});
