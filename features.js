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
 * <script>
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
 * </script>
 * ```
 * Note that only one channel flag should be set to `true`.
 * 
 * The module returns the `has()` function returned by the module `requirejs-dplugins/has`.
 * 
 * @module deliteful/features
 */
define(["requirejs-dplugins/has", "deliteful/channelBreakpoints"],
	function (has, channelBreakpoints) {

	// Use the device-width media feature rather than width, such that, on
	// desktop/laptop, the selected channel does not depend on the actual size of the
	// viewport. Thus, the selected channel depends only on the static characteristics
	// of the device (its screen width), which fits the use-case of multichannel
	// widgets that need a statically determined channel. Otherwise it would be confusing
	// to get a different channel depending on whether the app is initially loaded
	// in a small or large viewport.
	var mqSmall = window.matchMedia("(min-device-width: " +
		channelBreakpoints.smallScreen + ")");
	var mqMedium = window.matchMedia("(min-device-width: " +
		channelBreakpoints.mediumScreen + ")");
	
	has.add("phone-like-channel", function () {
		return !mqSmall.matches && !mqMedium.matches;
	});
	has.add("tablet-like-channel", function () {
		return mqSmall.matches && !mqMedium.matches;
	});
	has.add("desktop-like-channel", function () {
		return mqSmall.matches && mqMedium.matches;
	});
	
	return has;
});
