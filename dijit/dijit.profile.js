var profile = (function(){
	var testResourceRe = /^dui\/tests\//,

		copyOnly = function(filename, mid){
			var list = {
				"dui/dijit.profile":1,
				"dui/package.json":1,
				"dijit/themes/claro/compile":1
			};
			return (mid in list) || (/^dui\/resources\//.test(mid) && !/\.css$/.test(filename)) || /(png|jpg|jpeg|gif|tiff)$/.test(filename);
		};

	return {
		resourceTags:{
			test: function(filename, mid){
				return testResourceRe.test(mid) || mid=="dui/robot" || mid=="dui/robotx";
			},

			copyOnly: function(filename, mid){
				return copyOnly(filename, mid);
			},

			amd: function(filename, mid){
				return !testResourceRe.test(mid) && !copyOnly(filename, mid) && /\.js$/.test(filename);
			},

			miniExclude: function(filename, mid){
				return /^dui\/bench\//.test(mid) || /^dui\/themes\/themeTest/.test(mid);
			}
		}
	};
})();



