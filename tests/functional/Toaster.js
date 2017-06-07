define(["intern",
	"intern!object",
	"intern/dojo/node!leadfoot/helpers/pollUntil",
	"intern/chai!assert",
	"require"
], function (intern, registerSuite, pollUntil, assert, require) {
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
		assert.strictEqual(array1.length, array2.length, message);
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
	var ANIMATION_DURATION = 5000;

	// check functions

	function checkAriaAttr(remote, widgetId) {
		return remote
			.findById(widgetId)
			.getAttribute("aria-relevant")
			.then(function (value) {
				_assert.attrEqual(value, "additions text");
			})
			.end();
	}

	function checkNumberOfMessages(remote, toasterId, expected) {
		return remote
			.execute("return document.querySelectorAll('#" + toasterId + " .d-toaster-message').length;")
			.then(function (length) {
				assert.strictEqual(length, expected, "number of messages");
			});
	}

	function clickButton(remote, buttonId) {
		return remote
			.findById(buttonId)
			.click()
			.end();
	}

	function checkInsertion(remote, elementId) {
		return remote
			.execute("return document.getElementById('" + elementId + "');")
			.then(function (element) {
				assert.isNotNull(element, "element " + elementId + " was correctly inserted in DOM");
			})
			.end();
	}

	function checkHasClass(remote, elementId, className) {
		return remote
			.findById(elementId)
			.getAttribute("class")
			.then(function (value) {
				_assert.attrHas(value, className);
			})
			.end();
	}

	function checkHasElement(remote, elementId) {
		return remote
			.findById(elementId)
			.then(function () {
				// noop
		}, function () {
				assert.fail(true, false, elementId + " was not found");
			})
			.end();
	}

	function checkHasNotElement(remote, elementId) {
		return remote
			.findById(elementId)
			.then(function () {
				assert.fail(true, false, elementId + " was found");
			}, function () {
				// noop
		})
			.end();
	}

	function codeIns(action) {
		return "return " + action["var"] + ".inserted ? true : null;";
	}

	function codeExp(action) {
		return "return " + action["var"] + ".expired ? true : null;";
	}

	function codeRem(action) {
		return "return " + action["var"] + ".removed ? true : null;";
	}

	function checkExpirable(remote, action, duration) {
		var timeoutOffset = 5000;
		return remote
			.findById(action.buttonId)
			.click()
			.end()
			.then(pollUntil(codeIns(action), [], intern.config.WAIT_TIMEOUT, intern.config.POLL_INTERVAL))
			// wait for it to expire
			.then(pollUntil(codeExp(action), [],
				duration + timeoutOffset, intern.config.POLL_INTERVAL))
			.then(pollUntil(codeRem(action), [], ANIMATION_DURATION + timeoutOffset, intern.config.POLL_INTERVAL))
			.end();
	}

	function checkPersistent(remote, action) {
		return remote
			.findById(action.buttonId)
			.click()
			.then(pollUntil(codeIns(action), [], intern.config.WAIT_TIMEOUT, intern.config.POLL_INTERVAL))
			.end();
	}

	registerSuite({
		name: "Toaster tests",
		setup: function () {},
		beforeEach: function () {
			var remote = this.remote;
			return remote
				.get(require.toUrl(PAGE))
				.then(pollUntil("return ('ready' in window && ready) ? true : null;", [],
						intern.config.WAIT_TIMEOUT, intern.config.POLL_INTERVAL));
		},
		"Check Aria/initial nb of messages/posting": function () {
			var remote = this.remote;
			return checkAriaAttr(remote, "default")
				// Check initial rating
				.then(function () {
					// check number of messages on startup
					return checkNumberOfMessages(remote, "default", 0);
				})
				.then(function () {
					// post a few messages, and check if they are there
					return clickButton(remote, "trigger-button");
				})
				.then(pollUntil("return document.querySelectorAll('.d-toaster-message');", [],
						5000, intern.config.POLL_INTERVAL))
				.then(function () {
					return checkNumberOfMessages(remote, "default", 1);
				});
		},
		"Check toaster stacking permanent messages": function () {
			var remote = this.remote;
			return remote
				/*jshint -W061 */
				.execute("return actionsRemoval;") // NOTE: a global variable existing in PAGE
				.then(function (actions) {
					// check number of messages on startup
					var perm1 = actions.permanent1,
						exp2000 = actions.expirable2000,
						perm2 = actions.permanent2,
						exp6000 = actions.expirable6000;
					return remote
						// click on each button
						.findById(perm1.buttonId)
						.click()
						.end()
						.findById(exp2000.buttonId)
						.click()
						.end()
						.findById(perm2.buttonId)
						.click()
						.end()
						.findById(exp6000.buttonId)
						.click()
						.end()
						// make sure they are all inserted
						.then(pollUntil(codeIns(perm1), [], intern.config.WAIT_TIMEOUT, intern.config.POLL_INTERVAL))
						.then(function () {}, function () { throw new Error("perm1 not inserted"); })

						.then(pollUntil(codeIns(exp2000), [], intern.config.WAIT_TIMEOUT, intern.config.POLL_INTERVAL))
						.then(function () {}, function () { throw new Error("exp2000 not inserted"); })

						.then(pollUntil(codeIns(perm2), [], intern.config.WAIT_TIMEOUT, intern.config.POLL_INTERVAL))
						.then(function () {}, function () { throw new Error("perm2 not inserted"); })

						.then(pollUntil(codeIns(exp6000), [], intern.config.WAIT_TIMEOUT, intern.config.POLL_INTERVAL))
						.then(function () {}, function () { throw new Error("exp6000 not inserted"); })

						// wait for expirable2000 to expire
						.then(pollUntil(codeExp(exp2000), [], intern.config.WAIT_TIMEOUT, intern.config.POLL_INTERVAL))
						.then(function () {}, function () { throw new Error("exp2000 not removed"); })

						// wait for expirable6000 to expire
						.then(pollUntil(codeExp(exp6000), [], intern.config.WAIT_TIMEOUT, intern.config.POLL_INTERVAL))
						.then(function () {}, function () { throw new Error("exp6000 not removed"); })

						// wait for both messages to be removed
						.then(pollUntil(codeRem(exp2000) && codeRem(exp6000), [],
							intern.config.WAIT_TIMEOUT + ANIMATION_DURATION, intern.config.POLL_INTERVAL))

						// check expired are no longer in the DOM
						.then(function () {
							return checkHasNotElement(remote, exp2000.props.id);
						})
						.then(function () {
							return checkHasNotElement(remote, exp6000.props.id);
						})

						// check permanent are still in the DOM
						.then(function () {
							return checkHasElement(remote, perm1.props.id);
						})
						.then(function () {
							return checkHasElement(remote, perm2.props.id);
						});
				})
				.end();
		},

		// TODO: this test case doesn't pass due to a dpointer issue which has been reported here
		// https://github.com/ibm-js/dpointer/issues/23
//		"Check message dismissal": function () {
//			var remote = this.remote;
//			return remote
//				.get(require.toUrl(PAGE))
//				.waitForCondition("'ready' in window && ready", intern.config.WAIT_TIMEOUT)
//				/*jshint -W061 */
//				.eval("actionsDismiss")
//				.then(function (actions) {
//					var action = actions.permanent;
//					return remote
//
//						// click on show button
//						.findById(action.buttonId)
//						.click()
//						.end()
//
//						// wait for the message to show up
//						.waitForCondition(codeIns(action), intern.config.WAIT_TIMEOUT)
//
//						// click on the dismiss button
//						.findById(action.props.id)
//						.elementByClassName("d-toaster-dismiss")
//						.click()
//						// wait for the message to be removed and check it's not there
//						.waitForCondition(codeRem(action), intern.config.WAIT_TIMEOUT)
//						.then(function () {
//							return checkHasNotElement(remote, action.props.id);
//						})
//						.end();
//				})
//				.end();
//		},
		"Check message duration": function () {
			var remote = this.remote;
			return remote
				/*jshint -W061 */
				.execute("return actionsDurations;") // NOTE: a global variable existing in PAGE
				.then(function (actions) {
					return remote
						.getCurrentUrl()
						.then(function () {
							return checkExpirable(remote, actions["Duration 6000"], 6000);
						})
						.then(function () {
							return checkPersistent(remote, actions["Duration -1"]);
						})
						.end();
				})
				.end();
		},
		"Check message types": function () {
			var remote = this.remote;

			function checkType(remote, action) {
				return remote
					.findById(action.buttonId)
					.click()
					.end()
					.then(function () {
						return checkInsertion(remote, action.props.id)
							.then(function () {
								return checkHasClass(remote, action.props.id,
									"d-toaster-type-" + action.props.type);
							});
					});
			}
			return remote
				/*jshint -W061 */
				.execute("return actionsTypes;") // NOTE: a global variable existing in PAGE
				.then(function (actions) {
					remote
						.getCurrentUrl()
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
		},
		"Check visibility on hover" : function () {
			var remote = this.remote;
			if (/safari|firefox|iOS|selendroid/.test(remote.environmentType.browserName)) {
				// See https://code.google.com/p/selenium/issues/detail?id=4136
				return this.skip("moveMouseTo not supported");
			}
			return remote
				/*jshint -W061 */
				.execute("return actionsHover;") // NOTE: a global variable existing in PAGE
				.then(function (actions) {
					var action = actions.expirable3000;
					return remote
						// click on show button
						.findById(action.buttonId)
						.click()
						.end()
						// wait for the message to show up
						.then(pollUntil(codeIns(action), [], intern.config.WAIT_TIMEOUT,
							intern.config.POLL_INTERVAL))

						// move pointer over message
						.findById(action.props.id)
						.then(function (element) {
							return remote.moveMouseTo(element);
						})
						.end()
						// wait some time to read message
						.sleep(5000)
						// Verify the message still exists
						.then(function () {
							return checkHasElement(remote, action.props.id);
						})
						// move pointer out of message
						.findById(action.buttonId)
						.then(function (element) {
							return remote.moveMouseTo(element);
						})
						.end()

						// wait for the message to expire
						.then(pollUntil(codeExp(action), [],
							3000 + intern.config.WAIT_TIMEOUT, intern.config.POLL_INTERVAL))
						// wait for the message to be removed
						.then(pollUntil(codeRem(action), [],
							intern.config.WAIT_TIMEOUT + ANIMATION_DURATION, intern.config.POLL_INTERVAL))
						.then(function () {
							return checkHasNotElement(remote, action.props.id);
						})
						.end();
				})
				.end();
		}
	});
});
