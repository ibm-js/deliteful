define(function () {
	/* jshint multistr: true */
	/* jshint -W015 */
	/* jshint -W033 */
	return "\
.-d-view-stack-swirl.-d-view-stack-out {\
  -webkit-animation-duration: 0.5s;\
  animation-duration: 0.5s;\
  -webkit-animation-name: -d-view-stack-swirlOut;\
  animation-name: -d-view-stack-swirlOut;\
  -webkit-animation-timing-function: ease-in;\
  animation-timing-function: ease-in;\
}\
.-d-view-stack-swirl.-d-view-stack-in {\
  z-index: -100;\
  -webkit-animation-duration: 0.5s;\
  animation-duration: 0.5s;\
  -webkit-animation-name: -d-view-stack-swirlIn;\
  animation-name: -d-view-stack-swirlIn;\
  -webkit-animation-timing-function: ease-in;\
  animation-timing-function: ease-in;\
}\
.-d-view-stack-swirl.-d-view-stack-out.-d-view-stack-reverse {\
  -webkit-animation-name: -d-view-stack-swirlOutReverse;\
  animation-name: -d-view-stack-swirlOutReverse;\
}\
@-webkit-keyframes -d-view-stack-swirlOut {\
  from {\
    -webkit-transform: rotate(0deg) scale(1);\
  }\
  to {\
    -webkit-transform: rotate(-360deg) scale(0);\
  }\
}\
@keyframes -d-view-stack-swirlOut {\
  from {\
    transform: rotate(0deg) scale(1);\
  }\
  to {\
    transform: rotate(-360deg) scale(0);\
  }\
}\
@-webkit-keyframes -d-view-stack-swirlOutReverse {\
  from {\
    -webkit-transform: rotate(0deg) scale(1);\
  }\
  to {\
    -webkit-transform: rotate(360deg) scale(0);\
  }\
}\
@keyframes -d-view-stack-swirlOutReverse {\
  from {\
    transform: rotate(0deg) scale(1);\
  }\
  to {\
    transform: rotate(360deg) scale(0);\
  }\
}\
@-webkit-keyframes -d-view-stack-swirlIn {\
  from {\
    -webkit-transform: scale(1);\
  }\
  to {\
    -webkit-transform: scale(1);\
  }\
}\
@keyframes -d-view-stack-swirlIn {\
  from {\
    transform: scale(1);\
  }\
  to {\
    transform: scale(1);\
  }\
}";
});
