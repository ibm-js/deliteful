/**
 * This module leverages `requirejs-dplugins/has` and sets `has()` flags that can be
 * used by multichannel widgets to determine the required channel:
 *
 * - `has("phone-like-channel")`: `true` for mobile devices with small screens, `false` otherwise.
 * - `has("tablet-like-channel")`: `true` for mobile devices bigger than phones, `false` otherwise.
 * - `has("desktop-like-channel")`: `true` for non-mobile devices, `false` otherwise.
 *
 * In general pages should dynamically adjust to the browser viewport size, rather than relying
 * on these static has() flags.  They are only used by Combobox.
 *
 * The phone vs. mobile flags are set depending on the screen size, using CSS media queries that
 * compare the actual screen width (the `device-width` media feature) with the corresponding
 * breakpoint values provided by `deliteful/channelBreakpoints`.
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
define([
	"requirejs-dplugins/has",
	"deliteful/channelBreakpoints"
], function (
	has,
	channelBreakpoints
) {
	// The build system evaluates the function of plugin modules while running
	// in nodejs. Hence the need to test for presence of window. The value of
	// the has-features does not matter at build time. (#512)
	if (typeof window !== "undefined") {
		// Determine mobile or desktop by sniffing, rather than testing for TouchEvent etc.,
		// as the latter will be true on desktop machines with touch screens.
		// See https://stackoverflow.com/questions/3514784/what-is-the-best-way-to-detect-a-mobile-device
		var mobile = /Mobi|Android/i.test(navigator.userAgent);

		// matched by screens at least as large as the "small" breakpoint
		var mqAboveSmall = window.matchMedia("(min-device-width: " +
			channelBreakpoints.smallScreen + ")");

		has.add("phone-like-channel", function () {
			return mobile && !mqAboveSmall.matches;
		});
		has.add("tablet-like-channel", function () {
			return mobile && mqAboveSmall.matches;
		});
		has.add("desktop-like-channel", function () {
			return !mobile;
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
