define(["intern",
    "intern!object",
    "intern/dojo/node!leadfoot/helpers/pollUntil",
	"intern/chai!assert",
	"require"
	], function (intern, registerSuite, pollUntil, assert, require) {

	var loadFile = function (remote, fileName) {
		return remote
			.get(require.toUrl(fileName))
			.then(pollUntil("return ready ? true : null;", [],
					intern.config.WAIT_TIMEOUT, intern.config.POLL_INTERVAL));
	};

	var checkScrollAmount = function (remote, scrollContainerId, expectedScroll) {
		remote.execute("return document.getElementById('" +
			scrollContainerId + "').getCurrentScroll();")
			.then(function (scroll) {
				assert.strictEqual(scroll.x, expectedScroll.x, "unexpected scrollLeft!");
				assert.strictEqual(scroll.y, expectedScroll.y, "unexpected scrollTop!");
			});
	};

	var checkScrollTopLeft = function (remote, wd, scrollContainerId, scrollTo, expectedScroll) {
		// Executes scrolling by modifying the scrollTop/scrollLeft properties of
		// widget's scrollableNode.
		return wd
			.then(function () {
				var scrollableNodeStr = "document.getElementById('" +
					scrollContainerId + "').scrollableNode";
				remote.execute(scrollableNodeStr + ".scrollLeft = '" + scrollTo.x + "'; " +
					scrollableNodeStr + ".scrollTop = '" + scrollTo.y + "';")
					.then(function () {
						checkScrollAmount(remote, scrollContainerId, expectedScroll);
					});
			});
	};

	var checkScrollBy = function (remote, wd, scrollContainerId, scrollBy, expectedScroll) {
		// Executes scrolling by calling the scrollBy() method of the widget.
		return wd
			.then(function () {
				remote.execute("document.getElementById('" +
					scrollContainerId + "').scrollBy({" +
					"x: " + scrollBy.x + ", y: " + scrollBy.y + "});")
					.then(function () {
						checkScrollAmount(remote, scrollContainerId, expectedScroll);
					});
			});
	};
	
	var checkScroll = function (remote, fileName, scrollContainerId,
								scrollAmount, expectedScroll, checkScrollFunction) {
		var wd = loadFile(remote, fileName);
		return checkScrollFunction(remote, wd, scrollContainerId, scrollAmount, expectedScroll);
	};

	registerSuite({
		name: "ScrollableContainer - functional",

		"scroll with animation (via button, inside LinearLayout, scrollDirection=vertical)": function () {
			this.timeout = intern.config.TEST_TIMEOUT;
			return loadFile(this.remote, "./ScrollableContainer.html")
				.findById("scrollButton")
				.click()
				.end()
				// Check that the scroll arrives at 100: (large timeout because of sauce...)
				.then(pollUntil("return document.getElementById('scrollContainer').scrollableNode.scrollTop==100 ?"
						+ "true: null;", [], intern.config.WAIT_TIMEOUT, intern.config.POLL_INTERVAL))
				// Check that it stays at 100 even after waiting a while (that is,
				// that it does not continue to scroll):
				.sleep(200)
				.execute("return document.getElementById('scrollContainer').scrollableNode.scrollTop;")
				.then(function (value) {
					assert.strictEqual(value, 100, "scrollTop should have stayed at 100!");
				});
		},

		"scrollBy (without LinearLayout, scrollDirection=vertical)": function () {
			this.timeout = intern.config.TEST_TIMEOUT;
			return checkScroll(this.remote, "./ScrollableContainer-alone.html", "scrollContainer",
				{x: 100, y: 100}, // scroll amount
				// Since this container has scrollDirection="vertical", the horizontal part of
				// scrollBy should have no effect on the amount of scroll.
				{x: 0, y: 100}, // expected scroll
				checkScrollBy); // checking function
		},
		
		"scrollTop/scrollLeft (without LinearLayout, scrollDirection=vertical)": function () {
			this.timeout = intern.config.TEST_TIMEOUT;
			return checkScroll(this.remote, "./ScrollableContainer-alone.html", "scrollContainer",
				{x: 100, y: 100}, // scroll amount
				// Since this container has scrollDirection="vertical", the horizontal part of
				// scrollBy should have no effect on the amount of scroll.
				{x: 0, y: 100}, // expected scroll
				checkScrollTopLeft); // checking function
		},

		"scrollBy (non-fullscreen, without LinearLayout, scrollDirection=both)": function () {
			this.timeout = intern.config.TEST_TIMEOUT;
			return checkScroll(this.remote, "./ScrollableContainer-alone-small.html", "scrollContainer1",
				{x: 100, y: 100}, // scroll amount
				// On this container, scrollDirection is "both", so it should scroll
				// both horizontally and vertically
				{x: 100, y: 100}, // expected scroll
				checkScrollBy); // checking function
		},

		"scrollTop/scrollLeft (non-fullscreen, without LinearLayout, scrollDirection=both)": function () {
			this.timeout = intern.config.TEST_TIMEOUT;
			return checkScroll(this.remote, "./ScrollableContainer-alone-small.html", "scrollContainer1",
				{x: 100, y: 100}, // scroll amount
				// On this container, scrollDirection is "both", so it should scroll
				// both horizontally and vertically
				{x: 100, y: 100}, // expected scroll
				checkScrollTopLeft); // checking function
		},
		
		"scrollBy (non-fullscreen, without LinearLayout, scrollDirection=vertical)": function () {
			this.timeout = intern.config.TEST_TIMEOUT;
			return checkScroll(this.remote, "./ScrollableContainer-alone-small.html", "scrollContainer2",
				{x: 100, y: 100}, // scroll amount
				// Since this container has scrollDirection="vertical", the horizontal part of
				// scrollBy should have no effect on the amount of scroll.
				{x: 0, y: 100}, // expected scroll
				checkScrollBy); // checking function
		},

		"scrollTop/scrollLeft (non-fullscreen, without LinearLayout, scrollDirection=vertical)": function () {
			this.timeout = intern.config.TEST_TIMEOUT;
			return checkScroll(this.remote, "./ScrollableContainer-alone-small.html", "scrollContainer2",
				{x: 100, y: 100}, // scroll amount
				// Since this container has scrollDirection="vertical", the horizontal part of
				// scrollBy should have no effect on the amount of scroll.
				{x: 0, y: 100}, // expected scroll
				checkScrollTopLeft); // checking function
		},

		"scrollBy (fullscreen, with LinearLayout, scrollDirection=vertical)": function () {
			this.timeout = intern.config.TEST_TIMEOUT;
			return checkScroll(this.remote, "./ScrollableContainer-full-screen.html", "scrollContainer",
				{x: 100, y: 100}, // scroll amount
				// Since this container has scrollDirection="vertical", the horizontal part of
				// scrollBy should have no effect on the amount of scroll.
				{x: 0, y: 100}, // expected scroll
				checkScrollBy); // checking function
		},
		
		"scrollTop/scrollLeft (fullscreen, with LinearLayout, scrollDirection=vertical)": function () {
			this.timeout = intern.config.TEST_TIMEOUT;
			return checkScroll(this.remote, "./ScrollableContainer-full-screen.html", "scrollContainer",
				{x: 100, y: 100}, // scroll amount
				// Since this container has scrollDirection="vertical", the horizontal part of
				// scrollBy should have no effect on the amount of scroll.
				{x: 0, y: 100}, // expected scroll
				checkScrollTopLeft); // checking function
		},
		
		"scrollBy (fullscreen, as subchild of LinearLayout, scrollDirection=vertical)": function () {
			this.timeout = intern.config.TEST_TIMEOUT;
			return checkScroll(this.remote,
				"./ScrollableContainer-full-screen-as-subchild-of-LinearLayout.html",
				"scrollContainer",
				{x: 100, y: 100}, // scroll amount
				// Since this container has scrollDirection="vertical", the horizontal part of
				// scrollBy should have no effect on the amount of scroll.
				{x: 0, y: 100}, // expected scroll
				checkScrollBy); // checking function
		},
		
		"scrollTop/scrollLeft (fullscreen, as subchild of LinearLayout, scrollDirection=vertical)": function () {
			this.timeout = intern.config.TEST_TIMEOUT;
			return checkScroll(this.remote,
				"./ScrollableContainer-full-screen-as-subchild-of-LinearLayout.html",
				"scrollContainer",
				{x: 100, y: 100}, // scroll amount
				// Since this container has scrollDirection="vertical", the horizontal part of
				// scrollBy should have no effect on the amount of scroll.
				{x: 0, y: 100}, // expected scroll
				checkScrollTopLeft); // checking function
		},
		
		"scrollBy (fullscreen, as subsubchild of LinearLayout, scrollDirection=vertical)":
			function () {
				this.timeout = intern.config.TEST_TIMEOUT;
				return checkScroll(this.remote,
					"./ScrollableContainer-full-screen-as-subsubchild-of-LinearLayout.html",
					"scrollContainer",
					{x: 100, y: 100}, // scroll amount
					// Since this container has scrollDirection="vertical", the horizontal part of
					// scrollBy should have no effect on the amount of scroll.
					{x: 0, y: 100}, // expected scroll
					checkScrollBy); // checking function
			},
		
		"scrollTop/scrollLeft (fullscreen, as subsubchild of LinearLayout, scrollDirection=vertical)":
			function () {
				this.timeout = intern.config.TEST_TIMEOUT;
				return checkScroll(this.remote,
					"./ScrollableContainer-full-screen-as-subsubchild-of-LinearLayout.html",
					"scrollContainer",
					{x: 100, y: 100}, // scroll amount
					// Since this container has scrollDirection="vertical", the horizontal part of
					// scrollBy should have no effect on the amount of scroll.
					{x: 0, y: 100}, // expected scroll
					checkScrollTopLeft); // checking function
			},
		
		"scrollBy (non-fullscreen, with LinearLayout, scrollDirection=both)": function () {
			this.timeout = intern.config.TEST_TIMEOUT;
			return checkScroll(this.remote, "./ScrollableContainer-small.html", "scrollContainer1",
				{x: 100, y: 100}, // scroll amount
				// On this container, scrollDirection is "both", so it should scroll
				// both horizontally and vertically
				{x: 100, y: 100}, // expected scroll
				checkScrollBy); // checking function
		},
		
		"scrollTop/scrollLeft (non-fullscreen, with LinearLayout, scrollDirection=both)": function () {
			this.timeout = intern.config.TEST_TIMEOUT;
			return checkScroll(this.remote, "./ScrollableContainer-small.html", "scrollContainer1",
				{x: 100, y: 100}, // scroll amount
				// On this container, scrollDirection is "both", so it should scroll
				// both horizontally and vertically
				{x: 100, y: 100}, // expected scroll
				checkScrollTopLeft); // checking function

		},

		"scrollBy (non-fullscreen, with LinearLayout, scrollDirection=vertical)": function () {
			this.timeout = intern.config.TEST_TIMEOUT;
			return checkScroll(this.remote, "./ScrollableContainer-small.html", "scrollContainer2",
				{x: 100, y: 100}, // scroll amount
				// Since this container has scrollDirection="vertical", the horizontal part of
				// scrollTo should have no effect on the amount of scroll.
				{x: 0, y: 100}, // expected scroll
				checkScrollBy); // checking function
		},
		
		"scrollBy (non-fullscreen, with LinearLayout, with 1 level of interm. DIV, scrollDirection=vertical)":
			function () {
				this.timeout = intern.config.TEST_TIMEOUT;
				return checkScroll(this.remote, "./ScrollableContainer-small.html", "scrollContainer3",
					{x: 100, y: 100}, // scroll amount
					// Since this container has scrollDirection="vertical", the horizontal part of
					// scrollTo should have no effect on the amount of scroll.
					{x: 0, y: 100}, // expected scroll
					checkScrollBy); // checking function
			},
		
		"scrollBy (non-fullscreen, with LinearLayout, with 2 levels of interm. DIV, scrollDirection=vertical)":
			function () {
				this.timeout = intern.config.TEST_TIMEOUT;
				return checkScroll(this.remote, "./ScrollableContainer-small.html", "scrollContainer4",
					{x: 100, y: 100}, // scroll amount
					// Since this container has scrollDirection="vertical", the horizontal part of
					// scrollTo should have no effect on the amount of scroll.
					{x: 0, y: 100}, // expected scroll
					checkScrollBy); // checking function
			},
		
		"scrollTop/scrollLeft (non-fullscreen, with LinearLayout, scrollDirection=vertical)": function () {
			this.timeout = intern.config.TEST_TIMEOUT;
			return checkScroll(this.remote, "./ScrollableContainer-small.html", "scrollContainer2",
				{x: 100, y: 100}, // scroll amount
				// Since this container has scrollDirection="vertical", the horizontal part of
				// scrollTo should have no effect on the amount of scroll.
				{x: 0, y: 100}, // expected scroll
				checkScrollTopLeft); // checking function
		}
	});
});
