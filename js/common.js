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
