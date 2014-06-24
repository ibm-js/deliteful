define(["intern!object",
	"intern/chai!assert",
	"require"
	], function (registerSuite, assert, require) {

	var checkNumberOfOptions = function (remote, selectId, expectedNumberOfOptions) {
		return remote
			.elementById(selectId)
			.elementsByTagName("OPTION")
			.then(function (result) {
				assert.strictEqual(result.length, expectedNumberOfOptions,
					selectId + " number of options is not the expected one");
			});
	};
	
	var updateAndCheckNumberOfOptions = function (remote, selectId, updateId, expectedNumberOfOptions) {
		return remote
				.elementById(updateId)
				.click()
				.end()
				.elementById(selectId)
				.elementsByTagName("OPTION")
				.then(function (result) {
					assert.strictEqual(result.length, expectedNumberOfOptions,
						selectId + " number of options is not the expected one");
				});
	};

	var nOptions = 40;
	
	registerSuite({
		name: "deliteful/Select - functional",

		"setup": function () {
			return this.remote
				.get(require.toUrl("./Select.html"))
				.waitForCondition("ready", 15000); // large timeout because of sauce...
		},
		/* The content of Select.html:
		1. deliteful/Select created declaratively (with default store):
		2. deliteful/Select created programmatically (with default store):
		3. deliteful/Select created declaratively (with user's store):
		4. deliteful/Select created programmatically (with user's store):
		5. deliteful/Select created declaratively with no options (empty):
		6. deliteful/Select created programmatically with no options (empty):
		7. deliteful/Select created declaratively with larger font-size, font-family:Courier, 
		border-radius, and background-color (with default store):
		*/
		"init (declaratively, default store)": function () {
			return checkNumberOfOptions(this.remote, "select1", nOptions);
		},
		"init (programmatically, default store)": function () {
			return checkNumberOfOptions(this.remote, "select2", nOptions);
		},
		"init (declaratively, user's store)": function () {
			return checkNumberOfOptions(this.remote, "select3", nOptions);
		},
		"init (programmatically, user's store)": function () {
			return checkNumberOfOptions(this.remote, "select4", nOptions);
		},
		"init (declaratively, empty)": function () {
			return checkNumberOfOptions(this.remote, "select5", 0/*empty*/);
		},
		"init (programmatically, empty)": function () {
			return checkNumberOfOptions(this.remote, "select6", 0/*empty*/);
		},
		
		// Check that after pressing the update button the Select widget still has
		// the expected number of options and the options now contain the 
		// updated text content.
		"update (declaratively, default store)": function () {
			return updateAndCheckNumberOfOptions(this.remote, "select1", "update1", nOptions);
		},
		"update (programmatically, default store)": function () {
			return updateAndCheckNumberOfOptions(this.remote, "select2", "update2", nOptions);
		},
		"update (declaratively, user's store)": function () {
			return updateAndCheckNumberOfOptions(this.remote, "select3", "update3", nOptions);
		},
		"update (programmatically, user's store)": function () {
			return updateAndCheckNumberOfOptions(this.remote, "select4", "update4", nOptions);
		}
	});
});
