define(function(){ return '\
.-d-view-stack-scaleOut.-d-view-stack-out {\
  -webkit-animation-duration: 0.5s;\
  animation-duration: 0.5s;\
  -webkit-animation-name: -d-view-stack-scaleOutOut;\
  animation-name: -d-view-stack-scaleOutOut;\
  -webkit-animation-timing-function: ease-in;\
  animation-timing-function: ease-in;\
}\
.dj_android .-d-view-stack-scaleOut.-d-view-stack-out {\
  -webkit-animation-name: -d-view-stack-scaleOutOutAndroid;\
  animation-name: -d-view-stack-scaleOutOutAndroid;\
}\
.-d-view-stack-scaleOut.-d-view-stack-in {\
  z-index: -100;\
  -webkit-animation-duration: 0.5s;\
  animation-duration: 0.5s;\
  -webkit-animation-name: -d-view-stack-scaleOutIn;\
  animation-name: -d-view-stack-scaleOutIn;\
  -webkit-animation-timing-function: ease-in;\
  animation-timing-function: ease-in;\
}\
@-webkit-keyframes -d-view-stack-scaleOutOut {\
  from {\
    -webkit-transform: scale(1);\
    opacity: 1;\
  }\
  to {\
    -webkit-transform: scale(0);\
    opacity: 0;\
  }\
}\
@keyframes -d-view-stack-scaleOutOut {\
  from {\
    transform: scale(1);\
    opacity: 1;\
  }\
  to {\
    transform: scale(0);\
    opacity: 0;\
  }\
}\
@-webkit-keyframes -d-view-stack-scaleOutOutAndroid {\
  from {\
    -webkit-transform: scale(1);\
  }\
  to {\
    -webkit-transform: scale(0);\
  }\
}\
@keyframes -d-view-stack-scaleOutOutAndroid {\
  from {\
    transform: scale(1);\
  }\
  to {\
    transform: scale(0);\
  }\
}\
@-webkit-keyframes -d-view-stack-scaleOutIn {\
  from {\
    -webkit-transform: scale(1);\
  }\
  to {\
    -webkit-transform: scale(1);\
  }\
}\
@keyframes -d-view-stack-scaleOutIn {\
  from {\
    transform: scale(1);\
  }\
  to {\
    transform: scale(1);\
  }\
}\
'; } );
