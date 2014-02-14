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
  height: 1.5em;\
  font-size: 12px;\
  vertical-align: middle;\
}\
.d-progress-bar-background {\
  top: 0;\
  left: 0;\
  width: 100%;\
  margin: 0;\
  padding: 0;\
  height: 0.334em;\
  background-color: #333333;\
  position: absolute;\
}\
.d-progress-bar-indicator {\
  top: 0;\
  left: 0;\
  width: 100%;\
  margin: 0;\
  padding: 0;\
  -webkit-transition: width 0.3s linear 0s;\
  transition: width 0.3s linear 0s;\
  height: 100%;\
  background: #33B5E5;\
  position: relative;\
}\
.d-progress-bar-label {\
  width: 100%;\
  margin: 0;\
  padding: 0;\
  overflow: hidden;\
  text-align: center;\
  position: absolute;\
  height: 1.1em;\
  line-height: 1.1em;\
  top: 0.5em;\
}\
.d-progress-bar-label-invert {\
  display: none;\
}\
.d-progress-bar-label-ext {\
  text-align: left;\
  overflow: hidden;\
}\
.d-progress-bar-label-ext::after {\
  content: attr(label-ext);\
  float: right;\
}\
.d-progress-bar-indeterminate .d-progress-bar-background {\
  margin: 0;\
  padding: 0;\
  background: #33B5E5;\
}\
.d-progress-bar-indeterminate .d-progress-bar-indicator {\
  margin: 0;\
  padding: 0;\
  background: #333333;\
  width: 5%;\
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
'; } );
