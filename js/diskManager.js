/*页面交互的js*/
//ajax读取json数据
var requestURL = {
	disk_manager : "json/disk_manager.json",
	disk_part_check : "json/disk_part_check.json",
	disk_part_create : "json/disk_part_create.json",
	disk_part_delete : "json/disk_part_delete.json",
	disk_part_format : "json/disk_part_format.json"
};
var resultData = {}
$.get(requestURL.disk_manager,
	function (data) {
	resultData = eval(data);
	//console.log(resultData);
	wycFun.fillColorHtmlByData(resultData,$("#diskinfo01")[0]);
});
var wycFun = {
	getPercent : function (sum, num) { //获取百分比的函数
			return (Math.round((num / sum) * 100));
	},
	fillColorHtmlByData : function (data, Dom) {//填充图像颜色
		var Class,percent,typeName,html = [];
		percent = this.getPercent(data[0].range['end'],data[0].parts[0].range['end']);
		percent = percent -1;//少1像素的区域留给边框
		html.push('<div class="box02_1 red j_diskPart" style="width:' + percent + '%"dataindex =resultData[0].parts[0] boolClick="true">' + data[0].parts[0].type_name+data[0].parts[0].num + '</div>');
		//percent = percent-1;
		var othersDisk = data[0].range['end'] - data[0].parts[0].range['end'];
		html.push('<div class="box02_1 green w500" style="width:' + percent + '%">');
		for (var i = 0; i < data[0].parts[1].parts.length; i++) {
			switch (data[0].parts[1].parts[i].type) {
			case "logical": //逻辑分区
				Class = "yellow j_diskPart";
				break;
			case "empty":
				Class = "block j_diskSpace";
				break;
			default:
				break;
			}
			console.log(data[0].parts[1].parts[i].range['end']);
			percent = this.getPercent(othersDisk,data[0].parts[1].parts[i].range['end']- data[0].parts[1].parts[i].range['start']+1);
			percent = percent-1;//少1像素的区域留给边框
			typeName = data[0].parts[1].parts[i].type_name;
			html.push('<div class="box02_1 w150 h30 box02_2 ' + Class + '"style="width:' + percent + '%"dataindex=resultData[0].parts[1].parts['+i+'] boolClick="true">');
			html.push(typeName + data[0].parts[1].parts[i].num+'</div>');
		}
		html.push("</div>");
		Dom.innerHTML = html.join('');
	}
}
/*function fillHtmlByData(data, Dom) {
	var html = [],Class,percent,typeName;
	html.push('<div class="box02_1 red j_diskPart" style="width:' + data[0].parts[0].range_percent + '">' + data[0].parts[0]._comment_1 + '</div>');
	html.push('<div class="box02_1 green w500" style="width:' + data[0].parts[1].range_percent + '">');
	for (var i = 0; i < data[0].parts[1].parts.length; i++) {
		switch(data[0].parts[1].parts[i].type){
			case "logical"://逻辑分区
				Class ="yellow j_diskPart";
			break;
			case "empty":
			Class ="block j_diskSpace";
			break;
			default:
			break;
		}
		percent = data[0].parts[1].parts[i].range_percent;
		typeName = data[0].parts[1].parts[i].type_name;
		html.push('<div class="box02_1 w150 h30 box02_2 '+Class+'"style="width:'+percent+'">');
		html.push(typeName+'</div>');	
	}
	html.push("</div>");
	Dom.innerHTML = html.join('');
	console.log(html.join(''));
	console.log(Dom.innerHTML);
}*/
$("#dialog-message" ).dialog({
			autoOpen:false,
			modal: true,
			title:"确认删除？",
			buttons: {
				"确认":function() {
					$( this ).dialog( "close" );
					alert("删除成功");
				}
			},
		});
$( "#diskCheckMess" ).dialog({
			autoOpen:false,
			modal: true,
			title:"检查磁盘",
			buttons: {
				"取消": function() {
					$( this ).dialog( "close" );
					alert("取消成功");
				}
			},
		});	
$("#diskFarmating").dialog({
	autoOpen:false,
	title:"格式化:",
	modal:true,
	buttons:{
	"确认":function(){
		$(this).dialog("close");
		alert("格式化成功");
	},
	"取消":function(){
	$(this).dialog("close");
	}
}
});
$("#diskFormatbtn").bind("click",function(){
	$("#diskFarmating").dialog("open");
});
$("#deleteBtn").bind("click",function(){
	$("#dialog-message" ).dialog("open");
	});
$("#diskCheckBtn").bind("click",function(){
	$( "#diskCheckMess" ).dialog("open");
});
$(".j_diskSpace").toggle(function(){
	$("#diskNone").show();	
},function(){
	$("#diskNone").hide();
});
$(".j_diskPart").toggle(function(){
	$("#diskFormat").show();
	
},function(){$("#diskFormat").hide();}
);
