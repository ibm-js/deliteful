/** @module deliteful/list/PageableList */
define([
	"dcl/dcl",
	"delite/register",
	"dojo/string",
	"requirejs-dplugins/Promise!",
	"requirejs-dplugins/jquery!attributes/classes",
	"decor/sniff",
	"./List",
	"./Renderer",
	"delite/handlebars!./List/_PageLoaderRenderer.html",
	"requirejs-dplugins/i18n!./List/nls/Pageable"
], function (dcl, register, string, Promise, $, has, List, Renderer, template, messages) {

	/*
	 * A clickable renderer that initiate the loading of a page in a pageable list.
	 * It renders an item that has the following properties:
	 * - loadMessage: the label to display when a page is not currently loading
	 * - loadingMessage: the label to display when a page is loading
	 */
	var _PageLoaderRenderer = register("d-list-loader", [HTMLElement, Renderer], {

		/*
		 * The CSS class of the widget
		 * @member {string}
		 * @default "d-list-loader"
		 */
		baseClass: "d-list-loader",

		_setItemAttr: function (item) {
			this._set("item", item);
			if (this.item && !this.loading) {
				this._label.innerHTML = this.item.loadMessage;
			}
		},

		/*
		 * Indicates whether or not a page is currently loading.
		 * @member {boolean}
		 */
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
				$(this).toggleClass("d-loading", loading);
				this._label.innerHTML = loading ? this.item.loadingMessage : this.item.loadMessage;
				$(this._progressIndicator).toggleClass("d-hidden");
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

		/*
		 * HTML element that wraps a progress indicator and an optional label in the render node
		 * @member {HTMLElement} _PageLoaderRenderer#_button
		 * @private
		 */

		/*
		 * A progress indicator to report that the loader is currently loading a page
		 * @member {module:deliteful/ProgressIndicator} _PageLoaderRenderer#_progressIndicator
		 * @private
		 */

		/*
		 * An HTML element that displays a label for the loader
		 * @member {HTMLElement} _PageLoaderRenderer#_label
		 * @private
		 */

		/*
		 * The list that the PageLoader loads data for
		 * @member {module:deliteful/list/List} _PageLoaderRenderer#_list
		 * @private
		 */

		//////////// Widget life cycle ///////////////////////////////////////

		postRender: function () {
			// summary:
			//		set the click event handler
			this.on("click", this._load.bind(this));
		},

		template: template,

		//////////// Public methods ///////////////////////////////////////

		/*
		 * Executed before loading a page.
		 * Callback to be implemented by user of the widget
		 * @method _PageLoaderRenderer#beforeLoading
		 * @abstract
		 */

		/*
		 * Performs the actual loading of a page.
		 * Callback to be implemented by user of the widget.
		 * It MUST return a promise that is fulfilled when the load operation is finished.
		 * @method _PageLoaderRenderer#performLoading
		 * @abstract
		 */

		/*
		 * Executed after loading a page.
		 * Callback to be implemented by user of the widget
		 * @method _PageLoaderRenderer#afterLoading
		 * @abstract
		 */

		//////////// Private methods ///////////////////////////////////////

		/*
		 * Handle click events on the widget.
		 * If a loading is already in progress, this method
		 * return undefined. In the other case, it starts a loading
		 * and returns a Promise that resolves when the loading
		 * has completed.
		 * @returns {Promise} or null
		 * @private
		 */
		_load: function () {
			if (this._list.hasAttribute("aria-busy")) { return; }
			this.loading = true;
			var self = this;
			return new Promise(function (resolve, reject) {
				// defer execution so that the new style / class is correctly applied on iOS
				self.defer(function () {
					self.performLoading().then(function () {
						self.loading = false;
						resolve();
					}.bind(this), function (error) {
						self.loading = false;
						reject(error);
						self._queryError(error);
					});
				});
			});
		}
	});

	/**
	 * A widget that renders a scrollable list of items and provides paging.
	 * 
	 * This widget allows displaying the content of a list in pages of items instead of rendering
	 * all items at once.
	 * 
	 * See the {@link https://github.com/ibm-js/deliteful/tree/master/docs/list/PageableList.md user documentation}
	 * for more details.
	 * 
	 * @class module:deliteful/list/PageableList
	 * @augments module:deliteful/list/List
	 */
	return register("d-pageable-list", [HTMLElement, List], /** @lends module:deliteful/list/PageableList# */ {

		/**
		 * if > 0, enable paging while defining the number of items to display per page.
		 * @member {number}
		 * @default 0
		 */
		pageLength: 0,

		/**
		 * The maximum number of pages to display at the same time. If a new page is loaded while
		 * the maximum number of pages is already displayed, another page will be unloaded from the list
		 * to make room for the new page.
		 * @member {number}
		 * @default 0
		 */
		maxPages: 0,

		/**
		 * The message displayed on the previous page loader when it can be clicked
		 * to load the previous page. This message can contains placeholder for the
		 * List attributes to be replaced by their runtime value. For example, the
		 * message can include the value of the pageLength attribute by using the
		 * placeholder `${pageLength}`.
		 * @member {string}
		 * @default localized version of "Click to load ${pageLength} more items"
		 */
		loadPreviousMessage: messages["default-load-message"],

		/**
		 * The message displayed on the next page loader when it can be clicked
		 * to load the next page. This message can contains placeholder for the
		 * List attributes to be replaced by their runtime value. For example, the
		 * message can include the value of the pageLength attribute by using the
		 * placeholder `${pageLength}`.
		 * @member {string}
		 * @default localized version of "Click to load ${pageLength} more items"
		 */
		loadNextMessage: messages["default-load-message"],

		/**
		 * Indicates whether or not to use auto paging. If true, automatically loads the next or previous page when
		 * the scrolling reaches the bottom or the top of the list content.
		 * @member {boolean}
		 * @default false
		 */
		autoPaging: false,
		_setAutoPagingAttr: function (value) {
			this._set("autoPaging", value);
			if (this._autoPagingHandle) {
				this._autoPagingHandle.remove();
				this._autoPagingHandle = null;
			}
			if (value) {
				this._autoPagingHandle = this.on("scroll", this._scrollHandler.bind(this), this);
			}
		},

		/**
		 * Indicates whether or not to hide the content of the list when loading a new page.
		 * If true, the content of the list is hidden by a loading panel (displaying a progress
		 * indicator and an optional label defined with the property loadingMessage)
		 * while its content is updated with a new page of data.
		 * This attribute is ignored if autoPaging is true.
		 * @member {boolean}
		 * @default false
		 */
		hideOnPageLoad: false,

		/**
		 * The collection of items from which pages are extracted
		 * @member {boolean} module:deliteful/list/Pageable#_collection
		 * @private
		 */
		_collection: null,

		/**
		 * Handle for the auto paging scroll handler (Object with a remove method)
		 * @member {module:deliteful/list/Pageable} module:deliteful/list/Pageable#_autoPagingHandle
		 * @private
		 */

		/**
		 * Spec of the range to use to load a page.
		 * @member {Object} module:deliteful/list/Pageable#_rangeSpec
		 * @private
		 */

		/**
		 * The next page loader.
		 * @member {_PageLoaderRenderer} module:deliteful/list/Pageable#_nextPageLoader
		 * @private
		 */

		/**
		 * The previous page loader.
		 * @member {_PageLoaderRenderer} module:deliteful/list/Pageable#_previousPageLoader
		 * @private
		 */

		/**
		 * Wheter or not the list is currently scrolled at the top or the bottom
		 * @member {boolean} module:deliteful/list/Pageable#_atExtremity
		 * @private
		 */

		/**
		 * One entry per page currently loaded. Each entry contains an array
		 * of the ids of the items displayed in the page.
		 * @member {Array[]} module:deliteful/list/Pageable#_idPages
		 * @private
		 */

		/**
		 * Index of the first item currently loaded.
		 * @member {number}
		 * @default -1
		 * @private
		 */
		_firstLoaded: -1,

		/**
		 * Index of the last item currently loaded.
		 * @member {number}
		 * @default -1
		 * @private
		 */
		_lastLoaded: -1,

		//////////// delite/Store methods ///////////////////////////////////////

		refreshRendering: function (props) {
			if (this.pageLength > 0) {
				if ("store" in props || "query" in props || "_collection" in props)  {
					// Initial loading of the list
					if (this._dataLoaded) {
						this._setBusy(true, true);
						this._empty();
						props.pageLength = true;
					}
					this._idPages = [];
					this._loadNextPage().then(function () {
						this._setBusy(false);
						this._dataLoaded = true;
					}.bind(this), function (error) {
						this._setBusy(false);
						this._queryError(error);
					}.bind(this));
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
			}
		},

		processCollection: dcl.superCall(function (sup) {
			return function (collection) {
				if (this.pageLength === 0) {
					sup.apply(this, arguments);
				}
				this._collection = collection;
			};
		}),

		//////////// Private methods ///////////////////////////////////////

		/**
		 * Adds or removes the identity of an item in idPages
		 * @param {boolean} add true to add, false to remove
		 * @param {number} index Index of the item in the tracked collection
		 * @param {Object} identity Identity to add (only if add is true)
		 * @private
		 */
		_updateIdPages: function (add, index, identity) {
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

		/**
		 * Loads the next page of items if available.
		 * @private
		 */
		_loadNextPage: function () {
			if (!this._rangeSpec) {
				this._rangeSpec = {
					start: 0,
					count: this.pageLength
				};
				this._firstLoaded = this._rangeSpec.start;
			}
			if (this._nextPageLoader) {
				this._rangeSpec.start = this._lastLoaded + 1;
				this._rangeSpec.count = this.pageLength;
			}
			var results = this._collection.fetchRange({start: this._rangeSpec.start,
				end: this._rangeSpec.start + this._rangeSpec.count});
			return results.then(function (items) {
				var page = items.map(function (item) {
					return this.itemToRenderItem(item);
				}, this);
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
			}.bind(this));
		},

		/**
		 * Loads the previous page of items if available.
		 * @private
		 */
		_loadPreviousPage: function () {
			this._rangeSpec.count = this.pageLength;
			this._rangeSpec.start = this._firstLoaded - this.pageLength;
			if (this._rangeSpec.start < 0) {
				this._rangeSpec.count += this._rangeSpec.start;
				this._rangeSpec.start = 0;
			}
			var results = this._collection.fetchRange({start: this._rangeSpec.start,
				end: this._rangeSpec.start + this._rangeSpec.count});
			return results.then(function (items) {
				var page = items.map(function (item) {
					return this.itemToRenderItem(item);
				}, this);
				if (page.length) {
					var i;
					var idPage = page.map(function (item) {
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
			}.bind(this));
		},

		/**
		 * Unloads a page.
		 * @param {boolean} first true to unload the first page, false to unload the last one.
		 * @private
		 */
		_unloadPage: function (first) {
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

		/**
		 * Function to call when the previous page has been loaded.
		 * @param {Object[]} items the items in the previous page.
		 * @private
		 */
		_previousPageReadyHandler: function (items) {
			var renderer = this._getFirstVisibleRenderer();
			var nextRenderer = renderer.nextElementSibling;
			if (this.navigatedDescendant) {
				if (renderer && this._previousPageLoader && this._previousPageLoader.loading) {
					this.navigateTo(renderer.renderNode);
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
				this._previousPageLoader.placeAt(this, "first");
			}
			// the renderer may have been destroyed and replaced by another one (categorized lists)
			if (renderer._destroyed) {
				renderer = nextRenderer;
			}
			if (renderer) {
				var previous = renderer.previousElementSibling;
				if (previous && previous.renderNode) {
					var currentActiveElement = this.navigatedDescendant ? null : this.ownerDocument.activeElement;
					this.navigateTo(previous.renderNode);
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
		/**
		 * Function to call when the next page has been loaded.
		 * @param {Object[]} items the items in the next page.
		 * @private
		 */
		_nextPageReadyHandler: function (items) {
			var renderer = this._getLastVisibleRenderer();
			if (this.navigatedDescendant) {
				if (renderer) {
					this.navigateTo(renderer.renderNode);
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
					this._nextPageLoader.placeAt(this);
				}
			} else {
				if (items.length === this._rangeSpec.count) {
					this._createNextPageLoader();
				}
			}
			if (renderer) {
				var next = renderer.nextElementSibling;
				if (next && next.renderNode) {
					var currentActiveElement = this.navigatedDescendant ? null : this.ownerDocument.activeElement;
					this.navigateTo(next.renderNode);
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

		/**
		 * Returns the last renderer that is visible in the scroll viewport.
		 * @private
		 */
		_getLastVisibleRenderer: function () {
			var renderer = this._getLastRenderer();
			while (renderer) {
				if (this.getBottomDistance(renderer) <= 0) {
					break;
				}
				renderer = renderer.previousElementSibling;
			}
			return renderer;
		},

		/**
		 * Returns the first renderer that is visible in the scroll viewport.
		 * @private
		 */
		_getFirstVisibleRenderer: function () {
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

		/**
		 * Handler for scroll events (auto paging).
		 * @private
		 */
		_scrollHandler: function () {
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

		/**
		 * Creates the next page loader widget
		 * @private
		 */
		_createNextPageLoader: function () {
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
			this._nextPageLoader.placeAt(this);
		},

		/**
		 * Creates the previous page loader widget
		 * @private
		 */
		_createPreviousPageLoader: function () {
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
			this._previousPageLoader.placeAt(this, "first");
		},

		//////////// List methods overriding ///////////////////////////////////////

		itemRemoved: dcl.superCall(function (sup) {
			return function (index) {
				if (this.pageLength > 0) {
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
				} else {
					sup.apply(this, arguments);
				}
			};
		}),

		itemAdded: dcl.superCall(function (sup) {
			return function (index, item) {
				if (this.pageLength > 0) {
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
				} else {
					sup.apply(this, arguments);
				}
			};
		}),

		_empty: dcl.superCall(function (sup) {
			return function () {
				sup.call(this, arguments);
				if (this.pageLength > 0) {
					this._nextPageLoader = null;
					this._previousPageLoader = null;
					this._rangeSpec = null;
					this._untrack();
					this._firstLoaded = this._lastLoaded = -1;
				}
			};
		}),

		_getNextRenderer: dcl.superCall(function (sup) {
			//	make sure that no page loader is returned
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
			//	Handle action key on page loaders
			return function (event) {
				if (this._nextPageLoader && this._nextPageLoader.contains(event.target)) {
					event.preventDefault();
					this._nextPageLoader._load();
				} else if (this._previousPageLoader && this._previousPageLoader.contains(event.target)) {
					event.preventDefault();
					this._previousPageLoader._load();
				} else {
					sup.apply(this, arguments);
				}
			};
		}),
		
		handleSelection: dcl.superCall(function (sup) {
			// page loader should never be selected when clicked
			return function (event) {
				var renderer = this.getEnclosingRenderer(event.target);
				if (renderer === this._nextPageLoader || renderer === this._previousPageLoader) {
					return;
				} else {
					sup.apply(this, arguments);
				}
			};
		})

	});

});
