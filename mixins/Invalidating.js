define(["dcl/dcl", "dojo/_base/lang", "../Widget"], function (dcl, lang, Widget) {

	return dcl(Widget, {
		// summary:
		//		Mixin for classes (usually widgets) that watch invalidated properties and delay the rendering
		//		after these properties modifications to the next execution frame. The receiving class must extend
		//		dojo/Stateful and dojo/Evented or dui/Widget.

		_renderHandle: null,

		// _invalidatingProperties: {}
		//		A hash of properties to watch for to trigger properties invalidation and/or rendering
		//		invalidation.
		//		This list must be initialized by the time buildRendering() completes, usually in preCreate()
		//		using addInvalidatingProperties. Default value is null.
		_invalidatingProperties: null,
		// _invalidatedProperties: Object
		//		A hash of invalidated properties either to refresh them or refresh the rendering
		_invalidatedProperties: null,
		// invalidProperties: Boolean
		//		Whether at least one property is invalid or not. This is a readonly information, one must call
		//		invalidateProperties to modify this flag.
		invalidProperties: false,
		// invalidRenderering: Boolean
		//		Whether the rendering is invalid or not. This is a readonly information, one must call
		//		invalidateRendering to modify this flag.
		invalidRendering: false,

		// Listen for any changes to properties after the widget has been rendered,
		// including when declarative properties (ex: iconClass=xyz) are applied at
		// end of Widget.createdCallback().
		buildRendering: dcl.after(function () {
			// tags:
			//		protected
			if (this._invalidatingProperties) {
				var props = Object.keys(this._invalidatingProperties);
				for (var i = 0; i < props.length; i++) {
					this.watch(props[i], lang.hitch(this, this._invalidatingProperties[props[i]]));
				}
			}
			this._invalidatedProperties = {};
		}),

		addInvalidatingProperties: function () {
			// summary:
			//		Add the properties listed as parameters to the watched properties to trigger invalidation.
			// 		This method must be called during the startup lifecycle, before buildRendering() completes.
			//		It is typically used by subclasses of a _Invalidating class to
			// 		add more properties	to watch for.
			// tags:
			//		protected
			if (this._invalidatingProperties == null) {
				this._invalidatingProperties = {};
			}
			for (var i = 0; i < arguments.length; i++) {
				if (typeof arguments[i] === "string") {
					// we just want the rendering to be refreshed
					this._invalidatingProperties[arguments[i]] = "invalidateRendering";
				} else {
					// we just merge object keys/values into our invalidate list
					var props = Object.keys(arguments[i]);
					for (var j = 0; j < props.length; j++) {
						this._invalidatingProperties[props[j]] = arguments[i][props[j]];
					}
				}
			}
		},
		invalidateProperty: function (name) {
			// summary:
			//		Invalidating the property for the next execution frame.
			// name: String?
			//		The name of the property to invalidate. If absent then re-validation is asked without a
			//		particular property being invalidated.
			// tags:
			//		protected
			if (name) {
				this._invalidatedProperties[name] = true;
			}
			if (!this.invalidProperties) {
				this.invalidProperties = true;
				// if we have a pending render, let's cancel it to execute it post properties refresh
				if (this._renderHandle) {
					this._renderHandle.remove();
					this.invalidRendering = false;
					this._renderHandle = null;
				}
				this.defer("validateProperties");
			}
		},
		invalidateRendering: function (name) {
			// summary:
			//		Invalidating the rendering for the next execution frame.
			// name: String?
			//		The name of the property to invalidate. If absent then re-validation is asked without a
			//		particular property being invalidated.
			// tags:
			//		protected
			if (name) {
				this._invalidatedProperties[name] = true;
			}
			if (!this.invalidRendering) {
				this.invalidRendering = true;
				this._renderHandle = this.defer("validateRendering");
			}
		},
		validateProperties: function () {
			// summary:
			//		Immediately validate the properties if they have been invalidated.
			//		You generally do not call that method yourself.
			// tags:
			//		protected
			if (this.invalidProperties) {
				var props = lang.clone(this._invalidatedProperties);
				this.invalidProperties = false;
				this.refreshProperties(this._invalidatedProperties);
				this.emit("refresh-properties-complete",
					{ invalidatedProperties: props, bubbles: true, cancelable: false });
				// if there are properties still marked invalid pursue further with rendering refresh
				this.invalidateRendering();
			}
		},
		validateRendering: function () {
			// summary:
			//		Immediately validate the rendering if it has been invalidated.
			//		You generally do not call that method yourself.
			// tags:
			//		protected
			if (this.invalidRendering) {
				var props = lang.clone(this._invalidatedProperties);
				this.invalidRendering = false;
				this.refreshRendering(this._invalidatedProperties);
				this._invalidatedProperties = {};
				this.emit("refresh-rendering-complete",
					{ invalidatedProperties: props, bubbles: true, cancelable: false });
			}
		},
		validate: function () {
			// summary:
			//		Immediately validate the properties & the rendering if it has been invalidated.
			//		You generally do not call that method yourself.
			// tags:
			//		protected
			this.validateProperties();
			this.validateRendering();
		},
		refreshProperties: function (props) {
			// summary:
			//		Actually refresh the properties. Implementation should implement that method.
			// props: Object
			//		A hash of invalidated properties.
			// tags:
			//		protected
		},
		refreshRendering: function (props) {
			// summary:
			//		Actually refresh the rendering. Implementation should implement that method.
			// props: Object
			//		A hash of invalidated properties.
			// tags:
			//		protected
		}
	});
});
