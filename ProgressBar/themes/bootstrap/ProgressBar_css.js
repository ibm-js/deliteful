define(function(){ return '\
/*\
 * -----------------------------------------------\
 *  Theme     : bootstrap\
 *  Widget    : deliteful/ProgressBar\
 *  baseClass : d-progress-bar\
 * -----------------------------------------------\
 */\
.d-progress-bar-success .d-progress-bar-indicator {\
  background-color: #5cb85c;\
}\
.d-progress-bar-info .d-progress-bar-indicator {\
  background-color: #5bc0de;\
}\
.d-progress-bar-warning .d-progress-bar-indicator {\
  background-color: #f0ad4e;\
}\
.d-progress-bar-danger .d-progress-bar-indicator {\
  background-color: #d9534f;\
}\
.d-progress-bar {\
  display: inline-block;\
  position: relative;\
  margin: 2px;\
  padding: 0;\
  width: 100%;\
  font-size: 0.750em;\
  height: 1.667em;\
  vertical-align: middle;\
  overflow: hidden;\
  text-align: center;\
  border: 1px solid transparent;\
}\
.d-progress-bar-background {\
  top: 0;\
  left: 0;\
  width: 100%;\
  margin: 0;\
  padding: 0;\
  position: absolute;\
  overflow: hidden;\
  height: 100%;\
  background-color: #f5f5f5;\
  -webkit-box-sizing: border-box;\
  -moz-box-sizing: border-box;\
  box-sizing: border-box;\
  box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.1) inset;\
  border-radius: 4px;\
}\
.d-progress-bar-indicator {\
  top: 0;\
  left: 0;\
  width: 100%;\
  margin: 0;\
  padding: 0;\
  position: relative;\
  overflow: hidden;\
  height: 100%;\
  -webkit-box-sizing: border-box;\
  -moz-box-sizing: border-box;\
  box-sizing: border-box;\
  -webkit-transition: width 0.3s linear 0s;\
  transition: width 0.3s linear 0s;\
  border-top-left-radius: 4px;\
  border-bottom-left-radius: 4px;\
  background-color: #428bca;\
  background-image: linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, rgba(0, 0, 0, 0) 25%, rgba(0, 0, 0, 0) 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, rgba(0, 0, 0, 0) 75%, rgba(0, 0, 0, 0));\
  background-image: -webkit-linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, rgba(0, 0, 0, 0) 25%, rgba(0, 0, 0, 0) 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, rgba(0, 0, 0, 0) 75%, rgba(0, 0, 0, 0));\
  background-size: 40px 40px;\
  border: 1px solid transparent;\
}\
.d-progress-bar-empty .d-progress-bar-indicator {\
  border: 0;\
}\
.d-progress-bar-full .d-progress-bar-indicator {\
  border-top-right-radius: 4px;\
  border-bottom-right-radius: 4px;\
}\
.d-progress-bar-msg {\
  width: 100%;\
  margin: 0;\
  padding: 0;\
  overflow: hidden;\
  position: absolute;\
  height: 100%;\
  line-height: 1.667em;\
  left: 0;\
  white-space: nowrap;\
  -webkit-box-sizing: border-box;\
  -moz-box-sizing: border-box;\
  box-sizing: border-box;\
  text-overflow: ellipsis;\
  border-left: 2px solid transparent;\
}\
.d-progress-bar-msg-invert {\
  position: absolute;\
  overflow: hidden;\
  height: 100%;\
  white-space: nowrap;\
  line-height: 1.447em;\
  text-overflow: ellipsis;\
  width: 100%;\
  color: #ffffff;\
}\
.d-progress-bar-msg-ext {\
  overflow: hidden;\
}\
.d-progress-bar-indeterminate .d-progress-bar-background {\
  margin: 0;\
  padding: 0;\
}\
.d-progress-bar-indeterminate .d-progress-bar-indicator {\
  margin: 0;\
  padding: 0;\
  width: 100%;\
  background-image: linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, rgba(0, 0, 0, 0) 25%, rgba(0, 0, 0, 0) 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, rgba(0, 0, 0, 0) 75%, rgba(0, 0, 0, 0));\
  background-image: -webkit-linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, rgba(0, 0, 0, 0) 25%, rgba(0, 0, 0, 0) 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, rgba(0, 0, 0, 0) 75%, rgba(0, 0, 0, 0));\
  background-size: 40px 40px;\
  -webkit-box-sizing: border-box;\
  -moz-box-sizing: border-box;\
  box-sizing: border-box;\
  border-radius: 4px;\
  border: 1px solid transparent;\
  -webkit-transition: width 0s;\
  transition: width 0s;\
  -webkit-animation-name: d-progress-bar-indeterminate-animation;\
  animation-name: d-progress-bar-indeterminate-animation;\
  -webkit-animation-duration: 1s;\
  animation-duration: 1s;\
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
  0% {\
    background-position: 40px 0;\
  }\
  100% {\
    background-position: 0 0;\
  }\
}\
@-webkit-keyframes d-progress-bar-indeterminate-animation {\
  0% {\
    background-position: 40px 0;\
  }\
  100% {\
    background-position: 0 0;\
  }\
}\
'; } );