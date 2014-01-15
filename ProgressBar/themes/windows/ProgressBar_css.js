define(function(){ return '\
/*\
 * -----------------------------------------------\
 *  Theme     : windows\
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
  height: 16px;\
  font-size: 9pt;\
  line-height: 16px;\
  vertical-align: middle;\
}\
.d-progress-bar-background {\
  overflow: hidden;\
  position: absolute;\
  top: 0;\
  width: 100%;\
  margin: 0;\
  padding: 0;\
  height: 3px;\
}\
.d-progress-bar-background::before {\
  background-color: highlight;\
  content: "";\
  height: 3px;\
  opacity: 0.2;\
  position: absolute;\
  width: 100%;\
}\
.d-progress-bar-indicator {\
  position: absolute;\
  top: 0;\
  left: 0;\
  width: 100%;\
  margin: 0;\
  padding: 0;\
  height: 100%;\
  -webkit-transition: width 0.25s;\
  transition: width 0.25s;\
  background-color: highlight;\
}\
.d-progress-bar-label {\
  position: absolute;\
  height: 100%;\
  width: 100%;\
  margin: 0;\
  padding: 0;\
  top: 3px;\
  /* below the progress bar */\
  text-align: center;\
}\
.d-progress-bar-label-ext {\
  text-align: left;\
}\
.d-progress-bar-label-ext::after {\
  content: attr(label-ext);\
  float: right;\
}\
.d-progress-bar-indeterminate .d-progress-bar-background {\
  margin: 0;\
  padding: 0;\
  width: 100%;\
}\
.d-progress-bar-indeterminate .d-progress-bar-indicator {\
  margin: 0;\
  padding: 0;\
  width: 5% !important;\
  left: -5%;\
  /* avoid displaying when animation is not supported (IE9) */\
  -webkit-transition: width 0s;\
  transition: width 0s;\
  -webkit-animation-name: d-progress-bar-indeterminate-animation;\
  animation-name: d-progress-bar-indeterminate-animation;\
  -webkit-animation-duration: 1.5s;\
  animation-duration: 1.5s;\
  -webkit-animation-timing-function: cubic-bezier(0.1, 0.86, 0.76, 0.1);\
  animation-timing-function: cubic-bezier(0.1, 0.86, 0.76, 0.1);\
  -webkit-animation-iteration-count: infinite;\
  animation-iteration-count: infinite;\
}\
@keyframes d-progress-bar-indeterminate-animation {\
  0% {\
    left: 2%;\
  }\
  100% {\
    left: 93%;\
  }\
}\
@-webkit-keyframes d-progress-bar-indeterminate-animation {\
  0% {\
    left: 2%;\
  }\
  100% {\
    left: 93%;\
  }\
}\
/*\
 * -----------------------------------------------\
 *  A11Y\
 * -----------------------------------------------\
 */\
'; } );
