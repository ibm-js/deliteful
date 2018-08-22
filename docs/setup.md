---
layout: doc
title: setup
---

# Setup a project using deliteful

The various deliteful custom elements & modules can be consumed from two forms:

* the deliteful built AMD layer
* the deliteful source AMD modules

In order to install the built form:

```sh
bower install deliteful-build
```

Similarly, for the source form:

```sh
bower install deliteful
```

Both commands will install deliteful and its dependencies in a `bower_components` directory.

Using the source form is as simple as requiring the needed AMD modules using RequireJS:

```js
require.config({
  baseUrl: "bower_components"
});
require(["deliteful/Toaster", "requirejs-domready/domReady!"], function (Toaster) {
  var toaster = document.createElement("d-toaster");
  // or
  var toaster = new Toaster();
  //...
});
```
   
In order to consume the [built form](https://github.com/ibm-js/deliteful-build#how-to-use) you first need to load the
corresponding layer and then the AMD modules as follows:
 
```js
require.config({
  baseUrl: "bower_components"
});
require(["deliteful/layer"], function() {
  require(["deliteful/Toaster", "requirejs-domready/domReady!"], 
    function (Toaster) {
      //...
    });
});
```

Note that loading the deliteful layer will automatically load the delite layer.

When using the source form (or the built form if needed), you can build your resulting application using
the [grunt-amd-build](https://github.com/ibm-js/grunt-amd-build) project.

Alternatively you can use the [deliteful Yeoman generator](https://www.npmjs.org/package/generator-deliteful-app)
to setup the project structure.
