define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/dom",
	"dojo/dom-class",
	"dojo/dom-construct",
	"dojo/dom-style",
	"dojo/dom-attr",
	"dojo/on",
	"dojo/topic",
	"./View",
	"./iconUtils",
	"./_ItemBase",
	"./Badge",
	"dojo/sniff",
	"dojo/has!dojo-bidi?dui/mobile/bidi/TabBarButton"
], function(declare, lang, dom, domClass, domConstruct, domStyle, domAttr, on, topic, View, iconUtils, ItemBase, Badge, has, BidiTabBarButton){

	// module:
	//		dui/mobile/TabBarButton

	var TabBarButton = declare(has("dojo-bidi") ? "dui.mobile.NonBidiTabBarButton" : "dui.mobile.TabBarButton", ItemBase,{
		// summary:
		//		A button widget that is placed in the TabBar widget.
		// description:
		//		TabBarButton is a button that is placed in the TabBar widget. It
		//		is a subclass of dui/mobile/_ItemBase just like ListItem or
		//		IconItem. So, unlike Button, it has similar capability as
		//		ListItem or IconItem, such as icon support, transition, etc.

		// icon1: String
		//		A path for the unselected (typically dark) icon. If icon is not
		//		specified, the iconBase parameter of the parent widget is used.
		icon1: "",

		// icon2: String
		//		A path for the selected (typically highlight) icon. If icon is
		//		not specified, the iconBase parameter of the parent widget or
		//		icon1 is used.
		icon2: "",

		// iconPos1: String
		//		The position of an aggregated unselected (typically dark)
		//		icon. IconPos1 is a comma-separated list of values like
		//		top,left,width,height (ex. "0,0,29,29"). If iconPos1 is not
		//		specified, the iconPos parameter of the parent widget is used.
		iconPos1: "",

		// iconPos2: String
		//		The position of an aggregated selected (typically highlight)
		//		icon. IconPos2 is a comma-separated list of values like
		//		top,left,width,height (ex. "0,0,29,29"). If iconPos2 is not
		//		specified, the iconPos parameter of the parent widget or
		//		iconPos1 is used.
		iconPos2: "",

		// selected: Boolean
		//		If true, the button is in the selected state.
		selected: false,

		// transition: String
		//		A type of animated transition effect.
		transition: "none",

		// tag: String
		//		A name of html tag to create as domNode.
		tag: "li",

		// badge: String
		//		A string to show on a badge. (ex. "12")
		badge: "",

		/* internal properties */	
		baseClass: "duiTabBarButton",
		// closeIcon: [private] String
		//		CSS class for the close icon.
		closeIcon: "duiDomButtonWhiteCross",

		_selStartMethod: "touch",
		_selEndMethod: "touch",
		
		// _moveTo: String
		//		id of destination view
		_moveTo: "",

		destroy: function(){
			if(this.badgeObj){
				delete this.badgeObj;
			}
			this.inherited(arguments);
		},

		inheritParams: function(){
			// summary:
			//		Overrides dui/mobile/_ItemBase.inheritParams().
			if(this.icon && !this.icon1){ this.icon1 = this.icon; }
			var parent = this.getParent();
			if(parent){
				if(!this.transition){ this.transition = parent.transition; }
				if(this.icon1 && parent.iconBase &&
					parent.iconBase.charAt(parent.iconBase.length - 1) === '/'){
					this.icon1 = parent.iconBase + this.icon1;
				}
				if(!this.icon1){ this.icon1 = parent.iconBase; }
				if(!this.iconPos1){ this.iconPos1 = parent.iconPos; }
				if(this.icon2 && parent.iconBase &&
					parent.iconBase.charAt(parent.iconBase.length - 1) === '/'){
					this.icon2 = parent.iconBase + this.icon2;
				}
				if(!this.icon2){ this.icon2 = parent.iconBase || this.icon1; }
				if(!this.iconPos2){ this.iconPos2 = parent.iconPos || this.iconPos1; }

				if(parent.closable){
					if(!this.icon1){
						this.icon1 = this.closeIcon;
					}
					if(!this.icon2){
						this.icon2 = this.closeIcon;
					}
					domClass.add(this.domNode, "duiTabBarButtonClosable");
				}
			}
		},

		buildRendering: function(){
			this.domNode = this.srcNodeRef || domConstruct.create(this.tag);
			if(this.srcNodeRef){
				if(!this.label){
					this.label = this.srcNodeRef.innerHTML.trim();
				}
				this.srcNodeRef.innerHTML = "";
			}

			this.labelNode = this.box = domConstruct.create("div", {className:"duiTabBarButtonLabel"}, this.domNode);
			
			domAttr.set(this.domNode, "role", "tab");
			domAttr.set(this.domNode, "aria-selected", "false");
			this._moveTo = this._getMoveToId();
			if(this._moveTo){
				var tabPanelNode = dom.byId(this._moveTo);
				if(tabPanelNode){
					domAttr.set(this.domNode, "aria-controls", this._moveTo);
					domAttr.set(tabPanelNode, "role", "tabpanel");
					domAttr.set(tabPanelNode, "aria-labelledby", this.id);
				}
			}
			
			this.inherited(arguments);
		},

		startup: function(){
			if(this._started){ return; }

			this.own(on(this.domNode, "dragstart", function(e){
				e.preventDefault();
				e.stopPropagation();
			}));
			this.own(on(this.domNode, "keydown", lang.hitch(this, "_onClick"))); // for desktop browsers
			var parent = this.getParent();
			if(parent && parent.closable){
				this.own(
					on(this.iconDivNode, "click", lang.hitch(this, "_onCloseButtonClick")),
					on(this.iconDivNode, "keydown", lang.hitch(this, "_onCloseButtonClick"))
				); // for desktop browsers
				this.iconDivNode.tabIndex = "0";
			}

			this.inherited(arguments);
			if(!this._isOnLine){
				this._isOnLine = true;
				// retry applying the attribute for which the custom setter delays the actual 
				// work until _isOnLine is true. 
				this.set({
					icon: this._pendingIcon !== undefined ? this._pendingIcon : this.icon,
					icon1:this.icon1,
					icon2:this.icon2});
				// Not needed anymore (this code executes only once per life cycle):
				delete this._pendingIcon; 
			}
			dom.setSelectable(this.domNode, false);
		},

		onClose: function(e){
			// summary:
			//		Called when the parent is a dui/mobile/TabBar whose closable property is true, and the user clicked the close button.
			topic.publish("/dui/mobile/tabClose", this);
			return this.getParent().onCloseButtonClick(this);
		},

		_onCloseButtonClick: function(e){
			if(e && e.type === "keydown" && e.keyCode !== 13){ return; }
			if(this.onCloseButtonClick(e) === false){ return; } // user's click action
			if(this.onClose()){
				this.destroy();
			}
		},

		onCloseButtonClick: function(/*Event*/ /*===== e =====*/){
			// summary:
			//		User defined function to handle clicks
			//		when the parent is a dui/mobile/TabBar whose closable property is true.
			// tags:
			//		callback
		},

		_onClick: function(e){
			// summary:
			//		Internal handler for click events.
			// tags:
			//		private
			if(e && e.type === "keydown" && e.keyCode !== 13){ return; }
			if(this.onClick(e) === false){ return; } // user's click action
			this.defaultClickAction(e);
		},

		onClick: function(/*Event*/ /*===== e =====*/){
			// summary:
			//		User defined function to handle clicks
			// tags:
			//		callback
		},

		_setIcon: function(icon, n){
			if(!this.getParent()){ return; } // icon may be invalid because inheritParams is not called yet
			this._set("icon" + n, icon);
			if(!this.iconDivNode){
				this.iconDivNode = domConstruct.create("div", {className:"duiTabBarButtonIconArea"}, this.domNode, "first");
				// duiTabBarButtonDiv -> duiTabBarButtonIconArea
			}
			if(!this["iconParentNode" + n]){
				this["iconParentNode" + n] = domConstruct.create("div", {className:"duiTabBarButtonIconParent duiTabBarButtonIconParent" + n}, this.iconDivNode);
				// duiTabBarButtonIcon -> duiTabBarButtonIconParent
			}
			this["iconNode" + n] = iconUtils.setIcon(icon, this["iconPos" + n],
				this["iconNode" + n], this.alt, this["iconParentNode" + n]);
			this["icon" + n] = icon;
			domClass.toggle(this.domNode, "duiTabBarButtonHasIcon", icon && icon !== "none");
		},
		
		_getMoveToId: function(){
			// summary:
			//		Return the id of the destination view.
			//		If there is no id, return an empty string.
			var toId = "";
			if(this.moveTo){
				if(this.moveTo === "#"){ return toId; }
				if(typeof(this.moveTo) === "object" && this.moveTo.moveTo){
					toId = this.moveTo.moveTo;
				}else{
					toId = this.moveTo;
				}
				if(toId){
					toId = View.prototype.convertToId(toId);
				}
			}
			return toId;
		},

		_setIcon1Attr: function(icon){
			this._setIcon(icon, 1);
		},

		_setIcon2Attr: function(icon){
			this._setIcon(icon, 2);
		},

		_getBadgeAttr: function(){
			return this.badgeObj && this.badgeObj.domNode.parentNode &&
				this.badgeObj.domNode.parentNode.nodeType == 1 ? this.badgeObj.getValue() : null;
		},

		_setBadgeAttr: function(/*String*/value){
			if(!this.badgeObj){
				this.badgeObj = new Badge({fontSize:11});
				domStyle.set(this.badgeObj.domNode, {
					position: "absolute",
					top: "0px",
					right: "0px"
				});
			}
			this.badgeObj.setValue(value);
			if(value){
				this.domNode.appendChild(this.badgeObj.domNode);
			}else{
				if(this.domNode === this.badgeObj.domNode.parentNode){
					this.domNode.removeChild(this.badgeObj.domNode);
				}
			}
		},

		_setSelectedAttr: function(/*Boolean*/selected){
			// summary:
			//		Makes this widget in the selected or unselected state.
			this.inherited(arguments);
			domClass.toggle(this.domNode, "duiTabBarButtonSelected", selected);
			domAttr.set(this.domNode, "aria-selected", selected ? "true" : "false");
			if(this._moveTo){
				var tabPanelNode = dom.byId(this._moveTo);
				if(tabPanelNode){
					domAttr.set(tabPanelNode, "aria-hidden", selected ? "false" : "true");
				}
			}
		}
	});

	return has("dojo-bidi")?declare("dui.mobile.TabBarButton", [TabBarButton, BidiTabBarButton]):TabBarButton;
});
