define([
	"dojo/Deferred",
	"dojo/_base/config"
], function(Deferred, config){
	/*=====
	return {
		// summary:
		//		This is the wrapper module which loads
		//		dojox/css3/transit conditionally. If duiCSS3Transition
		//		is set to 'dojox/css3/transit', it will be loaded as
		//		the module to conduct view transitions, otherwise this module returns null.
	};
	=====*/
	if(config['duiCSS3Transition']){
		//require dojox/css3/transit and resolve it as the result of transitDeferred.
		var transitDeferred = new Deferred();
		require([config['duiCSS3Transition']], function(transit){
			transitDeferred.resolve(transit);
		});
		return transitDeferred;
	}
	return null;
});
