var commonFunc = {
	//okBtn 窗口的调用
	//@param j_btn jqueryUI 的弹窗对象
	//@ param title 需要弹出的显示信息
	//@ param width 弹窗的宽度,
	//@ param height 弹窗的高度 
	btnMess : function (j_btn, title, width, height) {
		j_btn.html('<p class="marginAuto"><strong>' + title + '</strong></p>')
		j_btn.dialog({ //弹出窗口
			autoOpen : false,
			title : title,
			modal : true,
			width : width,
			height : height,
			minWidth : 100,
			minHeight : 100,
			buttons : {
				"确认" : function () {
					$(this).dialog("close");
					wycFun.initFun();
				}
			}
		});
		j_btn.dialog("open");
	}
};
//进度条对象
// @param url ajax的发送地址
//@param sendDatas ajax发送的参数，
//@param txtid 显示文字进度的dom元素的id，
//@loadingCssId 显示颜色进度的css Dom元素的id，
function setLoadRunDiv(url, sendDatas, txtId, loadingCssId) {
	this.url = url; //ajax的url
	this.sendDatas = sendDatas; //发送的数据
	this.txtDom = $("#" + txtId); //显示数值的id
	this.loadingCssDOm = $("#" + loadingCssId); //显示进度宽度的id
	this.timeNum = null; //定时器num
}
setLoadRunDiv.prototype = {
	start : function () {
		var that = this;
		$.get(that.url, that.sendDatas, function (data) {
			var getData = eval(data);
			if (getData.response.result === "ok") {
				getData = getData.response;
				if (getData.data.process <= 100 && getData.data.process >= 0) {
					that.loadingCssDOm.css("width", getData.data.process + '%');
					that.txtDom.text(getData.data.process + '%');
				}
			} else if (getData.data.process >= 100) {
				that.stop();
			}
		}, "json");
		that.timeNum = setTimeout(function () {
				that.start()
			}, 1000);
	},
	stop : function () {
		var that = this;
		clearTimeout(that.timeNum);
	}
}