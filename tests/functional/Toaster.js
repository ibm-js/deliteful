define(["intern!object",
	"intern/chai!assert",
	"require",
	"dojo/promise/all"
], function (registerSuite, assert, require, all) {
	var PAGE = "./Toaster.html";

	// helpers
	function attrValueToArray(value) {
		return value.trim().split(/\s+/g);
	}

	// asserts
	var _assert = {};

	_assert.include = function (array, element, message) {
		assert(array.indexOf(element) >= 0, message);
	};

	_assert.sameMembers = function (array1, array2, message) {
		array1.forEach(function (e1) {
			_assert.include(array2, e1, message);
		});
		assert.equal(array1.length, array2.length, message);
	};

	_assert.includeMembers = function (array, subarray, message) {
		subarray.forEach(function (e) {
			_assert.include(array, e, message);
		});
	};

	_assert.attrEqual = function (value1, value2) {
		var v1 = attrValueToArray(value1),
			v2 = attrValueToArray(value2);
		_assert.sameMembers(v1, v2, "attributes " + value1 + " and " + value2 + " are equal");
	};
	_assert.attrHas = function (value, sub) {
		var v1 = attrValueToArray(value),
			v2 = attrValueToArray(sub);
		_assert.includeMembers(v1, v2, "attributes " + value + " contains " + sub);
	};

	// const
	var WAIT_TIMEOUT_MS = 180000;
	var TEST_TIMEOUT_MS = 1000;

	// check functions

	function checkAriaAttr(remote, widgetId) {
		return remote
			.elementById(widgetId)
			.getAttribute("aria-relevant")
			.then(function (value) {
				_assert.attrEqual(value, "additions text");
			})
			.end();
	}

	function checkNumberOfMessages(remote, toasterId, expected) {
		return remote
			.elementById(toasterId)
			.elementsByClassName("d-toaster-message")
			.then(function (value) {
				assert.equal(value.length, expected, "number of messages is correct");
			})
			.end();
	}

	function clickButton(remote, buttonId) {
		return remote
			.elementById(buttonId)
			.click()
			.end();
	}

	function checkInsertion(remote, elementId) {
		return remote
			.elementByIdOrNull(elementId)
			.then(function (element) {
				assert.isNotNull(element, "element " + elementId + " was correctly inserted in DOM");
			})
			.end();
	}

	function checkHasClass(remote, elementId, className) {
		return remote
			.elementByIdOrNull(elementId)
			.getAttribute("class")
			.then(function (value) {
				_assert.attrHas(value, className);
			})
			.end();
	}

	function checkHasElement(remote, elementId) {
		return remote
			.hasElementById(elementId)
			.then(function (has) {
				assert.isTrue(has, elementId + " was found");
			})
			.end();
	}

	function checkHasNotElement(remote, elementId) {
		return remote
			.hasElementById(elementId)
			.then(function (has) {
				assert.isFalse(has, "No element " + elementId);
			})
			.end();
	}

	function codeIns(action) {
		return action.var + ".inserted";
	}

	function codeExp(action) {
		return action.var + ".expired";
	}

	function codeRem(action) {
		return action.var + ".removed";
	}

	console.log("# Registering Toaster tests");
	registerSuite({
		name: "Toaster tests",
		setup: function () {
			this.timeout = TEST_TIMEOUT_MS;
			var remote = this.remote;
			return remote
				.get(require.toUrl(PAGE));
		},
		"Check Aria/initial nb of messages/posting": function () {
			console.log("# running test 'default'");
			var remote = this.remote;
			return remote
				.waitForCondition("'ready' in window && ready", WAIT_TIMEOUT_MS)
				// Check initial rating
				.then(function () {
					return checkAriaAttr(remote, "default");
				})
				.then(function () {
					// check number of messages on startup
					return checkNumberOfMessages(remote, "default", 0);
				})
				.then(function () {
					// post a few messages, and check if they are there
					return clickButton(remote, "trigger-button");
				})
				.then(function () {
					return checkNumberOfMessages(remote, "default", 1);
				});
		},
		"Check toaster stacking permanent messages": function () {
			console.log("# running test 'check permanent message stacking'");
			var remote = this.remote;
			return remote
				.get(require.toUrl(PAGE))
				.waitForCondition("'ready' in window && ready", WAIT_TIMEOUT_MS)
				/*jshint -W061 */
				.eval("actionsRemoval") // NOTE: a global variable existing in PAGE
				.then(function (actions) {
					// check number of messages on startup
					var perm1 = actions.permanent1,
						exp2000 = actions.expirable2000,
						perm2 = actions.permanent2,
						exp6000 = actions.expirable6000;
					return remote
						// click on each button
						.elementById(perm1.buttonId)
						.clickElement()
						.end()
						.elementById(exp2000.buttonId)
						.clickElement()
						.end()
						.elementById(perm2.buttonId)
						.clickElement()
						.end()
						.elementById(exp6000.buttonId)
						.clickElement()
						.end()
						// make sure they are all inserted
						.waitForCondition(codeIns(perm1), TEST_TIMEOUT_MS)
						.waitForCondition(codeIns(exp2000), TEST_TIMEOUT_MS)
						.waitForCondition(codeIns(perm2), TEST_TIMEOUT_MS)
						.waitForCondition(codeIns(exp6000), TEST_TIMEOUT_MS)
						// wait for expirable2000 to expire
						.waitForCondition(codeExp(exp2000), 2000 + TEST_TIMEOUT_MS)
						.then(function () {
							// check it is in the DOM and set to fade-out
							return checkHasClass(remote, exp2000.props.id, "d-toaster-fadeout");
						})
						// wait for expirable6000 to expire
						.waitForCondition(codeExp(exp6000), 6000 + TEST_TIMEOUT_MS)
						.then(function () {
							// check it is in the DOM and set to fade-out
							return checkHasClass(remote, exp6000.props.id, "d-toaster-fadeout");
						})
						// wait for both messages to be removed
						.waitForCondition(codeRem(exp2000) && codeRem(exp6000), TEST_TIMEOUT_MS)
						.then(function () {
							var remotes = [];
							// check expired are no longer in the DOM
							remotes.push(checkHasNotElement(remote, exp2000.props.id));
							remotes.push(checkHasNotElement(remote, exp6000.props.id));
							// check permanent are still in the DOM
							remotes.push(checkHasElement(remote, perm1.props.id));
							remotes.push(checkHasElement(remote, perm2.props.id));
							return all(remotes);
						})
						.end();
				})
				.end();

		},
		"Check message dismissal": function () {
			console.log("# running test 'check message dismissal'");
			var remote = this.remote;
			return remote
				.get(require.toUrl(PAGE))
				.waitForCondition("'ready' in window && ready", WAIT_TIMEOUT_MS)
				/*jshint -W061 */
				.eval("actionsDismiss")
				.then(function (actions) {
					var action = actions.permanent;
					return remote

						// click on show button
						.elementById(action.buttonId)
						.clickElement()
						.end()

						// wait for the message to show up
						.waitForCondition(codeIns(action), TEST_TIMEOUT_MS)

						// click on the dismiss button
						.elementById(action.props.id)
						.elementByClassName("d-toaster-dismiss")
						.click()
						// wait for the message to be removed and check it's not there
						.waitForCondition(codeRem(action), TEST_TIMEOUT_MS)
						.then(function () {
							return checkHasNotElement(remote, action.props.id);
						})
						.end();
				})
				.end();
		},
		"Check message duration": function () {
			console.log("# running test 'check message durations'");
			var remote = this.remote;

			function checkExpirable(remote, action) {
				return remote
					.elementById(action.buttonId)
					.clickElement()
					.end()
					.waitForCondition(codeIns(action), TEST_TIMEOUT_MS)
					.then(function () {
						return remote
							// wait for it to expire
							.waitForCondition(codeExp(action),
								action.props.duration + TEST_TIMEOUT_MS)
							.then(function () {
								// check it was set to fadeout
								checkHasClass(remote, action.props.id, "d-toaster-fadeout");
							})
							.end();
					})
					.end();
			}

			function checkPersistent(remote, action) {
				return remote
					.elementById(action.buttonId)
					.clickElement()
					.waitForCondition(codeIns(action), TEST_TIMEOUT_MS)
					.end();
			}

			return remote
				.get(require.toUrl(PAGE))
				.waitForCondition("'ready' in window && ready", WAIT_TIMEOUT_MS)
				/*jshint -W061 */
				.eval("actionsDurations") // NOTE: a global variable existing in PAGE
				.then(function (actions) {
					return remote
						.waitForCondition("true", 1000)
						.then(function () {
							return checkExpirable(remote, actions["default"]);
						})
						.then(function () {
							return checkExpirable(remote, actions["Duration 6000"]);
						})
						.then(function () {
							return checkPersistent(remote, actions["Duration -1"]);
						})
						.end();
				})
				.end();
		},
		"Check message types": function () {
			console.log("# running test 'check message types'");
			var remote = this.remote;

			function checkType(remote, action) {
				return remote
					.elementById(action.buttonId)
					.clickElement()
					.end()
					.then(function () {
						checkInsertion(remote, action.props.id)
							.then(function () {
								checkHasClass(remote, action.props.id,
									"d-toaster-type-" + action.props.type);
							});
					});
			}

			return remote
				.waitForCondition("'ready' in window && ready", WAIT_TIMEOUT_MS)
				/*jshint -W061 */
				.eval("actionsTypes") // NOTE: a global variable existing in PAGE
				.then(function (actions) {
					remote
						.waitForCondition("true", 1000)
						.then(function () {
							return checkType(remote, actions["Type info"]);
						})
						.then(function () {
							return checkType(remote, actions["Type warning"]);
						})
						.then(function () {
							return checkType(remote, actions["Type error"]);
						})
						.end();
				})
				.end();
		}
	});
});
