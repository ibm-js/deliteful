define([
	"decor/sniff",
	"intern!object",
	"intern/chai!assert",
	"dojo/Deferred",
	"decor/ObservableArray",
	"delite/register",
	"deliteful/list/PageableList",
	"./resources/ListBaseTestsObservableArray",
	"requirejs-dplugins/Promise!"
], function (has, registerSuite, assert, Deferred, ObservableArray, register,
			 PageableList, ListBaseTestsObservableArray, Promise) {

	/////////////////////////////////
	// List base tests
	/////////////////////////////////

	registerSuite(
		ListBaseTestsObservableArray.buildSuite("list/PageableList-ObservableArray-noPagination-baseListTests",
			PageableList));

	/////////////////////////////////
	// PageableList specific tests
	/////////////////////////////////

	var list = null;

	var waitForCondition = function (func, timeout, interval) {
		var wait = function (def, start) {
			setTimeout(function () {
				if (func()) {
					def.resolve();
				} else {
					if (new Date() - start > timeout) {
						def.reject(new Error("timeout"));
					} else {
						wait(def, start);
					}
				}
			}, interval);
		};
		var def = new Deferred();
		var start = new Date();
		wait(def, start);
		return def;
	};

	var removeTabsAndReturns = function (str) {
		return str.replace(/\t/g, "").replace(/\n/g, "");
	};

	/* jshint maxcomplexity: 11 */
	var assertList = function (list, firstItemNumber, lastItemNumber, missingItemNumbers,
							   previousPageLoader, nextPageLoader, hint) {
		hint = hint || "";
		var listContent = list.containerNode;
		var numberOfItems = lastItemNumber - firstItemNumber + 1 - missingItemNumbers.length;
		assert.strictEqual(listContent.children.length, numberOfItems, hint + " number of children");
		if (previousPageLoader && list._previousPageLoaderVisible) {
			assert.strictEqual(removeTabsAndReturns(list.previousPageLoader.labelNode.textContent),
					"Click to load " + list.pageLength + " more items", hint + " previous page loader");
		}
		for (var i = 0, index = i + firstItemNumber; i < numberOfItems; i++, index++) {
			if (missingItemNumbers.length) {
				while (missingItemNumbers.indexOf(index) >= 0) {
					index++;
				}
			}
			assert.strictEqual(
				removeTabsAndReturns(listContent.children[i].textContent), "item " + index, hint);
		}
		if (nextPageLoader && list._nextPageLoaderVisible) {
			assert.strictEqual(removeTabsAndReturns(list.nextPageLoader.labelNode.textContent),
					"Click to load " + list.pageLength + " more items", hint + " next page loader");
		}
	};

	var assertCategorizedList = function (list, numberOfItems, firstItemNumber, previousPageLoader, nextPageLoader) {
		var numberOfCategories = Math.floor((firstItemNumber + numberOfItems - 1) / 10)
			- Math.floor(firstItemNumber / 10) + 1;
		var lastCategory = null;
		var listContent = list.containerNode;
		assert.strictEqual(numberOfCategories + numberOfItems, listContent.children.length, "number of children");
		if (previousPageLoader && list._previousPageLoaderVisible) {
			assert.strictEqual(removeTabsAndReturns(list.previousPageLoader.labelNode.textContent),
					"Click to load " + list.pageLength + " more items", "previous page loader");
		}
		for (var childIndex = 0, itemIndex = firstItemNumber;
			itemIndex < firstItemNumber + numberOfItems; itemIndex++, childIndex++) {
			var category = Math.floor(itemIndex / 10);
			if (category !== lastCategory) {
				lastCategory = category;
				assert.strictEqual(removeTabsAndReturns(listContent.children[childIndex].textContent),
					"Category " + category);
				childIndex++;
			}
			assert.strictEqual(
				removeTabsAndReturns(listContent.children[childIndex].textContent), "item " + itemIndex);
		}
		if (nextPageLoader && list._nextPageLoaderVisible) {
			assert.strictEqual(removeTabsAndReturns(list.nextPageLoader.labelNode.textContent),
					"Click to load " + list.pageLength + " more items", "next page loader");
		}
	};

	var clickPreviousPageLoader = function (list) {
		return list._loadPreviousPage();
	};

	var clickNextPageLoader = function (list) {
		return list._loadNextPage();
	};

	var testHelpers = {
		"Helper: Removing items in displayed pages": function (/*Deferred*/dfd) {
			/*jshint maxlen: 135*/
			var TIMEOUT = 2000;
			var INTERVAL = 100;
			list = new PageableList({source: new ObservableArray()});
			for (var i = 0; i < 92; i++) {
				list.source.push({label: "item " + i, id: i});
			}
			list.pageLength = 23;
			list.maxPages = 2;
			list.on("new-query-asked", function (evt) {
				evt.setPromise(new Promise(function (resolve) {
					resolve(list.source.slice(evt.start, evt.end));
				}));
			});
			list.placeAt(document.body);
			list.deliver();
			waitForCondition(function () {
				return list.textContent.indexOf("item 22") >= 0;
			}, TIMEOUT, INTERVAL).then(dfd.rejectOnError(function () {
				// initial load (page 1 loaded)
				assertList(list, 0, 22, [], false, true, "initial load");
				// check internal pages references
				assert.strictEqual(list._idPages.length, 1, "A: expect one page loaded");
				assert.strictEqual(list._idPages[0].length, 23, "A: page size");
				for (i = 0; i < 23; i++) {
					assert(list._idPages[0][i] === i);
				}
				// remove two items in the first page (page 1 size will be 21)
				list.source.splice(0, 1); // remove item 0
				list.source.splice(1, 1); // remove item 2
				list.deliver();
				assertList(list, 0, 22, [0, 2], false, true, "page 1 loaded");
				// check internal pages references
				assert.strictEqual(list._idPages.length, 1, "B: expect one page loaded");
				assert.strictEqual(list._idPages[0].length, 21, "B: page size");
				assert(list._idPages[0][0] === 1);
				assert(list._idPages[0][1] === 3);
				for (i = 2; i < 21; i++) {
					assert(list._idPages[0][i] === i + 2);
				}
				// load next page (pages 1 and 2 loaded)
				clickNextPageLoader(list).then(dfd.rejectOnError(function () {
					list.deliver();
					assertList(list, 1, 45, [2], false, true, "page 1 and 2 loaded");
					// remove to items in the second page (page 2 size will be 21)
					list.source.splice(43, 1); // remove item 45
					list.source.splice(41, 1); // remove item 43
					list.deliver();
					assertList(list, 1, 44, [2, 43], false, true, "after removal");
					// load next page (pages 2 and 3 loaded)
					clickNextPageLoader(list).then(dfd.rejectOnError(function () {
						list.deliver();
						assertList(list, 23, 68, [43, 45], true, true, "page 2 and 3 loaded");
						// load previous page (page 1 and 2 loaded)
						clickPreviousPageLoader(list).then(dfd.rejectOnError(function () {
							list.deliver();
							assertList(list, 1, 44, [2, 43], false, true, "page 1 and 2 loaded (second time)");
							// load next page (pages 2 and 3 loaded)
							clickNextPageLoader(list).then(dfd.rejectOnError(function () {
								list.deliver();
								assertList(list, 23, 68, [43, 45], true, true, "page 2 and 3 loaded (second time)");
								// load next page (pages 3 and 4 loaded)
								clickNextPageLoader(list).then(dfd.rejectOnError(function () {
									list.deliver();
									assertList(list, 46, 91, [], true, true, "page 3 and 4 loaded");
									// click once more (pages 3 and 4 loaded still loaded, next loader disappears)
									clickNextPageLoader(list).then(dfd.rejectOnError(function () {
										list.deliver();
										assertList(list, 46, 91, [], true, false,
											"page 3 and 4 loaded and next loader disappears");
										// load previous page (pages 2 and 3 loaded)
										clickPreviousPageLoader(list).then(dfd.rejectOnError(function () {
											list.deliver();
											assertList(list, 21, 68, [43, 45], true, true,
												"page 2 and 3 loaded (third time)");
											// load previous page (pages 1 and 2 loaded)
											clickPreviousPageLoader(list).then(dfd.callback(function () {
												list.deliver();
												assertList(list, 1, 44, [2, 43], false, true,
													"page 1 and 2 loaded (third time)");
											}));
										}));
									}));
								}));
							}));
						}));
					}));
				}));
			}));
			/*jshint maxlen: 120*/
			return dfd;
		},
		"Helper: Removing items in next non displayed page": function (/*Deferred*/dfd) {
			var TIMEOUT = 2000;
			var INTERVAL = 100;
			list = new PageableList({source: new ObservableArray()});
			for (var i = 0; i < 92; i++) {
				list.source.push({label: "item " + i, id: i});
			}
			list.pageLength = 23;
			list.maxPages = 2;
			list.placeAt(document.body);
			// initial load (page 1 loaded)
			list.deliver();
			waitForCondition(function () {
				return list.textContent.indexOf("item 22") >= 0;
			}, TIMEOUT, INTERVAL).then(dfd.rejectOnError(function () {
				assertList(list, 0, 22, [], false, true, "assert 1");
				// Remove items in the next page
				list.source.splice(23, 1); // remove item 23
				list.source.splice(24, 1); // remove item 25
				list.deliver();
				clickNextPageLoader(list).then(dfd.callback(function () {
					list.deliver();
					assertList(list, 0, 47, [23, 25], false, true, "assert 2");
				}));
			}));
			return dfd;
		},
		"Helper: Removing items in previous non displayed page":
			function (/*Deferred*/dfd) {
				var TIMEOUT = 2000;
				var INTERVAL = 100;
				list = new PageableList({source: new ObservableArray()});
				for (var i = 0; i < 92; i++) {
					list.source.push({label: "item " + i, id: i});
				}
				list.pageLength = 23;
				list.maxPages = 2;
				list.placeAt(document.body);
				list.deliver();
				waitForCondition(function () {
					return list.textContent.indexOf("item 22") >= 0;
				}, TIMEOUT, INTERVAL).then(dfd.rejectOnError(function () {
					clickNextPageLoader(list).then(dfd.rejectOnError(function () {
						clickNextPageLoader(list).then(dfd.rejectOnError(function () {
							list.deliver();
							// initial load (page 1 loaded)
							assertList(list, 23, 68, [], true, true, "assert 1");
							// Remove items in the previous page
							list.source.splice(0, 1); // remove item 0
							list.source.splice(11, 1); // remove item 12
							list.source.splice(20, 1); // remove item 22
							list.deliver();
							clickPreviousPageLoader(list).then(dfd.callback(function () {
								list.deliver();
								assertList(list, 1, 45, [12, 22], false, true, "assert 2");
							}));
						}));
					}));
				}));
				return dfd;
			},
		"Helper: Remove item and browse":
			function (/*Deferred*/dfd) {
				var TIMEOUT = 2000;
				var INTERVAL = 100;
				list = new PageableList({source: new ObservableArray()});
				for (var i = 0; i < 91; i++) {
					list.source.push({label: "item " + i, id: i});
				}
				list.pageLength = 23;
				list.maxPages = 2;
				list.style.height = "200px";
				list.on("new-query-asked", function (evt) {
					evt.setPromise(new Promise(function (resolve) {
						resolve(list.source.slice(evt.start, evt.end));
					}));
				});
				list.placeAt(document.body);
				list.deliver();
				waitForCondition(function () {
					return list.textContent.indexOf("item 22") >= 0;
				}, TIMEOUT, INTERVAL).then(dfd.rejectOnError(function () {
					// Click next page loader three times
					clickNextPageLoader(list).then(dfd.rejectOnError(function () {
						clickNextPageLoader(list).then(dfd.rejectOnError(function () {
							clickNextPageLoader(list).then(dfd.rejectOnError(function () {
								// remove item 45
								list.source.splice(45, 1);
								list.deliver();
								// Click previous page loader two times
								clickPreviousPageLoader(list).then(dfd.rejectOnError(function () {
									clickPreviousPageLoader(list).then(dfd.rejectOnError(function () {
										// Click load next page
										clickNextPageLoader(list).then(dfd.callback(function () {
											list.deliver();
											// Check the content of the list
											assertList(list, 22, 68, [45], true, true);
										}));
									}));
								}));
							}));
						}));
					}));
				}));
				return dfd;
			},
		"Helper: Remove all items in non displayed first page removes previous page loader":
			function (/*Deferred*/dfd) {
				var TIMEOUT = 2000;
				var INTERVAL = 100;
				list = new PageableList({source: new ObservableArray()});
				for (var i = 0; i < 91; i++) {
					list.source.push({label: "item " + i, id: i});
				}
				list.pageLength = 23;
				list.maxPages = 2;
				list.style.height = "200px";
				list.placeAt(document.body);
				list.deliver();
				waitForCondition(function () {
					return list.textContent.indexOf("item 22") >= 0;
				}, TIMEOUT, INTERVAL).then(dfd.rejectOnError(function () {
					// Click next page loader two times
					clickNextPageLoader(list).then(dfd.rejectOnError(function () {
						clickNextPageLoader(list).then(dfd.callback(function () {
							// remove all items in the first page
							list.source.splice(0, 23);
							list.deliver();
							// check that the previous page loader has been removed
							assertList(list, 23, 68, [], false, true);
						}));
					}));
				}));
				return dfd;
			},
		"Helper: Add items in displayed page": function (/*Deferred*/dfd) {
			/*jshint maxlen: 140*/
			var TIMEOUT = 2000;
			var INTERVAL = 100;
			list = new PageableList({source: new ObservableArray()});
			for (var i = 0; i < 92; i++) {
				list.source.push({id: i, label: "item " + i});
			}
			list.pageLength = 23;
			list.maxPages = 2;
			list.placeAt(document.body);
			list.deliver();
			waitForCondition(function () {
				return list.textContent.indexOf("item 22") >= 0;
			}, TIMEOUT, INTERVAL).then(dfd.rejectOnError(function () {
				list.source.splice(1, 0, {id: "A", label: "item A"});
				list.source.splice(23, 0, {id: "B", label: "item B"});
				list.deliver();
				// Check internal page representation
				assert.strictEqual(list._idPages.length, 1, "A: number of pages");
				assert.deepEqual(list._idPages[0],
					[0, "A", 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, "B", 22]);
				assert.strictEqual(list._idPages[0].length, 25, "A: number of items in page");
				assert.strictEqual(list.containerNode.children.length, 25, "A: number of list children");
				list.deliver();
				assert.strictEqual(removeTabsAndReturns(list.containerNode.children[0].textContent), "item 0", "A");
				assert.strictEqual(removeTabsAndReturns(list.containerNode.children[1].textContent), "item A", "A");
				for (i = 2; i <= 22; i++) {
					assert.strictEqual(removeTabsAndReturns(list.containerNode.children[i].textContent), "item " + (i - 1), "A");
				}
				assert.strictEqual(removeTabsAndReturns(list.containerNode.children[23].textContent), "item B", "A");
				assert.strictEqual(removeTabsAndReturns(list.containerNode.children[24].textContent), "item 22", "A");
				assert.strictEqual(removeTabsAndReturns(list.nextPageLoader.labelNode.textContent), "Click to load 23 more items", "A");
				clickNextPageLoader(list).then(dfd.rejectOnError(function () {
					assert.strictEqual(list.containerNode.children.length, 48, "B: number of list children");
					list.deliver();
					assert.strictEqual(removeTabsAndReturns(list.containerNode.children[0].textContent), "item 0", "B");
					assert.strictEqual(removeTabsAndReturns(list.containerNode.children[1].textContent), "item A", "B");
					for (i = 2; i <= 22; i++) {
						assert.strictEqual(removeTabsAndReturns(list.containerNode.children[i].textContent), "item " + (i - 1), "B");
					}
					assert.strictEqual(removeTabsAndReturns(list.containerNode.children[23].textContent), "item B", "B");
					for (i = 24; i <= 47; i++) {
						assert.strictEqual(removeTabsAndReturns(list.containerNode.children[i].textContent), "item " + (i - 2), "B");
					}
					assert.strictEqual(removeTabsAndReturns(list.nextPageLoader.labelNode.textContent),
						"Click to load 23 more items", "B");
					// Add an item
					list.source.splice(25, 0, {id: "C", label: "item C"});
					list.deliver();
					assert.strictEqual(list.containerNode.children.length, 49, "C: number of list children");
					assert.strictEqual(removeTabsAndReturns(list.containerNode.children[0].textContent), "item 0", "C");
					assert.strictEqual(removeTabsAndReturns(list.containerNode.children[1].textContent), "item A", "C");
					for (i = 2; i <= 22; i++) {
						assert.strictEqual(removeTabsAndReturns(list.containerNode.children[i].textContent), "item " + (i - 1), "C");
					}
					assert.strictEqual(removeTabsAndReturns(list.containerNode.children[23].textContent), "item B", "C");
					assert.strictEqual(removeTabsAndReturns(list.containerNode.children[24].textContent), "item 22", "C");
					assert.strictEqual(removeTabsAndReturns(list.containerNode.children[25].textContent), "item C", "C");
					for (i = 26; i <= 48; i++) {
						assert.strictEqual(removeTabsAndReturns(list.containerNode.children[i].textContent), "item " + (i - 3), "C");
					}
					assert.strictEqual(removeTabsAndReturns(list.nextPageLoader.labelNode.textContent),
						"Click to load 23 more items", "C");
					clickNextPageLoader(list).then(dfd.rejectOnError(function () {
						list.deliver();
						assert.strictEqual(list.containerNode.children.length, 47, "D: number of list children");
						assert.strictEqual(removeTabsAndReturns(list.previousPageLoader.labelNode.textContent),
							"Click to load 23 more items",
							"C: previous page loader");
						assert.strictEqual(removeTabsAndReturns(list.containerNode.children[0].textContent), "item C", "C");
						assert.strictEqual(removeTabsAndReturns(list.containerNode.children[46].textContent), "item 68", "C");
						assert.strictEqual(removeTabsAndReturns(list.nextPageLoader.labelNode.textContent),
							"Click to load 23 more items",
							"C: next page loader");
						clickPreviousPageLoader(list).then(dfd.rejectOnError(function () {
							list.deliver();
							assert.strictEqual(list.containerNode.children.length, 47, "D: number of list children");
							assert.strictEqual(removeTabsAndReturns(list.previousPageLoader.labelNode.textContent),
								"Click to load 23 more items",
								"D: previous page loader");
							assert.strictEqual(removeTabsAndReturns(list.containerNode.children[0].textContent), "item 1", "D");
							assert.strictEqual(removeTabsAndReturns(list.containerNode.children[46].textContent), "item 45", "D");
							assert.strictEqual(removeTabsAndReturns(list.nextPageLoader.labelNode.textContent),
								"Click to load 23 more items",
								"D: next page loader");
							clickPreviousPageLoader(list).then(dfd.callback(function () {
								list.deliver();
								assert.strictEqual(list.containerNode.children.length, 25, "E: number of list children");
								assert.strictEqual(removeTabsAndReturns(list.containerNode.children[0].textContent),
									"item 0", "E");
								assert.strictEqual(removeTabsAndReturns(list.containerNode.children[1].textContent),
									"item A", "E");
								assert.strictEqual(removeTabsAndReturns(list.containerNode.children[24].textContent),
									"item 22", "E");
								assert.strictEqual(removeTabsAndReturns(list.nextPageLoader.labelNode.textContent),
									"Click to load 23 more items",
									"E: next page loader");
							}));
						}));
					}));
				}));
			}));
			/*jshint maxlen: 120*/
			return dfd;
		},
		"Helper: add item before first page creates loader": function (/*Deferred*/dfd) {
			var TIMEOUT = 2000;
			var INTERVAL = 100;
			list = new PageableList({source: new ObservableArray()});
			for (var i = 0; i < 24; i++) {
				list.source.push({id: i, label: "item " + i});
			}
			list.pageLength = 23;
			list.maxPages = 2;
			list.placeAt(document.body);
			list.deliver();
			waitForCondition(function () {
				return list.textContent.indexOf("item 22") >= 0;
			}, TIMEOUT, INTERVAL).then(dfd.rejectOnError(function () {
				list.source.splice(0, 0, {id: "A", label: "item A"});
				list.deliver();
				// Check internal page representation
				assert.strictEqual(list._idPages.length, 1, "A: number of pages");
				assert.deepEqual(list._idPages[0],
					[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22]);
				assert.strictEqual(list._idPages[0].length, 23, "A: number of items in page");
				assert.strictEqual(list.containerNode.children.length, 23, "A: number of list children");
				assert.strictEqual(removeTabsAndReturns(list.previousPageLoader.labelNode.textContent),
					"Click to load 23 more items",
					"A (previous page loader)");
				for (i = 0; i < 23; i++) {
					assert.strictEqual(
						removeTabsAndReturns(list.containerNode.children[i].textContent), "item " + i, "A");
				}
				assert.strictEqual(removeTabsAndReturns(list.nextPageLoader.labelNode.textContent),
					"Click to load 23 more items",
					"A (next page loader)");
				clickPreviousPageLoader(list).then(dfd.callback(function () {
					list.deliver();
					assert.strictEqual(list.containerNode.children.length, 24, "B: number of list children");
					assert.strictEqual(removeTabsAndReturns(list.containerNode.children[0].textContent), "item A", "B");
					for (i = 1; i <= 23; i++) {
						assert.strictEqual(removeTabsAndReturns(list.containerNode.children[i].textContent),
							"item " + (i - 1), "B");
					}
					assert.strictEqual(removeTabsAndReturns(list.nextPageLoader.labelNode.textContent),
						"Click to load 23 more items", "B");
				}));
			}));
			return dfd;
		},
		"Helper: add item after last page creates loader": function (/*Deferred*/dfd) {
			var TIMEOUT = 2000;
			var INTERVAL = 100;
			list = new PageableList({source: new ObservableArray()});
			for (var i = 0; i < 23; i++) {
				list.source.push({id: i, label: "item " + i});
			}
			list.pageLength = 23;
			list.maxPages = 0;
			list.on("new-query-asked", function (evt) {
				evt.setPromise(new Promise(function (resolve) {
					resolve(list.source.slice(evt.start, evt.end));
				}));
			});
			list.placeAt(document.body);
			list.deliver();
			waitForCondition(function () {
				return list.textContent.indexOf("item 22") >= 0;
			}, TIMEOUT, INTERVAL).then(dfd.rejectOnError(function () {
				assert.strictEqual(list.containerNode.children.length, 23, "0: number of list children");
				assert.strictEqual(removeTabsAndReturns(list.nextPageLoader.labelNode.textContent),
					"Click to load 23 more items",
					"0: last children is next page loader");
				clickNextPageLoader(list).then(dfd.rejectOnError(function () {
					// Add an item at the end
					list.source.push({id: "A", label: "item A"});
					list.deliver();
					// Check internal page representation
					assert.strictEqual(list._idPages.length, 1, "A: number of pages");
					assert.deepEqual(list._idPages[0],
						[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22]);
					assert.strictEqual(list._idPages[0].length, 23, "A: number of items in page");
					assert.strictEqual(list.containerNode.children.length, 23, "A: number of list children");
					for (i = 0; i <= 22; i++) {
						assert.strictEqual(
							removeTabsAndReturns(list.containerNode.children[i].textContent), "item " + i, "A");
					}
					assert.strictEqual(removeTabsAndReturns(list.nextPageLoader.labelNode.textContent),
						"Click to load 23 more items",
						"A (next page loader)");
					clickNextPageLoader(list).then(dfd.callback(function () {
						list.deliver();
						assert.strictEqual(list.containerNode.children.length, 24, "B: number of list children");
						for (i = 0; i <= 22; i++) {
							assert.strictEqual(removeTabsAndReturns(list.containerNode.children[i].textContent),
								"item " + i, "B");
						}
						assert.strictEqual(removeTabsAndReturns(list.containerNode.children[23].textContent),
							"item A", "B");
					}));
				}));
			}));
			return dfd;
		},
		"Helper: add item to undisplayed page": function (/*Deferred*/dfd) {
			var TIMEOUT = 2000;
			var INTERVAL = 100;
			list = new PageableList({source: new ObservableArray()});
			for (var i = 0; i < 100; i++) {
				list.source.push({id: i, label: "item " + i});
			}
			list.pageLength = 23;
			list.maxPages = 1;
			list.placeAt(document.body);
			list.source.splice(23, 0, {id: "A", label: "item A"});
			list.deliver();
			waitForCondition(function () {
				return list.textContent.indexOf("item 22") >= 0;
			}, TIMEOUT, INTERVAL).then(dfd.rejectOnError(function () {
				assertList(list, 0, 22, [], false, true, "A");
				clickNextPageLoader(list).then(dfd.rejectOnError(function () {
					list.deliver();
					assert.strictEqual(list.containerNode.children.length, 23, "B: list number of children");
					assert.strictEqual(removeTabsAndReturns(list.previousPageLoader.labelNode.textContent),
						"Click to load 23 more items",
						"B: previous page loader");
					assert.strictEqual(removeTabsAndReturns(list.containerNode.children[0].textContent), "item A", "B");
					for (i = 1; i < 23; i++) {
						assert.strictEqual(removeTabsAndReturns(list.containerNode.children[i].textContent),
							"item " + (i + 22), "B");
					}
					assert.strictEqual(removeTabsAndReturns(list.nextPageLoader.labelNode.textContent),
						"Click to load 23 more items",
						"B: next page loader");
					list.source.splice(22, 0, {id: "B", label: "item B"});
					list.deliver();
					clickPreviousPageLoader(list).then(dfd.callback(function () {
						list.deliver();
						assert.strictEqual(list.containerNode.children.length, 23, "C: list number of children");
						assert.strictEqual(removeTabsAndReturns(list.previousPageLoader.labelNode.textContent),
							"Click to load 23 more items",
							"C: previous page loader");
						for (i = 0; i < 21; i++) {
							assert.strictEqual(removeTabsAndReturns(list.containerNode.children[i].textContent),
								"item " + (i + 1), "C");
						}
						assert.strictEqual(removeTabsAndReturns(list.containerNode.children[21].textContent),
							"item B", "C");
						assert.strictEqual(removeTabsAndReturns(list.containerNode.children[22].textContent),
							"item 22", "C");
						assert.strictEqual(removeTabsAndReturns(list.nextPageLoader.labelNode.textContent),
							"Click to load 23 more items",
							"C: next page loader");
					}));
				}));
			}));
			return dfd;
		}
	};

	registerSuite({
		name: "list/PageableList-ObservableArray",
		beforeEach: function () {
			if (list) {
				list.destroy();
			}
		},
		"itemAdded": function () {
			list = new PageableList({source: new ObservableArray()});
			list.pageLength = 100;
			var resetList = function () {
				list._idPages = [[1, 2, 3], [4, 5, 6]];
				list._firstLoaded = 1;
				list._lastLoaded = 6;
				list.deliver();
			};
			list.getIdentity = function (item) {
				return item.id !== undefined ? item.id : this.data.indexOf(item);
			};
			resetList();
			list.itemAdded(0, {id: "A"});
			assert.deepEqual(list._idPages, [[1, 2, 3], [4, 5, 6]]);
			assert.strictEqual(list._firstLoaded, 2, "A");
			assert.strictEqual(list._lastLoaded, 7, "A");
			resetList();
			list.itemAdded(1, {id: "B"});
			assert.deepEqual(list._idPages, [[1, 2, 3], [4, 5, 6]]);
			assert.strictEqual(list._firstLoaded, 2, "B");
			assert.strictEqual(list._lastLoaded, 7, "B");
			resetList();
			list.itemAdded(2, {id: "C"});
			assert.deepEqual(list._idPages, [[1, "C", 2, 3], [4, 5, 6]]);
			assert.strictEqual(list._firstLoaded, 1, "C");
			assert.strictEqual(list._lastLoaded, 7, "C");
			resetList();
			list.itemAdded(3, {id: "D"});
			assert.deepEqual(list._idPages, [[1, 2, "D", 3], [4, 5, 6]]);
			assert.strictEqual(list._firstLoaded, 1, "D");
			assert.strictEqual(list._lastLoaded, 7, "D");
			resetList();
			list.itemAdded(4, {id: "E"});
			assert.deepEqual(list._idPages, [[1, 2, 3], ["E", 4, 5, 6]]);
			assert.strictEqual(list._firstLoaded, 1, "E");
			assert.strictEqual(list._lastLoaded, 7, "E");
			resetList();
			list.itemAdded(5, {id: "F"});
			assert.deepEqual(list._idPages, [[1, 2, 3], [4, "F", 5, 6]]);
			assert.strictEqual(list._firstLoaded, 1, "F");
			assert.strictEqual(list._lastLoaded, 7, "F");
			resetList();
			list.itemAdded(6, {id: "G"});
			assert.deepEqual(list._idPages, [[1, 2, 3], [4, 5, "G", 6]]);
			assert.strictEqual(list._firstLoaded, 1, "G");
			assert.strictEqual(list._lastLoaded, 7, "G");
			resetList();
			list.itemAdded(7, {id: "H"});
			assert.deepEqual(list._idPages, [[1, 2, 3], [4, 5, 6]]);
			assert.strictEqual(list._firstLoaded, 1, "H");
			assert.strictEqual(list._lastLoaded, 6, "H");
		},
		"itemRemoved": function () {
			list = new PageableList({source: new ObservableArray()});
			list.pageLength = 100;
			var resetList = function () {
				list._idPages = [[1, 2, 3], [4, 5, 6]];
				list._firstLoaded = 1;
				list._lastLoaded = 6;
				list.deliver();
			};
			resetList();
			list.itemRemoved(0);
			assert.deepEqual(list._idPages, [[1, 2, 3], [4, 5, 6]]);
			assert.strictEqual(list._firstLoaded, 0, "0");
			assert.strictEqual(list._lastLoaded, 5, "0");
			resetList();
			list.itemRemoved(1);
			assert.deepEqual(list._idPages, [[2, 3], [4, 5, 6]]);
			assert.strictEqual(list._firstLoaded, 1, "1");
			assert.strictEqual(list._lastLoaded, 5, "1");
			resetList();
			list.itemRemoved(2);
			assert.deepEqual(list._idPages, [[1, 3], [4, 5, 6]]);
			assert.strictEqual(list._firstLoaded, 1, "2");
			assert.strictEqual(list._lastLoaded, 5, "2");
			resetList();
			list.itemRemoved(3);
			assert.deepEqual(list._idPages, [[1, 2], [4, 5, 6]]);
			assert.strictEqual(list._firstLoaded, 1, "3");
			assert.strictEqual(list._lastLoaded, 5, "3");
			resetList();
			list.itemRemoved(4);
			assert.deepEqual(list._idPages, [[1, 2, 3], [5, 6]]);
			assert.strictEqual(list._firstLoaded, 1, "4");
			assert.strictEqual(list._lastLoaded, 5, "4");
			resetList();
			list.itemRemoved(5);
			assert.deepEqual(list._idPages, [[1, 2, 3], [4, 6]]);
			assert.strictEqual(list._firstLoaded, 1, "5");
			assert.strictEqual(list._lastLoaded, 5, "5");
			resetList();
			list.itemRemoved(6);
			assert.deepEqual(list._idPages, [[1, 2, 3], [4, 5]]);
			assert.strictEqual(list._firstLoaded, 1, "6");
			assert.strictEqual(list._lastLoaded, 5, "6");
			resetList();
			list.itemRemoved(7);
			assert.deepEqual(list._idPages, [[1, 2, 3], [4, 5, 6]]);
			assert.strictEqual(list._firstLoaded, 1, "7");
			assert.strictEqual(list._lastLoaded, 6, "7");
		},
		"Loading all next pages (pageLength 20, maxPages 0)" : function () {
			var dfd = this.async(3000);
			var TIMEOUT = 2000;
			var INTERVAL = 100;
			list = new PageableList({source: new ObservableArray()});
			for (var i = 0; i < 100; i++) {
				list.source.push({label: "item " + i});
			}
			list.pageLength = 20;
			list.maxPages = 0;
			list.on("new-query-asked", function (evt) {
				evt.setPromise(new Promise(function (resolve) {
					resolve(list.source.slice(evt.start, evt.end));
				}));
			});
			list.placeAt(document.body);
			list.deliver();
			waitForCondition(function () {
				return list.textContent.indexOf("item 19") >= 0;
			}, TIMEOUT, INTERVAL).then(dfd.rejectOnError(function () {
				// initial load
				assertList(list, 0, 19, [], false, true);
				clickNextPageLoader(list).then(dfd.rejectOnError(function () {
					list.deliver();
					// after second page is loaded
					assertList(list, 0, 39, [], false, true);
					clickNextPageLoader(list).then(dfd.rejectOnError(function () {
						list.deliver();
						// after third page is loaded
						assertList(list, 0, 59, [], false, true);
						clickNextPageLoader(list).then(dfd.rejectOnError(function () {
							list.deliver();
							// after fourth page is loaded
							assertList(list, 0, 79, [], false, true);
							clickNextPageLoader(list).then(dfd.rejectOnError(function () {
								list.deliver();
								// after fifth page is loaded
								assertList(list, 0, 99, [], false, true);
								clickNextPageLoader(list).then(dfd.callback(function () {
									list.deliver();
									// after last click
									assertList(list, 0, 99, [], false, false);
								}));
							}));
						}));
					}));
				}));
			}));
			return dfd;
		},
		"Categorized list: Loading all next pages (pageLength 25, maxPages 0)" : function () {
			var dfd = this.async(3000);
			var TIMEOUT = 2000;
			var INTERVAL = 100;
			list = new PageableList({source: new ObservableArray()});
			for (var i = 0; i < 100; i++) {
				list.source.push({label: "item " + i, category: "Category " + Math.floor(i / 10)});
			}
			list.pageLength = 25;
			list.maxPages = 0;
			list.categoryAttr = "category";
			list.on("new-query-asked", function (evt) {
				evt.setPromise(new Promise(function (resolve) {
					resolve(list.source.slice(evt.start, evt.end));
				}));
			});
			list.placeAt(document.body);
			list.deliver();
			waitForCondition(function () {
				return list.textContent.indexOf("item 24") >= 0;
			}, TIMEOUT, INTERVAL).then(dfd.rejectOnError(function () {
				assertCategorizedList(list, 25, 0, false, true);
				clickNextPageLoader(list).then(dfd.rejectOnError(function () {
					list.deliver();
					// after second page is loaded
					waitForCondition(function () {
						return list.textContent.indexOf("item 49") >= 0;
					}, TIMEOUT, INTERVAL).then(dfd.rejectOnError(function () {
						assertCategorizedList(list, 50, 0, false, true);
						clickNextPageLoader(list).then(dfd.rejectOnError(function () {
							list.deliver();
							// after third page is loaded
							waitForCondition(function () {
								return list.textContent.indexOf("item 74") >= 0;
							}, TIMEOUT, INTERVAL).then(dfd.rejectOnError(function () {
								assertCategorizedList(list, 75, 0, false, true);
								clickNextPageLoader(list).then(dfd.rejectOnError(function () {
									list.deliver();
									// after fourth page is loaded
									waitForCondition(function () {
										return list.textContent.indexOf("item 99") >= 0;
									}, TIMEOUT, INTERVAL).then(dfd.rejectOnError(function () {
										assertCategorizedList(list, 100, 0, false, true);
										clickNextPageLoader(list).then(dfd.callback(function () {
											list.deliver();
											// after last click
											assertCategorizedList(list, 100, 0, false, false);
										}));
									}));
								}));
							}));
						}));
					}));
				}));
			}));
			return dfd;
		},
		"Loading all next pages, and then loading all previous pages (pageLength 20, maxPages 2)" : function () {
			/*jshint maxlen: 138*/
			var dfd = this.async(3000);
			var TIMEOUT = 2000;
			var INTERVAL = 100;
			list = new PageableList({source: new ObservableArray()});
			for (var i = 0; i < 100; i++) {
				list.source.push({label: "item " + i});
			}
			list.pageLength = 20;
			list.maxPages = 2;
			list.on("new-query-asked", function (evt) {
				evt.setPromise(new Promise(function (resolve) {
					resolve(list.source.slice(evt.start, evt.end));
				}));
			});
			list.placeAt(document.body);
			list.deliver();
			waitForCondition(function () {
				return list.textContent.indexOf("item 19") >= 0;
			}, TIMEOUT, INTERVAL).then(dfd.rejectOnError(function () {
				// initial load
				assertList(list, 0, 19, [], false, true);
				clickNextPageLoader(list).then(dfd.rejectOnError(function () {
					list.deliver();
					// after second page is loaded
					assertList(list, 0, 39, [], false, true);
					clickNextPageLoader(list).then(dfd.rejectOnError(function () {
						list.deliver();
						// after third page is loaded and first page is unloaded
						assertList(list, 20, 59, [], true, true);
						clickNextPageLoader(list).then(dfd.rejectOnError(function () {
							list.deliver();
							// after fourth page is loaded and second page is unloaded
							assertList(list, 40, 79, [], true, true);
							clickNextPageLoader(list).then(dfd.rejectOnError(function () {
								list.deliver();
								// after fifth page is loaded and third page is unloaded
								assertList(list, 60, 99, [], true, true);
								clickNextPageLoader(list).then(dfd.rejectOnError(function () {
									list.deliver();
									// after last click
									assertList(list, 60, 99, [], true, false);
									clickPreviousPageLoader(list).then(dfd.rejectOnError(function () {
										list.deliver();
										// after fifth page is unloaded and third page is loaded
										assertList(list, 40, 79, [], true, true);
										clickPreviousPageLoader(list).then(dfd.rejectOnError(function () {
											list.deliver();
											// after fourth page is unloaded and second page is loaded
											assertList(list, 20, 59, [], true, true);
											clickPreviousPageLoader(list).then(dfd.callback(function () {
												list.deliver();
												// after third page is unloaded and first page is loaded
												assertList(list, 0, 39, [], false, true);
											}));
										}));
									}));
								}));
							}));
						}));
					}));
				}));
			}));
			/*jshint maxlen: 120*/
			return dfd;
		},
		"Categorized List: loading all next pages, and then loading all previous pages (pageLength 20, maxPages 2)" :
			function () {
				var dfd = this.async(3000);
				var TIMEOUT = 2000;
				var INTERVAL = 100;
				list = new PageableList({source: new ObservableArray()});
				for (var i = 0; i < 100; i++) {
					list.source.push({label: "item " + i, category: "Category " + Math.floor(i / 10)});
				}
				list.categoryAttr = "category";
				list.pageLength = 25;
				list.maxPages = 2;
				list.on("new-query-asked", function (evt) {
					evt.setPromise(new Promise(function (resolve) {
						resolve(list.source.slice(evt.start, evt.end));
					}));
				});
				list.placeAt(document.body);
				list.deliver();
				waitForCondition(function () {
					return list.textContent.indexOf("item 24") >= 0;
				}, TIMEOUT, INTERVAL).then(dfd.rejectOnError(function () {
					// initial load
					assertCategorizedList(list, 25, 0, false, true);
					clickNextPageLoader(list).then(dfd.rejectOnError(function () {
						list.deliver();
						// after second page is loaded
						assertCategorizedList(list, 50, 0, false, true);
						clickNextPageLoader(list).then(dfd.rejectOnError(function () {
							list.deliver();
							// after third page is loaded and first page is unloaded
							assertCategorizedList(list, 50, 25, true, true);
							clickNextPageLoader(list).then(dfd.rejectOnError(function () {
								list.deliver();
								// after fourth page is loaded and second page is unloaded
								assertCategorizedList(list, 50, 50, true, true);
								clickNextPageLoader(list).then(dfd.rejectOnError(function () {
									list.deliver();
									// after last click
									assertCategorizedList(list, 50, 50, true, false);
									clickPreviousPageLoader(list).then(dfd.rejectOnError(function () {
										list.deliver();
										// after fourth page is unloaded and second page is loaded
										assertCategorizedList(list, 50, 25, true, true);
										clickPreviousPageLoader(list).then(dfd.callback(function () {
											list.deliver();
											// after third page is unloaded and first page is loaded
											assertCategorizedList(list, 50, 0, false, true);
										}));
									}));
								}));
							}));
						}));
					}));
				}));
				return dfd;
			},
		"pageLength equal to the total number of item (maxPages 0)" : function () {
			var dfd = this.async(3000);
			var TIMEOUT = 2000;
			var INTERVAL = 100;
			list = new PageableList({source: new ObservableArray()});
			for (var i = 0; i < 100; i++) {
				list.source.push({label: "item " + i});
			}
			list.pageLength = 100;
			list.maxPages = 0;
			list.on("new-query-asked", function (evt) {
				evt.setPromise(new Promise(function (resolve) {
					resolve(list.source.slice(evt.start, evt.end));
				}));
			});
			list.placeAt(document.body);
			list.deliver();
			waitForCondition(function () {
				return list.textContent.indexOf("item 99") >= 0;
			}, TIMEOUT, INTERVAL).then(dfd.rejectOnError(function () {
				// initial load
				assertList(list, 0, 99, [], false, true);
				clickNextPageLoader(list).then(dfd.callback(function () {
					list.deliver();
					// after a click on the next page loader
					assertList(list, 0, 99, [], false, false);
				}));
			}));
			return dfd;
		},
		"Categorized List: pageLength equal to the total number of item (maxPages 0)" : function () {
			var dfd = this.async(3000);
			var TIMEOUT = 2000;
			var INTERVAL = 100;
			list = new PageableList({source: new ObservableArray()});
			for (var i = 0; i < 100; i++) {
				list.source.push({label: "item " + i, category: "Category " + Math.floor(i / 10)});
			}
			list.categoryAttr = "category";
			list.pageLength = 100;
			list.maxPages = 0;
			list.on("new-query-asked", function (evt) {
				evt.setPromise(new Promise(function (resolve) {
					resolve(list.source.slice(evt.start, evt.end));
				}));
			});
			list.placeAt(document.body);
			// initial load
			list.deliver();
			waitForCondition(function () {
				return list.textContent.indexOf("item 99") >= 0;
			}, TIMEOUT, INTERVAL).then(dfd.rejectOnError(function () {
				assertCategorizedList(list, 100, 0, false, true);
				clickNextPageLoader(list).then(dfd.callback(function () {
					list.deliver();
					// after a click on the next page loader
					assertCategorizedList(list, 100, 0, false, false);
				}));
			}));
			return dfd;
		},
		"pageLength equal to the total number of item (maxPages 2)" : function () {
			var dfd = this.async(3000);
			var TIMEOUT = 2000;
			var INTERVAL = 100;
			list = new PageableList({source: new ObservableArray()});
			for (var i = 0; i < 100; i++) {
				list.source.push({label: "item " + i});
			}
			list.pageLength = 100;
			list.maxPages = 0;
			list.on("new-query-asked", function (evt) {
				evt.setPromise(new Promise(function (resolve) {
					resolve(list.source.slice(evt.start, evt.end));
				}));
			});
			list.placeAt(document.body);
			// initial load
			list.deliver();
			waitForCondition(function () {
				return list.textContent.indexOf("item 99") >= 0;
			}, TIMEOUT, INTERVAL).then(dfd.rejectOnError(function () {
				assertList(list, 0, 99, [], false, true);
				clickNextPageLoader(list).then(dfd.callback(function () {
					list.deliver();
					// after a click on the next page loader
					assertList(list, 0, 99, [], false, false);
				}));
			}));
			return dfd;
		},
		"Categorized List: pageLength equal to the total number of item (maxPages 2)" : function () {
			var dfd = this.async(3000);
			var TIMEOUT = 2000;
			var INTERVAL = 100;
			list = new PageableList({source: new ObservableArray()});
			for (var i = 0; i < 100; i++) {
				list.source.push({label: "item " + i, category: "Category " + Math.floor(i / 10)});
			}
			list.categoryAttr = "category";
			list.pageLength = 100;
			list.maxPages = 0;
			list.on("new-query-asked", function (evt) {
				evt.setPromise(new Promise(function (resolve) {
					resolve(list.source.slice(evt.start, evt.end));
				}));
			});
			list.placeAt(document.body);
			list.deliver();
			waitForCondition(function () {
				return list.textContent.indexOf("item 99") >= 0;
			}, TIMEOUT, INTERVAL).then(dfd.rejectOnError(function () {
				// initial load
				assertCategorizedList(list, 100, 0, false, true);
				clickNextPageLoader(list).then(dfd.callback(function () {
					list.deliver();
					// after a click on the next page loader
					assertCategorizedList(list, 100, 0, false, false);
				}));
			}));
			return dfd;
		},
		"pageLength greater than the total number of item (maxPages 0)" : function () {
			var dfd = this.async(3000);
			var TIMEOUT = 2000;
			var INTERVAL = 100;
			list = new PageableList({source: new ObservableArray()});
			for (var i = 0; i < 100; i++) {
				list.source.push({label: "item " + i});
			}
			list.pageLength = 101;
			list.maxPages = 0;
			list.on("new-query-asked", function (evt) {
				evt.setPromise(new Promise(function (resolve) {
					resolve(list.source.slice(evt.start, evt.end));
				}));
			});
			list.placeAt(document.body);
			// initial load
			list.deliver();
			waitForCondition(function () {
				return list.textContent.indexOf("item 99") >= 0;
			}, TIMEOUT, INTERVAL).then(dfd.callback(function () {
				assertList(list, 0, 99, [], false, false);
			}));
			return dfd;
		},
		"Categorized List: pageLength greater than the total number of item (maxPages 0)" : function () {
			var dfd = this.async(3000);
			var TIMEOUT = 2000;
			var INTERVAL = 100;
			list = new PageableList({source: new ObservableArray()});
			for (var i = 0; i < 100; i++) {
				list.source.push({label: "item " + i, category: "Category " + Math.floor(i / 10)});
			}
			list.categoryAttr = "category";
			list.pageLength = 101;
			list.maxPages = 0;
			list.on("new-query-asked", function (evt) {
				evt.setPromise(new Promise(function (resolve) {
					resolve(list.source.slice(evt.start, evt.end));
				}));
			});
			list.placeAt(document.body);
			list.deliver();
			waitForCondition(function () {
				return list.textContent.indexOf("item 99") >= 0;
			}, TIMEOUT, INTERVAL).then(dfd.callback(function () {
				// initial load
				assertCategorizedList(list, 100, 0, false, false);
			}));
			return dfd;
		},
		"pageLength greater than the total number of item (maxPages 2)" : function () {
			var dfd = this.async(3000);
			var TIMEOUT = 2000;
			var INTERVAL = 100;
			list = new PageableList({source: new ObservableArray()});
			for (var i = 0; i < 100; i++) {
				list.source.push({label: "item " + i});
			}
			list.pageLength = 101;
			list.maxPages = 0;
			list.on("new-query-asked", function (evt) {
				evt.setPromise(new Promise(function (resolve) {
					resolve(list.source.slice(evt.start, evt.end));
				}));
			});
			list.placeAt(document.body);
			list.deliver();
			waitForCondition(function () {
				return list.textContent.indexOf("item 99") >= 0;
			}, TIMEOUT, INTERVAL).then(dfd.callback(function () {
				// initial load
				assertList(list, 0, 99, [], false, false);
			}));
			return dfd;
		},
		"Categorized List: pageLength greater than the total number of item (maxPages 2)" : function () {
			var dfd = this.async(3000);
			var TIMEOUT = 2000;
			var INTERVAL = 100;
			list = new PageableList({source: new ObservableArray()});
			for (var i = 0; i < 100; i++) {
				list.source.push({label: "item " + i, category: "Category " + Math.floor(i / 10)});
			}
			list.categoryAttr = "category";
			list.pageLength = 101;
			list.maxPages = 0;
			list.on("new-query-asked", function (evt) {
				evt.setPromise(new Promise(function (resolve) {
					resolve(list.source.slice(evt.start, evt.end));
				}));
			});
			list.placeAt(document.body);
			list.deliver();
			waitForCondition(function () {
				return list.textContent.indexOf("item 99") >= 0;
			}, TIMEOUT, INTERVAL).then(dfd.callback(function () {
				// initial load
				assertCategorizedList(list, 100, 0, false, false);
			}));
			return dfd;
		},
	//	///////////////////////////////////////////
	//	// TEST REMOVING ITEMS
	//	///////////////////////////////////////////
		"Removing items in displayed pages": function () {
			return testHelpers["Helper: Removing items in displayed pages"](this.async(3000), false);
		},
		"Removing items in next non displayed page": function () {
			return testHelpers["Helper: Removing items in next non displayed page"](this.async(3000), false);
		},
		"Removing items in previous non displayed page": function () {
			return testHelpers["Helper: Removing items in previous non displayed page"](this.async(3000), false);
		},
		"Remove all items in non displayed first page": function () {
			return testHelpers[
				"Helper: Remove all items in non displayed first page removes previous page loader"
				](this.async(3000), false);
		},
		"Remove item and browse": function () {
			return testHelpers["Helper: Remove item and browse"](this.async(3000), false);
		},
	//	///////////////////////////////////////////
	//	// TEST ADDING ITEMS
	//	///////////////////////////////////////////
		"Add items in displayed pages": function () {
			return testHelpers["Helper: Add items in displayed page"](this.async(3000), false);
		},
		"Add item before first page creates loader": function () {
			return testHelpers["Helper: add item before first page creates loader"](this.async(3000), false);
		},
		"Add item after last page creates loader": function () {
			return testHelpers["Helper: add item after last page creates loader"](this.async(3000), false);
		},
		"Add item to undisplayed page": function () {
			return testHelpers["Helper: add item to undisplayed page"](this.async(3000), false);
		},
		"Reload list content": function () {
			var dfd = this.async(3000);
			var TIMEOUT = 2000;
			var INTERVAL = 100;
			list = new PageableList({source: new ObservableArray()});
			for (var i = 0; i < 100; i++) {
				list.source.push({label: "item " + i, category: "Category " + Math.floor(i / 10)});
			}
			list.categoryAttr = "category";
			list.pageLength = 25;
			list.maxPages = 0;
			list.placeAt(document.body);
			// initial load
			list.deliver();
			waitForCondition(function () {
				return list.textContent.indexOf("item 24") >= 0;
			}, TIMEOUT, INTERVAL).then(dfd.rejectOnError(function () {
				assertCategorizedList(list, 25, 0, false, true);
				clickNextPageLoader(list).then(dfd.rejectOnError(function () {
					list.deliver();
					assertCategorizedList(list, 50, 0, false, true);
					// Create a new source and assign it to the list
					var source = new ObservableArray();
					for (var i = 1000; i < 1100; i++) {
						source.push({label: "item " + i, category: "Category " + Math.floor(i / 10)});
					}
					list.source = source;
					list.deliver();
					waitForCondition(function () {
						return list.textContent.indexOf("item 1000") >= 0;
					}, TIMEOUT, INTERVAL).then(dfd.callback(function () {
						assertCategorizedList(list, 25, 1000, false, true);
					}));
				}));
			}));
			return dfd;
		},
		"Update pageLength": function () {
			var dfd = this.async(3000);
			var TIMEOUT = 2000;
			var INTERVAL = 100;
			list = new PageableList({source: new ObservableArray()});
			for (var i = 0; i < 100; i++) {
				list.source.push({label: "item " + i});
			}
			list.pageLength = 10;
			list.maxPages = 2;
			list.placeAt(document.body);
			list.deliver();
			waitForCondition(function () {
				return list.textContent.indexOf("item 9") >= 0;
			}, TIMEOUT, INTERVAL).then(dfd.rejectOnError(function () {
				clickNextPageLoader(list).then(dfd.rejectOnError(function () {
					list.deliver();
					assertList(list, 0, 19, [], false, true, "A");
					list.pageLength = 20;
					clickNextPageLoader(list).then(dfd.rejectOnError(function () {
						list.deliver();
						assertList(list, 10, 39, [], true, true, "B");
						clickNextPageLoader(list).then(dfd.rejectOnError(function () {
							list.deliver();
							assertList(list, 20, 59, [], true, true, "C");
							clickPreviousPageLoader(list).then(dfd.callback(function () {
								list.deliver();
								assertList(list, 0, 39, [], false, true, "D");
							}));
						}));
					}));
				}));
			}));
			return dfd;
		},
		"Update maxPages": function () {
			var dfd = this.async(3000);
			var TIMEOUT = 2000;
			var INTERVAL = 100;
			list = new PageableList({source: new ObservableArray()});
			for (var i = 0; i < 100; i++) {
				list.source.push({label: "item " + i});
			}
			list.pageLength = 10;
			list.maxPages = 2;
			list.placeAt(document.body);
			list.deliver();
			waitForCondition(function () {
				return list.textContent.indexOf("item 9") >= 0;
			}, TIMEOUT, INTERVAL).then(dfd.rejectOnError(function () {
				clickNextPageLoader(list).then(dfd.rejectOnError(function () {
					clickNextPageLoader(list).then(dfd.rejectOnError(function () {
						list.deliver();
						assertList(list, 10, 29, [], true, true, "A");
						list.maxPages = 3;
						clickNextPageLoader(list).then(dfd.rejectOnError(function () {
							list.deliver();
							assertList(list, 10, 39, [], true, true, "B");
							clickNextPageLoader(list).then(dfd.callback(function () {
								list.deliver();
								assertList(list, 20, 49, [], true, true, "C");
							}));
						}));
					}));
				}));
			}));
			return dfd;
		},
		"Update loadPreviousMessage": function () {
			var dfd = this.async(3000);
			var TIMEOUT = 2000;
			var INTERVAL = 100;
			list = new PageableList({source: new ObservableArray()});
			for (var i = 0; i < 100; i++) {
				list.source.push({label: "item " + i});
			}
			list.pageLength = 10;
			list.maxPages = 1;
			list.placeAt(document.body);
			list.deliver();
			waitForCondition(function () {
				return list.textContent.indexOf("item 9") >= 0;
			}, TIMEOUT, INTERVAL).then(dfd.rejectOnError(function () {
				clickNextPageLoader(list).then(dfd.callback(function () {
					list.deliver();
					assertList(list, 10, 19, [], true, true, "A");
					list.loadPreviousMessage = "foo";
					list.deliver();
					assert.strictEqual(removeTabsAndReturns(list.previousPageLoader.labelNode.textContent), "foo",
						"loader label not updated");
				}));
			}));
			return dfd;
		},
		"Update loadNextMessage": function () {
			var dfd = this.async(3000);
			var TIMEOUT = 2000;
			var INTERVAL = 100;
			list = new PageableList({source: new ObservableArray()});
			for (var i = 0; i < 100; i++) {
				list.source.push({label: "item " + i});
			}
			list.pageLength = 10;
			list.maxPages = 1;
			list.placeAt(document.body);
			list.deliver();
			waitForCondition(function () {
				return list.textContent.indexOf("item 9") >= 0;
			}, TIMEOUT, INTERVAL).then(dfd.rejectOnError(function () {
				clickNextPageLoader(list).then(dfd.callback(function () {
					list.deliver();
					assertList(list, 10, 19, [], true, true, "A");
					list.loadNextMessage = "foo";
					list.deliver();
					assert.strictEqual(removeTabsAndReturns(list.nextPageLoader.labelNode.textContent),
						"foo", "loader label not updated");
				}));
			}));
			return dfd;
		},
		"hideOnPageLoad: hidding panel removed after loading the last page" : function () {
			var dfd = this.async(3000);
			var TIMEOUT = 2000;
			var INTERVAL = 100;
			list = new PageableList({source: new ObservableArray()});
			for (var i = 0; i < 39; i++) {
				list.source.push({label: "item " + i});
			}
			list.hideOnPageLoad = true;
			list.pageLength = 20;
			list.maxPages = 0;
			list.on("new-query-asked", function (evt) {
				evt.setPromise(new Promise(function (resolve) {
					resolve(list.source.slice(evt.start, evt.end));
				}));
			});
			list.placeAt(document.body);
			list.deliver();
			waitForCondition(function () {
				return list.textContent.indexOf("item 19") >= 0;
			}, TIMEOUT, INTERVAL).then(dfd.rejectOnError(function () {
				// initial load
				assertList(list, 0, 19, [], false, true);
				clickNextPageLoader(list).then(dfd.callback(function () {
					list.deliver();
					// after second page is loaded
					assertList(list, 0, 38, [], false, false);
					// verify that loading panel is not displayed
					assert.isNotNull(list.querySelector(".d-list-loading-panel[d-shown='false']"),
						"loading panel should not be visible");
				}));
			}));
			return dfd;
		},
		"autoPaging: categorized list with category headers destroyed when loading pages": function () {
			var TIMEOUT = 2000;
			var INTERVAL = 100;
			if (navigator.userAgent.indexOf("Firefox") >= 0) {
				// This test is not reliable on Firefox
				return;
			}
			var def = this.async(1000 + 3 * TIMEOUT);
			list = new PageableList({source: new ObservableArray()});
			list.categoryAttr = "category";
			list.pageLength = 25;
			list.maxPages = 2;
			list.style.height = "200px";
			list.autoPaging = true;
			for (var i = 0; i < 100; i++) {
				list.source.push({label: "item " + i, category: "Category " + Math.floor(i / 10)});
			}
			list.placeAt(document.body);
			list.deliver();
			setTimeout(def.rejectOnError(function () {
				waitForCondition(function () {
					return list.textContent.indexOf("item 24") >= 0;
				}, TIMEOUT, INTERVAL).then(def.rejectOnError(function () {
					list.deliver();
					// initial load
					assertCategorizedList(list, 25, 0, false, true);
					setTimeout(def.rejectOnError(function () {
						// scroll to the bottom
						list.scrollTop =
							(list.scrollHeight - list.offsetHeight);
						waitForCondition(function () {
							return list.textContent.indexOf("item 49") >= 0;
						}, TIMEOUT, INTERVAL).then(def.rejectOnError(function () {
							list.deliver();
							assertCategorizedList(list, 50, 0, false, true);
							assert.strictEqual(
								removeTabsAndReturns(list._getLastVisibleRenderer().textContent),
								"item 24",
								"last visible renderer after first page load");
							setTimeout(def.rejectOnError(function () {
								// scroll a little to remove the "_atExtremity" marker
								list.scrollTop =
									((list.scrollHeight - list.offsetHeight) / 2);
								setTimeout(def.rejectOnError(function () {
									// scroll to the bottom
									list.scrollTop =
										((list.scrollHeight - list.offsetHeight));
									waitForCondition(function () {
										return list.textContent.indexOf("item 74") >= 0;
									}, TIMEOUT, INTERVAL).then(def.rejectOnError(function () {
										list.deliver();
										assertCategorizedList(list, 50, 25, true, true);
										assert.strictEqual(
											removeTabsAndReturns(list._getLastVisibleRenderer().textContent),
											"item 73",
											"last visible renderer after second page load");
										setTimeout(def.rejectOnError(function () {
											// scroll a little to remove the "_atExtremity" marker
											list.scrollTop = 100;
											setTimeout(def.rejectOnError(function () {
												// scroll to the top
												list.scrollTop = 0;
												waitForCondition(function () {
													return list.textContent.indexOf("item 24") >= 0;
												}, TIMEOUT, INTERVAL).then(def.callback(function () {
													assertCategorizedList(list, 50, 0, false, true);
													assert.strictEqual(
														removeTabsAndReturns(
															list._getFirstVisibleRenderer().textContent),
														"Category 0",
														"first visible renderer");
												}));
											}), 10);
										}), 10);
									}));
								}), 10);
							}), 10);
						}));
					}), 10);
				}));
			}), 10);
			return def;
		},
		"getItemRendererByIndex ignores page loaders": function () {
			var dfd = this.async(3000);
			var TIMEOUT = 2000;
			var INTERVAL = 100;
			list = new PageableList({source: new ObservableArray()});
			for (var i = 0; i < 100; i++) {
				list.source.push({label: "item " + i});
			}
			list.pageLength = 10;
			list.maxPages = 1;
			list.placeAt(document.body);
			list.deliver();
			waitForCondition(function () {
				return list.textContent.indexOf("item 9") >= 0;
			}, TIMEOUT, INTERVAL).then(dfd.rejectOnError(function () {
				clickNextPageLoader(list).then(dfd.callback(function () {
					list.deliver();
					assert.strictEqual("item 10",
						removeTabsAndReturns(list.getItemRendererByIndex(0).textContent));
				}));
			}));
			return dfd;
		},
		///////////////////////////////////////////
		// TODO: TEST MOVING ITEMS ?
		///////////////////////////////////////////
		teardown : function () {
			list.destroy();
			list = null;
		}
	});

});

