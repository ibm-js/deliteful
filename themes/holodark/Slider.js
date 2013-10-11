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
  height: 5px;\
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
  top: -8.5px;\
  width: 20px;\
  height: 20px;\
}\
.duiSliderV {\
  height: auto;\
}\
.duiSliderV .duiSliderRemainingBar {\
  height: 200px;\
  min-height: 80px;\
  width: 5px;\
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
  left: -8.5px;\
  width: 20px;\
  height: 20px;\
}\
.duiSliderHandle {\
  position: absolute;\
  display: inline-block;\
  -webkit-box-sizing: border-box;\
  box-sizing: border-box;\
  border-width: 1px;\
  border-style: solid;\
  border-color: transparent;\
  border-radius: 10em;\
  padding: 0;\
  margin: 0;\
  background: gray;\
  background-clip: content-box;\
  background-image: -webkit-gradient(radial, 9 9, 3, 9 9, 9, from(#33b5e5), color-stop(0, #33b5e5), color-stop(0.01, rgba(31, 83, 102, 0.8)), to(rgba(31, 83, 102, 0.8)));\
  background-image: radial-gradient(circle closest-side at center, #ffffff 0%, #a435c5 50%, #251ae7 75%, #00a3ef 100%);\
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
  background-color: #292929;\
}\
.duiSliderRemainingBar > * {\
  position: absolute !important;\
}\
.duiSliderProgressBar {\
  -webkit-box-sizing: content-box;\
  box-sizing: content-box;\
  border-width: 0;\
  background-color: #33b5e5;\
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
