---
layout: doc
title: deliteful/features
---

# deliteful/features

This module leverages `requirejs-dplugins/has` and augments the `has()` tests with
media query based tests, such that multichannel widgets can rely on the `has()` API
for determining the channel.
Using this approach in conjunction with an optimizing compiler at build time, it is possible
to optimize out unwanted code paths for specific channel policies.

The `deliteful/features` module sets the following `has`-features:

* `has("phone-like-channel")`: `true` for small screens, `false` otherwise.
* `has("tablet-like-channel")`: `true` for medium screens, `false` otherwise.
* `has("desktop-like-channel")`: `true` for large screens, `false` otherwise.

The flags are set depending on the screen size, using CSS media queries that compare the actual
screen width (the `device-width` media feature) with the corresponding breakpoint values
provided by `deliteful/channelBreakpoints`.

Note that the screen size is the only criteria used for determining the channel. When a
channel flag is set to `true`, the other channel flags are set to `false`.

## Using deliteful/features

Example of use for determining different code paths depending on the channel:

```js
require(["deliteful/features", ...], function (has, ...) {
	if (has("phone-like-channel")) { // only for the phone channel (small screen)
	  ...
	} else { // tablet-like and desktop-like channels (medium and large screens)
	  ...
	}
});
```

Example of conditional loading of dependent modules depending on the channel,
using a chained ternary operator applied to the `deliteful/features` module used as
a [requirejs plugin](http://requirejs.org/docs/plugins.html):

```js
require(["deliteful/features!phone-like-channel?./PhoneModule:tablet-like-channel?./TabletModule:./DesktopModule", ...],
	function (Module, ...) {
	// The Module argument points to the return value of either PhoneModule, TabletModule,
	// or DesktopModule depending on the channel.
	...
});
```


## Configuring deliteful/features

The channel flags can be configured statically in a hashmap provided through
[requirejs module configuration](http://requirejs.org/docs/api.html#config-moduleconfig),
for instance:

```html
<script>
  // configuring RequireJS
  require.config({
    ...
    config: {
      "requirejs-dplugins/has": {
        "phone-like-channel": false,
        "tablet-like-channel": true,
        "desktop-like-channel": false,
      }
    }
  });
</script>
```
Note that only one channel flag should be set to `true`.

If the channel flags are not configured statically, they are computed dynamically using
CSS media queries based on breakpoints values provided by `deliteful/channelBreakpoints`.
The breakpoint values can be configured using `require.config()`.
For details, see the documentation of [`deliteful/channelBreakpoints`](./channelBreakpoints.md).

