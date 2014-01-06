define(function(){ return '\
.-delite-dissolve.-delite-out {\
  -webkit-animation-duration: 1s;\
  animation-duration: 1s;\
  -webkit-animation-name: -delite-dissolveOut;\
  animation-name: -delite-dissolveOut;\
  -webkit-animation-timing-function: cubic-bezier(0.25, 1, 0.75, 0);\
  animation-timing-function: cubic-bezier(0.25, 1, 0.75, 0);\
}\
.-delite-dissolve.-delite-in {\
  -webkit-animation-duration: 1s;\
  animation-duration: 1s;\
  -webkit-animation-name: -delite-dissolveIn;\
  animation-name: -delite-dissolveIn;\
  -webkit-animation-timing-function: cubic-bezier(0.25, 1, 0.75, 0);\
  animation-timing-function: cubic-bezier(0.25, 1, 0.75, 0);\
}\
@-webkit-keyframes -delite-dissolve-out {\
  from {\
    opacity: 1;\
  }\
  to {\
    opacity: 0;\
  }\
}\
@keyframes -delite-dissolve-out {\
  from {\
    opacity: 1;\
  }\
  to {\
    opacity: 0;\
  }\
}\
@-webkit-keyframes -delite-dissolve-in {\
  from {\
    opacity: 0;\
  }\
  to {\
    opacity: 1;\
  }\
}\
@keyframes -delite-dissolve-in {\
  from {\
    opacity: 0;\
  }\
  to {\
    opacity: 1;\
  }\
}\
'; } );
