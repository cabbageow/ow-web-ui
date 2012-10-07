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
					//callbackFn();
				}
			}
		});
		j_btn.dialog("open");
	},
	//confirm窗口的调用
	//@param jq_Confirm  confirm-dialog对象，
	//@param title 弹窗的标题
	//@param width 弹窗宽度
	//@param height 弹窗的高度
	//@param html 弹窗显示信息的html字符串
	//@param ok_callback 点击ok按钮后执行的函数
	//@param Esc_callback 点击取消按钮执行的函数
	commonConfirm : function (jq_Confirm, html, title, width, height, ok_callback, Esc_callback) {
		jq_Confirm.html(html);
		jq_Confirm.dialog({
			autoOpen : true,
			modal : true,
			title : title,
			width : width || 300,
			height : height || auto,
			buttons : {
				"确认" : function () {
					if (typeof ok_callback === 'function') {
						ok_callback();
					}
					$(this).dialog("close");
					$(this).dialog("destroy");
				},
				"取消" : function () {
					if (typeof Esc_callback === "function") {
						Esc_callback();
					}
					$(this).dialog("close");
					$(this).dialog("destroy");
				}
				
			}
		});
	},
	//对象深度复制
	//@ param obj 需要复制的对象
	//返回新对象
	deepClone : function (obj) {
		var temp = function () {};
		temp.prototype = obj;
		var tempObj = new temp();
		for (var o in tempObj) {
			if (typeof tempObj[o] == "object") {
				tempObj[o] = commonFunc.deepClone(tempObj[o]);
			}
		}
		return tempObj;
	},
	getSize : function (num) {
		if (num >= 1024 * 1024 * 1024) {
			return (num / (1024 * 1024 * 1024)).toFixed(3) + 'G';
		} else if (num >= 1024 * 1024) {
			return (num / (1024 * 1024)).toFixed(3) + 'M';
		} else if (num >= 1024) {
			return (num / 1024).toFixed(3) + 'K';
		} else {
			return num + '字节';
		}
	},
	confirm : $('#common-confirm')
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

//翻页对象
//@param list 数据源
//@param num 每页的数据量
function TurnPage(list, pageNum, num) {
	this.list = commonFunc.deepClone(list); //拷贝对象..这里是否需要深度拷贝？
	this.pageNum = pageNum || 1;
	this.num = num || 25;
	this.listLength = this.list.length;
	this.pageLength = Math.ceil(this.listLength / this.num);
	this.pageData = null;
	this.pageNum = Math.min(this.pageNum, this.pageLength);
}
TurnPage.prototype = {
	getData : function () {
		var tempArr = [];
		for (var i = 0; i < this.num && i < this.listLength; i++) {
			tempArr.push(this.list[i + (this.pageNum - 1) * this.num]);
		}
		this.pageData = commonFunc.deepClone(tempArr);
	},
	setPageNum : function (pageNum) {//取num， pageLength的最小值
		this.pageNum = Math.min(num, this.pageLength);
	},
	turnPagebyNum : function (num) {
		this.pageNum = num;
		this.getData();
	}
}
TurnPage.prototype.constructor = TurnPage;
