# dui/themes/load!

Dui/themes/load! is a high level plugin for loading all the CSS files necessary for a given widget.

For example, on an iPhone, load!common,Button will load (in the following order):

- dui/themes/ios/common.css
- dui/themes/ios/common_rtl.css
- dui/themes/ios/Button.css
- dui/themes/ios/Button_rtl.css.

The theme is detected automatically based on the platform and browser.

You can alternately pass an additional URL parameter string
theme={theme widget} to force a specific theme through the browser
URL input.

The available theme ids are bootstrap, holodark (theme introduced in Android 3.0),
blackberry, custom, and windows (from Windows 8). The theme names are case-sensitive. If the given
widget does not match, the bootstrap theme is used.
