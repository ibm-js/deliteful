define(function(){ return '\
.-delite-swap {\
  -webkit-animation-duration: 0.6s;\
  animation-duration: 0.6s;\
  -webkit-animation-timing-function: linear;\
  animation-timing-function: linear;\
}\
.-delite-swap.-delite-out {\
  -webkit-animation-name: -delite-swapOut;\
  animation-name: -delite-swapOut;\
}\
.-delite-swap.-delite-in {\
  -webkit-animation-name: -delite-swapIn;\
  animation-name: -delite-swapIn;\
}\
.-delite-swap.-delite-out.-delite-reverse {\
  -webkit-animation-name: -delite-swapOutReverse;\
  animation-name: -delite-swapOutReverse;\
}\
.-delite-swap.-delite-in.-delite-reverse {\
  -webkit-animation-name: -delite-swapInReverse;\
  animation-name: -delite-swapInReverse;\
}\
@-webkit-keyframes -delite-swapOut {\
  0% {\
    z-index: auto;\
    -webkit-transform: translate3d(0%, 0%, 0px) scale(1);\
    opacity: 1;\
  }\
  50% {\
    z-index: -60;\
    -webkit-transform: translate3d(-45%, 5%, 0px) scale(0.6);\
    opacity: 0.4;\
  }\
  100% {\
    z-index: -100;\
    -webkit-transform: translate3d(-20%, 10%, 0px) scale(0.4);\
    opacity: 0;\
  }\
}\
@keyframes -delite-swapOut {\
  0% {\
    z-index: auto;\
    transform: translate3d(0%, 0%, 0px) scale(1);\
    opacity: 1;\
  }\
  50% {\
    z-index: -60;\
    transform: translate3d(-45%, 5%, 0px) scale(0.6);\
    opacity: 0.4;\
  }\
  100% {\
    z-index: -100;\
    transform: translate3d(-20%, 10%, 0px) scale(0.4);\
    opacity: 0;\
  }\
}\
@-webkit-keyframes -delite-swapIn {\
  0% {\
    z-index: -100;\
    -webkit-transform: translate3d(-20%, 0%, 0px) scale(0.5);\
    opacity: 0.4;\
  }\
  50% {\
    z-index: -40;\
    -webkit-transform: translate3d(45%, 0%, 0px) scale(0.7);\
    opacity: 1;\
  }\
  100% {\
    z-index: auto;\
    -webkit-transform: translate3d(0%, 0%, 0px) scale(1);\
    opacity: 1;\
  }\
}\
@keyframes -delite-swapIn {\
  0% {\
    z-index: -100;\
    transform: translate3d(-20%, 0%, 0px) scale(0.5);\
    opacity: 0.4;\
  }\
  50% {\
    z-index: -40;\
    transform: translate3d(45%, 0%, 0px) scale(0.7);\
    opacity: 1;\
  }\
  100% {\
    z-index: auto;\
    transform: translate3d(0%, 0%, 0px) scale(1);\
    opacity: 1;\
  }\
}\
@-webkit-keyframes -delite-swapOutReverse {\
  0% {\
    z-index: auto;\
    -webkit-transform: translate3d(0%, 0%, 0px) scale(1);\
    opacity: 1;\
  }\
  50% {\
    z-index: -60;\
    -webkit-transform: translate3d(45%, 5%, 0px) scale(0.6);\
    opacity: 0.4;\
  }\
  100% {\
    z-index: -100;\
    -webkit-transform: translate3d(20%, 10%, 0px) scale(0.4);\
    opacity: 0;\
  }\
}\
@keyframes -delite-swapOutReverse {\
  0% {\
    z-index: auto;\
    transform: translate3d(0%, 0%, 0px) scale(1);\
    opacity: 1;\
  }\
  50% {\
    z-index: -60;\
    transform: translate3d(45%, 5%, 0px) scale(0.6);\
    opacity: 0.4;\
  }\
  100% {\
    z-index: -100;\
    transform: translate3d(20%, 10%, 0px) scale(0.4);\
    opacity: 0;\
  }\
}\
@-webkit-keyframes -delite-swapInReverse {\
  0% {\
    z-index: -100;\
    -webkit-transform: translate3d(20%, 0%, 0px) scale(0.5);\
    opacity: 0.4;\
  }\
  50% {\
    z-index: -40;\
    -webkit-transform: translate3d(-45%, 0%, 0px) scale(0.7);\
    opacity: 1;\
  }\
  100% {\
    z-index: auto;\
    -webkit-transform: translate3d(0%, 0%, 0px) scale(1);\
    opacity: 1;\
  }\
}\
@keyframes -delite-swapInReverse {\
  0% {\
    z-index: -100;\
    transform: translate3d(20%, 0%, 0px) scale(0.5);\
    opacity: 0.4;\
  }\
  50% {\
    z-index: -40;\
    transform: translate3d(-45%, 0%, 0px) scale(0.7);\
    opacity: 1;\
  }\
  100% {\
    z-index: auto;\
    transform: translate3d(0%, 0%, 0px) scale(1);\
    opacity: 1;\
  }\
}\
'; } );
