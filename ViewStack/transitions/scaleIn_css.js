define(function(){ return '\
.-d-view-stack-scaleIn.-d-view-stack-out {\
  z-index: -100;\
  -webkit-animation-duration: 0.5s;\
  animation-duration: 0.5s;\
  -webkit-animation-name: -d-view-stack-scaleInOut;\
  animation-name: -d-view-stack-scaleInOut;\
  -webkit-animation-timing-function: ease-out;\
  animation-timing-function: ease-out;\
}\
.-d-view-stack-scaleIn.-d-view-stack-in {\
  -webkit-animation-duration: 0.5s;\
  animation-duration: 0.5s;\
  -webkit-animation-name: -d-view-stack-scaleInIn;\
  animation-name: -d-view-stack-scaleInIn;\
  -webkit-animation-timing-function: ease-out;\
  animation-timing-function: ease-out;\
}\
.dj_android .-d-view-stack-scaleIn.-d-view-stack-in {\
  -webkit-animation-name: -d-view-stack-scaleInInAndroid;\
  animation-name: -d-view-stack-scaleInInAndroid;\
}\
@-webkit-keyframes -d-view-stack-scaleInOut {\
  from {\
    -webkit-transform: scale(1);\
  }\
  to {\
    -webkit-transform: scale(1);\
  }\
}\
@keyframes -d-view-stack-scaleInOut {\
  from {\
    transform: scale(1);\
  }\
  to {\
    transform: scale(1);\
  }\
}\
@-webkit-keyframes -d-view-stack-scaleInIn {\
  from {\
    -webkit-transform: scale(0);\
    opacity: 0;\
  }\
  to {\
    -webkit-transform: scale(1);\
    opacity: 1;\
  }\
}\
@keyframes -d-view-stack-scaleInIn {\
  from {\
    transform: scale(0);\
    opacity: 0;\
  }\
  to {\
    transform: scale(1);\
    opacity: 1;\
  }\
}\
@-webkit-keyframes -d-view-stack-scaleInInAndroid {\
  from {\
    -webkit-transform: scale(0);\
  }\
  to {\
    -webkit-transform: scale(1);\
  }\
}\
@keyframes -d-view-stack-scaleInInAndroid {\
  from {\
    transform: scale(0);\
  }\
  to {\
    transform: scale(1);\
  }\
}\
'; } );
