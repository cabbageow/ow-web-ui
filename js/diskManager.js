/*页面交互的js*/
//ajax读取json数据
var requestURL = {
	disk_manager : "json/disk_manager.json",
	disk_part_check : "json/disk_part_check.json",
	disk_part_create : "json/disk_part_create.json",
	disk_part_delete : "json/disk_part_delete.json",
	disk_part_format : "json/disk_part_format.json"
};
var resultData = {}, wycVal = {
	timeNum1 : null, //定时器id号
	clickNum : null //判断磁盘点击的序号
};
var wycFun = {
	initFun : function () {
		resultData = {};
		wycVal.timeNum1 = null;
		wycVal.clickNum = null;
		$.get(requestURL.disk_manager,
			function (data) {
			resultData = eval(data);
			var diskDom = $('#diskList'),
			htmlDiv = '';
			for (var i = 0; i < resultData.length; i++) {
				htmlDiv += '<div class="j_disk clearfix disk" clickNum = "' + i + '">';
				var htmlDiv_temp = wycFun.fillColorHtmlByData(resultData[i], i);
				htmlDiv += wycFun.initFillDiskInfor(htmlDiv_temp, resultData[i]);
				htmlDiv += '</div>';
			}
			diskDom.html(htmlDiv);
		}, "json");
	},
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
	fillColorHtmlByData : function (data, Num) { //填充图像颜色,硬盘数据对象，对应的dom元素，硬盘数据对象的索引号
		var Class,
		percent,
		percentExtened,
		typeName,
		boolExtened = 0,
		html_primary = [],
		html_extened = [];
		var diskSumNum = data.range['end'];
		var diskExtenedSum = data.extened_range_sum;
		percentExtened = this.getPercent(diskSumNum, diskExtenedSum) - 1;
		
		for (var k = 0; k < data.parts.length; k++) {
			switch (data.parts[k].type) {
			case 'extened': //逻辑分区
				if (boolExtened == 0) {
					boolExtened = 1;
					html_extened.push('<div class="box02_1 green w500" style="width:' + percentExtened + '%">');
				}
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
					//console.log(data.parts[k].parts[i].range['end']);
					percent = this.getPercent(diskExtenedSum, data.parts[k].parts[i].range['end'] - data.parts[k].parts[i].range['start'] + 1);
					percent = percent - 1; //少1像素的区域留给边框
					typeName = data.parts[k].parts[i].type_name;
					html_extened.push('<div class="box02_1 w150 h30 box02_2 ' + Class + '"style="width:' + percent + '%"dataindex="resultData[' + Num + '].parts[' + k + '].parts[' + i + ']" boolClick="1">');
					html_extened.push(typeName + data.parts[k].parts[i].num + '</div>');
				}
				break;
			case 'primary': // 主分区
				percent = this.getPercent(diskSumNum, data.parts[k].range['end'] - data.parts[k].range['start'] + 1);
				percent = percent - 1;
				html_primary.push('<div class="box02_1 red j_diskPart" style="width:' + percent + '%"dataindex =resultData[' + Num + '].parts[' + k + '] boolClick="1">' + data.parts[k].type_name + data.parts[k].num + '</div>');
				break;
			default:
				break;
			}
		}
		if (boolExtened == 1) {
			html_extened.push("</div>");
		}
		return html_primary.join('') + html_extened.join('');
	},
	fillDataTotable : function (data, dom) {
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
		dom.html(html_table.join(''));
	},
	initFillDiskInfor : function (colorHtml, data) { //初始化填充磁盘信息模块html
		var html = [];
		html.push('<h2 class="title01 none ">' + data._comment + '<span class="box01 font14">主分区<span class="redBorder rect"></span >');
		html.push('扩展分区<span class="greenBorder rect"></span>逻辑分区<span class="yellowBorder rect"></span></span></h2><hr/>');
		html.push('<div class="box02 j_diskinfo">' + colorHtml + '</div>');
		html.push('<div class="diskinfo j_diskFormat" style="display:none">');
		html.push('<h3 class="title03 none ">详情:<span class="j_titleInfo"></span><hr/></h3>');
		html.push('<div class="diskinfo_box j_diskInfoTable"></div>');
		html.push('<h3 class="title03 none">操作:<hr/></h3>');
		html.push('<div class="itembtn j_diskOperate" style="display:none">');
		html.push('<button class="btn1 ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only j_diskCheckBtn" role="button" aria-disabled="false"><span class="ui-button-text">磁盘检查</span></button>');
		html.push('<button class="btn2 btn1 ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only j_diskFormatbtn" role="button" aria-disabled="false"><span class="ui-button-text">格式化</span></button>');
		html.push('<button class="btn3 btn1 ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only j_deleteBtn" role="button" aria-disabled="false"><span class="ui-button-text">删除</span></button>');
		html.push('</div><div class="itembtn j_diskempty"  style="display:none">');
		html.push('<button class=" btn1 ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only j_createPartBtn" role="button" aria-disabled="false"><span class="ui-button-text">创建分区</span></button>');
		html.push('</div><span class="ui-icon ui-icon-closethick myspanclose">close</span></div>');
		return html.join('');
	},
	/*点击确认按钮弹出操作完成的窗口的方法,参数分别为：ajax返回的数据,应该返回的正确的数据,
	对应的数据弹窗的标题[righttitle，othertitle]第一个对应正确的数据应该显示的标题，第二个非正确数据应该显示的标题,窗口的宽度和高度*/
	affirmBtnEnter : function (datas, rightData, titles, width, height) {
		var getData = eval(datas);
		var okBtn = $("#okbtn");
		switch (getData.result.result) {
		case 'ok':
			this.btnMess(okBtn, titles[0], width, height);
			break;
		default:
			this.btnMess(okBtn, titles[1], width, height);
			break;
		}
	},
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
	},
	regDiskNum : function (str) {
		var reg = /^[1-9]+[0-9]*$/;
		return reg.test(str);
	}
	
} //通用函数完毕
$("#dialog-delete").dialog({
	autoOpen : false,
	modal : true,
	title : "确认删除？",
	buttons : {
		"确认" : function () {
			if (wycVal.clickNum >= 0) {
				var dataIndex = $(".j_diskOperate")[wycVal.clickNum].getAttribute('diskdata');
				//console.log($(".j_diskOperate")[wycVal.clickNum]);
				dataIndex = eval(dataIndex);
				$.get(requestURL.disk_part_delete, {
					dev : dataIndex.dev,
					num : dataIndex.num
				}, function (data) {
					wycFun.affirmBtnEnter(data, 'ok', ['删除成功', '删除失败'], 180, 132);
				}, "json");
			}
			$(this).dialog("close");
		}
	}
});
$("#diskCheckMess").dialog({
	autoOpen : false,
	modal : true,
	title : "检查磁盘",
	buttons : {
		"取消" : function () {
			clearTimeout(wycVal.timeNum);
			$(this).dialog("close");
			
		}
	},
	close : function () {
		clearTimeout(wycVal.timeNum);
	}
});
$("#diskFarmating").dialog({
	autoOpen : false,
	title : "格式化:",
	modal : true,
	buttons : {
		"确认" : function () {
			if (wycVal.clickNum >= 0) {
				var dataIndex = $(".j_diskOperate")[wycVal.clickNum].getAttribute('diskdata');
				var formatType = $($('.j_diskFarmating')[wycVal.clickNum]).find("option:selected").val();
				dataIndex = eval(dataIndex);
				$.get(requestURL.disk_part_format, {
					dev : dataIndex.dev,
					num : dataIndex.num,
					fstype : formatType
				},
					function (data) {
					wycFun.affirmBtnEnter(data, 'ok', ['格式化成功', '格式化失败'], 180, 132);
				}, "json");
			}
			$(this).dialog("close");
		},
		"取消" : function () {
			$(this).dialog("close");
		}
	}
});

$("#diskPartCreate").dialog({
	autoOpen : false,
	title : "创建分区:",
	modal : true,
	buttons : {
		"确认" : function () {
			if (wycVal.clickNum >= 0) {
				var formatType = $($("#diskPartCreate")[wycVal.clickNum]).find("option:selected").val();
				var diskSize = $(this).find("input").val();
				if (wycFun.regDiskNum(diskSize)) {
					var dataIndex = $(".j_diskempty")[wycVal.clickNum].getAttribute('diskdata');
					dataIndex = eval(dataIndex);
					$.get(requestURL.disk_part_create, {
						dev : dataIndex.dev,
						num : dataIndex.num,
						fstype : formatType,
						size : diskSize
					},
						function (data) {
						wycFun.affirmBtnEnter(data, 'ok', ['创建成功', '创建失败'], 180, 132);
					}, "json");
					$(this).dialog("close");
				} else {
					$(this).find(".j_input_num_error").show();
					$(this).find("input").val('');
				}
			}
			
		},
		"取消" : function () {
			$(this).dialog("close");
		}
	},
	close : function () {
		$(this).find(".j_input_num_error").hide();
		$(this).find("input").val('');
	}
});

$(".j_diskFormatbtn").live("click", function () {
	$("#diskFarmating").dialog("open");
});
$(".j_deleteBtn").live("click", function () {
	$("#dialog-delete").dialog("open");
});
$(".j_diskCheckBtn").live("click", function () { //检查磁盘的操作
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
});
$(".j_createPartBtn").live("click", function () {
	//创建分区按钮
	$("#diskPartCreate").dialog("open");
});
//下面写点击事件的处理
$('.myspanclose').live('click', function () { //为自己写的关闭的按钮的关闭事件
	$(this).parent().hide();
});

$('.j_disk').live('click', function (event) {
	
	var e = event || window.event;
	var target = event.target || event.srcElement;
	var dataindex_str = target.getAttribute('dataindex');
	if (dataindex_str) {
		$(".j_diskFormat").hide();
		wycVal.clickNum = this.getAttribute('clickNum');
		var dataindex_obj = eval(dataindex_str);
		var temp = $(this).find(".j_diskInfoTable");
		wycFun.fillDataTotable(dataindex_obj, temp);
		
		$(this).find(".j_titleInfo").html(dataindex_obj.type_name + dataindex_obj.num);
		$(this).find(".j_diskFormat").show();
		//console.log($(this).find(".j_diskInfoTable"));
		switch (dataindex_obj.type) {
		case 'primary':
		case 'logical':
			$(this).find(".j_diskOperate").show().attr('diskData', dataindex_str);
			$(this).find(".j_diskempty").hide();
			break;
		case 'empty':
			$(this).find('.j_diskempty').show().attr('diskData', dataindex_str);
			$(this).find(".j_diskOperate").hide();
			break;
		default:
			break;
		}
	}
});
$(".j_input_num").bind("focus", function () {
	$(".j_input_num_error").hide();
});

$(document).ready(function () {
	$('#tabs').tabs();
	wycFun.initFun();
	
});
