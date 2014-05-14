define(["dcl/dcl",
		"delite/register",
		"dojo/on",
		"dojo/string",
		"dojo/when",
		"dojo/Deferred",
		"dojo/dom",
		"dojo/dom-class",
		"dojo/sniff",
		"delite/Widget",
		"./Renderer",
		"../ProgressIndicator",
		"requirejs-dplugins/i18n!./List/nls/Pageable"
], function (dcl, register, on, string, when, Deferred, dom, domClass, has,
		Widget, Renderer, ProgressIndicator, messages) {

	// module:
	//		deliteful/list/Pageable

	var _PageLoaderRenderer = register("d-list-loader", [HTMLElement, Renderer], {
		// summary:
		//		A clickable renderer that initiate the loading of a page in a pageable list.
		//		It renders an item that has the following properties:
		//		- loadMessage: the label to display when a page is not currently loading
		//		- loadingMessage: the label to display when a page is loading

		// baseClass: String
		//		the CSS class of the widget
		baseClass: "d-list-loader",

		// loading: Boolean
		//		true if a page is loading, false otherwise
		loading: false,
		_setLoadingAttr: function (/*boolean*/loading) {
			// summary:
			//		Set the loading status of the widget
			this._set("loading", loading);
			// always execute beforeLoading, event if the page loader widget was destroyed
			if (loading) {
				this.beforeLoading();
			}
			if (!this._destroyed) {
				domClass.toggle(this, "d-loading", loading);
				this._label.innerHTML = loading ? this.item.loadingMessage : this.item.loadMessage;
				domClass.toggle(this._progressIndicator, "d-hidden");
				this._progressIndicator.active = loading;
				if (loading) {
					this._button.setAttribute("aria-disabled", "true");
				} else {
					this._button.removeAttribute("aria-disabled");
				}
			}
			// always execute afterLoading, event if the page loader widget was destroyed
			if (!loading) {
				this.afterLoading();
			}
		},

		/*====
		// HTML element that wraps a progress indicator and an optional label in the render node
		_button: null,

		// A progress indicator to report that the loader is currently loading a page
		_progressIndicator: null,
		
		// An HTML element that displays a label for the loader
		_label: null,
		
		// The list that the PageLoader loads data for
		_list: null,
		 ====*/

		//////////// Widget life cycle ///////////////////////////////////////

		postCreate: function () {
			// summary:
			//		set the click event handler
			this.on("click", this._load.bind(this));
		},

		buildRendering: dcl.superCall(function (sup) {
			// summary:
			//		creates the button that contains a progress indicator and an optional label
			return function () {
				sup.apply(this, arguments);
				var spacer = this.renderNode.appendChild(this.ownerDocument.createElement("div"));
				spacer.className = "d-spacer";
				this.renderNode.appendChild(spacer);
				this._button = this.renderNode.appendChild(this.ownerDocument.createElement("div"));
				this._button.setAttribute("role", "button");
				this._button.setAttribute("navindex", "0");
				this._progressIndicator = new ProgressIndicator();
				domClass.toggle(this._progressIndicator, "d-hidden");
				this._button.appendChild(this._progressIndicator);
				this._label = this.ownerDocument.createElement("div");
				this._button.appendChild(this._label);
				this.renderNode.appendChild(this._button);
				spacer = this.renderNode.appendChild(this.ownerDocument.createElement("div"));
				spacer.className = "d-spacer";
				this.renderNode.appendChild(spacer);
			};
		}),

		//////////// Renderer life cycle ///////////////////////////////////////

		render: function () {
			if (!this.loading) {
				this._label.innerHTML = this.item.loadMessage;
			}
		},

		//////////// Public methods ///////////////////////////////////////

		/*====
		beforeLoading: function () {
			// summary:
			//		Executed before loading a page.
			// description:
			// 		Callback to be implemented by user of the widget
			// tags:
			//		extension
		},

		performLoading: function () {
			// summary:
			//		Performs the actual loading of a page.
			// description:
			// 		Callback to be implemented by user of the widget
			// 		It MUST return a promise that is fulfilled when the load operation is finished.
			// tags:
			//		extension
		},

		afterLoading: function () {
			// summary:
			//		Executed after loading a page.
			// description:
			// 		Callback to be implemented by user of the widget
			// tags:
			//		extension
		},
		====*/

		//////////// Private methods ///////////////////////////////////////

		_load: function () {
			// summary:
			//		Handle click events on the widget.
			//		If a loading is already in progress, this method
			//		return undefined. In the other case, it starts a loading
			//		and returns a Promise that resolves when the loading
			//		has completed.
			if (this._list.hasAttribute("aria-busy")) { return; }
			var def = new Deferred();
			this.loading = true;
			// defer execution so that the new style / class is correctly applied on iOS
			this.defer(function () {
				this.performLoading().then(function () {
					this.loading = false;
					def.resolve();
				}.bind(this), function (error) {
					this.loading = false;
					def.reject(error);
					this._queryError(error);
				}.bind(this));
			}.bind(this));
			return def; // dojo/Deferred
		}
	});

	return dcl(null, {
		// summary:
		//		A Mixin for deliteful/List that provides paging.
		//
		// description:
		//		This mixin allows displaying the content of a list in pages of items instead of rendering
		//		all items at once.
		//
		//		See the user documentation at https://github.com/ibm-js/deliteful/tree/master/docs/list/Pageable.md

		// pageLength: int
		//		if > 0, enable paging while defining the number of items to display per page.
		pageLength: 0,

		// maxPages: int
		//		the maximum number of pages to display at the same time. If a new page is loaded while
		//		the maximum number of pages is already displayed, another page will be unloaded from the list
		//		to make room for the new page.
		maxPages: 0,

		// loadPreviousMessage: String
		//		The message displayed on the previous page loader when it can be clicked
		//		to load the previous page. This message can contains placeholder for the
		//		List attributes to be replaced by their runtime value. For example, the
		//		message can include the value of the pageLength attribute by using the
		//		placeholder ${pageLength}.
		loadPreviousMessage: messages["default-load-message"],

		// loadNextMessage: String
		//		The message displayed on the next page loader when it can be clicked
		//		to load the next page. This message can contains placeholder for the
		//		List attributes to be replaced by their runtime value. For example, the
		//		message can include the value of the pageLength attribute by using the
		//		placeholder ${pageLength}.
		loadNextMessage: messages["default-load-message"],

		// autoPaging: Boolean
		//		If true, automatically loads the next or previous page when
		//		the scrolling reaches the bottom or the top of the list content.
		autoPaging: false,
		_setAutoPagingAttr: function (value) {
			this._set("autoPaging", value);
			if (this._autoPagingHandle) {
				this._autoPagingHandle.remove();
				this._autoPagingHandle = null;
			}
			if (value) {
				this._autoPagingHandle = this.own(on(this.scrollableNode, "scroll", this._scrollHandler.bind(this)))[0];
			}
		},

		// hideOnPageLoad: Boolean
		//		If true, the content of the list is hidden by a loading panel (displaying a progress
		//		indicator and an optional label defined with the property loadingMessage)
		//		while its content is updated with a new page of data.
		//		This attribute is ignored if autoPaging is true.
		hideOnPageLoad: false,

		/*=====
		 // _autoPagingHandle: Object with a remove method
		 //	handle for the auto paging scroll handler
		 _autoPagingHandle: null

		// _rangeSpec: Object
		//		store the spec of the range to use to load a page.
		_rangeSpec: null,

		// _nextPageLoader: _PageLoaderRenderer
		//		the next page loader.
		_nextPageLoader: null,

		// _previousPageLoader: _PageLoaderRenderer
		//		the previous page loader.
		_previousPageLoader: null,

		// _atExtremity: Boolean
		//		true if the list is currently scrolled at the top or the bottom,
		//		false otherwise.
		_atExtremity: false,

		// _idPages: Object[][]
		//		one entry per page currently loaded. Each entry contains an array
		//		of the ids of the items displayed in the page.
		_idPages: null,
		=====*/

		// _firstLoaded: int
		//		index of the first item currently loaded.
		_firstLoaded: -1,

		// _lastLoaded: int
		//		index of the last item currently loaded.
		_lastLoaded: -1,

		//////////// Widget life cycle ///////////////////////////////////////

		preCreate: function () {
			// summary:
			//		Set invalidating properties.
			// tags:
			//		protected
			this.addInvalidatingProperties({
				"pageLength": "invalidateProperty",
				"loadPreviousMessage": "invalidateProperty",
				"loadNextMessage": "invalidateProperty",
				"loadingMessage": "invalidateProperty"
			});
		},

		//////////// delite/Store methods ///////////////////////////////////////

		refreshProperties: dcl.superCall(function (sup) {
			return function (props) {
				var doQuery = props.store || props.query;
				props.store = props.query = false;
				sup.call(this, props);
				if (doQuery)  {
					// Initial loading of the list
					if (this._dataLoaded) {
						this._setBusy(true, true);
						this._empty();
						props.pageLength = true;
					}
					this._idPages = [];
					this._loadNextPage();
				}
				// Update page loader messages as they may depend on any property of the List
				if (this._previousPageLoader) {
					this._previousPageLoader.item = {
							loadMessage: string.substitute(this.loadPreviousMessage, this),
							loadingMessage: this.loadingMessage
						};
				}
				if (this._nextPageLoader) {
					this._nextPageLoader.item = {
							loadMessage: string.substitute(this.loadNextMessage, this),
							loadingMessage: this.loadingMessage
						};
				}
			};
		}),

		initItems: function (page) {
			if (this._rangeSpec.forward) {
				if (page.length) {
					var idPage = page.map(function (item) {
						return this.getIdentity(item);
					}, this);
					this._lastLoaded = this._rangeSpec.start + idPage.length - 1;
					this._idPages.push(idPage);
				}
				this._nextPageReadyHandler(page);
				// TODO: May need to force repaint here,
				// at least on iOS (iPad 4, iOS 7.0.6). TEST ON OTHER DEVICES ???!!!
			} else {
				if (page.length) {
					var i;
					idPage = page.map(function (item) {
						return this.getIdentity(item);
					}, this);
					var previousPageIds = this._idPages[0];
					for (i = 0; i < idPage.length; i++) {
						if (previousPageIds.indexOf(idPage[i]) >= 0) {
							// remove the duplicate (happens if an element was deleted before the first one displayed)
							page.splice(i, 1);
							idPage.splice(i, 1);
							i--;
						}
					}
					this._firstLoaded = this._rangeSpec.start;
					this._idPages.unshift(idPage);
				}
				this._previousPageReadyHandler(page);
			}
			this._setBusy(false);
			this._dataLoaded = true;
		},

		//////////// Private methods ///////////////////////////////////////

		_updateIdPages: function (add, index, identity) {
			// summary:
			//		add or remove the identity of an item in idPages
			// add: boolean
			//		true to add, false to remove
			// index: integer
			//		Index of the item in the tracked collection
			// identity: object
			//		Identity to add (only if add is true)
			var pageFirstIndex = this._firstLoaded;
			for (var pageIndex = 0; pageIndex < this._idPages.length; pageIndex++) {
				var pageLastIndex = pageFirstIndex + this._idPages[pageIndex].length - 1;
				if (index >= pageFirstIndex && index <= pageLastIndex) {
					if (add) {
						this._idPages[pageIndex].splice(index - pageFirstIndex, 0, identity);
					} else {
						this._idPages[pageIndex].splice(index - pageFirstIndex, 1);
					}
					break;
				} else {
					pageFirstIndex += this._idPages[pageIndex].length;
				}
			}
		},

		_postProcessStore: function (collection) {
			var data = this.postProcessStore ? this.postProcessStore(collection) : collection;
			return data.range(this._rangeSpec.start, this._rangeSpec.start + this._rangeSpec.count);
		},

		_loadNextPage: function () {
			// summary:
			//		load the next page of items if available.
			if (!this._rangeSpec) {
				this._rangeSpec = {};
				if (this.pageLength > 0) {
					this._rangeSpec.start = 0;
					this._rangeSpec.count = this.pageLength;
					this._firstLoaded = this._rangeSpec.start;
				}
			}
			if (this._nextPageLoader) {
				this._rangeSpec.start = this._lastLoaded + 1;
				this._rangeSpec.count = this.pageLength;
			}
			this._rangeSpec.forward = true;
			return this.queryStoreAndInitItems(this.preProcessStore, this._postProcessStore);
		},

		_loadPreviousPage: function () {
			// summary:
			//		load the previous page of items if available.
			this._rangeSpec.count = this.pageLength;
			this._rangeSpec.start = this._firstLoaded - this.pageLength;
			if (this._rangeSpec.start < 0) {
				this._rangeSpec.count += this._rangeSpec.start;
				this._rangeSpec.start = 0;
			}
			this._rangeSpec.forward = false;
			return this.queryStoreAndInitItems(this.preProcessStore, this._postProcessStore);
		},

		_unloadPage: function (/*Boolean*/first) {
			// summary:
			//		unload a page.
			// first: Boolean
			//		true to unload the first page, false to unload the last one.
			var idPage, i;
			if (first) {
				idPage = this._idPages.shift();
				this._firstLoaded += idPage.length;
				for (i = 0; i < idPage.length; i++) {
					this._removeRenderer(this.getItemRendererByIndex(0), true);
				}
				if (idPage.length && !this._previousPageLoader) {
					this._createPreviousPageLoader();
				}
				// if the next page is also empty, unload it too
				if (this._idPages.length && !this._idPages[0].length) {
					this._unloadPage(first);
				}
			} else {
				idPage = this._idPages.pop();
				this._lastLoaded -= idPage.length;
				for (i = 0; i < idPage.length; i++) {
					this._removeRenderer(this.getRendererByItemId(idPage[i]), true);
				}
				if (idPage.length && !this._nextPageLoader) {
					this._createNextPageLoader();
				}
				// if the previous page is also empty, unload it too
				if (this._idPages.length && !this._idPages[this._idPages.length - 1].length) {
					this._unloadPage(first);
				}
			}
		},

		_previousPageReadyHandler: function (/*array*/ items) {
			// summary:
			//		function to call when the previous page has been loaded.
			// items: Array
			//		the items in the previous page.
			var renderer = this._getFirstVisibleRenderer();
			var nextRenderer = renderer.nextElementSibling;
			if (this.focusedChild) {
				if (renderer && this._previousPageLoader && this._previousPageLoader.loading) {
					this.focusChild(renderer.renderNode);
				}
			}
			this._renderNewItems(items, true);
			if (this.maxPages && this._idPages.length > this.maxPages) {
				this._unloadPage(false);
			}
			if (this._firstLoaded === 0) {
				// no more previous page
				this._previousPageLoader.destroy();
				this._previousPageLoader = null;
			} else {
				this._previousPageLoader.placeAt(this.containerNode, "first");
			}
			// the renderer may have been destroyed and replaced by another one (categorized lists)
			if (renderer._destroyed) {
				renderer = nextRenderer;
			}
			if (renderer) {
				var previous = renderer.previousElementSibling;
				if (previous && previous.renderNode) {
					var currentActiveElement = this.focusedChild ? null : this.ownerDocument.activeElement;
					this.focusChild(previous.renderNode);
					// scroll the focused node to the top of the screen.
					// To avoid flickering, we do not wait for a focus event
					// to confirm that the child has indeed been focused.
					this.scrollBy({y: this.getTopDistance(previous)});
					if (currentActiveElement) {
						currentActiveElement.focus();
					}
				}
			}
		},

		/*jshint maxcomplexity: 11*/
		_nextPageReadyHandler: function (/*array*/ items) {
			// summary:
			//		function to call when the next page has been loaded.
			// items: Array
			//		the items in the next page.
			var renderer = this._getLastVisibleRenderer();
			if (this.focusedChild) {
				if (renderer) {
					this.focusChild(renderer.renderNode);
				}
			}
			this._renderNewItems(items, false);
			if (this.maxPages && this._idPages.length > this.maxPages) {
				this._unloadPage(true);
			}
			if (this._nextPageLoader) {
				if (items.length !== this._rangeSpec.count) {
					// no more next page
					this._nextPageLoader.destroy();
					this._nextPageLoader = null;
				} else {
					this._nextPageLoader.placeAt(this.containerNode);
				}
			} else {
				if (items.length === this._rangeSpec.count) {
					this._createNextPageLoader();
				}
			}
			if (renderer) {
				var next = renderer.nextElementSibling;
				if (next && next.renderNode) {
					var currentActiveElement = this.focusedChild ? null : this.ownerDocument.activeElement;
					this.focusChild(next.renderNode);
					// scroll the focused node to the bottom of the screen.
					// To avoid flickering, we do not wait for a focus event
					// to confirm that the child has indeed been focused.
					this.scrollBy({y: this.getBottomDistance(next)});
					if (currentActiveElement) {
						currentActiveElement.focus();
					}
				}
			}
		},
		/*jshint maxcomplexity: 10*/

		_getLastVisibleRenderer: function () {
			// summary:
			//		returns the last renderer that is visible in the scroll viewport.
			var renderer = this._getLastRenderer();
			while (renderer) {
				if (this.getBottomDistance(renderer) <= 0) {
					break;
				}
				renderer = renderer.previousElementSibling;
			}
			return renderer;
		},

		_getFirstVisibleRenderer: function () {
			// summary:
			//		returns the first renderer that is visible in the scroll viewport.
			var renderer = this._getFirstRenderer();
			while (renderer) {
				if (this.getTopDistance(renderer) >= 0) {
					break;
				}
				renderer = renderer.nextElementSibling;
			}
			return renderer;
		},

		//////////// Event handlers ///////////////////////////////////////

		_scrollHandler: function () {
			// summary:
			//		handler for scroll events (auto paging).
			if (this.isTopScroll()) {
				if (!this._atExtremity && this._previousPageLoader) {
					this._previousPageLoader._load();
				}
				this._atExtremity = true;
			} else if (this.isBottomScroll()) {
				if (!this._atExtremity && this._nextPageLoader) {
					this._nextPageLoader._load();
				}
				this._atExtremity = true;
			} else {
				this._atExtremity = false;
			}
		},

		//////////// Page loaders creation ///////////////////////////////////////

		_createNextPageLoader: function () {
			// summary:
			//		create the next page loader widget
			/* jshint newcap: false*/
			this._nextPageLoader = new _PageLoaderRenderer({
				item: {
					loadMessage: string.substitute(this.loadNextMessage, this),
					loadingMessage: this.loadingMessage
				},
				beforeLoading: function () {
					var showLoadingPanel = this.hideOnPageLoad && !this.autoPaging;
					this._setBusy(true, showLoadingPanel);
				}.bind(this),
				afterLoading: function () {
					this._setBusy(false);
				}.bind(this),
				performLoading: function () {
					return this._loadNextPage();
				}.bind(this),
				_list: this
			});
			this._nextPageLoader.placeAt(this.containerNode);
			this._nextPageLoader.startup();
		},

		_createPreviousPageLoader: function () {
			// summary:
			//		create the previous page loader widget
			/* jshint newcap: false*/
			this._previousPageLoader = new _PageLoaderRenderer({
				item: {
					loadMessage: string.substitute(this.loadPreviousMessage, this),
					loadingMessage: this.loadingMessage
				},
				beforeLoading: function () {
					var showLoadingPanel = this.hideOnPageLoad && !this.autoPaging;
					this._setBusy(true, showLoadingPanel);
				}.bind(this),
				afterLoading: function () {
					this._setBusy(false);
				}.bind(this),
				performLoading: function () {
					return this._loadPreviousPage();
				}.bind(this),
				_list: this
			});
			this._previousPageLoader.placeAt(this.containerNode, "first");
			this._previousPageLoader.startup();
		},

		//////////// List methods overriding ///////////////////////////////////////

		itemRemoved: dcl.superCall(function (sup) {
			return function (index) {
				if (this._firstLoaded <= index && index <= this._lastLoaded) {
					// Remove the item id in _idPages
					this._updateIdPages(false, index);
					sup.call(this, index - this._firstLoaded);
				}
				if (index < this._firstLoaded) {
					this._firstLoaded--;
				}
				if (index <= this._lastLoaded) {
					this._lastLoaded--;
				}
				if (this._firstLoaded === 0 && this._previousPageLoader) {
					this._previousPageLoader.destroy();
					this._previousPageLoader = null;
				}
			};
		}),

		itemAdded: dcl.superCall(function (sup) {
			return function (index, item) {
				if (this._firstLoaded < index && index <= this._lastLoaded) {
					// Add the item id in _idPages
					this._updateIdPages(true, index, this.getIdentity(item));
					this._lastLoaded++;
					sup.call(this, index - this._firstLoaded, item);
				} else if (index <= this._firstLoaded) {
					this._firstLoaded++;
					this._lastLoaded++;
					if (!this._previousPageLoader) {
						this._createPreviousPageLoader();
					}
				} else if (index > this._lastLoaded) {
					if (!this._nextPageLoader) {
						this._createNextPageLoader();
					}
				}
			};
		}),

		_empty: dcl.superCall(function (sup) {
			return function () {
				sup.call(this, arguments);
				this._nextPageLoader = null;
				this._previousPageLoader = null;
				this._rangeSpec = null;
				this._untrack();
				this._firstLoaded = this._lastLoaded = -1;
			};
		}),

		_getNextRenderer: dcl.superCall(function (sup) {
			// summary:
			//		make sure that no page loader is returned
			return function (renderer, /*jshint unused:vars*/dir) {
				var value = sup.apply(this, arguments);
				if ((this._nextPageLoader && value === this._nextPageLoader)
					|| (this._previousPageLoader && value === this._previousPageLoader)) {
					value = null;
				}
				return value;
			};
		}),

		_spaceKeydownHandler: dcl.superCall(function (sup) {
			// summary:
			//		handle action key on page loaders
			return function (event) {
				if (this._nextPageLoader && dom.isDescendant(event.target, this._nextPageLoader)) {
					event.preventDefault();
					this._nextPageLoader._load();
				} else if (this._previousPageLoader && dom.isDescendant(event.target, this._previousPageLoader)) {
					event.preventDefault();
					this._previousPageLoader._load();
				} else {
					sup.apply(this, arguments);
				}
			};
		})

	});
});