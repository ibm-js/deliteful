define(function () {
	/* jshint multistr: true */
	/* jshint -W015 */
	/* jshint -W033 */
	return "\
.d-switch-width {\
  width: 70px;\
}\
.d-switch-rounded {\
  border-radius: 0px;\
}\
.d-switch {\
  display: inline-block;\
  font-size: 0.9em;\
  position: relative;\
  overflow: hidden;\
  box-shadow: 0 0px 3px black;\
  white-space: nowrap;\
}\
.d-switch.d-focused {\
  outline: thin dotted;\
  outline: 5px auto -webkit-focus-ring-color;\
  outline-offset: -2px;\
}\
.-d-switch-inner {\
  position: absolute;\
  width: 30px;\
  top: 0;\
  border-width: 0px;\
}\
.-d-switch-on {\
  background-color: #0c86af;\
  background-image: none;\
  color: #ffffff;\
  right: 50%;\
  text-align: center;\
}\
.-d-switch-on-rtl {\
  background-color: #0c86af;\
  background-image: none;\
  color: #ffffff;\
  left: 50%;\
  text-align: center;\
}\
.-d-switch-off {\
  background-color: #333333;\
  background-image: none;\
  color: #ffffff;\
  left: 50%;\
  text-align: center;\
}\
.-d-switch-off-rtl {\
  background-color: #333333;\
  background-image: none;\
  color: #ffffff;\
  right: 50%;\
  text-align: center;\
}\
.-d-switch-knob {\
  width: 30px;\
  left: 50%;\
  margin-left: -15px;\
  z-index: 5;\
  box-shadow: 0 1px 6px black;\
  background-color: #606060;\
  background-image: none;\
}\
.-d-switch-knobglass {\
  display: inline-block;\
  position: absolute;\
  width: 30px;\
  height: 100%;\
  z-index: 10;\
}\
.-d-switch-block {\
  display: inline-block;\
  position: absolute;\
  top: 0;\
  border-width: 0px;\
}\
.-d-switch-inner-wrapper {\
  position: relative;\
  display: inline-block;\
}\
.-d-switch-push {\
  display: inline-block;\
  width: 0;\
  margin-left: 0px;\
}\
.-d-switch-input {\
  position: absolute;\
  opacity: 0;\
  z-index: 1;\
  height: 100%;\
  margin: 0px;\
}\
.-d-switch-input:checked + .-d-switch-push {\
  margin-left: -30px;\
  width: 70px;\
}\
.-d-switch-transition {\
  -webkit-transition: margin-left 100ms ease-in, width 100ms ease-in;\
  transition: margin-left 100ms ease-in, width 100ms ease-in;\
}";
});
