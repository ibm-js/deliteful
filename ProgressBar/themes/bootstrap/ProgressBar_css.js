define(function(){ return '\
/*\
 * -----------------------------------------------\
 *  Theme     : bootstrap\
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
  height: 15px;\
  font-size: 11px;\
  line-height: 17px;\
  border: 1px solid #759dc0;\
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
  background-color: white;\
}\
.d-progress-bar-indicator {\
  position: absolute;\
  top: 0;\
  left: 0;\
  width: 100%;\
  margin: 0;\
  padding: 0;\
  -webkit-box-sizing: border-box;\
  -moz-box-sizing: border-box;\
  box-sizing: border-box;\
  height: 100%;\
  -webkit-transition: width 0.25s;\
  transition: width 0.25s;\
  border: 0px;\
  border-right: 1px solid #759dc0;\
  background-color: #abd6ff;\
  background-image: -moz-linear-gradient(rgba(255, 255, 255, 0.93) 0px, rgba(255, 255, 255, 0.41) 1px, rgba(255, 255, 255, 0.7) 2px, rgba(255, 255, 255, 0) 100%);\
  background-image: -webkit-linear-gradient(rgba(255, 255, 255, 0.93) 0px, rgba(255, 255, 255, 0.41) 1px, rgba(255, 255, 255, 0.7) 2px, rgba(255, 255, 255, 0) 100%);\
  background-image: -o-linear-gradient(rgba(255, 255, 255, 0.93) 0px, rgba(255, 255, 255, 0.41) 1px, rgba(255, 255, 255, 0.7) 2px, rgba(255, 255, 255, 0) 100%);\
  background-image: linear-gradient(rgba(255, 255, 255, 0.93) 0px, rgba(255, 255, 255, 0.41) 1px, rgba(255, 255, 255, 0.7) 2px, rgba(255, 255, 255, 0) 100%);\
  -ms-filter: "progid:DXImageTransform.Microsoft.gradient(startColorstr=#EEEEEE, endColorstr=#ABD6FF)";\
  /* ie9 */\
}\
.d-progress-bar-empty .d-progress-bar-indicator {\
  border-right-width: 0px;\
}\
.d-progress-bar-full .d-progress-bar-indicator {\
  border-right-width: 0px;\
}\
.d-progress-bar-label {\
  position: absolute;\
  height: 100%;\
  width: 100%;\
  margin: 0;\
  padding: 0;\
  top: 0;\
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
  -ms-filter: "";\
  /* ie9 */\
  background: #efefef url("../../images/indeterminate-anim.gif") repeat-x top;\
  /* ie9 fallback */\
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
.dj_a11y .d-progress-bar-indicator {\
  border: 2px solid;\
  border-left-width: 0px;\
  -ms-filter: "";\
  /* ie9 */\
}\
.dj_a11y .d-progress-bar-empty .d-progress-bar-indicator {\
  border: 0 none;\
}\
.dj_a11y .d-progress-bar-full .d-progress-bar-indicator {\
  border-left-width: 2px;\
}\
.dj_a11y .d-progress-bar-label {\
  font-weight: bolder;\
}\
.dj_a11y .d-progress-bar-indeterminate .d-progress-bar-indicator {\
  -webkit-animation-name: none;\
  animation-name: none;\
  width: 100%;\
  border: 2px dashed;\
}\
'; } );
