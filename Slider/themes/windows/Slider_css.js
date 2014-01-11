define(function(){ return '\
.d-slider {\
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
.d-slider input {\
  display: none;\
}\
.d-slider .dijitRuleContainer {\
  width: 100%;\
  margin: 0;\
  display: inline-block;\
  vertical-align: top;\
}\
.d-slider-h {\
  width: 100%;\
}\
.d-slider-h .d-slider-remaining-bar {\
  width: 100%;\
  min-width: 4.6em;\
  height: 0.65em;\
}\
.d-slider-h .d-slider-remaining-bar > * {\
  left: 0;\
}\
.d-slider-h .d-slider-progress-bar {\
  height: 100%;\
  top: 0;\
  float: none;\
}\
.d-slider-h .dijitRuleContainer > * {\
  margin-left: -0.25px;\
}\
.d-slider-h .d-slider-handle {\
  top: -0.3499999999999999em;\
  width: 0.65em;\
  height: 1.15em;\
}\
.d-slider-v {\
  height: 100%;\
}\
.d-slider-v .d-slider-remaining-bar {\
  height: 100%;\
  min-height: 4.6em;\
  width: 0.65em;\
}\
.d-slider-v .d-slider-remaining-bar > * {\
  top: 0;\
}\
.d-slider-v .d-slider-progress-bar {\
  width: 100%;\
  left: 0;\
  display: block;\
}\
.d-slider-v .d-slider-handle {\
  left: -0.3499999999999999em;\
  width: 1.15em;\
  height: 0.65em;\
}\
.d-slider-handle {\
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
.d-slider-h-htl .d-slider-handle-max,\
.d-slider-h-lth .d-slider-handle-min {\
  left: -0.325em;\
}\
.d-slider-h-htl .d-slider-handle-min,\
.d-slider-h-lth .d-slider-handle-max {\
  right: -0.325em;\
}\
.d-slider-v-lth .d-slider-handle-max,\
.d-slider-v-htl .d-slider-handle-min {\
  bottom: -0.325em;\
}\
.d-slider-v-lth .d-slider-handle-min,\
.d-slider-v-htl .d-slider-handle-max {\
  top: -0.325em;\
}\
.d-slider-bar {\
  border-width: 0.1em;\
  border-style: solid;\
  border-color: transparent;\
  border-radius: 0;\
  padding: 0;\
  margin: 0;\
  background: none;\
  background-clip: content-box;\
}\
.d-slider-remaining-bar {\
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
.d-slider-remaining-bar > * {\
  position: absolute !important;\
}\
.d-slider-progress-bar {\
  -webkit-box-sizing: content-box;\
  box-sizing: content-box;\
  border-width: 0;\
  background-image: none;\
  background-color: Highlight;\
}\
.d-slider-transition {\
  -moz-transition-duration: 400ms;\
  -webkit-transition-duration: 400ms;\
  transition-duration: 400ms;\
}\
.dj_a11y .d-slider-handle:after {\
  content: "\\025A3";\
  display: block;\
  font-family: monospace;\
  font-size: 0.65em;\
}\
.dj_a11y .d-slider-h .d-slider-handle {\
  line-height: 1.15em;\
}\
.dj_a11y .d-slider-v .d-slider-handle {\
  line-height: 0.65em;\
}\
.dj_a11y .d-slider .d-slider-handle {\
  border-radius: 0;\
}\
.d-slider-v .d-rule {\
  left: 0;\
}\
.d-slider-v.d-rtl .d-rule {\
  right: 0;\
}\
.d-slider-h .d-rule {\
  top: 0;\
}\
.d-slider-v.d-rtl .d-rule-after .d-rule-label,\
.d-slider-v.d-rtl DIV.d-rule-label,\
.d-slider-v .d-rule-before .d-rule-label {\
  right: 100%;\
  left: auto;\
}\
.d-slider-v .d-rule-label,\
.d-slider-v.d-rtl .d-rule-before DIV.d-rule-label {\
  left: 100%;\
  right: auto;\
}\
.d-slider-h .d-rule-before .d-rule-label {\
  bottom: 100%;\
  top: auto;\
}\
.d-slider-h .d-rule-label,\
.d-slider-h .d-rule-after .d-rule-label {\
  top: 100%;\
  bottom: auto;\
}\
'; } );
