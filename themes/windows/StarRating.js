define(function(){ return '\
.duiToolBarButtonHasArrow-styles {\
  width: 27px;\
  height: 27px;\
  border-radius: 20px;\
  border: 2px solid #ffffff;\
  padding: 0px;\
  margin: 0px;\
  margin-top: 8px;\
  margin-bottom: 8px;\
  background-image: url("images/dark/back.png");\
  background-position: 50% 50%;\
  background-size: 27px 27px;\
  background-repeat: no-repeat;\
}\
.d-star-rating.d-star-rating-hovered {\
  opacity: 0.5;\
}\
.d-star-rating {\
  -ms-touch-action: none;\
}\
.d-star-rating input {\
  display: none;\
}\
.d-star-rating-disabled .d-star-rating-star-icon:before {\
  content: url("../common/images/grey-stars-40.png");\
}\
.d-star-rating-star-icon {\
  height: 40px;\
  width: 40px;\
  overflow: hidden;\
}\
.d-star-rating-star-icon:before {\
  display: inline-block;\
  content: url("../common/images/yellow-stars-40.png");\
}\
.d-star-rating-empty-star:before {\
  margin-left: -40px;\
}\
.d-star-rating-half-star:before {\
  margin-left: -80px;\
}\
'; } );
