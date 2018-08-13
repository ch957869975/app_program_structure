/**
 * 参考文档：http://ask.dcloud.net.cn/article/431
 * 升级文件为JSON格式数据，如下：
 */

//{
//	"status":1,
//	"android_version": "2.6.0",
//  "ios_version": "3.0.0"
//	"title": "Hello MUI版本更新",
//	"note": "修复“选项卡+下拉刷新”示例中，某个选项卡滚动到底时，会触发所有选项卡上拉加载事件的bug；\n修复Android4.4.4版本部分手机上，软键盘弹出时影响图片轮播组件，导致自动轮播停止的bug；",
//	"android_url": "http://www.dcloud.io/hellomui/HelloMUI.apk",
//  "ios_url": "http://www.dcloud.io/hellomui/HelloMUI.apk"
//}

(function() {
	var wgtWaiting = null; // 加载等待框

	//检测系统
	function checkSystem() {

		if(mui.os.ios) { //ios系统
			checkoutVersion(true);
		} else { //android系统
			checkoutVersion(false);
		}
	}

	//检验版本信息(android)
	function checkoutVersion(isIOS) {
		var curDate = (new Date()).valueOf(); //当前时间的时间戳
		//对照服务端版本信息
		mui.ajax(window.APP_UPDATE_SERVER, {
			dataType: 'json',
			type: 'GET',
			data: {
				id: curDate
			},
			success: function(data) {
				if(data.status) {
					console.log(JSON.stringify(data))
					if(isIOS) { //ios
						if(data.ios_version > plus.runtime.version) { //需更新版本
							plus.nativeUI.confirm('发现新版本', function(e) {
								console.log("Close confirm: " + e.index);
								if(0 == e.index) {
									plus.runtime.openURL(data.ios_url);
								}
							}, {
								"title": data.title,
								"buttons": ["立即更新", "取消"],
							});
						} else {
							return;
						}
					} else { //android
						if(data.android_version > plus.runtime.version) { //需更新版本
							//验证已下载的版本
							if(plus.storage.getItem('UpdateVersionInfo')) { //本地缓存了已下载的安装包的信息
								var UpdateVersionInfo = JSON.parse(plus.storage.getItem('UpdateVersionInfo'));
								if(data.android_version > UpdateVersionInfo.version) { //本地最新安装包版本没有服务器端版本高则直接下载
									createDownload(data, data.android_version);
								} else { //直接使用本地的安装包
									plus.io.resolveLocalFileSystemURL(UpdateVersionInfo.path, function(entry) {
										installApp(UpdateVersionInfo.path, '安装更新！');
									}, function(error) { //文件获取不到 可能被删除
										createDownload(data, data.android_version);
									});
								}
							} else {
								createDownload(data, data.android_version);
							}
						} else {
							return;
						}
					}
				}
			},
			error: function(xhr, type, errorThrown) {
				console.log('【==检测远端版本信息出错==】' + type + ': ' + xhr.status);
				//重新检测
				window.setTimeout(function() {
					checkSystem();
				}, 5000);
			}
		});
	}

	/* 开启下载 */
	function createDownload(data, varsion) {
		plus.nativeUI.confirm('发现新版本', function(event) {
			if(0 == event.index) {
				wgtWaiting = plus.nativeUI.showWaiting("开始下载", {
					modal: true
				});
				var dtask = plus.downloader.createDownload(data.android_url, {
					filename: "_doc/update/",
					retry: 1
				}, function(d, status) {
					wgtWaiting.close();
					if(status == 200) { // 下载成功
						var path = d.filename;
						//缓存最新下载的安装包信息
						var UpdateVersionInfo = {
							version: varsion,
							path: path
						};
						plus.storage.setItem('UpdateVersionInfo', JSON.stringify(UpdateVersionInfo));

						installApp(path, '下载完成！');
					} else { //下载失败
						update();
					}
				});

				// 跟踪下载任务进度
				dtask.addEventListener("statechanged", function(download, status) {
					switch(download.state) {
						case 2:
							wgtWaiting.setTitle("已连接到服务器");
							break;
						case 3:
							var percent = download.downloadedSize / download.totalSize * 100;
							wgtWaiting.setTitle("已下载 " + parseInt(percent) + "%");
							break;
						case 4:
							wgtWaiting.setTitle("下载完成");
							break;
					}
				});
				dtask.start();
			} else {
				plus.runtime.quit();
			}
		}, {
			"title": data.title,
			"buttons": ["立即更新", "退 出"]
		});
	}

	function installApp(path, tip) {
		plus.nativeUI.confirm(tip, function(event) {
			if(0 == event.index) {
				plus.runtime.install(path); // 安装下载的apk文件
				setTimeout(function() {
					plus.runtime.quit();
				}, 200);
			} else {
				plus.runtime.quit();
			}
		}, {
			"title": '提示',
			"buttons": ["立即安装", "退 出"]
		});
	}

	//入口
	mui.os.plus && !mui.os.stream && mui.plusReady(checkSystem);
})();