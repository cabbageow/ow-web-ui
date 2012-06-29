/*页面交互的js*/
//ajax读取json数据
var requestURL = {
	disk_manager:"json/disk_manager.json",
	disk_part_check:"json/disk_part_check.json",
	disk_part_create:"json/disk_part_create.json",
	disk_part_delete:"json/disk_part_delete.json",
	disk_part_format:"json/disk_part_format.json"
};
var resultData={} 
$.get(requestURL.disk_manager,
   function(data){
     eval(data);
	 alert(10);
	 console.log(resultData);
   });
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
