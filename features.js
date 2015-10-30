/**
 * This module leverages `requirejs-dplugins/has` and sets `has()` flags that can be
 * used by multichannel widgets to determine the required channel:
 *
 * - `has("phone-like-channel")`: `true` for small screens, `false` otherwise.
 * - `has("tablet-like-channel")`: `true` for medium screens, `false` otherwise.
 * - `has("desktop-like-channel")`: `true` for large screens, `false` otherwise.
 * 
 * These flags are set depending on the screen size, using CSS media queries that
 * compare the actual screen width (the `device-width` media feature) with the corresponding
 * breakpoint values provided by `deliteful/channelBreakpoints`. 
 * 
 * Note that the screen size is the only criteria used for determining
 * the channel. When a channel flag is set to `true`, the other channel flags are set
 * to `false`.
 * 
 * The default values of the breakpoints can be configured using `require.config()`.
 * For details, see the documentation of `deliteful/channelBreakpoints`.
 * 
 * The channel can be configured statically using `require.config()`, for instance:
 * 
 * ```html
 * &lt;script>
 *   // configuring RequireJS
 *   require.config({
 *     ...
 *     config: {
 *       "requirejs-dplugins/has": {
 *         "phone-like-channel": false,
 *         "tablet-like-channel": true,
 *         "desktop-like-channel": false,
 *       }
 *     }
 *   });
 * &lt;/script>
 * ```
 * Note that only one channel flag should be set to `true`.
 * 
 * The module returns the `has()` function returned by the module `requirejs-dplugins/has`.
 * 
 * @module deliteful/features
 */
define(["requirejs-dplugins/has", "deliteful/channelBreakpoints"],
	function (has, channelBreakpoints) {

	// Notes:
	// - Use the device-width media feature rather than width, such that, on
	// desktop/laptop, the selected channel does not depend on the actual size of the
	// viewport. Thus, the selected channel depends only on the static characteristics
	// of the device (its screen width), which fits the use-case of multichannel
	// widgets that need a statically determined channel. Otherwise it would be confusing
	// to get a different channel depending on whether the app is initially loaded
	// in a small or large viewport.
	// - We do not technically enforce the "small" breakpoint to be smaller than the
	// medium one. Hence the apparently redundant checks of both media queries
	// for the small and large channels.
	
	// The build system evaluates the function of plugin modules while running
	// in nodejs. Hence the need to test for presence of window. The value of
	// the has-features does not matter at build time. (#512)
	if (typeof window !== "undefined") {
		// matched by screens at least as large as the "small" breakpoint
		var mqAboveSmall = window.matchMedia("(min-device-width: " +
			channelBreakpoints.smallScreen + ")");
		// matched by screens at least as large as the "medium" breakpoint
		var mqAboveMedium = window.matchMedia("(min-device-width: " +
			channelBreakpoints.mediumScreen + ")");
	
		has.add("phone-like-channel", function () {
			return !mqAboveSmall.matches && !mqAboveMedium.matches;
		});
		has.add("tablet-like-channel", function () {
			return mqAboveSmall.matches && !mqAboveMedium.matches;
		});
		has.add("desktop-like-channel", function () {
			return mqAboveSmall.matches && mqAboveMedium.matches;
		});
	}

	// Does browser have support for CSS animations ?
	has.add("animationEndEvent", function () {
		var animationEndEvents = {
			"animation": "animationend", // > IE10, FF
			"-webkit-animation": "webkitAnimationEnd",   // > chrome 1.0 , > Android 2.1 , > Safari 3.2
			"-ms-animation": "MSAnimationEnd" // IE 10
		};
		// NOTE: returns null if event is not supported
		var fakeElement = document.createElement("fakeElement");
		for (var event in animationEndEvents) {
			if (fakeElement.style[event] !== undefined) {
				return animationEndEvents[event];
			}
		}
		return null;
	});

	return has;
});
