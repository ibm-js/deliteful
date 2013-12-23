define(function(){ return '\
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
  width: auto;\
}\
.duiSliderH .duiSliderRemainingBar {\
  width: 200px;\
  min-width: 80px;\
  height: 8px;\
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
  top: -7px;\
  width: 20px;\
  height: 20px;\
}\
.duiSliderV {\
  height: auto;\
}\
.duiSliderV .duiSliderRemainingBar {\
  height: 200px;\
  min-height: 80px;\
  width: 8px;\
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
  left: -7px;\
  width: 20px;\
  height: 20px;\
}\
.duiSliderHandle {\
  position: absolute;\
  display: inline-block;\
  -webkit-box-sizing: border-box;\
  box-sizing: border-box;\
  border-width: 1px;\
  border-style: outset;\
  border-color: #9b9b9b #9b9b9b #767676;\
  border-radius: 0;\
  padding: 0;\
  margin: 0;\
  background: gray;\
  background-clip: content-box;\
  background-image: -webkit-gradient(linear, left top, left bottom, from(#e2e2e2), to(#a4a4a4));\
  background-image: linear-gradient(to bottom, #e2e2e2 0%, #a4a4a4 100%);\
}\
.duiSliderHHtL .duiSliderHandleMax,\
.duiSliderHLtH .duiSliderHandleMin {\
  left: -10px;\
}\
.duiSliderHHtL .duiSliderHandleMin,\
.duiSliderHLtH .duiSliderHandleMax {\
  right: -10px;\
}\
.duiSliderVLtH .duiSliderHandleMax,\
.duiSliderVHtL .duiSliderHandleMin {\
  bottom: -10px;\
}\
.duiSliderVLtH .duiSliderHandleMin,\
.duiSliderVHtL .duiSliderHandleMax {\
  top: -10px;\
}\
.duiSliderBar {\
  border-width: 1px;\
  border-style: inset;\
  border-color: #c0c0c0 #c0c0c0 #9b9b9b;\
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
  background-image: -webkit-gradient(linear, left top, left bottom, from(#ffffff), to(#e2e2e2));\
  background-image: linear-gradient(to bottom, #ffffff 0%, #e2e2e2 100%);\
}\
.duiSliderRemainingBar > * {\
  position: absolute !important;\
}\
.duiSliderProgressBar {\
  -webkit-box-sizing: content-box;\
  box-sizing: content-box;\
  border-width: 0;\
  background-image: -webkit-gradient(linear, left top, left bottom, from(#bbbbbb), to(#999999));\
  background-image: linear-gradient(to bottom, #bbbbbb 0%, #999999 100%);\
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
  font-size: 20px;\
}\
.dj_a11y .duiSliderH .duiSliderHandle {\
  line-height: 20px;\
}\
.dj_a11y .duiSliderV .duiSliderHandle {\
  line-height: 20px;\
}\
.dj_a11y .duiSlider .duiSliderHandle {\
  border-radius: 0;\
}\
.duiSliderV .duiRule {\
  left: 0;\
}\
.duiSliderV.d-rtl .duiRule {\
  right: 0;\
}\
.duiSliderH .duiRule {\
  top: 0;\
}\
.duiSliderV.d-rtl .duiRuleAfter .duiRuleLabel,\
.duiSliderV.d-rtl DIV.duiRuleLabel,\
.duiSliderV .duiRuleBefore .duiRuleLabel {\
  right: 100%;\
  left: auto;\
}\
.duiSliderV .duiRuleLabel,\
.duiSliderV.d-rtl .duiRuleBefore DIV.duiRuleLabel {\
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
