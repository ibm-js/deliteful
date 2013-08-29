define([
	"dojo/_base/declare", // declare
	"./HorizontalRuleLabels"
], function(declare, HorizontalRuleLabels){

	// module:
	//		dui/form/VerticalRuleLabels

	return declare("dui.form.VerticalRuleLabels", HorizontalRuleLabels, {
		// summary:
		//		Labels for the `dui/form/VerticalSlider`

		templateString: '<div class="duiRuleContainer duiRuleContainerV duiRuleLabelsContainer duiRuleLabelsContainerV"></div>',

		_positionPrefix: '<div class="duiRuleLabelContainer duiRuleLabelContainerV" style="top:',
		_labelPrefix: '"><span class="duiRuleLabel duiRuleLabelV">',

		_calcPosition: function(pos){
			// Overrides HorizontalRuleLabel._calcPosition()
			return 100-pos;
		},

		// needed to prevent labels from being reversed in RTL mode
		_isHorizontal: false
	});
});
