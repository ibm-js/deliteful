# dui/themes/load!

Dui/themes/load! is a high level plugin for loading CSS files based on the theme of the page.

The plugin is similar to the CSS loader, but will substitute {{theme}} with the page's theme.

	themes/load!./a/b/{{theme}}/file1.css,./a/b/{{theme}}/file2.css

The requirements are that:

- there is an a/b directory relative to the current directory
- it contains subdirectories holodark, ios, blackberry, and bootstrap
- each of those subdirectories contains file1.css and file2.css

The theme is detected automatically based on the platform and browser, and the correct files are loaded.

You can alternately pass an additional URL parameter string
theme={theme widget} to force a specific theme through the browser
URL input.

The available theme ids are:
 - bootstrap
 - holodark (theme introduced in Android 3.0)
 - blackberry
 - ios

The theme names are case-sensitive.
