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
function  setLoadRunDiv(url,sendDatas,txtid,loadingCssId){
	this.url =url;//ajax的url
	this.sendDatas = sendDatas;//发送的数据
	this.txtDom = $("#"+txtid);//显示数值的id
	this.loadingCssDOm = $("#"+loadingCssId);//显示进度宽度的id
	this.timeNum = null;//定时器num
}
setLoadRunDiv.prototype = {
	start:function(){
		var that = this;
		$.get(that.url,that.sendDatas,function(data){
			var getData = eval(data);
			if(getData.response.result ==="ok"){
				getData = getData.response;
				if (getData.data.process <= 100 && getData.data.process >= 0) {
					that.loadingCssDOm.css("width", getData.data.process + '%');
					that.txtDom.text(getData.data.process+'%');
				}
			}else if(getData.data.process >= 100){
			that.stop();
			}
		},"json");
		that.timeNum = setTimeout(function(){that.start()},1000);
		},
	stop:function(){
			var that = this;
			clearTimeout(that.timeNum);
		}		
	}
/*function (data) {
				var getData = eval(data);
					if(getData.response.result ==="ok"){
					getData = getData.response.data;
				if (getData.data.process <= 100 && getData.data.process >= 0) {
					checkLoading.css('width', getData.data.process + '%');
					$("#j_checkResult").html(getData.data.process+'%');
					wycVal.timeNum = setTimeout(timeSet, 1000);
				} else if (getData.data.process == 100) {
					clearTimeout(wycVal.timeNum);
					//wycFun.initFun();
					$("#diskCheckMess").dialog("close");
				}
				}else{
				alert(getData.response.data);
				
				}			
				
			}, "json");*/