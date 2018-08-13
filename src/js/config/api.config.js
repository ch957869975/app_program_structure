/*
 * 接口配置文档
 * 王有锴
 */

/*主机地址 */

window.HOST_CONFIG ='http://218.2.170.38:8090/tzxx/'; //预生产

/* 文件服务器 */
window.FILE_SERVER ='';//预生产


/*文件操作 */
window.FILE_HOST_CONFIG = window.FILE_SERVER + 'getFile/'; //获取文件
window.UPLOADIMGURL = window.FILE_SERVER + 'uploadImage'; //图片上传
window.UPLOADVOICEURL = window.FILE_SERVER + 'uploadVideoVoice'; //语音上传	
window.FILE_HOST_CONFIG_VIEW = window.FILE_SERVER + "getFileView/"; //在线预览

/*图片服务器 */
//window.IMAGE_SERVER = 'http://192.168.241.48:9000/'; //测试
window.IMAGE_SERVER = 'http://static.huhuschool.com:9000/'; //外网

//图片操作
window.IMAGE_GET_CONFIG = window.IMAGE_SERVER + 'get-image/'; //获取图片
window.IMAGE_UPLOAD_CONFIG = window.IMAGE_SERVER + 'image/add/'; //上传图片

/* 文件转换服务器 */
window.FILE_TRANSFORM_SERVER = 'http://118.178.123.53/op/embed.aspx?src=';

/* 接口地址 */
window.API_CONFIG = {
	// 登录
	login: window.HOST_CONFIG + 'mobile/login/userLogin',
};