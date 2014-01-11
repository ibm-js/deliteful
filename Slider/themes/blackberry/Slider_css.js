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
  height: 8px;\
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
  top: -7px;\
  width: 20px;\
  height: 20px;\
}\
.d-slider-v {\
  height: auto;\
}\
.d-slider-v .d-slider-remaining-bar {\
  height: 200px;\
  min-height: 80px;\
  width: 8px;\
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
  left: -7px;\
  width: 20px;\
  height: 20px;\
}\
.d-slider-handle {\
  position: absolute;\
  display: inline-block;\
  -webkit-box-sizing: border-box;\
  box-sizing: border-box;\
  border-width: 1px;\
  border-style: outset;\
  border-color: #9d9d9d;\
  border-radius: 6px;\
  padding: 0;\
  margin: 0;\
  background: gray;\
  background-clip: content-box;\
  background-image: -webkit-gradient(linear, left top, left bottom, from(#fafafa), to(#999999), color-stop(0.5, #bbbbbb));\
  background-image: linear-gradient(to bottom, #fafafa 0%, #bbbbbb 50%, #999999 100%);\
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
  border-style: inset;\
  border-color: #b0b0b0;\
  border-radius: 6px;\
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
  background-image: -webkit-gradient(linear, left top, left bottom, from(#f7f3f7), to(#cec5d6), color-stop(0.5, #ced3ce));\
  background-image: linear-gradient(to bottom, #f7f3f7 0%, #ced3ce 50%, #cec5d6 100%);\
}\
.d-slider-remaining-bar > * {\
  position: absolute !important;\
}\
.d-slider-progress-bar {\
  -webkit-box-sizing: content-box;\
  box-sizing: content-box;\
  border-width: 0;\
  background-image: -webkit-gradient(linear, left top, left bottom, from(#088eef), to(#0851ad), color-stop(0.5, #0869c6));\
  background-image: linear-gradient(to bottom, #088eef 0%, #0869c6 50%, #0851ad 100%);\
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
