define(["intern!object",
        "intern/chai!assert",
        "require"
        ], function (registerSuite, assert, require) {

	// helpers
	var attrValueToArray = function(value){
		return value.replace(/\s+/g, ' ')
			.trim()
			.split(" ");
	};
	var q = function(str){
		return "'" + str + "'";
	}


	// asserts
	var _assert = {};

	_assert.include = function (array, element, message) {
		if (typeof(message) !== "undefined")
			assert(array.indexOf(element) >= 0, message);
		else
			assert(array.indexOf(element) >= 0);
	};

	_assert.sameMembers = function(array1, array2, message){
		array1.forEach(function (e1) {
			_assert.include(array2, e1, message);
		});
		assert.equal(array1.length, array2.length, message)
	};


	_assert.includeMembers = function(array, subarray, message){
		subarray.forEach(function (e) {
			_assert.include(array, e, message);
		});
	};

	_assert.attrEqual = function(value1, value2){
		var v1 = attrValueToArray(value1),
			v2 = attrValueToArray(value2);
		_assert.sameMembers(v1, v2, "attributes " + value1 + " and " + value2 + " are equal");
	};
	_assert.attrHas = function(value, sub){
		var v1 = attrValueToArray(value),
			v2 = attrValueToArray(sub);
		_assert.includeMembers(v1, v2, "attributes " + value + " contains " + sub );
	};


	// const
	var WAIT_TIMEOUT_MS = 180000;
	var TEST_TIMEOUT_MS = 120000;

	// check functions

	var checkAriaAttr = function (remote, widgetId) {
		return remote
			.elementById(widgetId)
			.getAttribute("aria-relevant")
			.then(function (value) {
				assert.equal(value, "additions text")
				_assert.attrEqual(value, "additions text")
			})
			.end();
	};

	var checkNumberOfMessages = function(remote, toasterId, expected){
		return remote
			.elementById(toasterId)
			.elementsByClassName("d-toaster-message")
			.then(function(value){
				assert.equal(value.length, expected, "number of messages is correct")
			})
			.end();
	};

	var clickButton = function(remote, buttonId){
		return remote
			.elementById(buttonId)
			.click()
			.end()
		.then(function(){

		})

	};

	var checkMessageHasAppeared = function(remote, messageId){
		console.log(messageId);
		return remote
			.elementById(messageId)
			.then(function(){
				console.log("a");
			})
			.end();


	};

	var checkInsertion = function(remote, elementId){
		return remote
			.elementByIdOrNull(elementId)
			.then(function(element){
				assert.isNotNull(element, "element " + elementId + " was correctly inserted in DOM")
			})
			.end()
	};
	var checkHasClass = function(remote, elementId, className){
		return remote
			.elementByIdOrNull(elementId)
			.getAttribute("class")
			.then(function(value){
				_assert.attrHas(value, className);
			})
			.end()
	};

	// check how much time a message stays
	// check if persitant message don't fade
	// check if clicking on the button makes them go away

	console.log("# Registering Toaster tests");
	registerSuite({
		name: "Toaster tests",
		"default": function () {
			this.timeout = TEST_TIMEOUT_MS;
			console.log("# running test 'default'");
			var remote = this.remote;
			return remote
				.get(require.toUrl("./ToasterTests.html"))
				.waitForCondition("'ready' in window && ready", WAIT_TIMEOUT_MS)
				// Check initial rating
				.then(function () {
					return checkAriaAttr(remote, "default");
				})
				.then(function(){
					// check number of messages on startup
					return checkNumberOfMessages(remote, "default", 0)
				})
				.then(function(){
					// post a few messages, and check if they are there
					return clickButton(remote, "trigger-button")
				})
				.then(function(){
					return checkNumberOfMessages(remote, "default", 1);
				});



		},
		"Check message posting": function () {
			this.timeout = TEST_TIMEOUT_MS;
			console.log("# running test 'check message posting'");
			var remote = this.remote;
			return remote
				.get(require.toUrl("./ToasterTests.html"))
				.waitForCondition("'ready' in window && ready", WAIT_TIMEOUT_MS)
				// Check initial rating
				.then(function(){
					// check number of messages on startup
					return checkNumberOfMessages(remote, "default", 0)
				})

		},
		"Check message durations": function () {
			this.timeout = TEST_TIMEOUT_MS;
			console.log("# running test 'check message posting'");
			var remote = this.remote;
			return remote
				.get(require.toUrl("./ToasterTests.html"))
				.waitForCondition("'ready' in window && ready", WAIT_TIMEOUT_MS)
				.then(function(){
					return remote
						.eval("actionsDurations")// NOTE: a global variable existing in ToasterTests.html
						.then(function(actions){
							// check number of messages on startup
							for(a in actions){
								(function(action){
									remote
										.elementById(action.buttonId)
										.clickElement()
										.end()
								})(actions[a]);
							}
						})
						.end()

				})
				.then(function(){
					return remote
						.eval("actionsDurations")// NOTE: a global variable existing in ToasterTests.html
						.then(function(actions){
							// check number of messages on startup
							for(a in actions){
								(function(a, action){
									//checkInsertion(remote, action.props.id);
									var codeIns = action.var + ".inserted"; // checking that messages are inserted
									remote.waitForCondition(codeIns, 1000);
									if (action.props.duration > -1){
										var codeExp = action.var + ".expired"; // checking that expired message actually expired
										var codeRem = action.var + ".removed";
										remote
											.waitForCondition(codeExp, action.props.duration + 1000)
											.then(function(){
												checkHasClass(remote, action.props.id, "d-toaster-fadeout");
											})
									}
								})(a, actions[a]);
							}
						})
						.end()

				})
				.then(function(){

				})
		},
		"Check message types": function () {
			this.timeout = TEST_TIMEOUT_MS;
			console.log("# running test 'check message posting'");
			var remote = this.remote;
			return remote
				.get(require.toUrl("./ToasterTests.html"))
				.waitForCondition("'ready' in window && ready", WAIT_TIMEOUT_MS)
				// Check initial rating
				.then(function(){
					return remote
						.eval("actionsTypes")// NOTE: a global variable existing in ToasterTests.html
						.then(function(actions){
							// check number of messages on startup
							for(a in actions){
								(function(action){
									console.log(action.buttonId);
									remote
										.elementById(action.buttonId)
										.clickElement()
										.end()
								})(actions[a]);
							}
						})
						.end()

				})
				.then(function(){
					return remote
						.eval("actionsTypes")// NOTE: a global variable existing in ToasterTests.html
						.then(function(actions){
							// check number of messages on startup
							for(a in actions){
								(function(action){
									console.log(action.props.id);
									checkInsertion(remote, action.props.id);
									checkHasClass(remote, action.props.id,
										"d-toaster-type-" + action.props.type);
								})(actions[a]);
							}
						})
						.end()

				})
		}

	});
});
