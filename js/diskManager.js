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
	wycFun.fillColorHtmlByData(resultData[0],$("#diskinfo01")[0],0);
});
var wycFun = {
	getPercent : function (sum, num) { //获取百分比的函数
			return (Math.round((num / sum) * 100));
	},
	/*getExtenedPercent:function(data){//获取本次盘有多少逻辑分区
		var num = 0;
		for(var k = 0; k <data.parts.length; k++){
			if(data.parts[k].type=='extened'){
				num +=data.parts[k].range['end']-data.parts[k].range['start'];
			}
		}
		return num;
	}*/
	fillColorHtmlByData : function (data, Dom, Num) { //填充图像颜色,硬盘数据对象，对应的dom元素，硬盘数据对象的索引号
		var Class,
		percent,
		typeName,
		html_primary = [],
		html_extened = [];
		var diskSumNum = data.range['end'];
		var diskExtenedSum = data.extened_range_sum;
		percent = this.getPercent(diskSumNum, diskExtenedSum) -1;
		html_extened.push('<div class="box02_1 green w500" style="width:' + percent + '%">');
			for (var k = 0; k < data.parts.length; k++) {
				switch (data.parts[k].type) {
				case 'extened': //逻辑分区
					for (var i = 0; i < data.parts[k].parts.length; i++) {
						switch (data.parts[k].parts[i].type) {
						case "logical": //逻辑分区
							Class = "yellow j_diskPart";
							break;
						case "empty":
							Class = "block j_diskSpace";
							break;
						default:
							break;
						}
						console.log(data.parts[k].parts[i].range['end']);
						percent = this.getPercent(diskExtenedSum, data.parts[k].parts[i].range['end'] - data.parts[k].parts[i].range['start'] + 1);
						percent = percent - 1; //少1像素的区域留给边框
						typeName = data.parts[k].parts[i].type_name;
						html_extened.push('<div class="box02_1 w150 h30 box02_2 ' + Class + '"style="width:' + percent + '%"dataindex=resultData['+Num+'].parts[' + k + '].parts[' + i + '] boolClick="1">');
						html_extened.push(typeName + data.parts[k].parts[i].num + '</div>');
					}
					break;
				case 'primary': // 主分区
					percent = this.getPercent(diskSumNum, data.parts[k].range['end'] - data.parts[k].range['start'] + 1);
					percent = percent - 1;
					html_primary.push('<div class="box02_1 red j_diskPart" style="width:' + percent + '%"dataindex =resultData['+Num+'].parts[' + k + '] boolClick="1">' + data.parts[k].type_name + data.parts[k].num + '</div>');
					break;
				default:
					break;
				}
			}
				html_extened.push("</div>");
				Dom.innerHTML = html_primary.join('') + html_extened.join('');
			},
	fillDataTotable:function(data,dom){
		var html_table = ['<table class="table1"><tbody><tr><td class="td1">分区类型:</td><td>'];
		html_table.push(data.type_name);
		html_table.push('</td><td class="td1">设备:</td><td>');
		html_table.push(data.dev);
		html_table.push('</td></tr><tr><td class="td1">文件系统:</td><td>');
		html_table.push(data.fstype);
		html_table.push('</td><td class="td1">挂载点:</td><td>');
		html_table.push(data.mountpoint);
		html_table.push('</td></tr><tr><td class="td1">容量:</td><td>');
		html_table.push(data.size.total);
		html_table.push('</td><td class="td1">剩余空间:</td><td>');
		html_table.push(data.size.left)
		html_table.push('</td></tr></tbody></table>');
		dom.innerHTML = html_table.join('');
	},
	
}//读取函数完毕		
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
//下面写点击事件的处理
$('.myspanclose').bind('click',function(){//为自己写的关闭的按钮的关闭事件
$(this).parent().hide();
});
$('#diskinfo01').bind('click',function(event){	
	e = event || window.event;
	var target = event.target || event.srcElement;
	var dataindex_str = target.getAttribute('dataindex');
	if (dataindex_str) {

		var dataindex_obj = eval(dataindex_str);
		//console.log(dataindex.dev);
		wycFun.fillDataTotable(dataindex_obj, $("#diskInfoTable")[0]);
		$("#diskFormat").show();
		switch (dataindex_obj.type) {
		case 'primary':
		case 'logical':
			$("#diskOperate").show().attr('diskData',dataindex_str);
			$('#diskempty').hide();
			break;
		case 'empty':
		$('#diskempty').show().attr('diskData',dataindex_str);
		$("#diskOperate").hide();
			break;
		default:
			break;
		}
	}
});
//下面写各个按钮的点击事件



























