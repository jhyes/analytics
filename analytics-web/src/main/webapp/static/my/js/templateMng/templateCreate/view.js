define(function(require, exports, module) {
	var model = require("./model");
	var rm = require("./rm");
	var view = Backbone.View.extend({
		el: "div.aajax-content",
		initialize:function(){
			this.model=new model();
		},
		events:{
			"click #btn-templateCreate" : "fnTemplateCreateSubmit",//暂存
			"click #btn-templateSendAudit" : "fnTemplateSendAudit",//发送审核
			"click #goBack":"goBack",
			"click button[role='downloadEdit']":"downLoadExcelByPath",
			"change #sumType":"selectSumType",
			"keyup input[name='startRow']" : "checkValues",
		},
		render:function(){
			this.formRules();
			this.initForm();
			this.initTaskReceiver();
			var id = $("#id").val();//模板id
			this.loadRoles(id);
//			this.loadOrgs(id);
			this.loadInfo(id);
//			this.templateSendAudit();
		},
		goBack:function(){
			window.location.href=$$ctx+"/main#templateMng?type=templateMng";
		},
		loadInfo:function(id){
			if( id!=null && id!="" ){
				$("#cycle").val($("#cycleValue").val());
				$("#sumType").val($("#sumTypeValue").val());
			}else{
				$("#download-detail").hide();
			}
			$("#btn-templateCreate").attr("disabled", false);
			$("#btn-templateSendAudit").attr("disabled", false);
			this.selectSumType();
		},
		selectSumType:function(){
			var sumType = $("#sumType").val();
			if(sumType==2){
				$("#startRow").attr("disabled", true);
				$("#startRow").attr("class",""); 
				$("#startRow").val(""); 
			}else if(sumType==1){
				$("#startRow").attr("disabled", false);
				$("#startRow").attr("class","required"); 
				$("#startRow").val($("#startRowValue").val());

			}
		},
		downLoadExcelByPath:function(){
			var lock = false;
			var path = $("#pathValue").val();
			if(path!=null && path!="undefined"){
				$.ajax({
					type:"GET",
					url: $$ctx + "/templateMng/fileIsExists?filePath="+path,
					beforeSend:function(){
					},
					success:function(result){
						if (result == "") {
							window.location.href = $$ctx + "/templateMng/downLoadExcelById?fileId="+$("#id").val();
//							$.ajax({
//								type:"GET",
//								url: $$ctx + "/templateMng/downLoadExcelById?fileId="+$("#id").val(),
//							});
						} else {
							bootbox.alert("<span style='font-size:16px;'>"+result+"</span>");
						}
					}
				});
			}
		},
		getPath:function(obj){  
			if(obj){
				if(window.navigator.userAgent.indexOf("MSIE")>=1){
					obj.select();
					return document.selection.createRange().text;
				}else if(window.navigator.userAgent.indexOf("Firefox")>=1){
					if(obj.files){
						return obj.files.item(0).getAsDataURL();
					}
					return obj.value;
				}
				return obj.value;
			}
		},
		//TODO 报表模板文件
		initForm: function() {
//			var templatePath = $("#pathValue").val()=="" ? "未选择文件":$("#pathValue").val();
			var templatePath = $("#pathValue").val();
			$("#templatePath").html(templatePath);
			$("#templateForm").validate({
				rules: rm.rules,
				messages: rm.messages
			});
		},
		formRules :function(){//验证
			var viewSelf = this;
			
			var id = $("#id").val();
			if( id!=null && id!=""){
				var pathInput = $("#templateForm input[name='uploadFile']");
				var path = pathInput.val();
				if(path==null || path=="" ){
					pathInput.attr("class",""); 
					pathInput.attr("extension",""); 
				}
			}
			
		},
		
		templateCreateSubmit : function() {
			var viewSelf = this;
			$("#templateForm").ajaxSubmit(function(r){
	            if(r=='creatSuccess'){
					bootbox.alert("暂存成功!",function(){
						window.location.href = $$ctx + "/main#templateMng?type=templateMng";
					});
	            	}else if(r=='sendSuccess'){
	            		//待办统计数字
	            		$.post($$ctx + "/todoList/findTodoListToltalNum",function(r_data){
	        				$("#todoListToltalNum").html(r_data);
	        			});
	            		bootbox.alert("发送审核成功!",function(){
						window.location.href = $$ctx + "/main#templateMng?type=templateMng";
					});
				}else if(r=='creatFail'){
					bootbox.alert("暂存失败!");
				}else if(r=='sendFail'){
					bootbox.alert("发送审核失败!");
				}
			});
		},
		//TODO 暂存
		fnTemplateCreateSubmit:function(){
			var viewSelf = this;
			var nodes_dashboard = $.fn.zTree.getZTreeObj("taskReceiver").getCheckedNodes();
			var receiver="";
			$.each(nodes_dashboard, function(i, node) {
				receiver=node.ssoId+","+receiver;
			});
			$("#templateForm").attr("action", $$ctx + "/templateMng/addReportTemplate?receiver="+receiver);
			
//			var templatePath = $("#pathValue").val();
//			$("#uploadFile").val(templatePath);
			
			var b = $("#templateForm").valid();
	        if (b) {
	        	var pathInput = $("#templateForm input[name='uploadFile']");
				var path = pathInput.val();
				
	        	$("#btn-templateCreate").attr("disabled", true);
	        	viewSelf.templateCreateSubmit();
	        }
		},
		//发送审核
		fnTemplateSendAudit:function(){
			var viewSelf = this;
			
			var b = $("#templateForm").valid();
	        if (b) {
				var nodes_dashboard = $.fn.zTree.getZTreeObj("taskReceiver").getCheckedNodes();
				var loginName="";//登录帐号
				$.each(nodes_dashboard, function(i, node) {
					loginName=node.ssoId+","+loginName;
				});
				if(loginName==null||loginName==''){
					alert("请选择下一环节处理人！");
					return;
				}else{
		        	$("#btn-templateSendAudit").attr("disabled", true);
		        	$("#templateForm").attr("action", $$ctx + "/templateMng/sendAudit?receivers="+loginName);
		        	viewSelf.templateCreateSubmit();
				}
	        }
		},
		loadRoles:function(id){// 加载所有角色 
			var viewSelf = this;
			$.ajax({
				type:"POST",
				url: $$ctx + "/roleMng/findAllCheckRole",
				dataType:"json",
				success:function(result){
					if(result.success == true){
						if( id!=null && id!="" ){
							var checkRoleValue = $("#checkRoleValue").val();
							var rid=[];
							var roleStr = checkRoleValue.split(",");
							$(".role-select").html("");
						}
						$.each(result.data,function(i,item){
							$("<option value ='"+item.id+"'>"+item.name+"</option>").appendTo(".role-select");
							if( id!=null && id!="" ){
								for(var i=0;i<roleStr.length;i++){
									if(item.id == roleStr[i]){
										rid.push(item.id);
									}
								}
							}
						});
						var config = {
								'.role-select'					 : {},
								'.role-select-deselect'	: {allow_single_deselect:true},
								'.role-select-no-single' : {disable_search_threshold:10},
								'.role-select-no-results': {no_results_text:'没有数据!'},
								'.role-select-width'		 : {width:"100%"}
							}
							for (var selector in config) {
								$(selector).chosen(config[selector]);
							}
						$('.role-select').addClass('tag-input-style');
						$('.role-select').trigger("chosen:updated");
						if( id!=null && id!="" ){
							$('#checkRole').val(rid);
							$('.role-select').trigger("chosen:updated");
						}
					}
				}
			});
			
		},
		
		checkValues:function(e){//检查数值是否合法
			var regx =/^[0-9]*[1-9][0-9]*$/;
			var startRow = $("#startRow").val(); 
			if(startRow!=""){
			if(regx.test(startRow)==false){
//				startRow="";
//				$("#"+startRow.id).css("border","1px solid #ff9933");
				alert("请输入正整数！");
				$("#startRow").val("");
			}
			}
		},
		initTaskReceiver:function(){
			var callback_receivers = $("#callback_receivers").val();
			$.fn.zTree.init($("#taskReceiver"), {
				async: {
					enable: true,
					url:$$ctx + "/templateMng/findtaskReceiverMenuList?orgId=392&receiver="+callback_receivers
				},
				data: {
					simpleData: { enable: true, idKey: "ssoId", pIdKey: "pid"},
					key: { name: "userName" },
				},
//				check: { enable: true, chkStyle: "checkbox",chkboxType:{ "Y" : "ps", "N" : "ps" }},
				check: { enable: true, chkStyle: "radio"},
				callback: {
					onAsyncSuccess: function() {
						var treeObj = $.fn.zTree.getZTreeObj("taskReceiver");
						treeObj.expandAll(false);//全不展开
					}
				}
			});
		},
		
	});
	module.exports = view;
})