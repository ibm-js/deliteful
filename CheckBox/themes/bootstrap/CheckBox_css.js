define(function () {
	/* jshint multistr: true */
	/* jshint -W015 */
	/* jshint -W033 */
	return "\
.d-checkbox {\
  position: relative;\
  margin-left: 4px;\
  margin-right: 4px;\
  margin-top: 3px;\
  margin-bottom: 3px;\
}\
.d-checkbox.d-focused {\
  outline: thin dotted;\
  outline: 5px auto -webkit-focus-ring-color;\
  outline-offset: -2px;\
}\
.d-checkbox::before {\
  overflow: hidden;\
  display: inline-block;\
  position: absolute;\
  top: 0px;\
  content: \"\";\
  border-color: #b0b0b0;\
  border-style: solid;\
  border-width: 1px;\
  border-radius: 2px;\
  background-image: linear-gradient(to bottom, #ededed 0%, #dedede 100%);\
  height: 1em;\
  width: 100%;\
}\
.d-checkbox.d-rtl::before {\
  right: 0px;\
}\
.d-checkbox.d-checked::before {\
  content: \"\\2714\";\
}\
.d-checkbox.d-disabled {\
  color: #545454;\
}\
.d-checkbox.d-disabled::before {\
  border-color: #cfcfcf;\
  background-image: linear-gradient(to bottom, #f6f6f6 0%, #eeeeee 100%);\
  color: #9b9b9b;\
}\
.d-checkbox.d-disabled,\
fieldset[disabled] .d-checkbox {\
  cursor: not-allowed;\
}\
.d-checkbox > input[type=checkbox] {\
  width: 1em;\
  height: 1em;\
  margin: 0px;\
  margin-top: 1px \\9;\
  /* IE8-9 */\
  opacity: 0.01;\
  position: relative;\
  overflow: hidden;\
  font: inherit;\
  cursor: pointer;\
  -webkit-appearance: none;\
  -moz-appearance: none;\
}\
.d-checkbox > input[type=checkbox][disabled],\
fieldset[disabled] .d-checkbox > input[type=checkbox] {\
  cursor: not-allowed;\
}";
});
