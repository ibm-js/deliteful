define(function (require) {
	"use strict";

	var intern = require("intern");
	var registerSuite = require("intern!object");
	var pollUntil = require("intern/dojo/node!leadfoot/helpers/pollUntil");
	var assert = require("intern/chai!assert");
	var PAGE = "./Toaster.html";

	// helpers
	function attrValueToArray (value) {
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

	function checkAriaAttr (remote, widgetId) {
		return remote
			.findById(widgetId)
			.getAttribute("aria-relevant")
			.then(function (value) {
				_assert.attrEqual(value, "additions text");
			})
			.end();
	}

	function checkNumberOfMessages (remote, toasterId, expected) {
		return remote
			.execute("return document.querySelectorAll('#" + toasterId + " .d-toaster-message').length;")
			.then(function (length) {
				assert.strictEqual(length, expected, "number of messages");
			});
	}

	function clickButton (remote, buttonId) {
		return remote
			.findById(buttonId)
			.click()
			.end();
	}

	function checkInsertion (remote, elementId) {
		return remote
			.execute("return document.getElementById('" + elementId + "');")
			.then(function (element) {
				assert.isNotNull(element, "element " + elementId + " was correctly inserted in DOM");
			})
			.end();
	}

	function checkHasClass (remote, elementId, className) {
		return remote
			.findById(elementId)
			.getAttribute("class")
			.then(function (value) {
				_assert.attrHas(value, className);
			})
			.end();
	}

	function checkHasElement (remote, elementId) {
		return remote
			.findById(elementId)
			.then(function () {
				// noop
			}, function () {
				assert.fail(true, false, elementId + " was not found");
			})
			.end();
	}

	function checkHasNotElement (remote, elementId) {
		return remote
			.findById(elementId)
			.then(function () {
				assert.fail(true, false, elementId + " was found");
			}, function () {
				// noop
			})
			.end();
	}

	// TODO: replace usages of codeIns(), codeExp(), and codeRem() with direct reference to variables,
	// like permanent1Var.inserted... or at least, pass in the name of the variable.
	/*
	function codeIns(action) {
		return "return " + action["var"] + ".inserted ? true : null;";
	}

	function codeExp(action) {
		return "return " + action["var"] + ".expired ? true : null;";
	}

	function codeRem(action) {
		return "return " + action["var"] + ".removed ? true : null;";
	}
	*/

	registerSuite({
		"name": "Toaster tests",
		"setup": function () {},
		"beforeEach": function () {
			var remote = this.remote;
			return remote
				.get(require.toUrl(PAGE))
				.then(pollUntil("return ('ready' in window && ready) ? true : null;", [],
					intern.config.WAIT_TIMEOUT, intern.config.POLL_INTERVAL));
		},
		"Check Aria/initial nb of messages/posting": function () {
			var remote = this.remote;
			return checkAriaAttr(remote, "myToaster")
				// Check initial rating
				.then(function () {
					// check number of messages on startup
					return checkNumberOfMessages(remote, "myToaster", 0);
				})
				.then(function () {
					// post a few messages, and check if they are there
					return clickButton(remote, "trigger-button");
				})
				.then(pollUntil("return document.querySelectorAll('.d-toaster-message');", [],
					5000, intern.config.POLL_INTERVAL))
				.then(function () {
					return checkNumberOfMessages(remote, "myToaster", 1);
				});
		},

		"Check toaster stacking permanent messages": function () {
			/*jshint -W061 */
			// check number of messages on startup
			var remote = this.remote;
			return remote
				// click on each button
				.findById("permanent1Button").click().end()
				.findById("expirable2000Button").click().end()
				.findById("permanent2Button").click().end()
				.findById("expirable6000Button").click().end()
				// make sure they are all inserted
				.then(pollUntil("return permanent1Var.inserted || null", [],
					intern.config.WAIT_TIMEOUT, intern.config.POLL_INTERVAL))
				.then(function () {}, function () { throw new Error("perm1 not inserted"); })

				.then(pollUntil("return expirable2000Var.inserted || null", [],
					intern.config.WAIT_TIMEOUT, intern.config.POLL_INTERVAL))
				.then(function () {}, function () { throw new Error("exp2000 not inserted"); })

				.then(pollUntil("return permanent2Var.inserted || null", [],
					intern.config.WAIT_TIMEOUT, intern.config.POLL_INTERVAL))
				.then(function () {}, function () { throw new Error("perm2 not inserted"); })

				.then(pollUntil("return expirable6000Var.inserted || null", [],
					intern.config.WAIT_TIMEOUT, intern.config.POLL_INTERVAL))
				.then(function () {}, function () { throw new Error("exp6000 not inserted"); })

				// wait for expirable2000 to expire
				.then(pollUntil("return expirable2000Var.expired || null", [],
					intern.config.WAIT_TIMEOUT, intern.config.POLL_INTERVAL))
				.then(function () {}, function () { throw new Error("exp2000 not removed"); })

				// wait for expirable6000 to expire
				.then(pollUntil("return expirable6000Var.expired || null", [],
					intern.config.WAIT_TIMEOUT, intern.config.POLL_INTERVAL))
				.then(function () {}, function () { throw new Error("exp6000 not removed"); })

				// wait for both messages to be removed
				.then(pollUntil("return (expirable2000Var.removed && expirable6000Var.removed) || null", [],
					intern.config.WAIT_TIMEOUT + ANIMATION_DURATION, intern.config.POLL_INTERVAL))

				// check expired are no longer in the DOM
				.then(function () {
					return checkHasNotElement(remote, "expirable2000Msg");
				})
				.then(function () {
					return checkHasNotElement(remote, "expirable6000Msg");
				})

				// check permanent are still in the DOM
				.then(function () {
					return checkHasElement(remote, "permanent1Msg");
				})
				.then(function () {
					return checkHasElement(remote, "permanent2Msg");
				});
		},

		"Check message dismissal": function () {
			var remote = this.remote;
			if (/internet explorer|edge/.test(remote.environmentType.browserName) ||
				remote.environmentType.platformName === "iOS") {
				return this.skip("Clicking dismiss button doesn't work via webdriver (but works manually).");
			}
			return remote
				// click on show button
				.findById("permanentButton").click().end()
				// wait for the message to show up
				.findById("permanentMsg").end()

				// click on the dismiss button
				.findByCssSelector("#permanentMsg .d-toaster-dismiss").click().end()

				// wait for the message to be removed and check it's not there
				.then(pollUntil("return permanentVar.removed || null", [],
					intern.config.WAIT_TIMEOUT, intern.config.POLL_INTERVAL))
				.then(function () {
					return checkHasNotElement(remote, "permanentMsg");
				});
		},

		"Check message duration": function () {
			return this.remote
				.findById("duration6000Button").click().end()
				.findById("duration6000Msg").end()
				// wait for it to expire
				.then(pollUntil("return duration6000Var.expired || null", [],
					6000 + 5000, intern.config.POLL_INTERVAL))
				.then(pollUntil("return duration6000Var.removed || null", [],
					ANIMATION_DURATION + 5000, intern.config.POLL_INTERVAL));
		},

		"Check message types": function () {
			var remote = this.remote;

			function checkType (action) {
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
				.execute("return actionsTypes;") // TODO: stop using, hardcode variable names
				.then(function (actions) {
					remote
						.getCurrentUrl()
						.then(function () {
							return checkType(actions["Type info"]);
						})
						.then(function () {
							return checkType(actions["Type warning"]);
						})
						.then(function () {
							return checkType(actions["Type error"]);
						})
						.end();
				})
				.end();
		},

		"Check visibility on hover": function () {
			return this.skip("moveMouseTo doesn't seem to work anywhere");
			/*
			var remote = this.remote;
			return remote
				// jshint -W061
				.execute("return actionsHover;") // TODO: stop using, hardcode variable names
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
				.end();*/
		}
	});
});
