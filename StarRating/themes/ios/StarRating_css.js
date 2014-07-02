define(function () {
	/* jshint multistr: true */
	/* jshint -W015 */
	/* jshint -W033 */
	return "\
.d-star-rating {\
  /* Do not modify the display style */\
  display: inline-block;\
  font-size: 40px;\
}\
.d-star-rating.d-star-rating-hovered {\
  opacity: 0.5;\
}\
.d-star-rating-zero {\
  /* Do not modify the display style */\
  display: inline-block;\
  overflow: hidden;\
  height: 1em;\
  width: 0.5em;\
}\
.d-star-rating-zero.d-hidden {\
  width: 0px;\
}\
.d-star-rating-star-icon {\
  /* Do not modify the display style */\
  display: inline-block;\
  overflow: hidden;\
  line-height: 1em;\
  height: 1em;\
  width: 0.5em;\
}\
.d-star-rating-star-icon:before {\
  width: 1em;\
  display: inline-block;\
  text-align: center;\
}\
.d-star-rating-empty:before {\
  content: \"\\2605\";\
  color: #f8f8f8;\
}\
.d-star-rating-full:before {\
  content: \"\\2605\";\
  color: #ffff00;\
}\
.d-star-rating-disabled .d-star-rating-full:before {\
  color: #808080;\
}\
.d-star-rating-end.d-star-rating-star-icon:before {\
  margin-left: -0.5em;\
}";
});
