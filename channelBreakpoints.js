/** @module deliteful/channelBreakpoints */
define({
	/**
	 * This module returns an object containing properties that define values for breakpoints
	 * of CSS media queries based on screen size:
	 *
	 * - `smallScreen`: defines the screen size limit between phone-like and tablet-like
	 * channels.
	 * - `mediumScreen`: defines the screen size limit between tablet-like and desktop-like
	 * channels.
	 *
	 * The values of the breakpoints are used by CSS media queries of `deliteful/features`
	 * for setting the `has()`-flags `"phone-like-channel"`, `"tablet-like-channel"`, and
	 * `"desktop-like-channel"`.
	 *
	 * @module deliteful/channelBreakpoints
	 */

	/**
	 * The maximum screen size value for small screens.
	 * Used as breakpoint by a CSS media query of `deliteful/features` as screen size
	 * threshold between the phone-like and the tablet-like channels.
	 * @member {string}
	 * @default "480px"
	 */
	smallScreen: "480px",

	/**
	 * The maximum screen size value for medium screens.
	 * Used as breakpoint by a CSS media query of `deliteful/features` as screen size
	 * threshold between the tablet-like and the desktop-like channels.
	 * @member {string}
	 * @default "1024px"
	 */
	mediumScreen: "1024px"
});
