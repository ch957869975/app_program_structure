/*
 * Ajax获取数据方法封装
 */

window.DataUtil = {
	//登陆
	login: function(paramObj, sCallBack, fCallBack) {
		mui.ajax({
			url: window.API_CONFIG.login,
			type: "POST",
			dataType: "json",
			timeout: window.GlOBAL_CONFIG.timeOut,
			data: paramObj,
			error: function(xhr, type, error) {
				MethodUtil.checkToken(xhr, type, error, fCallBack);
			},
			success: function(data) {
				plus.storage.setItem('tokenNewestTime', Date.parse(new Date()));
				sCallBack && sCallBack(data);
			}
		})
	},
}