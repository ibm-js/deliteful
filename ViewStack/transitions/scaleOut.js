define(function(){ return '\
.-delite-scaleOut.-delite-out {\
  -webkit-animation-duration: 0.5s;\
  animation-duration: 0.5s;\
  -webkit-animation-name: -delite-scaleOutOut;\
  animation-name: -delite-scaleOutOut;\
  -webkit-animation-timing-function: ease-in;\
  animation-timing-function: ease-in;\
}\
.dj_android .-delite-scaleOut.-delite-out {\
  -webkit-animation-name: -delite-scaleOutOutAndroid;\
  animation-name: -delite-scaleOutOutAndroid;\
}\
.-delite-scaleOut.-delite-in {\
  z-index: -100;\
  -webkit-animation-duration: 0.5s;\
  animation-duration: 0.5s;\
  -webkit-animation-name: -delite-scaleOutIn;\
  animation-name: -delite-scaleOutIn;\
  -webkit-animation-timing-function: ease-in;\
  animation-timing-function: ease-in;\
}\
@-webkit-keyframes -delite-scaleOutOut {\
  from {\
    -webkit-transform: scale(1);\
    opacity: 1;\
  }\
  to {\
    -webkit-transform: scale(0);\
    opacity: 0;\
  }\
}\
@keyframes -delite-scaleOutOut {\
  from {\
    transform: scale(1);\
    opacity: 1;\
  }\
  to {\
    transform: scale(0);\
    opacity: 0;\
  }\
}\
@-webkit-keyframes -delite-scaleOutOutAndroid {\
  from {\
    -webkit-transform: scale(1);\
  }\
  to {\
    -webkit-transform: scale(0);\
  }\
}\
@keyframes -delite-scaleOutOutAndroid {\
  from {\
    transform: scale(1);\
  }\
  to {\
    transform: scale(0);\
  }\
}\
@-webkit-keyframes -delite-scaleOutIn {\
  from {\
    -webkit-transform: scale(1);\
  }\
  to {\
    -webkit-transform: scale(1);\
  }\
}\
@keyframes -delite-scaleOutIn {\
  from {\
    transform: scale(1);\
  }\
  to {\
    transform: scale(1);\
  }\
}\
'; } );
