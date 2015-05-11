---
layout: doc
title: styling
---

# Styling deliteful custom element widgets

Deliteful widgets come as one `SomeWidget.js` file and a folder `SomeWidget/`. 
The latter holds one template and one CSS file for each of the provided themes: bootstrap, holodark (android) and ios.
The styles for each theme are first written in [LESS](http://lesscss.org/) then compiled to CSS browsers understand. 
As for the template, it's written using the [Handlebars](http://handlebarsjs.com/) syntax then converted to HTML on 
the fly by the browser and inserted into the page.

For example let's look at the Slider widget. Like every widget, it has a `Slider.js` file and a `Slider/` folder

```
- Slider.js, holds the logic of the widget
- Slider/
 |_ Slider.html, is the template. It's compiled into HTML and inserted into the page.
 |_ themes/
       |_ bootstrap/
             |_ Slider.css: is the CSS stylesheet for slider under the bootstrap theme. 
                            You don't have to link it youself: you'll just need to 
                            specify which theme you're using and it's automatically 
                            fetched when you require the widget.
             |_ Slider.less: is the LESS file that compiles to Slider.css, when typing 
                             `grunt less` in your console.
       |_ holodark/
       |_ ios/
- samples/Slider.html
```

Open samples/Slider.html in your browser if you want to see what it looks like. By default, the bootstrap theme is loaded. 

If you want to customize the look of Slider under the bootstrap theme, there are two ways you can do this.

1. Edit `Slider/themes/bootstrap/Slider.css`: 
   this won't affect the other themes. Also this isn't the recommended way as you can lose your changes with a single unfortunate `grunt less`.
   However, it is simpler as it doesn't require a build step.
2. Edit `Slider/themes/bootstrap/Slider.less`:
   this won't affect the other themes. If you're familiar with CSS preprocessors, we recommend this approach. Once you've
   made your changes, type `grunt less` in your console to regenerate the matching Slider.css.

You'll notice most classes inside Slider.css start with `d-slider`. That's a convention.
Leveraging this you can also choose to simply override theses classes with your own styles either by:

* creating a stylesheet and link it in your page. 

```html
<link rel="stylesheet" href="path/to/my-styles.css" type="text/css" />
```

* opening a `<style>` tag directly in your page.

```html
<style>
.d-slider { ... }
</style>
```

With both ways, your styles will be prioritized by the browser over the CSS files inside `Slider/`.
Note that this *will* affect the look of Slider under all themes.


