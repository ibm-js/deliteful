dojo.provide("dui.mobile.tests.module");

try{
	dojo.require("dui.mobile.tests.doh.module");
	if(!dojo.isBB && !dojo.isAndroid && !dojo.isIPhone && !dojo.isIPad && !dojo.isIPod) {
		dojo.require("dui.mobile.tests.robot.module");
	}

}catch(e){
	doh.debug(e);
}

