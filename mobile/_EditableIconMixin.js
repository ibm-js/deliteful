define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/window",
	"dojo/dom-geometry",
	"dojo/dom-style",
	"dojo/on",
	"dojo/topic",
	"dojo/touch",
	"dui/registry",
	"./IconItem",
	"./viewRegistry",
	"./_css3"
], function(declare, lang, win, domGeometry, domStyle, on, topic, touch, registry, IconItem, has, viewRegistry, css3){

	// module:
	//		dui/mobile/_EditableIconMixin

	return declare("dui.mobile._EditableIconMixin", null, {
		// summary:
		//		A mixin for IconContainer to make it editable.

		deleteIconForEdit: "duiDomButtonBlackCircleCross",
		threshold: 4, // drag threshold value in pixels

		destroy: function(){
			// summary:
			//		Destroys the container.
			if(this._blankItem){
				this._blankItem.destroy();
			}
			this.inherited(arguments);
		},

		startEdit: function(){
			// summary:
			//		Starts the editing.
			if(!this.editable || this.isEditing){ return; }

			this.isEditing = true;
			if(!this._handles){
				this._handles = [
					this.own(on(this.domNode, css3.name("transitionStart"), lang.hitch(this, "_onTransitionStart"))),
					this.own(on(this.domNode, css3.name("transitionEnd"), lang.hitch(this, "_onTransitionEnd")))
				];
			}

			var count = 0;
			this.getChildren().forEach(function(w){
				this.defer(function(){
					w.set("deleteIcon", this.deleteIconForEdit);
					if(w.deleteIconNode){
						w._deleteHandle = this.own(on(w.deleteIconNode, "click", lang.hitch(this, "_deleteIconClicked")))[0];
					}
					w.highlight(0);
				}, 15*count++);
			}, this);

			topic.publish("/dui/mobile/startEdit", this); // pubsub
			this.onStartEdit(); // callback
		},

		endEdit: function(){
			// summary:
			//		Ends the editing.
			if(!this.isEditing){ return; }

			this.getChildren().forEach(function(w){
				w.unhighlight();
				if(w._deleteHandle){
					w._deleteHandle.remove();
					w._deleteHandle = null;
				}
				w.set("deleteIcon", "");
			}, this);

			this._movingItem = null;
			if(this._handles){
				this._handles.forEach(function(h){h.remove();}, this);
				this._handles = null;
			}

			topic.publish("/dui/mobile/endEdit", this); // pubsub
			this.onEndEdit(); // callback
			this.isEditing = false;
		},

		scaleItem: function(/*Widget*/widget, /*Number*/ratio){
			// summary:
			//		Scales an item according to the specified ratio.
			domStyle.set(widget.domNode, css3.add({}, {
				transition: has("android") ? "" : css3.name("transform", true) + " .1s ease-in-out",
				transform: ratio == 1 ? "" : "scale(" + ratio + ")"
			}));			
		},

		_onTransitionStart: function(e){
			// tags:
			//		private
			e.preventDefault();
			e.stopPropagation();

		},

		_onTransitionEnd: function(e){
			// tags:
			//		private
			e.preventDefault();
			e.stopPropagation();

			var w = registry.getEnclosingWidget(e.target);
			w._moving = false;
			domStyle.set(w.domNode, css3.name("transition"), "");
		},

		_onTouchStart: function(e){
			// tags:
			//		private
			if(!this._blankItem){
				this._blankItem = new IconItem();
				this._blankItem.domNode.style.visibility = "hidden";
				this._blankItem._onClick = function(){};
			}
			var item = this._movingItem = registry.getEnclosingWidget(e.target);
			var iconPressed = false;
			var n;
			for(n = e.target; n !== item.domNode; n = n.parentNode){
				if(n === item.iconNode){
					iconPressed = true;
					break;
				}
			}
			if(!iconPressed){ return; }

			if(!this._conn){
				this._conn = [
					this.own(on(this.domNode, touch.move, lang.hitch(this, "_onTouchMove")))[0],
					this.own(on(win.doc, touch.release, lang.hitch(this, "_onTouchEnd")))[0]
				];
			}
			this._touchStartPosX = e.touches ? e.touches[0].pageX : e.pageX;
			this._touchStartPosY = e.touches ? e.touches[0].pageY : e.pageY;
			if(this.isEditing){
				this._onDragStart(e);
			}else{
				// set timer to detect long press
				this._pressTimer = this.defer(function(){
					this.startEdit();
					this._onDragStart(e);
				}, 1000);
			}
		},

		_onDragStart: function(e){
			// tags:
			//		private
			this._dragging = true;

			var movingItem = this._movingItem;
			if(movingItem.get("selected")){
				movingItem.set("selected", false);
			}
			this.scaleItem(movingItem, 1.1);

			var x = e.touches ? e.touches[0].pageX : e.pageX;
			var y = e.touches ? e.touches[0].pageY : e.pageY;
			
			var enclosingScrollable = viewRegistry.getEnclosingScrollable(movingItem.domNode);
			var dx = 0;
			var dy = 0;
			if(enclosingScrollable){ // this node is placed inside a scrollable
				var pos = enclosingScrollable.getPos();
				dx = pos.x;
				dy = pos.y;
				e.preventDefault();
				e.stopPropagation();
			}
			
			var startPos = this._startPos = domGeometry.position(movingItem.domNode, true);
			this._offsetPos = {
				x: startPos.x - x - dx,
				y: startPos.y - y - dy
			};

			this._startIndex = this.getIndexOfChild(movingItem);
			this.addChild(this._blankItem, this._startIndex);
			this.moveChild(movingItem, this.getChildren().length);
			domStyle.set(movingItem.domNode, {
				position: "absolute",
				top: (startPos.y - dy) + "px",
				left: (startPos.x - dx) + "px",
				zIndex: 100
			});
		},

		_onTouchMove: function(e){
			// tags:
			//		private
			var x = e.touches ? e.touches[0].pageX : e.pageX;
			var y = e.touches ? e.touches[0].pageY : e.pageY;
			if(this._dragging){
				domStyle.set(this._movingItem.domNode, {
					top: (this._offsetPos.y + y) + "px",
					left: (this._offsetPos.x + x) + "px"
				});
				this._detectOverlap({x: x, y: y});
				e.preventDefault();
				e.stopPropagation();

			}else{
				var dx = Math.abs(this._touchStartPosX - x);
				var dy = Math.abs(this._touchStartPosY - y);
				if (dx > this.threshold || dy > this.threshold) {
					this._clearPressTimer();					
				}
			}
		},

		_onTouchEnd: function(){
			// tags:
			//		private
			this._clearPressTimer();
			if(this._conn){
				this._conn.forEach(function(h){h.remove();}, this);
				this._conn = null;
			}

			if(this._dragging){
				this._dragging = false;

				var movingItem = this._movingItem;
				this.scaleItem(movingItem, 1.0);
				domStyle.set(movingItem.domNode, {
					position: "",
					top: "",
					left: "",
					zIndex: ""
				});
				var startIndex = this._startIndex;
				var endIndex = this.getIndexOfChild(this._blankItem);
				this.moveChild(movingItem, endIndex);
				this.removeChild(this._blankItem);
				topic.publish("/dui/mobile/moveIconItem", this, movingItem, startIndex, endIndex); // pubsub
				this.onMoveItem(movingItem, startIndex, endIndex); // callback
			}
		},

		_clearPressTimer: function(){
			// tags:
			//		private
			if(this._pressTimer){
				this._pressTimer.remove();
				this._pressTimer = null;
			}
		},

		_detectOverlap: function(/*Object*/point){
			// tags:
			//		private
			var children = this.getChildren(),
				blankItem = this._blankItem,
				blankPos = domGeometry.position(blankItem.domNode, true),
				blankIndex = this.getIndexOfChild(blankItem),
				dir = 1,
				i, w, pos;
			if(this._contains(point, blankPos)){
				return;
			}else if(point.y < blankPos.y || (point.y <= blankPos.y + blankPos.h && point.x < blankPos.x)){
				dir = -1;
			}
			for(i = blankIndex + dir; i>=0 && i<children.length-1; i += dir){
				w = children[i];
				if(w._moving){ continue; }
				pos = domGeometry.position(w.domNode, true);
				if(this._contains(point, pos)){
					this.defer(function(){
						// TODO: this looks wrong, by the time the deferred executes i will have a different value
						this.moveChildWithAnimation(blankItem, dir == 1 ? i+1 : i);
					});
					break;
				}else if((dir == 1 && pos.y > point.y) || (dir == -1 && pos.y + pos.h < point.y)){
					break;
				}
			}
		},

		_contains: function(point, pos){
			// tags:
			//		private
			return pos.x < point.x && point.x < pos.x + pos.w && pos.y < point.y && point.y < pos.y + pos.h;
		},

		_animate: function(/*int*/from, /*int*/to){
			// tags:
			//		private
			if(from == to) { return; }
			var dir = from < to ? 1 : -1;
			var children = this.getChildren();
			var posArray = [];
			var i, j;
			for(i=from; i!=to; i+=dir){
				posArray.push({
					t: (children[i+dir].domNode.offsetTop - children[i].domNode.offsetTop) + "px",
					l: (children[i+dir].domNode.offsetLeft - children[i].domNode.offsetLeft) + "px"
				});
			}
			for(i=from, j=0; i!=to; i+=dir, j++){
				var w = children[i];
				w._moving = true;
				domStyle.set(w.domNode, {
					top: posArray[j].t,
					left: posArray[j].l
				});
				this.defer(lang.hitch(w, function(){
					domStyle.set(this.domNode, css3.add({
						top: "0px",
						left: "0px"
					}, {
						transition: "top .3s ease-in-out, left .3s ease-in-out"
					}));
				}), j*10);
			}
		},

		removeChildWithAnimation: function(/*Widget|Number*/widget){
			// summary:
			//		Removes the given child with animation.
			var index = (typeof widget === "number") ? widget : this.getIndexOfChild(widget);
			this.removeChild(widget);

			// Show remove animation
			if(this._blankItem){
				// #16868 - no _blankItem if calling deleteItem() programmatically, that is
				// without _onTouchStart() being called.
				this.addChild(this._blankItem);
			}
			this._animate(index, this.getChildren().length - 1);
			if(this._blankItem){
				this.removeChild(this._blankItem);
			}
		},

		moveChild: function(/*Widget|Number*/widget, /*Number?*/insertIndex){
			// summary:
			//		Moves a child without animation.
			this.addChild(widget, insertIndex);
			this.paneContainerWidget.addChild(widget.paneWidget, insertIndex);
		},

		moveChildWithAnimation: function(/*Widget|Number*/widget, /*Number?*/insertIndex){
			// summary:
			//		Moves a child with animation.	
			var index = this.getIndexOfChild(this._blankItem);
			this.moveChild(widget, insertIndex);

			// Show move animation
			this._animate(index, insertIndex);
		},

		_deleteIconClicked: function(e){
			// summary:
			//		Internal handler for click events.
			// tags:
			//		private
			if(this.deleteIconClicked(e) === false){ return; } // user's click action
			var item = registry.getEnclosingWidget(e.target);
			this.deleteItem(item);
		},

		deleteIconClicked: function(/*Event*/ /*===== e =====*/){
			// summary:
			//		User-defined function to handle clicks for the delete icon.
			// tags:
			//		callback
		},

		deleteItem: function(/*Widget*/item){
			// summary:
			//		Deletes the given item.
			if(item._deleteHandle){
				item._deleteHandle.remove();
			}
			this.removeChildWithAnimation(item);

			topic.publish("/dui/mobile/deleteIconItem", this, item); // pubsub
			this.onDeleteItem(item); // callback

			item.destroy();
		},

		onDeleteItem: function(/*Widget*/item){
			// summary:
			//		Stub function to connect to from your application.
		},

		onMoveItem: function(/*Widget*/item, /*int*/from, /*int*/to){
			// summary:
			//		Stub function to connect to from your application.
		},

		onStartEdit: function(){
			// summary:
			//		Stub function to connect to from your application.
		},

		onEndEdit: function(){
			// summary:
			//		Stub function to connect to from your application.
		},

		_setEditableAttr: function(/*Boolean*/editable){
			// tags:
			//		private
			this._set("editable", editable);
			if(editable && !this._touchStartHandle){ // Allow users to start editing by long press on IconItems
				this._touchStartHandle = this.own(on(this.domNode, touch.press, lang.hitch(this, "_onTouchStart")))[0];
			}else if(!editable && this._touchStartHandle){
				this._touchStartHandle.remove();
				this._touchStartHandle = null;
			}
		}
	});
});
