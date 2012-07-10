var commonFunc = {
	/*changeTheHrefByHash:function(){
		//var href = top.location.hash.substring(1);
		if(href !==top.name){
		var href = top.name;
		console.log(href);
		var regHref = /\.html$/;//一个简单的匹配
		if(regHref.test(href)){
			window.location.href = href;
		}
	}
	}*/
	//okBtn 窗口的调用
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
function  setLoadRunDiv(url,datas,txtid,loadingCssId){
	this.url =url;
	this.datas = datas;
	this.txtDom = $("#'+txtid);
	this.loadingCssDOm = $("#"+loadingCssId);
	this.timeNum = null;
}
setLoadRunDiv.prototype = {
	
}
if (wycVal.clickNum >= 0) {
		var checkLoading = $('#checkLoading');
		checkLoading.css('width', "1%");
		function timeSet() {
			var dataIndex = $(".j_diskOperate")[wycVal.clickNum].getAttribute('diskdata');
			dataIndex = eval(dataIndex);
			$.get(requestURL.disk_part_check, {
				dev : dataIndex.dev,
				num : dataIndex.num
			},
				function (data) {
				var getData = eval(data);
				if (getData.result.process <= 100 && getData.result.process >= 0) {
					checkLoading.css('width', getData.result.process + '%');
					$("#j_checkResult").html(getData.result.process+'%');
					wycVal.timeNum = setTimeout(timeSet, 1000);
				} else if (getData.result.process == 100) {
					clearTimeout(wycVal.timeNum);
					//wycFun.initFun();
					$("#diskCheckMess").dialog("close");
				}
			}, "json");
		}
		timeSet();
		$("#diskCheckMess").dialog("open");
	}
