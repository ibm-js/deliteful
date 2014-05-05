define(function () {
	/* jshint multistr: true */
	/* jshint -W015 */
	/* jshint -W033 */
	return "\
.d-star-rating.d-rtl .d-star-rating-full-star:before {\
  margin-left: 0px;\
  margin-right: -120px;\
}\
.d-star-rating.d-rtl .d-star-rating-empty-star:before {\
  margin-left: 0px;\
  margin-right: -80px;\
}\
.d-star-rating.d-rtl .d-star-rating-half-star:before {\
  margin-left: 0px;\
}\
.d-ie-9 .d-star-rating.d-rtl .d-star-rating-full-star:before {\
  margin-left: 0px;\
  margin-right: 0px;\
}\
.d-ie-9 .d-star-rating.d-rtl .d-star-rating-empty-star:before {\
  margin-left: 0px;\
  margin-right: -40px;\
}\
.d-ie-9 .d-star-rating.d-rtl .d-star-rating-half-star:before {\
  margin-left: 0px;\
  margin-right: -80px;\
}";
});
