# dui/Stateful

The purpose is to dui/Stateful is three-fold:

(1) declare a class where properties are set and retrieved using standard notation:

	myWidget.label = "hello";
	console.log(myWidget.label);

(2) be able to watch for changes to [a subset of] instance properties:

   	myWidget.watch("label", callback);

(3) allow the class to define custom getters/setters for some (but not necessarily all) of the properties

	MyClass = dcl(Stateful, {
		label: "Press",
		_setLabelAttr: function(val){
				this._set("label", ...);
				...
			}
		}
	});

## Implementation notes

Ideally ES5 native accessors would be supported via [dcl](http://www.dcljs.org/) but we are
[still waiting for that](https://github.com/uhop/dcl/issues/2).  It's not supported
by [ComposeJS](https://github.com/kriszyp/compose) either, although Kitson has
[a branch](https://github.com/kitsonk/core/blob/master/compose.js#L373) that supports it,
so using his branch is another option, if we could live with ComposeJS's limited features like
lack of C3MRO.


As for implementing watch(), we would ideally use
[Object.observe()](http://updates.html5rocks.com/2012/11/Respond-to-change-with-Object-observe)
or some similar functionality like
[Firefox's watch() method](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/watch)
or [IE's onpropertychange listener](http://msdn.microsoft.com/en-us/library/ie/ms536956.aspx).
Unfortunately there is no support for any of these on current versions of Webkit.  Even when Webkit starts
to support Object.observe() (in its production release, without flipping an switch to
"turn on experimental features"), it will be a while before the change trickles down to the mobile devices
we want to support.

Polymer tries to polyfill this functionality with it's [observe-js](https://github.com/Polymer/observe-js)
library.  However, after changing an object property (or set of object properties) the app needs to call
`Platform.performMicroTaskCheckpoint()`, or a similar method like `observer.deliver()`, so this hardly seems
like an acceptable solution.

So, the implementation is that dui/Stateful will note all the properties defined in the prototype, direct and inherited,
and call Object.defineProperty() on the prototype to add native ES5 setters and getters for those properties.
For properties where the subclass doesn't define a custom setter, Stateful will generate one on-the-fly
that just calls this._set(...) to save the new value and announce the change to any listeners registered
via watch().
