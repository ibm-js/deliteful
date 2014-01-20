define(function(){ return '\
.d-button {\
  padding: 15px 10px;\
  border-style: outset;\
  border-width: 1px;\
  font-family: Helvetica;\
  cursor: pointer;\
  -webkit-tap-highlight-color: rgba(255, 255, 255, 0);\
  background-image: none;\
  background-color: #333333;\
  border-style: none;\
  border-top-style: solid;\
  border-top-color: rgba(85, 85, 85, 0.9);\
  border-top-width: 1px;\
  border-radius: 2px;\
  height: 40px;\
  color: #ffffff;\
}\
.d-button-text {\
  margin: 10px;\
}\
.d-button:active,\
.d-button-selected {\
  color: #ffffff;\
  border-color: transparent;\
  background-image: none;\
  background-color: #2C94BB;\
  box-shadow: 0px 0px 1px 4px #1F5366;\
}\
.d-button-disabled,\
.d-button:disabled {\
  border-color: grey;\
  background-image: none;\
  color: grey;\
  cursor: default;\
}\
.d-button-blue {\
  color: #ffffff;\
  background-image: none;\
  background-color: #333333;\
  border-style: none;\
  border-top-style: solid;\
  border-top-color: rgba(85, 85, 85, 0.9);\
  border-top-width: 1px;\
  border-radius: 2px;\
  background-color: #0099CC;\
}\
.d-button-blue-selected {\
  background-image: none;\
}\
.d-button-red {\
  background-image: -webkit-gradient(linear, left top, left bottom, from(#fa9d58), to(#ee4115), color-stop(0.5, #ff4d25), color-stop(0.5, #ed4d15));\
  background-image: linear-gradient(to bottom, #fa9d58 0%, #ff4d25 50%, #ed4d15 50%, #ee4115 100%);\
  color: #ffffff;\
  background-image: none;\
  background-color: #333333;\
  border-style: none;\
  border-top-style: solid;\
  border-top-color: rgba(85, 85, 85, 0.9);\
  border-top-width: 1px;\
  border-radius: 2px;\
  background-color: #CC0000;\
}\
.d-button-red-selected {\
  background-image: none;\
}\
'; } );
