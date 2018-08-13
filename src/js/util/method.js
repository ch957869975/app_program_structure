/*
 * 常用方法封装
 * 王有锴
 */

window.MethodUtil = {
	// 去除字符串所有空格
	delAllTrim: function(str) {
		return str.replace(/\s+/g, "");
	},
	// 判断表单字段是否空
	trimTitle: function(objArr) {
		var flag = false;
		for(var i = 0; i < objArr.length; i++) {
			if(!objArr[i].value || objArr[i].value == '') {
				plus.nativeUI.toast(objArr[i].title);
				flag = true;
				break;
			}
		}
		if(flag) {
			return false;
		} else {
			return true;
		}
	},
	stringText: function(string, Chinese) { //校验参数函数
		if(!window.MethodUtil.filterEmoji(string)) { //校验表情
			return false;
		} else if(!string || string == '') {
			mui.toast('请填写' + Chinese);
			return false;
		} else if(string.replace(/\s+/g, "") == '') {
			mui.toast(Chinese + '不能为空格');
			return false;
		}
		return true;
	},
	//处理多文本换行符
	replaceLB: function(val) {
		var descArr = val.split('\n');
		descArr.forEach(function(item, idx, arr) {
			arr[idx] = '<p>' + item + '</p>';
		});
		return descArr.join('');
	},
	//去掉所有html标记的函数
	delHtmlTag: function delHtmlTag(str) {
		return str.replace(/<[^>]+>/g, ""); //去掉所有的html标记
	},

	// 字符串时间转时间戳
	getTimeStamp: function(stringTime) {
		var timestamp = Date.parse(new Date(stringTime));
		return timestamp;
	},
	//日期格式化
	getDate: function(value) {
		return moment(new Date(value)).utc().zone(-8).format("YYYY/MM/DD");
	},
	// 过滤emogi符号
	filterEmoji: function(content) {
		var emojiFilter = /[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/ig
		if(emojiFilter.test(content)) {
			plus.nativeUI.toast("不能输入emoji表情!");
			return false;
		}
		return true;
	},

	// 获取用户数据
	getUserInfo: function() {
		if(plus.storage.getItem('userInfo')) {
			return JSON.parse(plus.storage.getItem('userInfo'))
		}
		return ''
	},
	// 存储用户数据到本地
	setUserInfo: function(userInfo) {
		plus.storage.setItem('userInfo', JSON.stringify(userInfo));
	},
	//调用相机
	getCamera: function(callBack) {
		var camera = plus.camera.getCamera();
		camera.captureImage(function(path) {
			callBack(path);
		}, function(error) {
			console.log(error.message);
		}, {
			filename: "_doc/camera/",
			index: 1
		})
	},
	//上传图片
	uploadImage: function(path, callBack) {
		var task = plus.uploader.createUpload(IMAGE_UPLOAD_CONFIG, {
				method: "POST"
			},
			function(t, status) {
				if(status == 200) {
					var result = JSON.parse(t.responseText);
					callBack(result);
				} else {
					plus.nativeUI.toast('图片上传失败');
				}
			}
		);
		task.addFile(path, {
			key: "file"
		});
		task.addData("collection", "1");
		task.start();
	},
	/*
	 * 压缩图片
	 * @param src 文件路径
	 * @param 压缩后路径
	 * @quality 图片质量
	 */
	compressImage: function(src, dst, sCallBack, fCallBack, quality) {
		quality = quality || 40;
		plus.zip.compressImage({
			src: src,
			dst: dst,
			overwrite: true,
			quality: quality
		}, function(event) {
			sCallBack && sCallBack(event);
		}, function() {
			fCallBack && fCallBack();
			console.log("压缩失败");
			plus.nativeUI.toast("压缩失败");
		});
	},
}