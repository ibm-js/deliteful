define(function(){ return '\
/*\
 * -----------------------------------------------\
 *  Theme     : ios\
 *  Widget    : deliteful/ProgressBar\
 *  baseClass : d-progress-bar\
 * -----------------------------------------------\
 */\
.d-progress-bar {\
  display: inline-block;\
  position: relative;\
  margin: 2px;\
  padding: 0;\
  width: 100%;\
  height: 9px;\
  font-size: 11px;\
  line-height: 9px;\
  vertical-align: middle;\
}\
.d-progress-bar-background {\
  top: 0;\
  left: 0;\
  width: 100%;\
  margin: 0;\
  padding: 0;\
  height: 100%;\
  -moz-border-radius: 6px;\
  border-radius: 6px;\
  overflow: hidden;\
  background-color: white;\
  background-image: -moz-linear-gradient(#a5a6a5 0%, #d6d7d6 50%, #ffffff 50%, #ffffff 90%, #b5b6b5 100%);\
  background-image: -webkit-linear-gradient(#a5a6a5 0%, #d6d7d6 50%, #ffffff 50%, #ffffff 90%, #b5b6b5 100%);\
  background-image: -o-linear-gradient(#a5a6a5 0%, #d6d7d6 50%, #ffffff 50%, #ffffff 90%, #b5b6b5 100%);\
  background-image: linear-gradient(#a5a6a5 0%, #d6d7d6 50%, #ffffff 50%, #ffffff 90%, #b5b6b5 100%);\
}\
.d-progress-bar-indicator {\
  top: 0;\
  left: 0;\
  width: 100%;\
  margin: 0;\
  padding: 0;\
  -webkit-box-sizing: border-box;\
  -moz-box-sizing: border-box;\
  box-sizing: border-box;\
  position: absolute;\
  height: 100%;\
  -webkit-transition: width 0.25s;\
  transition: width 0.25s;\
  -moz-border-radius: 6px;\
  border-radius: 6px;\
  border: 1px solid #5e6fa3;\
  background-color: #3186e7;\
  background-image: -moz-linear-gradient(to bottom, #b0c0ff 0%, #70b2ff 60%, #3470b6 60%, #2f83e1 100%);\
  background-image: -webkit-linear-gradient(to bottom, #b0c0ff 0%, #70b2ff 60%, #3470b6 60%, #2f83e1 100%);\
  background-image: -o-linear-gradient(to bottom, #b0c0ff 0%, #70b2ff 60%, #3470b6 60%, #2f83e1 100%);\
  background-image: linear-gradient(to bottom, #b0c0ff 0%, #70b2ff 60%, #3470b6 60%, #2f83e1 100%);\
}\
.d-progress-bar-empty .d-progress-bar-indicator {\
  border: 0px;\
}\
.d-progress-bar-msg {\
  width: 100%;\
  margin: 0;\
  padding: 0;\
  overflow: hidden;\
  top: 0;\
  text-align: center;\
  color: #000000;\
}\
.d-progress-bar-msg-invert {\
  display: none;\
}\
.d-progress-bar-msg-ext {\
  overflow: hidden;\
}\
.d-progress-bar-indeterminate .d-progress-bar-background {\
  margin: 0;\
  padding: 0;\
  height: 7px;\
  -moz-border-radius: 6px;\
  border-radius: 6px;\
  border: 1px solid #5e6fa3;\
}\
.d-progress-bar-indeterminate .d-progress-bar-indicator {\
  margin: 0;\
  padding: 0;\
  width: 200%;\
  background-image: repeating-linear-gradient(90deg, #ffffff 0px, #abd6ff 2%, #abd6ff 4%, #ffffff 5%);\
  background-image: -webkit-repeating-linear-gradient(0deg, #ffffff 0px, #abd6ff 2%, #abd6ff 4%, #ffffff 5%);\
  -webkit-transition: width 0s;\
  transition: width 0s;\
  -webkit-animation-name: d-progress-bar-indeterminate-animation;\
  animation-name: d-progress-bar-indeterminate-animation;\
  -webkit-animation-duration: 5s;\
  animation-duration: 5s;\
  -webkit-animation-timing-function: linear;\
  animation-timing-function: linear;\
  -webkit-delay: 0s;\
  animation-delay: 0s;\
  -webkit-animation-iteration-count: infinite;\
  animation-iteration-count: infinite;\
  -webkit-animation-direction: normal;\
  animation-direction: normal;\
}\
@keyframes d-progress-bar-indeterminate-animation {\
  from {\
    left: -100%;\
  }\
  to {\
    left: 0%;\
  }\
}\
@-webkit-keyframes d-progress-bar-indeterminate-animation {\
  from {\
    left: -100%;\
  }\
  to {\
    left: 0%;\
  }\
}\
'; } );
