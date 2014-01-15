define(function(){ return '\
/*\
 * -----------------------------------------------\
 *  Theme     : holodark\
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
  font-size: 12px;\
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
  height: 2px;\
  background-color: #333333;\
}\
.d-progress-bar-indicator {\
  position: absolute;\
  top: 0;\
  left: 0;\
  width: 100%;\
  margin: 0;\
  padding: 0;\
  -webkit-transition: width 0.25s;\
  transition: width 0.25s;\
  height: 2px;\
  background: #33B5E5;\
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
  height: 2px;\
  background: #33B5E5;\
}\
.d-progress-bar-indeterminate .d-progress-bar-indicator {\
  margin: 0;\
  padding: 0;\
  background: #333333;\
  width: 5%;\
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
