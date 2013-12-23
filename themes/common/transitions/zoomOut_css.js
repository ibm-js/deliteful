define(function(){ return '\
.duiZoomOut.duiOut {\
  -webkit-animation-duration: 0.5s;\
  animation-duration: 0.5s;\
  -webkit-animation-name: duiZoomOutOut;\
  animation-name: duiZoomOutOut;\
  -webkit-animation-timing-function: ease-in;\
  animation-timing-function: ease-in;\
}\
.dj_android .duiZoomOut.duiOut {\
  -webkit-animation-name: duiZoomOutOutAndroid;\
  animation-name: duiZoomOutOutAndroid;\
}\
.duiZoomOut.duiIn {\
  z-index: -100;\
  -webkit-animation-duration: 0.5s;\
  animation-duration: 0.5s;\
  -webkit-animation-name: duiZoomOutIn;\
  animation-name: duiZoomOutIn;\
  -webkit-animation-timing-function: ease-in;\
  animation-timing-function: ease-in;\
}\
@-webkit-keyframes duiZoomOutOut {\
  from {\
    -webkit-transform: scale(1);\
    opacity: 1;\
  }\
  to {\
    -webkit-transform: scale(0);\
    opacity: 0;\
  }\
}\
@keyframes duiZoomOutOut {\
  from {\
    transform: scale(1);\
    opacity: 1;\
  }\
  to {\
    transform: scale(0);\
    opacity: 0;\
  }\
}\
@-webkit-keyframes duiZoomOutOutAndroid {\
  from {\
    -webkit-transform: scale(1);\
  }\
  to {\
    -webkit-transform: scale(0);\
  }\
}\
@keyframes duiZoomOutOutAndroid {\
  from {\
    transform: scale(1);\
  }\
  to {\
    transform: scale(0);\
  }\
}\
@-webkit-keyframes duiZoomOutIn {\
  from {\
    -webkit-transform: scale(1);\
  }\
  to {\
    -webkit-transform: scale(1);\
  }\
}\
@keyframes duiZoomOutIn {\
  from {\
    transform: scale(1);\
  }\
  to {\
    transform: scale(1);\
  }\
}\
'; } );
