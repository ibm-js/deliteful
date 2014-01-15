define(function(){ return '\
/*\
 * -----------------------------------------------\
 *  Theme     : blackberry\
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
  height: 22px;\
  font-size: 18px;\
  line-height: 22px;\
  border: 1px solid #ffffff;\
  vertical-align: middle;\
}\
.d-progress-bar-background {\
  overflow: hidden;\
  position: absolute;\
  top: 0;\
  width: 100%;\
  margin: 0;\
  padding: 0;\
  height: 100%;\
  background-color: #ffffff;\
}\
.d-progress-bar-indicator {\
  position: absolute;\
  top: 0;\
  left: 0;\
  width: 100%;\
  margin: 0;\
  padding: 0;\
  height: 100%;\
  border: 0px;\
  -webkit-transition: width 0.25s;\
  transition: width 0.25s;\
  background-color: #298eff;\
}\
.d-progress-bar-label {\
  position: absolute;\
  height: 100%;\
  width: 100%;\
  margin: 0;\
  padding: 0;\
  text-align: center;\
  color: #000000;\
}\
.d-progress-bar-indeterminate .d-progress-bar-background {\
  margin: 0;\
  padding: 0;\
  overflow: hidden;\
}\
.d-progress-bar-indeterminate .d-progress-bar-indicator {\
  margin: 0;\
  padding: 0;\
  width: 200%;\
  border: 0;\
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
    left: 0;\
  }\
}\
@-webkit-keyframes d-progress-bar-indeterminate-animation {\
  from {\
    left: -100%;\
  }\
  to {\
    left: 0;\
  }\
}\
/*\
 * -----------------------------------------------\
 *  A11Y\
 * -----------------------------------------------\
 */\
'; } );
