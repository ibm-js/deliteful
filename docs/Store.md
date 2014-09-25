---
layout: default
title: deliteful/Store
---

# deliteful/Store

`deliteful/Store` is a custom element that allows to easily create a memory-based instance of a `dstore/Store` object
 to connect it to `delite/Store` implementations like `deliteful/list/List` or `deliteful/Select`.
 
This is a logical custom element and does not provide any rendering. The rendering is performed by the UI custom element
it is connected to.

This is typically useful for declaring the store in markup, when performing the instantiation programmatically this is
easier to just instanciate a regular `dstore/Store` object.

You should use it as follows:

```js
require(["delite/register", "deliteful/Store", "deliteful/list/List", "dojo/domReady!"], function (register) {
  register.parse();
});
```

```html
<html>
    <d-store id="myStore">
        <!-- Add the following items to the store -->
        { "label": "France", "sales": 500, "profit": 50, "region": "EU" },
        { "label": "Germany", "sales": 450, "profit": 48, "region": "EU" },
        { "label": "UK", "sales": 700, "profit": 60, "region": "EU" },
        { "label": "USA", "sales": 2000, "profit": 250, "region": "America" },
        { "label": "Canada", "sales": 600, "profit": 30, "region": "America" },
        { "label": "Brazil", "sales": 450, "profit": 30, "region": "America" },
        { "label": "China", "sales": 500, "profit": 40, "region": "Asia" },
        { "label": "Japan", "sales": 900, "profit": 100, "region": "Asia" }
    </d-store>
    <d-list height="100%" righttextAttr="sales" categoryAttr="region" store="myStore"></d-list>
</html>
```

