define(function(){ return '\
.-delite-cube {\
  -webkit-animation-duration: 0.8s;\
  animation-duration: 0.8s;\
  -webkit-animation-timing-function: linear;\
  animation-timing-function: linear;\
}\
.-delite-cube.-delite-out {\
  -webkit-animation-name: -delite-cube-out;\
  animation-name: -delite-cube-out;\
  -webkit-transform-origin: 0% 50% !important;\
  transform-origin: 0% 50% !important;\
}\
.-delite-cube.-delite-in {\
  -webkit-animation-name: -delite-cube-in;\
  animation-name: -delite-cube-in;\
  -webkit-transform-origin: 100% 50% !important;\
  transform-origin: 100% 50% !important;\
}\
@-webkit-keyframes -delite-cube-out {\
  0% {\
    -webkit-transform: scale(1, 1) skew(0deg, 0deg);\
  }\
  50% {\
    -webkit-transform: scale(0.5, 1) skew(0deg, 3deg);\
  }\
  100% {\
    -webkit-transform: scale(0, 1) skew(0deg, 0deg);\
  }\
}\
@keyframes -delite-cube-out {\
  0% {\
    transform: scale(1, 1) skew(0deg, 0deg);\
  }\
  50% {\
    transform: scale(0.5, 1) skew(0deg, 3deg);\
  }\
  100% {\
    transform: scale(0, 1) skew(0deg, 0deg);\
  }\
}\
@-webkit-keyframes -delite-cube-in {\
  0% {\
    -webkit-transform: scale(0, 1) skew(0deg, 0deg);\
  }\
  50% {\
    -webkit-transform: scale(0.5, 1) skew(0deg, -3deg);\
  }\
  100% {\
    -webkit-transform: scale(1, 1) skew(0deg, 0deg);\
  }\
}\
@keyframes -delite-cube-in {\
  0% {\
    transform: scale(0, 1) skew(0deg, 0deg);\
  }\
  50% {\
    transform: scale(0.5, 1) skew(0deg, -3deg);\
  }\
  100% {\
    transform: scale(1, 1) skew(0deg, 0deg);\
  }\
}\
.-delite-cube.-delite-out.-delite-reverse {\
  -webkit-animation-name: -delite-cube-out-reverse;\
  animation-name: -delite-cube-out-reverse;\
  -webkit-transform-origin: 100% 50% !important;\
  transform-origin: 100% 50% !important;\
}\
.-delite-cube.-delite-in.-delite-reverse {\
  -webkit-animation-name: -delite-cube-in-reverse;\
  animation-name: -delite-cube-in-reverse;\
  -webkit-transform-origin: 0% 50% !important;\
  transform-origin: 0% 50% !important;\
}\
@-webkit-keyframes -delite-cube-out-reverse {\
  0% {\
    -webkit-transform: scale(1, 1) skew(0deg, 0deg);\
  }\
  50% {\
    -webkit-transform: scale(0.5, 1) skew(0deg, -3deg);\
  }\
  100% {\
    -webkit-transform: scale(0, 1) skew(0deg, 0deg);\
  }\
}\
@keyframes -delite-cube-out-reverse {\
  0% {\
    transform: scale(1, 1) skew(0deg, 0deg);\
  }\
  50% {\
    transform: scale(0.5, 1) skew(0deg, -3deg);\
  }\
  100% {\
    transform: scale(0, 1) skew(0deg, 0deg);\
  }\
}\
@-webkit-keyframes -delite-cube-in-reverse {\
  0% {\
    -webkit-transform: scale(0, 1) skew(0deg, 0deg);\
  }\
  50% {\
    -webkit-transform: scale(0.5, 1) skew(0deg, 3deg);\
  }\
  100% {\
    -webkit-transform: scale(1, 1) skew(0deg, 0deg);\
  }\
}\
@keyframes -delite-cube-in-reverse {\
  0% {\
    transform: scale(0, 1) skew(0deg, 0deg);\
  }\
  50% {\
    transform: scale(0.5, 1) skew(0deg, 3deg);\
  }\
  100% {\
    transform: scale(1, 1) skew(0deg, 0deg);\
  }\
}\
.dj_ios .-delite-cube {\
  -webkit-transform-style: preserve-3d !important;\
}\
.dj_ios .-delite-cube.-delite-out {\
  -webkit-animation-name: -delite-cube-out_iphone;\
  animation-name: -delite-cube-out_iphone;\
  -webkit-transform-origin: 50% 50% !important;\
  transform-origin: 50% 50% !important;\
}\
.dj_ios .-delite-cube.-delite-in {\
  -webkit-animation-name: -delite-cube-in_iphone;\
  animation-name: -delite-cube-in_iphone;\
  -webkit-transform-origin: 50% 50% !important;\
  transform-origin: 50% 50% !important;\
}\
@-webkit-keyframes -delite-cube-out_iphone {\
  from {\
    -webkit-transform: scale3d(0.835, 0.835, 0.835) rotateY(0deg) translateZ(160px);\
  }\
  to {\
    -webkit-transform: scale3d(0.835, 0.835, 0.835) rotateY(-90deg) translateZ(160px);\
  }\
}\
@keyframes -delite-cube-out_iphone {\
  from {\
    transform: scale3d(0.835, 0.835, 0.835) rotateY(0deg) translateZ(160px);\
  }\
  to {\
    transform: scale3d(0.835, 0.835, 0.835) rotateY(-90deg) translateZ(160px);\
  }\
}\
@-webkit-keyframes -delite-cube-in_iphone {\
  from {\
    -webkit-transform: scale3d(0.835, 0.835, 0.835) rotateY(90deg) translateZ(160px);\
  }\
  to {\
    -webkit-transform: scale3d(0.835, 0.835, 0.835) rotateY(0deg) translateZ(160px);\
  }\
}\
@keyframes -delite-cube-in_iphone {\
  from {\
    transform: scale3d(0.835, 0.835, 0.835) rotateY(90deg) translateZ(160px);\
  }\
  to {\
    transform: scale3d(0.835, 0.835, 0.835) rotateY(0deg) translateZ(160px);\
  }\
}\
.dj_ios.dj_landscape .-delite-cube.-delite-out {\
  -webkit-animation-name: -delite-cube-out_iphone_l;\
  animation-name: -delite-cube-out_iphone_l;\
  -webkit-transform-origin: 50% 50% !important;\
  transform-origin: 50% 50% !important;\
}\
.dj_ios.dj_landscape .-delite-cube.-delite-in {\
  -webkit-animation-name: -delite-cube-in_iphone_l;\
  animation-name: -delite-cube-in_iphone_l;\
  -webkit-transform-origin: 50% 50% !important;\
  transform-origin: 50% 50% !important;\
}\
@-webkit-keyframes -delite-cube-out_iphone_l {\
  from {\
    -webkit-transform: scale3d(0.77, 0.77, 0.77) rotateY(0deg) translateZ(240px);\
  }\
  to {\
    -webkit-transform: scale3d(0.77, 0.77, 0.77) rotateY(-90deg) translateZ(240px);\
  }\
}\
@keyframes -delite-cube-out_iphone_l {\
  from {\
    transform: scale3d(0.77, 0.77, 0.77) rotateY(0deg) translateZ(240px);\
  }\
  to {\
    transform: scale3d(0.77, 0.77, 0.77) rotateY(-90deg) translateZ(240px);\
  }\
}\
@-webkit-keyframes -delite-cube-in_iphone_l {\
  from {\
    -webkit-transform: scale3d(0.77, 0.77, 0.77) rotateY(90deg) translateZ(240px);\
  }\
  to {\
    -webkit-transform: scale3d(0.77, 0.77, 0.77) rotateY(0deg) translateZ(240px);\
  }\
}\
@keyframes -delite-cube-in_iphone_l {\
  from {\
    transform: scale3d(0.77, 0.77, 0.77) rotateY(90deg) translateZ(240px);\
  }\
  to {\
    transform: scale3d(0.77, 0.77, 0.77) rotateY(0deg) translateZ(240px);\
  }\
}\
.dj_ios .-delite-cube.-delite-out.-delite-reverse {\
  -webkit-animation-name: -delite-cube-out-reverse_iphone;\
  animation-name: -delite-cube-out-reverse_iphone;\
  -webkit-transform-origin: 50% 50% !important;\
  transform-origin: 50% 50% !important;\
}\
.dj_ios .-delite-cube.-delite-in.-delite-reverse {\
  -webkit-animation-name: -delite-cube-in-reverse_iphone;\
  animation-name: -delite-cube-in-reverse_iphone;\
  -webkit-transform-origin: 50% 50% !important;\
  transform-origin: 50% 50% !important;\
}\
@-webkit-keyframes -delite-cube-out-reverse_iphone {\
  from {\
    -webkit-transform: scale3d(0.835, 0.835, 0.835) rotateY(0deg) translateZ(160px);\
  }\
  to {\
    -webkit-transform: scale3d(0.835, 0.835, 0.835) rotateY(90deg) translateZ(160px);\
  }\
}\
@keyframes -delite-cube-out-reverse_iphone {\
  from {\
    transform: scale3d(0.835, 0.835, 0.835) rotateY(0deg) translateZ(160px);\
  }\
  to {\
    transform: scale3d(0.835, 0.835, 0.835) rotateY(90deg) translateZ(160px);\
  }\
}\
@-webkit-keyframes -delite-cube-in-reverse_iphone {\
  from {\
    -webkit-transform: scale3d(0.835, 0.835, 0.835) rotateY(-90deg) translateZ(160px);\
  }\
  to {\
    -webkit-transform: scale3d(0.835, 0.835, 0.835) rotateY(0deg) translateZ(160px);\
  }\
}\
@keyframes -delite-cube-in-reverse_iphone {\
  from {\
    transform: scale3d(0.835, 0.835, 0.835) rotateY(-90deg) translateZ(160px);\
  }\
  to {\
    transform: scale3d(0.835, 0.835, 0.835) rotateY(0deg) translateZ(160px);\
  }\
}\
.dj_ios.dj_landscape .-delite-cube.-delite-out.-delite-reverse {\
  -webkit-animation-name: -delite-cube-out-reverse_iphone_l;\
  animation-name: -delite-cube-out-reverse_iphone_l;\
  -webkit-transform-origin: 50% 50% !important;\
  transform-origin: 50% 50% !important;\
}\
.dj_ios.dj_landscape .-delite-cube.-delite-in.-delite-reverse {\
  -webkit-animation-name: -delite-cube-in-reverse_iphone_l;\
  animation-name: -delite-cube-in-reverse_iphone_l;\
  -webkit-transform-origin: 50% 50% !important;\
  transform-origin: 50% 50% !important;\
}\
@-webkit-keyframes -delite-cube-out-reverse_iphone_l {\
  from {\
    -webkit-transform: scale3d(0.77, 0.77, 0.77) rotateY(0deg) translateZ(240px);\
  }\
  to {\
    -webkit-transform: scale3d(0.77, 0.77, 0.77) rotateY(90deg) translateZ(240px);\
  }\
}\
@keyframes -delite-cube-out-reverse_iphone_l {\
  from {\
    transform: scale3d(0.77, 0.77, 0.77) rotateY(0deg) translateZ(240px);\
  }\
  to {\
    transform: scale3d(0.77, 0.77, 0.77) rotateY(90deg) translateZ(240px);\
  }\
}\
@-webkit-keyframes -delite-cube-in-reverse_iphone_l {\
  from {\
    -webkit-transform: scale3d(0.77, 0.77, 0.77) rotateY(-90deg) translateZ(240px);\
  }\
  to {\
    -webkit-transform: scale3d(0.77, 0.77, 0.77) rotateY(0deg) translateZ(240px);\
  }\
}\
@keyframes -delite-cube-in-reverse_iphone_l {\
  from {\
    transform: scale3d(0.77, 0.77, 0.77) rotateY(-90deg) translateZ(240px);\
  }\
  to {\
    transform: scale3d(0.77, 0.77, 0.77) rotateY(0deg) translateZ(240px);\
  }\
}\
.dj_ipad.dj_ios .-delite-cube.-delite-out {\
  -webkit-animation-name: -delite-cube-out_ipad;\
  animation-name: -delite-cube-out_ipad;\
  -webkit-transform-origin: 50% 50% !important;\
  transform-origin: 50% 50% !important;\
}\
.dj_ipad.dj_ios .-delite-cube.-delite-in {\
  -webkit-animation-name: -delite-cube-in_ipad;\
  animation-name: -delite-cube-in_ipad;\
  -webkit-transform-origin: 50% 50% !important;\
  transform-origin: 50% 50% !important;\
}\
@-webkit-keyframes -delite-cube-out_ipad {\
  from {\
    -webkit-transform: scale3d(0.806, 0.806, 0.806) rotateY(0deg) translateZ(384px);\
  }\
  to {\
    -webkit-transform: scale3d(0.806, 0.806, 0.806) rotateY(-90deg) translateZ(384px);\
  }\
}\
@keyframes -delite-cube-out_ipad {\
  from {\
    transform: scale3d(0.806, 0.806, 0.806) rotateY(0deg) translateZ(384px);\
  }\
  to {\
    transform: scale3d(0.806, 0.806, 0.806) rotateY(-90deg) translateZ(384px);\
  }\
}\
@-webkit-keyframes -delite-cube-in_ipad {\
  from {\
    -webkit-transform: scale3d(0.806, 0.806, 0.806) rotateY(90deg) translateZ(384px);\
  }\
  to {\
    -webkit-transform: scale3d(0.806, 0.806, 0.806) rotateY(0deg) translateZ(384px);\
  }\
}\
@keyframes -delite-cube-in_ipad {\
  from {\
    transform: scale3d(0.806, 0.806, 0.806) rotateY(90deg) translateZ(384px);\
  }\
  to {\
    transform: scale3d(0.806, 0.806, 0.806) rotateY(0deg) translateZ(384px);\
  }\
}\
.dj_ipad.dj_ios.dj_landscape .-delite-cube.-delite-out {\
  -webkit-animation-name: -delite-cube-out_ipad_l;\
  animation-name: -delite-cube-out_ipad_l;\
  -webkit-transform-origin: 50% 50% !important;\
  transform-origin: 50% 50% !important;\
}\
.dj_ipad.dj_ios.dj_landscape .-delite-cube.-delite-in {\
  -webkit-animation-name: -delite-cube-in_ipad_l;\
  animation-name: -delite-cube-in_ipad_l;\
  -webkit-transform-origin: 50% 50% !important;\
  transform-origin: 50% 50% !important;\
}\
@-webkit-keyframes -delite-cube-out_ipad_l {\
  from {\
    -webkit-transform: scale3d(0.758, 0.758, 0.758) rotateY(0deg) translateZ(512px);\
  }\
  to {\
    -webkit-transform: scale3d(0.758, 0.758, 0.758) rotateY(-90deg) translateZ(512px);\
  }\
}\
@keyframes -delite-cube-out_ipad_l {\
  from {\
    transform: scale3d(0.758, 0.758, 0.758) rotateY(0deg) translateZ(512px);\
  }\
  to {\
    transform: scale3d(0.758, 0.758, 0.758) rotateY(-90deg) translateZ(512px);\
  }\
}\
@-webkit-keyframes -delite-cube-in_ipad_l {\
  from {\
    -webkit-transform: scale3d(0.758, 0.758, 0.758) rotateY(90deg) translateZ(512px);\
  }\
  to {\
    -webkit-transform: scale3d(0.758, 0.758, 0.758) rotateY(0deg) translateZ(512px);\
  }\
}\
@keyframes -delite-cube-in_ipad_l {\
  from {\
    transform: scale3d(0.758, 0.758, 0.758) rotateY(90deg) translateZ(512px);\
  }\
  to {\
    transform: scale3d(0.758, 0.758, 0.758) rotateY(0deg) translateZ(512px);\
  }\
}\
.dj_ipad.dj_ios .-delite-cube.-delite-out.-delite-reverse {\
  -webkit-animation-name: -delite-cube-out-reverse_ipad;\
  animation-name: -delite-cube-out-reverse_ipad;\
  -webkit-transform-origin: 50% 50% !important;\
  transform-origin: 50% 50% !important;\
}\
.dj_ipad.dj_ios .-delite-cube.-delite-in.-delite-reverse {\
  -webkit-animation-name: -delite-cube-in-reverse_ipad;\
  animation-name: -delite-cube-in-reverse_ipad;\
  -webkit-transform-origin: 50% 50% !important;\
  transform-origin: 50% 50% !important;\
}\
@-webkit-keyframes -delite-cube-out-reverse_ipad {\
  from {\
    -webkit-transform: scale3d(0.806, 0.806, 0.806) rotateY(0deg) translateZ(384px);\
  }\
  to {\
    -webkit-transform: scale3d(0.806, 0.806, 0.806) rotateY(90deg) translateZ(384px);\
  }\
}\
@keyframes -delite-cube-out-reverse_ipad {\
  from {\
    transform: scale3d(0.806, 0.806, 0.806) rotateY(0deg) translateZ(384px);\
  }\
  to {\
    transform: scale3d(0.806, 0.806, 0.806) rotateY(90deg) translateZ(384px);\
  }\
}\
@-webkit-keyframes -delite-cube-in-reverse_ipad {\
  from {\
    -webkit-transform: scale3d(0.806, 0.806, 0.806) rotateY(-90deg) translateZ(384px);\
  }\
  to {\
    -webkit-transform: scale3d(0.806, 0.806, 0.806) rotateY(0deg) translateZ(384px);\
  }\
}\
@keyframes -delite-cube-in-reverse_ipad {\
  from {\
    transform: scale3d(0.806, 0.806, 0.806) rotateY(-90deg) translateZ(384px);\
  }\
  to {\
    transform: scale3d(0.806, 0.806, 0.806) rotateY(0deg) translateZ(384px);\
  }\
}\
.dj_ipad.dj_ios.dj_landscape .-delite-cube.-delite-out.-delite-reverse {\
  -webkit-animation-name: -delite-cube-out-reverse_ipad_l;\
  animation-name: -delite-cube-out-reverse_ipad_l;\
  -webkit-transform-origin: 50% 50% !important;\
  transform-origin: 50% 50% !important;\
}\
.dj_ipad.dj_ios.dj_landscape .-delite-cube.-delite-in.-delite-reverse {\
  -webkit-animation-name: -delite-cube-in-reverse_ipad_l;\
  animation-name: -delite-cube-in-reverse_ipad_l;\
  -webkit-transform-origin: 50% 50% !important;\
  transform-origin: 50% 50% !important;\
}\
@-webkit-keyframes -delite-cube-out-reverse_ipad_l {\
  from {\
    -webkit-transform: scale3d(0.758, 0.758, 0.758) rotateY(0deg) translateZ(512px);\
  }\
  to {\
    -webkit-transform: scale3d(0.758, 0.758, 0.758) rotateY(90deg) translateZ(512px);\
  }\
}\
@keyframes -delite-cube-out-reverse_ipad_l {\
  from {\
    transform: scale3d(0.758, 0.758, 0.758) rotateY(0deg) translateZ(512px);\
  }\
  to {\
    transform: scale3d(0.758, 0.758, 0.758) rotateY(90deg) translateZ(512px);\
  }\
}\
@-webkit-keyframes -delite-cube-in-reverse_ipad_l {\
  from {\
    -webkit-transform: scale3d(0.758, 0.758, 0.758) rotateY(-90deg) translateZ(512px);\
  }\
  to {\
    -webkit-transform: scale3d(0.758, 0.758, 0.758) rotateY(0deg) translateZ(512px);\
  }\
}\
@keyframes -delite-cube-in-reverse_ipad_l {\
  from {\
    transform: scale3d(0.758, 0.758, 0.758) rotateY(-90deg) translateZ(512px);\
  }\
  to {\
    transform: scale3d(0.758, 0.758, 0.758) rotateY(0deg) translateZ(512px);\
  }\
}\
'; } );
