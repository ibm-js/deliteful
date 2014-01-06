define(function(){ return '\
.-delite-swirl.-delite-out {\
  -webkit-animation-duration: 0.5s;\
  animation-duration: 0.5s;\
  -webkit-animation-name: -delite-swirlOut;\
  animation-name: -delite-swirlOut;\
  -webkit-animation-timing-function: ease-in;\
  animation-timing-function: ease-in;\
}\
.-delite-swirl.-delite-in {\
  z-index: -100;\
  -webkit-animation-duration: 0.5s;\
  animation-duration: 0.5s;\
  -webkit-animation-name: -delite-swirlIn;\
  animation-name: -delite-swirlIn;\
  -webkit-animation-timing-function: ease-in;\
  animation-timing-function: ease-in;\
}\
.-delite-swirl.-delite-out.-delite-reverse {\
  -webkit-animation-name: -delite-swirlOutReverse;\
  animation-name: -delite-swirlOutReverse;\
}\
@-webkit-keyframes -delite-swirlOut {\
  from {\
    -webkit-transform: rotate(0deg) scale(1);\
  }\
  to {\
    -webkit-transform: rotate(-360deg) scale(0);\
  }\
}\
@keyframes -delite-swirlOut {\
  from {\
    transform: rotate(0deg) scale(1);\
  }\
  to {\
    transform: rotate(-360deg) scale(0);\
  }\
}\
@-webkit-keyframes -delite-swirlOutReverse {\
  from {\
    -webkit-transform: rotate(0deg) scale(1);\
  }\
  to {\
    -webkit-transform: rotate(360deg) scale(0);\
  }\
}\
@keyframes -delite-swirlOutReverse {\
  from {\
    transform: rotate(0deg) scale(1);\
  }\
  to {\
    transform: rotate(360deg) scale(0);\
  }\
}\
@-webkit-keyframes -delite-swirlIn {\
  from {\
    -webkit-transform: scale(1);\
  }\
  to {\
    -webkit-transform: scale(1);\
  }\
}\
@keyframes -delite-swirlIn {\
  from {\
    transform: scale(1);\
  }\
  to {\
    transform: scale(1);\
  }\
}\
'; } );
