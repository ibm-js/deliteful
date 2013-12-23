define(function(){ return '\
.duiScaleIn.duiOut {\
  z-index: -100;\
  -webkit-animation-duration: 0.5s;\
  animation-duration: 0.5s;\
  -webkit-animation-name: duiScaleInOut;\
  animation-name: duiScaleInOut;\
  -webkit-animation-timing-function: ease-out;\
  animation-timing-function: ease-out;\
}\
.duiScaleIn.duiIn {\
  -webkit-animation-duration: 0.5s;\
  animation-duration: 0.5s;\
  -webkit-animation-name: duiScaleInIn;\
  animation-name: duiScaleInIn;\
  -webkit-animation-timing-function: ease-out;\
  animation-timing-function: ease-out;\
}\
.dj_android .duiScaleIn.duiIn {\
  -webkit-animation-name: duiScaleInInAndroid;\
  animation-name: duiScaleInInAndroid;\
}\
@-webkit-keyframes duiScaleInOut {\
  from {\
    -webkit-transform: scale(1);\
  }\
  to {\
    -webkit-transform: scale(1);\
  }\
}\
@keyframes duiScaleInOut {\
  from {\
    transform: scale(1);\
  }\
  to {\
    transform: scale(1);\
  }\
}\
@-webkit-keyframes duiScaleInIn {\
  from {\
    -webkit-transform: scale(0);\
    opacity: 0;\
  }\
  to {\
    -webkit-transform: scale(1);\
    opacity: 1;\
  }\
}\
@keyframes duiScaleInIn {\
  from {\
    transform: scale(0);\
    opacity: 0;\
  }\
  to {\
    transform: scale(1);\
    opacity: 1;\
  }\
}\
@-webkit-keyframes duiScaleInInAndroid {\
  from {\
    -webkit-transform: scale(0);\
  }\
  to {\
    -webkit-transform: scale(1);\
  }\
}\
@keyframes duiScaleInInAndroid {\
  from {\
    transform: scale(0);\
  }\
  to {\
    transform: scale(1);\
  }\
}\
'; } );
