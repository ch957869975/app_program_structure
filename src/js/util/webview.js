/*
 * webview方法封装
 */

window.WebviewUtil = {
	// 打开页面(可选带原生顶栏) 参考：http://dev.dcloud.net.cn/mui/window/#openWindowWithTitle
	//id：页面id；hasTitle：是否有标题；extras：参数；animation：转场动画；time: 转场动画持续时间；isWaiting：是否显示加载框
	show: function(id, extras, animation, animationTime,isWaiting) {
		var view = window.VIEW_CONFIG[id];
		extras = extras || {};
		animation = animation || 'slide-in-right';
		isWaiting = isWaiting || false;
		var titleNViewConfig = null,
			waitingConfig = {};

		// 打开webview
		mui.openWindow({
			url: view.url,
			id: view.id,
			extras: extras,
			show: {
				aniShow: animation,
				duration: animationTime,
			},
			waiting: {
				autoShow: isWaiting, //自动显示等待框，默认为true
			}
		});
	}
}