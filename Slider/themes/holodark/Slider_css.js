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
  width: auto;\
}\
.d-slider-h .d-slider-remaining-bar {\
  width: 200px;\
  min-width: 80px;\
  height: 5px;\
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
  top: -8.5px;\
  width: 20px;\
  height: 20px;\
}\
.d-slider-v {\
  height: auto;\
}\
.d-slider-v .d-slider-remaining-bar {\
  height: 200px;\
  min-height: 80px;\
  width: 5px;\
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
  left: -8.5px;\
  width: 20px;\
  height: 20px;\
}\
.d-slider-handle {\
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
.d-slider-h-htl .d-slider-handle-max,\
.d-slider-h-lth .d-slider-handle-min {\
  left: -10px;\
}\
.d-slider-h-htl .d-slider-handle-min,\
.d-slider-h-lth .d-slider-handle-max {\
  right: -10px;\
}\
.d-slider-v-lth .d-slider-handle-max,\
.d-slider-v-htl .d-slider-handle-min {\
  bottom: -10px;\
}\
.d-slider-v-lth .d-slider-handle-min,\
.d-slider-v-htl .d-slider-handle-max {\
  top: -10px;\
}\
.d-slider-bar {\
  border-width: 1px;\
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
  background-color: #292929;\
}\
.d-slider-remaining-bar > * {\
  position: absolute !important;\
}\
.d-slider-progress-bar {\
  -webkit-box-sizing: content-box;\
  box-sizing: content-box;\
  border-width: 0;\
  background-color: #33b5e5;\
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
  font-size: 20px;\
}\
.dj_a11y .d-slider-h .d-slider-handle {\
  line-height: 20px;\
}\
.dj_a11y .d-slider-v .d-slider-handle {\
  line-height: 20px;\
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
