# dui/css!

The `dui/css!` plugin is a low level plugin for loading individual CSS files.

This plugin will load the specified CSS files, or alternately AMD modules containing CSS,
and insert their content into the document in the specified order.

The CSS files or modules are specified as a comma separated list, for example
`dui/css!../foo.css,../bar.css` or for modules, `dui/css!../foo,../bar`.

Similar to `dojo/text!`, this plugin won't resolve until it has completed loading the specified CSS.

This loader has the following limitations:

- The plugin will not wait for @import statements to complete before resolving.
  Imported CSS files should not have @import statements, but rather
  all CSS files needed should be listed in the widget's define([...], ...) dependency list.

- Loading plain CSS files won't work cross domain, unless you set Access-Control-Allow-Origin
  in the HTTP response header.  Instead you should load AMD modules containing CSS.

For a more full featured loader one can use:

- [Xstyle's CSS loader](https://github.com/kriszyp/xstyle/blob/master/core/load-css.js)
- [CURL's CSS loader](https://github.com/cujojs/curl/blob/master/src/curl/plugin/css.js)
- [requirejs-css-plugin](https://github.com/tyt2y3/requirejs-css-plugin)
- [requirecss](https://github.com/guybedford/require-css)

## Implementation details

In order to avoid cross browser issues for detecting when a CSS file has finished loading,
this plugin loads CSS files via XHR instead of using <script> tags.

However, if the CSS exists in an AMD module, then this plugin merely leverages require() to
load the module.
