#ProgressIndicator
A **ProgressIndicator** widget displays a round spinning graphical representation that indicates that a task is ongoing. A value can be set to indicate a percentage of progression.

##Usage
```html
<!-- html -->
<d-progress-indicator></d-progress-indicator>
<!-- the widget is created and ready but it is hidden until you programmatically call the start() method.
     use the autoStart attribute to automatically start the animation.
-->
```

```js
/* Javascript */
var aProgressIndicator = new ProgressIndicator();
aProgressIndicator.startup();
aProgressIndicator.start(); // start and show the animation
```

The widget starts hidden. Use the **start()** method to make it visible and start the animation.

###Enable the automatic startup of the animation
You can show the widget and enable the automatic startup of the animation with the `autoStart`	attribute:

```html
<!-- html -->
<d-progress-indicator autoStart=true></d-progress-indicator>
```
```js
/* Javascript */
var aProgressInidator = new ProgressIndicator({autoStart: true});
aProgressInidator.startup();
```
You may also set `aProgressInidator.autoStart` *before* you call the startup() method.

###Display a percentage of progression
Just set a value (from 0 to 100) to indicate the percentage of progression of the ongoing task. 
```html
<!-- html -->
<d-progress-indicator id="aProgressIndicator" value=0></d-progress-indicator>
```

```js
/* Javascript */
var aProgressIndicator = document.getElementById("aProgressIndicator");
var percentage;
//...
aProgressInidator.value = percentage;
```
Setting the `value` attribute:
- stops any ongoing pinning animation,
- overrides the `autoStart` attribute,
- displays the value and the fill the spinning lines accordingly.


###Stopping and hidding the widget
Call the *stop()* method to stop any ongoing animation and hide the widget. Call the *start()* method or set a value to make it visible again and start the animation or display a progression value. Call *stop(true)* You can ask the widget to release its resources and remove itself from the dom.

```js
/* Javascript */
var aProgressInidator = new ProgressIndicator();
aProgressInidator.startup();
// ...
aProgressIndicator.start(); // show and start the animation
// ...
aProgressIndicator.stop(); // stop the animation and hide
// ...
aProgressIndicator.value = 50; // show and set 50% progression
//
aProgressIndicator.stop(true); // stop the animation and remove the widget from the dom

```

###Change the speed of the animation
The animation makes on revolution in 1 second. This is the default duration that may vary depending on devices/browsers capacity/limitations. The `lapsTime` attribute allow you to change this duration, in milliseconds. Any value below 500ms are defaulted to 1 second.
```html
<!-- html -->
<d-progress-indicator id="aProgressIndicator" lapsTime=600></d-progress-indicator>
```
```js
/* Javascript */
var aProgressIndicator = new ProgressIndicator({lapsTime: 600});
aProgressInidator.lapsTime = 2000;
```

##Attributes
<table>
	<caption>Attributes available on ProgressIndicator</caption>
	<thead>
		<tr>
			<th>Attribute</th>
			<th>Type/unit</th>
			<th>Default</th>
			<th>Description</th>
		</tr>
	</thead>
	<tfoot>
		<tr>
			<th colspan="4">Footer</th></tr>
	</tfoot>
	<tbody>
			<tr>
				<th>autoStart</th>
				<td>boolean</td>
				<td>true</td>
				<td>Set to false disabled the automatic startup of the animation when the widget starts.</td>
			</tr>
			<tr>
				<th>lapsTime</th>
				<td>boolean (ms)</td>
				<td>1000</td>
				<td>Duration of an animation revolution in milliseconds. Minimum value is 500ms: lower values are defaulted to the minimum value.</td>
			</tr>
			<tr>
				<th>value</th>
				<td>number</td>
				<td>-</td>
				<td>Set a value from 0 to 100 to indicate a percentage of progression of an ongoing task. Negative value is defaulted to 0. Values up to 100 are defaulted to 100. NaN is ignored. Explicit declaration of this attribute cancel the auto start animation.</td>
			</tr>
	</tbody>
</table>

##Styling
**ProgressIndicator** generates SVG markup that can be styled using CSS and/or inline styles.

Todo: CSS classes (.d-progress-indicator + .d-progress-indicator-lines)

###Color
Todo: use .d-progress-indicator color style. can override with inline style. use widget.color(aColor) after widget creation.

