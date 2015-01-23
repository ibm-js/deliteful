---
layout: doc
title: deliteful/channelBreakpoints
---

# deliteful/channelBreakpoints

This module returns an object containing properties that define values for breakpoints
of CSS media queries based on screen size:

* `smallScreen`: defines the screen size limit between phone-like and tablet-like
channels.
* `mediumScreen`: defines the screen size limit between tablet-like and desktop-like
channels.

The values of the breakpoints are used by CSS media queries of `deliteful/features` for
setting the `has()`-flags `"phone-like-channel"`, `"tablet-like-channel"`, 
and `"desktop-like-channel"`. For more information, see the [`deliteful/features`](./features.md)
documentation.


## Using deliteful/channelBreakpoints

Multichannel widgets (such as [`deliteful/Combobox`](./Combobox.md)) typically do
not use `channelBreakpoints` directly. Instead, they rely on the channel `has()` flags
set by [`deliteful/features`](./features.md). These flags are set by `deliteful/features`
using CSS media queries based on screen size and using the breakpoint values provided by
`deliteful/channelBreakpoints`.

Responsive widgets [`deliteful/ResponsiveColumns`](./ResponsiveColumns.md)) typically
use their own CSS media queries and share the default breakpoint values with the 
multichannel widgets by getting them from `deliteful/channelBreakpoints`, for instance:

```js
require(["deliteful/channelBreakpoints", ...],
	function (channelBreakpoints, ...) {
	var smallScreenBreakpoint = channelBreakpoints.smallScreen;
	var mediumScreenBreakpoint = channelBreakpoints.mediumScreen;
	// Use these values as default breakpoint values for creating media queries
	...
});
```

## Configuring deliteful/channelBreakpoints

The default values of the breakpoints can be configured statically in a hashmap provided through
[requirejs module configuration](http://requirejs.org/docs/api.html#config-moduleconfig), for
instance:

```html
<script>
  // configuring RequireJS
  require.config({
    ...
    config: {
      "deliteful/channelBreakpoints": {
        smallScreen: "200px",
        mediumScreen: "500px"
      }
    }
  });
</script>
```

