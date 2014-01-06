define(function(){ return '\
.-delite-zoomIn.-delite-out {\
  z-index: -100;\
  -webkit-animation-duration: 0.5s;\
  animation-duration: 0.5s;\
  -webkit-animation-name: -delite-zoomInOut;\
  animation-name: -delite-zoomInOut;\
  -webkit-animation-timing-function: ease-out;\
  animation-timing-function: ease-out;\
}\
.-delite-zoomIn.-delite-in {\
  -webkit-animation-duration: 0.5s;\
  animation-duration: 0.5s;\
  -webkit-animation-name: -delite-zoomInIn;\
  animation-name: -delite-zoomInIn;\
  -webkit-animation-timing-function: ease-out;\
  animation-timing-function: ease-out;\
}\
.dj_android .-delite-zoomIn.-delite-in {\
  -webkit-animation-name: -delite-zoomInInAndroid;\
  animation-name: -delite-zoomInInAndroid;\
}\
@-webkit-keyframes -delite-zoomInOut {\
  from {\
    -webkit-transform: scale(1);\
  }\
  to {\
    -webkit-transform: scale(1);\
  }\
}\
@keyframes -delite-zoomInOut {\
  from {\
    transform: scale(1);\
  }\
  to {\
    transform: scale(1);\
  }\
}\
@-webkit-keyframes -delite-zoomInIn {\
  from {\
    -webkit-transform: scale(0);\
    opacity: 0;\
  }\
  to {\
    -webkit-transform: scale(1);\
    opacity: 1;\
  }\
}\
@keyframes -delite-zoomInIn {\
  from {\
    transform: scale(0);\
    opacity: 0;\
  }\
  to {\
    transform: scale(1);\
    opacity: 1;\
  }\
}\
@-webkit-keyframes -delite-zoomInInAndroid {\
  from {\
    -webkit-transform: scale(0);\
  }\
  to {\
    -webkit-transform: scale(1);\
  }\
}\
@keyframes -delite-zoomInInAndroid {\
  from {\
    transform: scale(0);\
  }\
  to {\
    transform: scale(1);\
  }\
}\
'; } );
