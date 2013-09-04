define(function(){ return '\
html.mobile,\
.mobile body {\
  width: 100%;\
  margin: 0;\
  padding: 0;\
}\
.mobile body {\
  overflow-x: hidden;\
  -webkit-text-size-adjust: none;\
  font-family: Helvetica;\
  font-size: 17px;\
}\
.duiBackground {\
  background-color: #c5ccd3;\
}\
/* Button Colors */\
.duiColorBlue {\
  color: #ffffff;\
  background-color: #366edf;\
  background-image: -webkit-gradient(linear, left top, left bottom, from(#7a9de9), to(#2362dd), color-stop(0.5, #366edf), color-stop(0.5, #215fdc));\
  background-image: linear-gradient(to bottom, #7a9de9 0%, #366edf 50%, #215fdc 50%, #2362dd 100%);\
}\
.duiColorBlue45 {\
  background-image: -webkit-gradient(linear, left top, right bottom, from(#7a9de9), to(#2362dd), color-stop(0.5, #366edf), color-stop(0.5, #215fdc));\
  background-image: linear-gradient(to right bottom, #7a9de9 0%, #366edf 50%, #215fdc 50%, #2362dd 100%);\
}\
/* Default Button Colors */\
.duiColorDefault {\
  color: #ffffff;\
  background-color: #5877a2;\
  background-image: -webkit-gradient(linear, left top, left bottom, from(#222222), to(#4a6c9b), color-stop(0.02, #8ea4c1), color-stop(0.5, #5877a2), color-stop(0.5, #476999));\
  background-image: linear-gradient(to bottom, #222222 0%, #8ea4c1 2%, #5877a2 50%, #476999 50%, #4a6c9b 100%);\
}\
.duiColorDefault45 {\
  background-image: -webkit-gradient(linear, left top, right bottom, from(#222222), to(#4a6c9b), color-stop(0.02, #8ea4c1), color-stop(0.5, #5877a2), color-stop(0.5, #476999));\
  background-image: linear-gradient(to right bottom, #222222 0%, #8ea4c1 2%, #5877a2 50%, #476999 50%, #4a6c9b 100%);\
}\
.duiColorDefaultSel {\
  color: #ffffff;\
  background-color: #394d77;\
  background-image: -webkit-gradient(linear, left top, left bottom, from(#7c87a4), to(#263e6c), color-stop(0.5, #394d77), color-stop(0.5, #243b69));\
  background-image: linear-gradient(to bottom, #7c87a4 0%, #394d77 50%, #243b69 50%, #263e6c 100%);\
}\
.duiColorDefaultSel45 {\
  background-image: -webkit-gradient(linear, left top, right bottom, from(#7c87a4), to(#263e6c), color-stop(0.5, #394d77), color-stop(0.5, #243b69));\
  background-image: linear-gradient(to right bottom, #7c87a4 0%, #394d77 50%, #243b69 50%, #263e6c 100%);\
}\
.duiSpriteIcon {\
  position: absolute;\
}\
.duiSpriteIconParent {\
  position: relative;\
  font-size: 1px;\
}\
.duiImageIcon {\
  vertical-align: top;\
}\
'; } );
