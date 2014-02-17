define([
	"delite/register",
	"delite/Container",
	"delite/Scrollable"
], function (register, Container, Scrollable) {

	// module:
	//		deliteful/ScrollableContainer
	
	return register("d-scrollable-container", [HTMLElement, Container, Scrollable], {
		// summary:
		//		A container widget with scrolling capabilities.
		// description:
		//		A container widget which can scroll its content 
		//		horizontally and/or vertically. Its scrolling capabilities 
		//		and API are provided by the mixin delite/Scrollable.
		// example:
		//	|	<d-scrollable-container>
		//	|		<div>...</div>
		//	|		<div>...</div>
		//	|		<div>...</div>
		//	|	</d-scrollable-container>

		// baseClass: String
		//		The name of the CSS class of this widget.
		baseClass: "d-scrollable-container"
	});
});
