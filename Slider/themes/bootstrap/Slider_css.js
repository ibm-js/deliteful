define(function () {
	/* jshint multistr: true */
	/* jshint -W015 */
	/* jshint -W033 */
	return "\
.d-slider {\
  display: inline-block;\
  vertical-align: middle;\
  border-collapse: separate;\
  cursor: pointer;\
  padding: 12pt;\
  user-select: none;\
  -webkit-user-select: none;\
  -ms-user-select: none;\
  -moz-user-select: none;\
  -webkit-box-sizing: border-box;\
  -moz-box-sizing: border-box;\
  box-sizing: border-box;\
  -webkit-tap-highlight-color: rgba(255, 255, 255, 0);\
}\
.d-slider input {\
  display: none;\
}\
.d-slider .d-slider-bar {\
  border-width: 1px;\
  border-style: inset;\
  border-color: #cccccc;\
  border-radius: 4px;\
  padding: 0;\
  margin: 0;\
  background: none;\
  background-clip: content-box;\
  background-color: #f5f5f5;\
}\
.d-slider .d-slider-remaining-bar {\
  -webkit-box-sizing: border-box;\
  -moz-box-sizing: border-box;\
  box-sizing: border-box;\
  position: relative;\
  height: 100%;\
  width: 100%;\
  margin: auto;\
  vertical-align: middle;\
  background-image: none;\
  box-shadow: 0 0.1em 0.2em 0.1em rgba(0, 0, 0, 0.1) inset;\
}\
.d-slider .d-slider-progress-bar {\
  -webkit-box-sizing: content-box;\
  -moz-box-sizing: content-box;\
  box-sizing: content-box;\
  border-width: 0;\
  background-color: #999999;\
}\
.d-slider.d-disabled {\
  cursor: default;\
  -webkit-box-shadow: none;\
  -moz-box-shadow: none;\
  box-shadow: none;\
}\
.d-slider.d-disabled .d-slider-remaining-bar {\
  -webkit-box-shadow: none;\
  -moz-box-shadow: none;\
  box-shadow: none;\
  border-color: #ffffff;\
}\
.d-slider.d-disabled .d-slider-progress-bar {\
  background: none;\
}\
.d-slider.d-disabled .d-slider-handle,\
.d-slider.d-disabled .d-slider-handle:hover,\
.d-slider.d-disabled .d-slider-handle:focus,\
.d-slider.d-disabled .d-slider-handle:active,\
.d-slider.d-disabled .d-slider-handle.active {\
  border-color: #cccccc;\
  -webkit-box-shadow: none;\
  -moz-box-shadow: none;\
  box-shadow: none;\
  background-color: #f5f5f5;\
}\
.d-slider-remaining-bar > * {\
  position: absolute;\
}\
.d-slider-handle {\
  user-select: none;\
  -webkit-user-select: none;\
  -ms-user-select: none;\
  -moz-user-select: none;\
  position: absolute;\
  display: inline-block;\
  -webkit-box-sizing: border-box;\
  -moz-box-sizing: border-box;\
  box-sizing: border-box;\
  border-width: 1px;\
  border-style: outset;\
  border-color: #999999;\
  border-radius: 6px;\
  padding: 0;\
  margin: 0;\
  background-clip: content-box;\
  background-color: #f5f5f5;\
}\
.d-slider-handle:focus,\
.d-slider-handle:active:focus,\
.d-slider-handle.active:focus {\
  outline: 5px auto -webkit-focus-ring-color;\
  outline-offset: -2px;\
  outline: thin dotted;\
  outline-offset: -3px;\
}\
.d-slider-handle:hover,\
.d-slider-handle:focus {\
  color: #333333;\
  text-decoration: none;\
}\
.d-slider-handle:active,\
.d-slider-handle.active {\
  outline: 0;\
  background-image: none;\
  -webkit-box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);\
  -moz-box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);\
  box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);\
}\
.d-slider-h {\
  width: 200px;\
}\
.d-slider-h .d-slider-remaining-bar {\
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
.d-slider-h .d-slider-handle {\
  top: -7px;\
  width: 20px;\
  height: 20px;\
}\
.d-slider-v {\
  height: 200px;\
}\
.d-slider-v .d-slider-remaining-bar {\
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
}";
});
