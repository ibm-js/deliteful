define(function(){ return '\
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
