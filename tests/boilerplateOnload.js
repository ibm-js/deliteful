// Part of boilerplate.js but need to put it in a separate file for IE9, so it doesn't run until loader has finished
// loading and require is defined
/* global boilerplateOnLoad */
require(["requirejs-domready/domReady!"], boilerplateOnLoad);
