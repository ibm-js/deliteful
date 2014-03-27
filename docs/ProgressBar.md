#ProgressBar
A **ProgressBar** widget displays the progress status for tasks that take a long time. The percentage of progression is calculated from both *value* and *max* attibutes. The progress indicator moves to reflect the current percentage of progression. By default, a message displays the percentage of pogression but you can choose to replace it by a custom message using the *label* attribute.


##Usage
```html
<!-- html -->
<d-progress-bar></d-progress-bar>
<!-- the widget is created and ready in indeterminate state -->
<d-progress-bar label="Please wait..."></d-progress-bar>
<!-- the widget is created and ready in indeterminate state with a custom message -->
<d-progress-bar label="Please wait..." value=0></d-progress-bar>
<!-- the widget is created and ready in determinate state (empty) with a custom message -->
```
Todo: add images to illustrate indeterminate mod

```js
/* Javascript */
var aProgressBar = new ProgressBar({label="Please wait..."});
aProgressBar.value=0;
aProgressIndicator.startup();
```

The widget starts hidden. Use the **start()** method to make it visible and start the animation.

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
				<th>value</th>
				<td>Number</td>
				<td>NaN</td>
				<td>Number indicating the amount of completed task. The ProgressBar calculates the percentage of progression with respect to the max value (ie: if value is 53 and max is 100, the progression is 53%.
If max is 200, the progression is 26%). Negative and NaN values are defaulted to 0. Values higher
than max are defaulted to max. Set the value to 'Infinity' to force the progress bar state to indeterminate.</td>
			</tr>
			<tr>
				<th>max</th>
				<td>Number</td>
				<td>100</td>
				<td>Number which express the task as completed. Negative and NaN values are defaulted to 0.</td>
			</tr>
			<tr>
				<th>label</th>
				<td>String</td>
				<td>""</td>
				<td>Allow to specify/override the label on the progress bar whether it's determinate or indeterminate.The default behavior of the ProgressBar is to  displays the percentage of completion when the state is determinate, and to display no label when state is indeterminate. You can override this with the label attribute. Set an empty string to restore the default behavior.</td>
			</tr>
			<tr>
				<th>displayValues</th>
				<td>boolean</td>
				<td>false</td>
				<td>Allow to display the current value vs the max in the form value/max in addition to the current label. When true, the label stick to one side and value/max stick to the other side. Ex: [65%........379/583] This property is theme dependent. Has no effect on bootstrap. Has effect on holodark.</td>
			</tr>
			<tr>
				<th>fractionDigits</th>
				<td>Number</td>
				<td>0</td>
				<td>Number of places to show on default label displayed by the progress bar.</td>
			</tr>
	</tbody>
</table>

##Styling
**ProgressBar** can be styled using CSS and/or inline styles.

Todo: CSS classes