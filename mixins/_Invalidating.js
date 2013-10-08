define(["dcl/dcl", "dojo/_base/lang", "../_WidgetBase"],
	function(dcl, lang, _WidgetBase){
		
	return dcl(_WidgetBase, {
		// summary:
		//		Mixin for classes (usually widgets) that watch invalidated properties and delay the rendering
		//		after these properties modifications to the next execution frame. The receiving class must extend
		//		dojo/Stateful and dojo/Evented or dui/_WidgetBase.
		
		// _invalidatingProperties: String[]
		//		The list of properties to watch for to trigger invalidation. This list must be initialized in the
		//		constructor. Default value is null.
		_invalidatingProperties: null,
		// invalidatedProperties: Object
		//		A hash of invalidated properties.
		invalidatedProperties: {},
		// invalidRenderering: Boolean
		//		Whether the rendering is invalid or not. This is a readonly information, one must call 
		//		invalidateRendering to modify this flag. 
		invalidRendering: false,

		createdCallback: dcl.after(function(){
			// tags:
			//		protected
			if(this._invalidatingProperties){
				var params = this.params;
				var props = this._invalidatingProperties;
				for(var i = 0; i < props.length; i++){
					this.watch(props[i], lang.hitch(this, "invalidateRendering"));
					if(params && props[i] in params){
						// if the prop happens to have been passed in the ctor mixin we are invalidated
						this.invalidateRendering(props[i]);
					}
				}
			}
		}),

		addInvalidatingProperties: function(){
			// summary:
			//		Add the properties listed as parameters to the watched properties to trigger invalidation. This method
			// 		must be called during the startup lifecycle, before createdCallback() completes.
			//		It is typically used by subclasses of a _Invalidating class to
			// 		add more properties	to watch for.
			// tags:
			//		protected
			this._invalidatingProperties = this._invalidatingProperties?
				this._invalidatingProperties.concat(Array.prototype.slice.call(arguments)):Array.prototype.slice.call(arguments);
		},
		invalidateRendering: function(name){
			// summary:
			//		Invalidating the rendering for the next executation frame.
			// tags:
			//		protected
			if(!this.invalidatedProperties[name]){
				this.invalidatedProperties[name] = true;
			}
			if(!this.invalidRendering){
				this.invalidRendering = true;
				setTimeout(lang.hitch(this, "validateRendering"), 0);
			}
		},
		validateRendering: function(){
			// summary:
			//		Immediately validate the rendering if it has been invalidated. You generally do not call that method yourself.
			// tags:
			//		protected
			if(this.invalidRendering){
				this.refreshRendering();
				var props = this.invalidatedProperties;
				this.invalidatedProperties = {};
				this.invalidRendering = false;
				this.emit("refresh-complete", { invalidatedProperties: props, bubbles: true, cancelable: false });
			}
		},
		refreshRendering: function(){
			// summary:
			//		Actually refresh the rendering. Implementation should implement that method.
			// tags:
			//		protected
		}
	});
});
