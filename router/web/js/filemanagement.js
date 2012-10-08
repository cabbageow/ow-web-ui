var fileManageObj = fileManageObj || {};
fileManageObj.file_explorer_url_router = "json/file_explorer-router.json";
fileManageObj.file_explorer_url_disk = "json/file_explorer-disk.json";
fileManageObj.file_explorer_url_delete = "json/file_explorer-delete.json";
fileManageObj.responseData = {}; //保存当前路径下的目录结构
fileManageObj.pathName = []; //保存当前的路径
fileManageObj.pageNum = 1; //保存当前的页码
fileManageObj.navDOM = $("#fileNav");
fileManageObj.tbody_fileData = $("#tbody_fileData");
fileManageObj.paging = $("#filePaging");
//@param path 当前的目录路径
//@param navDOM 显示nav导航的DOM对象
fileManageObj.showThePathNav = function (path, navDOM) {
	var pathArr = path.split("/"),
	html = [];
	pathArr[0] = "/";
	if (path == '/'||fileManageObj.pathName.length==1) {
		html.push('<li class="inline"><b>' + fileManageObj.pathName[0] + '</b></li>');
	} else {	
		for (var i = 0; i < pathArr.length - 2; i++) {
			html.push('<li class="inline"><a href = "#" path="' + pathArr[i] + '" class = "color-blue" index = "' + i + '" > ' + fileManageObj.pathName[i] + '</a>&gt</li>');
		}
		html.push('<li class="inline"><b>' + fileManageObj.pathName[i] + '</b></li>');
	}
	navDOM.innerHTML = html.join('');
};

fileManageObj.showFileData = function (list, jqDOM, color1, color2) {
	//className 用来表示隔行的颜色，typeclass 表示对应的类型的className，mimeType 表示文件类型
	var className = color1,
	typeClass = {
		image : "image",
		video : "video",
		audio : "audio",
		text : "text",
		dir : "dir"
	},
	mimeType = [],
	html = [],
	openValue = "false",
	tempStr = '',tempPath = fileManageObj.responseData.path;
	if(tempPath==='/'){
		tempPath='';
	}
	tempPath = tempPath+'/';
	for (var i = 0; i < list.length; i++) {
		mimeType = [];
		openValue = "false";
		tempStr = '';
		className = (i % 2) > 0 ? color2 : color1;
		html.push('<tr class="tr ' + className + '" title="' + list[i].name + '"><td class="td "><div class="name-file">');
		
		switch (list[i].type) {
		case "file":
			openValue = "true";
			if (list[i]["mime-type"]) {
				mimeType = list[i]["mime-type"].split("/");
				tempStr = '<td class="td"><div class= "dir ' + typeClass[mimeType[0]] + '"></div>' + mimeType[1] + '</td>';
			}
			break;
		case "dir":
			openValue = "false";
			tempStr = '<td class="td"><div class="dir"></div>目录</td>';
			break;
		case "disk":
			openValue = "false";
			tempStr = '<td class="td">磁盘</td>';
			break;
		default:
			openValue = "false";
			tempStr = '<td class="td">' + list[i].type + "</td>";
			break;
		}
		html.push('<a href="' + tempPath + list[i].path + ' " openValue=' + openValue + '>' + list[i].name + '</a></div></td>');
		html.push(tempStr);
		html.push('<td class="td">' + commonFunc.getSize(list[i].size) + '</td><td class="td">' + list[i].time["create"] + '</td>');
		html.push('<td class="td"><input type="checkbox" name="SAMBAshare" value ="SAMBA共享" checked="checked">SAMBA共享</td>'); //共享在这里修改
		html.push('<td class="td"><input type="checkbox" name="DLANshare" value ="DLAN共享" checked="checked">DLAN共享</td>');
		html.push('<td class="td"><button class="line-height16" value="delete" name="delete" path="' + tempPath +  list[i].path + '">删除</button></td></tr>');
	}
	
	jqDOM.html(html.join(''));
}

fileManageObj.getJSON = function (url, keyValue, pageNum, quantity) {
	$.get(url, keyValue, function (json) {
		if (json.response.result === "ok") {
			fileManageObj.responseData = json.response.data;
			fileManageObj.pathName.push(fileManageObj.responseData["name"]);
			//console.log(fileManageObj.responseData);
			fileManageObj.showThePathNav(fileManageObj.responseData["path"], fileManageObj.navDOM[0]);
			//turnPage对象，见common.js
			fileManageObj.turnPage = new TurnPage(fileManageObj.responseData["list"], pageNum, quantity);
			//fileManageObj.turnPage.getData();
			if (fileManageObj.sortIndex) {
				fileManageObj.sortType(fileManageObj.sortIndex);
			} else {
				fileManageObj.buildPaging(fileManageObj.turnPage.pageNum, fileManageObj.paging);
			}
			console.log(fileManageObj.sortIndex);
		}
		
	}, "json");
};

//打开目录，或者打开文件
//@param dom为事件的节点
fileManageObj.openFile = function (dom) {
	var openValue = dom.getAttribute('openValue'),
	href = dom.getAttribute('href');
	switch (openValue) {
	case 'false':
		fileManageObj.getJSON(fileManageObj.file_explorer_url_disk, {
			path : href
		});
		break;
	case 'true':
		window.open(location.href + fileManageObj.file_explorer_url_disk + '?path=' + encodeURIComponent(href));
		break;
	default:
		break;
	}
	
};
//@param num 页码
//@param jqdom，显示页码html的节点
fileManageObj.buildPaging = function (num, jqDOM) {
	if (typeof num === 'number') {
		fileManageObj.turnPage.turnPagebyNum(num);
		fileManageObj.showFileData(fileManageObj.turnPage.pageData, fileManageObj.tbody_fileData, 'white', 'block');
		var html = [];
		if (num == 1) {
			html.push('<span class="s1 s3">上一页</span>');
		} else {
			
			html.push('<a href="' + (num - 1) + '"  class="s1">上一页</a>');
		}
		if (fileManageObj.turnPage.pageLength <= 9) { //页码<=9的情况
			for (var i = 1; i <= fileManageObj.turnPage.pageLength; i++) {
				if (i == num) {
					html.push('<span class="s1">' + i + '</span>');
				} else {
					html.push('<a href="' + i + '" >' + i + '</a>');
				}
			}
		} else { //页码大于9的情况
			if (num < 3) {
				for (var i = 1; i <= 6; i++) {
					if (i == num) {
						html.push('<span class="s1">' + i + '</span>');
					} else {
						html.push('<a href="' + i + '">' + i + '</a>');
					}
				}
			} else {
				html.push('<a href="1" >1</a> <a href="2"  >2</a> <a href="3"  >3</a>...');
				if (num + 3 >= fileManageObj.turnPage.pageLength) {
					for (var i = fileManageObj.turnPage.pageLength - 5; i <= fileManageObj.turnPage.pageLength; i++) {
						if (i == num) {
							html.push('<span class="s1">' + i + '</span>');
						} else {
							html.push('<a href="' + i + '">' + i + '</a>');
						}
					}
				} else {
					html.push('<a href="' + (num - 1) + '">' + (num - 1) + '</a> <a href="' + num + '">' + num + '</a> <a href="' + (num + 1) + '">' + (num + 1) + '</a>...');
					html.push('<a href="' + (fileManageObj.turnPage.pageLength - 2) + '">' + (fileManageObj.turnPage.pageLength - 2) + '</a> <a href="' + (fileManageObj.turnPage.pageLength - 1) + '>' + (fileManageObj.turnPage.pageLength - 1) + '</a> <a href="' + (fileManageObj.turnPage.pageLength) + '">' + (fileManageObj.turnPage.pageLength) + '</a>');
				}
			}
		}
		if (num == fileManageObj.turnPage.pageLength) {
			html.push('<span class="s1 s3">下一页</span>');
		} else {
			html.push('<a href="' + (num + 1) + '"  class="s1">下一页</a>');
		}
		html.push('<div class="clear"></div>');
		jqDOM.html(html.join(''));
	}
};
fileManageObj.deleteFile = function (paths) {
	$.getJSON(fileManageObj.file_explorer_url_delete, {
		path : paths
	}, function (json) {
		if (json.response.result === "ok") {
			fileManageObj.getJSON(fileManageObj.file_explorer_url_disk, {path : fileManageObj.responseData.path},fileManageObj.turnPage.pageNum,fileManageObj.turnPage.num);	
		}
	});
}

//记录当前的排序状态
fileManageObj.sortIndex = '';
fileManageObj.sort = {
	sortByUTF : function (a, b) { //根据utf-8码排序
		if (!a.name) {
			a.name = "   ";
		}
		if (!b.name) {
			b.name = "   ";
		}
		return a.name.charCodeAt(0) - b.name.charCodeAt(0);
	},
	sortBySize : function (a, b) {
		return a.size - b.size;
	},
	sortByTime : function (a, b) {
		if (!a.time.second) {
			a.time.second = 0;
		}
		if (!b.time.second) {
			b.time.second = 0;
		}
		return a.time.second - b.time.second;
	}
}

fileManageObj.sortType = function (type) {
	switch (type) {
	case "name":
		fileManageObj.turnPage.list.sort(fileManageObj.sort.sortByUTF);
		fileManageObj.buildPaging(fileManageObj.turnPage.pageNum, fileManageObj.paging);
		fileManageObj.sortIndex = 'name';
		break;
	case "size":
		fileManageObj.turnPage.list.sort(fileManageObj.sort.sortBySize);
		fileManageObj.buildPaging(fileManageObj.turnPage.pageNum, fileManageObj.paging);
		fileManageObj.sortIndex = 'size';
		break;
	case "time":
		fileManageObj.turnPage.list.sort(fileManageObj.sort.sortByTime);
		fileManageObj.buildPaging(fileManageObj.turnPage.pageNum, fileManageObj.paging);
		fileManageObj.sortIndex = 'time';
		break;
	default:
		break;
	}
}
fileManageObj.deleteBtn = function (dom) {
	var path = dom.getAttribute("path"),
	html = '<p><span class="ui-icon ui-icon-alert" style="float:left; margin:0 7px 20px 0;"></span>确认删除吗？</p>';
	
	commonFunc.commonConfirm(commonFunc.confirm, html, "删除文件", 300, 150, function () {
	fileManageObj.deleteFile(path);
	}, null);
}
$(document).ready(function () {
	fileManageObj.getJSON(fileManageObj.file_explorer_url_router, {
		path : "/"
	});
});
$("#fileData_table").bind("click", function (event) {
	//var event = e||window.event;
	var target = event.target //||event.srcElement;
		//这里写事件托管的处理
		switch (target.tagName) {
		case "TH": //表头的处理，主要是排序
			fileManageObj.sortType(target.getAttribute("sort"));
			break;
		case 'A': //链接的处理
			fileManageObj.openFile(target);
			break;
		case "BUTTON": //删除按钮的处理
			fileManageObj.deleteBtn(target);
			break;
		}
	event.stopPropagation();
	event.preventDefault();
	return false;
});
fileManageObj.paging.bind("click", function (event) {
	var target = event.target;
	if (target.tagName === 'A') {
		var num = target.href.split('/');
		num = Number(num[num.length - 1])
		fileManageObj.buildPaging(num, fileManageObj.paging);
	}
	event.stopPropagation();
	event.preventDefault();
	return false;
});
fileManageObj.navDOM.bind("click",function(event){
	var target = event.target,paths='',nameIndex = 0;
	if(target.tagName==='A'){
		paths=target.getAttribute('path');
		nameIndex= target.getAttribute('index');
		fileManageObj.pathName.length=nameIndex;
		fileManageObj.getJSON(fileManageObj.file_explorer_url_disk,{path:paths});
	}
	event.stopPropagation();
	event.preventDefault();
	return false;
});