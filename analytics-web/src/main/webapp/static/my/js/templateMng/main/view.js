define(function(require, exports, module) {
	var model = require("./model");
	var utils = require("utils");
	var getCycle = function(name){
		 var data;
			if(name==1){
     		data="一次性填报";
     	} else if(name==2){
     		data="年报";
     	} else if(name==3){
     		data="半年报";
     	} else if(name==4){
     		data="季报";
     	} else if(name==5){
     		data="月报";
     	} else if(name==6){
     		data="旬报";
     	} else if(name==7){
     		data="周报";
     	} else {
     		data="无";
     	}
			return data;
	};
	var getSumType = function(data){
		if(data==1){
			return "按行汇总";
		} else if(data==2){
			return "按页汇总";
		}else{
			return "无";
		}
	};
	var getTemplateState = function(data){
		if(data==1){
    		return "未提交";
    	}else if(data==10){
    		return "未提交";
    	}else if(data==2){
    		return "部门审核";
    	} else if(data==3){
    		return "统计组审核";
    	} else if(data==4){
    		return "负责人审核";
    	}else if(data==9){
    		return "模板发布";
    	} else if(data==5){
//    		return "已发布";
    		return "报表收集（已发布）";
    	} else if(data==6){
    		return "已完成";
    	} else if(data==7){
    		return "暂停执行";
    	}else if(data==8){
    		return "已退回";
    	} else {
    		return "无";
    	} 
	};
	var view = Backbone.View.extend({
		el: "div.ajax-content",
		initialize:function(){
			this.model=new model();
		},
		events:{
			"click button[role='adjust']":"adjust",
			"click button[role='detail']":"detail",
			"click #btn-search":"search",
			"click button[role='btn-adjust']":"updateExcute",
			"click button[role='download']":"download",
			"click button[role='create']":"templateCreate",
			"click button[role='edit']":"templateEdit",
			"click .close,#btn-concel-adjust,#btn-concel-detail" : "reflashTable"
		},
		render:function(){
			var viewSelf = this;
			$.ajax({
				type : "GET",
				url : $$ctx + "/templateMng/getRoleId",
				data : null,
				success : function(result){
					var id = result.split(",");
					for(var i=0;i<id.length;i++){
						if(id[i]-0 ==391){//判断角色是否显示新增按钮
							$("#btn-create").css("display", "block");
						}
					}
					viewSelf.id=id;
				}
			});
			this.initDataTables();
		},
		reflashTable : function(e) {
			var iCurrentPage = this.dt.fnSettings()._iDisplayStart;
		    var oSettings = this.dt.fnSettings();
		    oSettings._iDisplayStart = iCurrentPage;
		    this.dt.fnDraw(oSettings);
		},
		templateCreate: function() {
			var viewSelf = this;
			var self = $(this);
			window.location.href = $$ctx + "/main#templateMng?type=templateCreate";
		},
		templateEdit: function(e) {
			var viewSelf = this;
			var self = $(this);
			window.location.href = $$ctx + "/main#templateMng/templateEdit/"+e.currentTarget.value+"?time="+new Date().getTime();
		},
		download:function(){
			var fileName = $("#path").attr("name");;
			$.get($$ctx+"/submitDetailQuery/fileIsExists?fileName="+fileName,function(message){
				if (message == "") {
					window.location.href = $$ctx+"/submitDetailQuery/download?fileName="+fileName;
				} else {
					bootbox.alert({
						buttons:{
							ok:{
								label:"确定"
							}
						},
						message:message
					});
				}
			});	
		},
		updateExcute:function(e){
			$.ajax({
				type : "GET",
				url : $$ctx + "/templateMng/updateExcute/"+e.currentTarget.name+"/"+e.currentTarget.value,
				data : null,
				success : function(result){
					if(result=="success"){
						bootbox.alert({
							buttons:{
								ok:{
									label:"确定"
								}
							},
							message:"执行成功"
						});
					}
					if(result=="failure"){
						bootbox.alert({
							buttons:{
								ok:{
									label:"确定"
								}
							},
							message:"执行失败"
						});
					}
				}
			});
		},
		search:function(){
			var viewSelf = this;
			var oSearchData = {};
			oSearchData.beginTime = $("#begin-time").val();
			oSearchData.endTime = $("#end-time").val();
			oSearchData.status = $("#template-status option:selected").val();
			oSearchData.cycle = $("#report-cycle option:selected").val();
			oSearchData.reportName = $("#report-name").val();
			viewSelf.dt.oSearchData=oSearchData;//查询条件
			viewSelf.dt.fnPageChange(0);
		},
		detail:function(e){
			var id = e.currentTarget.value;
			$("#submitOrg").html("");//清空html元素
			$.ajax({
				type : "GET",
				url : $$ctx + "/templateMng/queryTemplateById/" + id,
				data : null,
				success : function(result){
					$("#reportCode").val($.trim(result.no));
					$("#reportName").val($.trim(result.name));
					$("#reportCycle").val(getCycle($.trim(result.cycle)));
					$("#timeLimit").val($.trim(result.timeLimit));
					
					var htmlContent = "";
					var orgArray = $.trim(result.submitOrg).split(";");//字符串转数组
					console.log(orgArray);
					for(var x=0;x<orgArray.length-1;x++){
						htmlContent += "<option value='' >"+orgArray[x]+"</option>";
					}
					$(htmlContent).appendTo($("#submitOrg"));
					
					
//					$("#submitOrg").val($.trim(result.submitOrg));
					$("#checkRole").val($.trim(result.checkRole));
					$("#sumType").val(getSumType($.trim(result.sumType)));
					var path = result.path;//相对路径
					$("#path").attr("name",path);
					var index1=path.lastIndexOf("\\");
					var index2=path.lastIndexOf("/");
					if(index2>index1) index1=index2;
					path=path.substring(index1+1);
					$("#path").val(path);
					$("#reportDetail").val($.trim(result.id));
				}
			});
			$("#tb_q input").attr("readOnly",true);
			$("#tb_q span").attr("valign","middle");
			$("#tb_q td").attr("align","center");
			$("#tb_q").appendTo($("#div-search"));
			$("#lookTemplate").modal("show");
		},
		adjust:function(e){
			var id = e.currentTarget.value;
			$("button[role='btn-adjust']").attr("name",e.currentTarget.value);
			$.ajax({
				type : "GET",
				url : $$ctx + "/templateMng/queryTemplateById/" + id,
				data : null,
				success : function(result){
					$("#reportCode").val($.trim(result.no));
					$("#reportName").val($.trim(result.name));
					$("#reportCycle").val(getCycle($.trim(result.cycle)));
					$("#timeLimit").val($.trim(result.timeLimit));
					$("#submitOrg").val($.trim(result.submitOrg));
					$("#checkRole").val($.trim(result.checkRole));
					$("#sumType").val(getSumType($.trim(result.sumType)));
					
					var path = result.path;//模板存储绝对路径
					$("#path").attr("name",path);
					var index1=path.lastIndexOf("\\");
					var index2=path.lastIndexOf("/");
					if(index2>index1) index1=index2;
					path=path.substring(index1+1);
					$("#path").val(path);
					
					$("#reportDetail").val($.trim(result.id));
				}
			});
			$("#tb_q input").attr("readOnly",true);
			$("#tb_q span").attr("valign","middle");
			$("#tb_q td").attr("align","center");
			$("#tb_q").appendTo($("#div-adjust"));
			$("#templateAdjust").modal("show");
		},
		initDataTables:function(){
			var viewSelf = this;
			var dt = $("#tbl").dataTable({
				bServerSide: true, 
				searching: false,
			    ordering:  false,
			    lengthMenu : [ [ 10, 20, 50,100 ], [ 10, 20, 50, 100 ] ],// 每页显示多少条记录
				ajax: {
					type : "POST",
					url : $$ctx + "/templateMng/queryTemplates",
					data :function(params) {
						if(viewSelf.dt&&viewSelf.dt.oSearchData) {//循环遍历查询条件
							 for(var key in viewSelf.dt.oSearchData) {
								 params[key]=viewSelf.dt.oSearchData[key];
					         }
						}
					}
				},
				columns : [
				    {data : null },
				    {data : [1] },
			        {data : null ,render : function(data,type,row) {
			        	return getCycle(row[2]);
			        }},
			        {data : null ,render : function(data,type,row) {
			        	if(row[3]==null){
			        		return "";
			        	}else{
			        		var date = new Date(parseInt(row[3]));//.toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");
				        	var month = date.getMonth()+1;
				        	return date.getFullYear()+"-"+(month<10?(+"0"+month.toString()):month)+"-"+date.getDate();
			        	}
			        } },
			        {data : null ,render : function(data,type,row) {
			        	if(row[4]!=null){
			        		return row[4];
			        	}
			        	return "无";
			        } },
			        {data : null ,render : function(data,type,row) {
			        	if(row[7]!=null){
							return row[7];
						} else if(row[6]!=null) {
							return row[6];
						} else if(row[5]!=null) {
							return row[5];
						} else {
							return "无";
						}
			        	}},
			        {data : null, render : function(data,type,row) {
			        		return getTemplateState(row[8]);
			        	}
			        },
			        {data : null, render: function(data, type, row ) {
			        	var loginName = $("#loginName").val();
			        	var div = $("<div class='btn-group'></div>");
			        	var button1 = $("<button role='detail' value='" + row[0] + "' name='detail'  class='btn btn-xs btn-info glyphicon glyphicon-eye-open' title='查看'></button>");
			        	var button2 = $("<button id='btn-update' role='edit' value='" + row[0] + "' name='edit'  class='btn btn-xs btn-info glyphicon glyphicon-edit' title='修改' style='display:none;'></button>");
			        	var button3 = $("<button id='btn-adjust' role='adjust' value='" + row[0] + "' name='adjust'  class='btn btn-xs btn-info glyphicon glyphicon-wrench' title='调整' disabled='true'></button>");
			        	var ids = viewSelf.id;
				        	for(var i=0;i<ids.length;i++){
				        		if(ids[i]-0==391){//判断角色，是否显示修改按钮（）
				        			if(row[8]==1){
				        				button2.css("display", "block");
				        				button3.css("display", "none");
				        			}
				        		}
				        		if(ids[i]-0==393){//判断角色是否显示调整按钮（统计组）
				        			if((row[8]==5||row[8]==7)&&row[2]!=1){//不是已发布和暂停执行或者是一次性填报的
				        				button3.attr("disabled", false);
				        			}
				        		}
				        		if(row[4]!=loginName){
				        			button2.attr("disabled", true);
				        		}
				    		}
				        div.append(button1).append(button2).append(button3);
						return div[0].outerHTML;
	                }}
			    ],
			    fnCreatedRow : function(nRow, aData, iDataIndex) {
		    		$('td:eq(0)', nRow).html(iDataIndex + 1);
		        }
			});
			
			viewSelf.dt = dt;
		}
	});
	module.exports = view;
});