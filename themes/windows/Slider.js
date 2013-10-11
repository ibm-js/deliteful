define(function(){ return '\
.duiToolBarButtonHasArrow-styles {\
  width: 27px;\
  height: 27px;\
  border-radius: 20px;\
  border: 2px solid #ffffff;\
  padding: 0px;\
  margin: 0px;\
  margin-top: 8px;\
  margin-bottom: 8px;\
  background-image: url("images/dark/back.png");\
  background-position: 50% 50%;\
  background-size: 27px 27px;\
  background-repeat: no-repeat;\
}\
.duiSlider {\
  display: inline-block;\
  vertical-align: middle;\
  border-collapse: separate;\
  cursor: pointer;\
  padding: 12pt;\
  -webkit-user-select: none;\
  -ms-user-select: none;\
  -webkit-box-sizing: border-box;\
  box-sizing: border-box;\
  -webkit-tap-highlight-color: rgba(255, 255, 255, 0);\
}\
.duiSlider input {\
  display: none;\
}\
.duiSlider .dijitRuleContainer {\
  width: 100%;\
  margin: 0;\
  display: inline-block;\
  vertical-align: top;\
}\
.duiSliderH {\
  width: 100%;\
}\
.duiSliderH .duiSliderRemainingBar {\
  width: 100%;\
  min-width: 4.6em;\
  height: 0.65em;\
}\
.duiSliderH .duiSliderRemainingBar > * {\
  left: 0;\
}\
.duiSliderH .duiSliderProgressBar {\
  height: 100%;\
  top: 0;\
  float: none;\
}\
.duiSliderH .dijitRuleContainer > * {\
  margin-left: -0.25px;\
}\
.duiSliderH .duiSliderHandle {\
  top: -0.3499999999999999em;\
  width: 0.65em;\
  height: 1.15em;\
}\
.duiSliderV {\
  height: 100%;\
}\
.duiSliderV .duiSliderRemainingBar {\
  height: 100%;\
  min-height: 4.6em;\
  width: 0.65em;\
}\
.duiSliderV .duiSliderRemainingBar > * {\
  top: 0;\
}\
.duiSliderV .duiSliderProgressBar {\
  width: 100%;\
  left: 0;\
  display: block;\
}\
.duiSliderV .duiSliderHandle {\
  left: -0.3499999999999999em;\
  width: 1.15em;\
  height: 0.65em;\
}\
.duiSliderHandle {\
  position: absolute;\
  display: inline-block;\
  -webkit-box-sizing: border-box;\
  box-sizing: border-box;\
  border-width: 0.1em;\
  border-style: solid;\
  border-color: transparent;\
  border-radius: 0;\
  padding: 0;\
  margin: 0;\
  background: gray;\
  background-clip: content-box;\
  background-color: #ffffff;\
}\
.duiSliderHHtL .duiSliderHandleMax,\
.duiSliderHLtH .duiSliderHandleMin {\
  left: -0.325em;\
}\
.duiSliderHHtL .duiSliderHandleMin,\
.duiSliderHLtH .duiSliderHandleMax {\
  right: -0.325em;\
}\
.duiSliderVLtH .duiSliderHandleMax,\
.duiSliderVHtL .duiSliderHandleMin {\
  bottom: -0.325em;\
}\
.duiSliderVLtH .duiSliderHandleMin,\
.duiSliderVHtL .duiSliderHandleMax {\
  top: -0.325em;\
}\
.duiSliderBar {\
  border-width: 0.1em;\
  border-style: solid;\
  border-color: transparent;\
  border-radius: 0;\
  padding: 0;\
  margin: 0;\
  background: none;\
  background-clip: content-box;\
}\
.duiSliderRemainingBar {\
  -webkit-box-sizing: border-box;\
  box-sizing: border-box;\
  position: relative;\
  height: 100%;\
  width: 100%;\
  margin: auto;\
  vertical-align: middle;\
  background-clip: content-box;\
  background-color: #1f1f1f;\
}\
.duiSliderRemainingBar > * {\
  position: absolute !important;\
}\
.duiSliderProgressBar {\
  -webkit-box-sizing: content-box;\
  box-sizing: content-box;\
  border-width: 0;\
  background-image: none;\
  background-color: Highlight;\
}\
.duiSliderTransition {\
  -moz-transition-duration: 400ms;\
  -webkit-transition-duration: 400ms;\
  transition-duration: 400ms;\
}\
.dj_a11y .duiSliderHandle:after {\
  content: "\\025A3";\
  display: block;\
  font-family: monospace;\
  font-size: 0.65em;\
}\
.dj_a11y .duiSliderH .duiSliderHandle {\
  line-height: 1.15em;\
}\
.dj_a11y .duiSliderV .duiSliderHandle {\
  line-height: 0.65em;\
}\
.dj_a11y .duiSlider .duiSliderHandle {\
  border-radius: 0;\
}\
.duiSliderV .duiRule {\
  left: 0;\
}\
.duiSliderRtlV .duiRule {\
  right: 0;\
}\
.duiSliderH .duiRule {\
  top: 0;\
}\
.duiSliderRtlV .duiRuleAfter .duiRuleLabel,\
.duiSliderRtlV DIV.duiRuleLabel,\
.duiSliderV .duiRuleBefore .duiRuleLabel {\
  right: 100%;\
  left: auto;\
}\
.duiSliderV .duiRuleLabel,\
.duiSliderRtlV .duiRuleBefore DIV.duiRuleLabel {\
  left: 100%;\
  right: auto;\
}\
.duiSliderH .duiRuleBefore .duiRuleLabel {\
  bottom: 100%;\
  top: auto;\
}\
.duiSliderH .duiRuleLabel,\
.duiSliderH .duiRuleAfter .duiRuleLabel {\
  top: 100%;\
  bottom: auto;\
}\
'; } );
