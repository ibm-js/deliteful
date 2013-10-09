# DUI

Dui aims to provide a widget infrastructure and set of widgets that fit future standards but are possible
to use on all modern browsers without performance concerns.

Specifically, it's based on the following concepts:

* Custom elements: The node is the widget and the widget is the node.
  By using Custom Elements, the constructor for all widgets is based
  off of the `HTMLElement` DOM object.  This has several advantages, in that as you manipulate the DOM nodes, you are also
  dealing with the widget instances.  This also means there is no widget registry, because the document is effectively the
  registry. You can use whatever DOM manipulation API you want to move the widget around.

* It leverages ES5 accessor properties instead of using the discreet accessors.  This means there is no `widget.get()`
  and `widget.set()`.  You can affect the widget directly.   See the [Stateful](Stateful.md) documentation
  for details.

* It directly supports reactive templating via the handlebars! plugin,
  see the [handlebars](handlebars.md) documentation for details
