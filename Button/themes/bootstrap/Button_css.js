define(function(){ return '\
.d-button {\
  display: inline-block;\
  overflow: hidden;\
  margin-bottom: 0;\
  font-weight: normal;\
  text-align: center;\
  vertical-align: middle;\
  cursor: pointer;\
  background-image: none;\
  border-width: 1px;\
  border-style: solid;\
  border-color: transparent;\
  -webkit-box-sizing: border-box;\
  -moz-box-sizing: border-box;\
  box-sizing: border-box;\
  padding: 6px 12px;\
  font-size: 14px;\
  line-height: 1.428571429;\
  border-radius: 4px;\
  user-select: none;\
  -webkit-user-select: none;\
  -ms-user-select: none;\
  -moz-user-select: none;\
  color: #333333;\
  background-color: #ffffff;\
  border-color: #cccccc;\
}\
.d-button:focus,\
.d-button:active:focus,\
.d-button.active:focus {\
  outline: thin dotted;\
  outline: 5px auto -webkit-focus-ring-color;\
  outline-offset: -2px;\
}\
.d-button:hover,\
.d-button:focus {\
  color: #333333;\
  text-decoration: none;\
}\
.d-button:active,\
.d-button.active {\
  outline: 0;\
  background-image: none;\
  -webkit-box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);\
  -moz-box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);\
  box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);\
}\
.d-button.disabled,\
.d-button[disabled],\
fieldset[disabled] .d-button {\
  cursor: not-allowed;\
  opacity: .65;\
  -webkit-box-shadow: none;\
  -moz-box-shadow: none;\
  box-shadow: none;\
  pointer-events: none;\
}\
.d-button:hover,\
.d-button:focus,\
.d-button:active,\
.d-button.active {\
  color: #333333;\
  background-color: #ebebeb;\
  border-color: #adadad;\
}\
.d-button:active,\
.d-button.active {\
  background-image: none;\
}\
.d-button.disabled,\
.d-button[disabled],\
.d-button.disabled:hover,\
.d-button[disabled]:hover,\
.d-button.disabled:focus,\
.d-button[disabled]:focus,\
.d-button.disabled:active,\
.d-button[disabled]:active,\
.d-button.disabled.active,\
.d-button[disabled].active {\
  background-color: #ffffff;\
  border-color: #cccccc;\
}\
.d-button-primary,\
.d-button-blue {\
  color: #ffffff;\
  background-color: #428bca;\
  border-color: #357ebd;\
}\
.d-button-primary:hover,\
.d-button-blue:hover,\
.d-button-primary:focus,\
.d-button-blue:focus,\
.d-button-primary:active,\
.d-button-blue:active,\
.d-button-primary.active,\
.d-button-blue.active {\
  color: #ffffff;\
  background-color: #3276b1;\
  border-color: #285e8e;\
}\
.d-button-primary:active,\
.d-button-blue:active,\
.d-button-primary.active,\
.d-button-blue.active {\
  background-image: none;\
}\
.d-button-primary.disabled,\
.d-button-blue.disabled,\
.d-button-primary[disabled],\
.d-button-blue[disabled],\
.d-button-primary.disabled:hover,\
.d-button-blue.disabled:hover,\
.d-button-primary[disabled]:hover,\
.d-button-blue[disabled]:hover,\
.d-button-primary.disabled:focus,\
.d-button-blue.disabled:focus,\
.d-button-primary[disabled]:focus,\
.d-button-blue[disabled]:focus,\
.d-button-primary.disabled:active,\
.d-button-blue.disabled:active,\
.d-button-primary[disabled]:active,\
.d-button-blue[disabled]:active,\
.d-button-primary.disabled.active,\
.d-button-blue.disabled.active,\
.d-button-primary[disabled].active,\
.d-button-blue[disabled].active {\
  background-color: #428bca;\
  border-color: #357ebd;\
}\
.d-button-success {\
  color: #ffffff;\
  background-color: #5cb85c;\
  border-color: #4cae4c;\
}\
.d-button-success:hover,\
.d-button-success:focus,\
.d-button-success:active,\
.d-button-success.active {\
  color: #ffffff;\
  background-color: #47a447;\
  border-color: #398439;\
}\
.d-button-success:active,\
.d-button-success.active {\
  background-image: none;\
}\
.d-button-success.disabled,\
.d-button-success[disabled],\
.d-button-success.disabled:hover,\
.d-button-success[disabled]:hover,\
.d-button-success.disabled:focus,\
.d-button-success[disabled]:focus,\
.d-button-success.disabled:active,\
.d-button-success[disabled]:active,\
.d-button-success.disabled.active,\
.d-button-success[disabled].active {\
  background-color: #5cb85c;\
  border-color: #4cae4c;\
}\
.d-button-info {\
  color: #ffffff;\
  background-color: #5bc0de;\
  border-color: #46b8da;\
}\
.d-button-info:hover,\
.d-button-info:focus,\
.d-button-info:active,\
.d-button-info.active {\
  color: #ffffff;\
  background-color: #39b3d7;\
  border-color: #269abc;\
}\
.d-button-info:active,\
.d-button-info.active {\
  background-image: none;\
}\
.d-button-info.disabled,\
.d-button-info[disabled],\
.d-button-info.disabled:hover,\
.d-button-info[disabled]:hover,\
.d-button-info.disabled:focus,\
.d-button-info[disabled]:focus,\
.d-button-info.disabled:active,\
.d-button-info[disabled]:active,\
.d-button-info.disabled.active,\
.d-button-info[disabled].active {\
  background-color: #5bc0de;\
  border-color: #46b8da;\
}\
.d-button-warning {\
  color: #ffffff;\
  background-color: #f0ad4e;\
  border-color: #eea236;\
}\
.d-button-warning:hover,\
.d-button-warning:focus,\
.d-button-warning:active,\
.d-button-warning.active {\
  color: #ffffff;\
  background-color: #ed9c28;\
  border-color: #d58512;\
}\
.d-button-warning:active,\
.d-button-warning.active {\
  background-image: none;\
}\
.d-button-warning.disabled,\
.d-button-warning[disabled],\
.d-button-warning.disabled:hover,\
.d-button-warning[disabled]:hover,\
.d-button-warning.disabled:focus,\
.d-button-warning[disabled]:focus,\
.d-button-warning.disabled:active,\
.d-button-warning[disabled]:active,\
.d-button-warning.disabled.active,\
.d-button-warning[disabled].active {\
  background-color: #f0ad4e;\
  border-color: #eea236;\
}\
.d-button-danger,\
.d-button-red {\
  color: #ffffff;\
  background-color: #d9534f;\
  border-color: #d43f3a;\
}\
.d-button-danger:hover,\
.d-button-red:hover,\
.d-button-danger:focus,\
.d-button-red:focus,\
.d-button-danger:active,\
.d-button-red:active,\
.d-button-danger.active,\
.d-button-red.active {\
  color: #ffffff;\
  background-color: #d2322d;\
  border-color: #ac2925;\
}\
.d-button-danger:active,\
.d-button-red:active,\
.d-button-danger.active,\
.d-button-red.active {\
  background-image: none;\
}\
.d-button-danger.disabled,\
.d-button-red.disabled,\
.d-button-danger[disabled],\
.d-button-red[disabled],\
.d-button-danger.disabled:hover,\
.d-button-red.disabled:hover,\
.d-button-danger[disabled]:hover,\
.d-button-red[disabled]:hover,\
.d-button-danger.disabled:focus,\
.d-button-red.disabled:focus,\
.d-button-danger[disabled]:focus,\
.d-button-red[disabled]:focus,\
.d-button-danger.disabled:active,\
.d-button-red.disabled:active,\
.d-button-danger[disabled]:active,\
.d-button-red[disabled]:active,\
.d-button-danger.disabled.active,\
.d-button-red.disabled.active,\
.d-button-danger[disabled].active,\
.d-button-red[disabled].active {\
  background-color: #d9534f;\
  border-color: #d43f3a;\
}\
.d-button-link {\
  color: #428bca;\
  font-weight: normal;\
  cursor: pointer;\
  border-radius: 0;\
}\
.d-button-link,\
.d-button-link:active,\
.d-button-link[disabled] {\
  background-color: transparent;\
  -webkit-box-shadow: none;\
  -moz-box-shadow: none;\
  box-shadow: none;\
  border-width: 0;\
}\
.d-button-link,\
.d-button-link:hover,\
.d-button-link:focus,\
.d-button-link:active {\
  border-color: transparent;\
}\
.d-button-link:hover,\
.d-button-link:focus {\
  color: #2a6496;\
  text-decoration: underline;\
  background-color: transparent;\
}\
.d-button-link[disabled]:hover,\
.d-button-link[disabled]:focus {\
  color: #999999;\
  text-decoration: none;\
}\
.d-button-text {\
  display: inline-block;\
  vertical-align: middle;\
  width: 100%;\
  max-width: 100%;\
  line-height: normal;\
  overflow: hidden;\
  text-overflow: ellipsis;\
  white-space: nowrap;\
  padding: 0;\
  margin: 0;\
}\
.d-button .d-button-icon:before {\
  display: inline-block;\
  content: "";\
  vertical-align: middle;\
  background-repeat: no-repeat;\
}\
.d-button .d-button-text.d-button-icon:before {\
  padding: 0 4px;\
}\
'; } );
