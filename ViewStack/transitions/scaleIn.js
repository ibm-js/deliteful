define(function(){ return '\
.-delite-scaleIn.-delite-out {\
  z-index: -100;\
  -webkit-animation-duration: 0.5s;\
  animation-duration: 0.5s;\
  -webkit-animation-name: -delite-scaleInOut;\
  animation-name: -delite-scaleInOut;\
  -webkit-animation-timing-function: ease-out;\
  animation-timing-function: ease-out;\
}\
.-delite-scaleIn.-delite-in {\
  -webkit-animation-duration: 0.5s;\
  animation-duration: 0.5s;\
  -webkit-animation-name: -delite-scaleInIn;\
  animation-name: -delite-scaleInIn;\
  -webkit-animation-timing-function: ease-out;\
  animation-timing-function: ease-out;\
}\
.dj_android .-delite-scaleIn.-delite-in {\
  -webkit-animation-name: -delite-scaleInInAndroid;\
  animation-name: -delite-scaleInInAndroid;\
}\
@-webkit-keyframes -delite-scaleInOut {\
  from {\
    -webkit-transform: scale(1);\
  }\
  to {\
    -webkit-transform: scale(1);\
  }\
}\
@keyframes -delite-scaleInOut {\
  from {\
    transform: scale(1);\
  }\
  to {\
    transform: scale(1);\
  }\
}\
@-webkit-keyframes -delite-scaleInIn {\
  from {\
    -webkit-transform: scale(0);\
    opacity: 0;\
  }\
  to {\
    -webkit-transform: scale(1);\
    opacity: 1;\
  }\
}\
@keyframes -delite-scaleInIn {\
  from {\
    transform: scale(0);\
    opacity: 0;\
  }\
  to {\
    transform: scale(1);\
    opacity: 1;\
  }\
}\
@-webkit-keyframes -delite-scaleInInAndroid {\
  from {\
    -webkit-transform: scale(0);\
  }\
  to {\
    -webkit-transform: scale(1);\
  }\
}\
@keyframes -delite-scaleInInAndroid {\
  from {\
    transform: scale(0);\
  }\
  to {\
    transform: scale(1);\
  }\
}\
'; } );
