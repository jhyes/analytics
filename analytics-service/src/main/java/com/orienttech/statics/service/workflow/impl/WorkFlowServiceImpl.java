package com.orienttech.statics.service.workflow.impl;


import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.TypeReference;
import com.google.common.base.Function;
import com.google.common.collect.Lists;
import com.orienttech.statics.commons.webservice.WebServices;
import com.orienttech.statics.service.model.workflow.CurrentTask;
import com.orienttech.statics.service.model.workflow.DoneTask;
import com.orienttech.statics.service.model.workflow.HandledWorkflows;
import com.orienttech.statics.service.model.workflow.NextTaskReceiver;
import com.orienttech.statics.service.model.workflow.PageTypedResultData;
import com.orienttech.statics.service.model.workflow.TaskAction;
import com.orienttech.statics.service.model.workflow.TaskTransferProcess;
import com.orienttech.statics.service.model.workflow.TodoTask;
import com.orienttech.statics.service.model.workflow.TypedResult;
import com.orienttech.statics.service.model.workflow.WorkFlowId;
import com.orienttech.statics.service.model.workflow.WorkFlowTaskIds;
import com.orienttech.statics.service.workflow.WorkFlowService;
import com.orienttech.statics.service.workflow.WorkFlowService.RoleCode;

@Service
public class WorkFlowServiceImpl implements WorkFlowService{
	
	private static final Logger logger = LoggerFactory.getLogger(WorkFlowServiceImpl.class);
	
	private static final String WORK_FLOW_SERVICE_NAME = "workflowService";
	
	private static final String TASK_CENTER_SERVICE_NAME = "taskCenterService";
	
	private static final String SERVICE_START_WORKFLOW = "startWorkflow";
	
	private static final String SERVICE_START_PROCESSING_TASK = "startProcessingTask";
	
	private static final String SERVICE_GET_TASK_ACTIONS = "getTaskActions";
	
	private static final String SERVICE_GET_NEXT_TASK_RECEIVERS = "getNextTaskReceivers";
	
	private static final String SERVICE_EXECUTE_TASK = "executeTask";
	
	private static final String SERVICE_TRANSFER_TASK = "transferTask";
	
	private static final String SERVICE_GET_TASK_TRANSFER_PROCESS_OF_WORKFLOW = "getTaskTransferProcessOfWorkflow";
	
	private static final String SERVICE_GET_HANDLED_WORK_FLOWS_BY_USER = "getHandledWorkflowsByUser";
	
	private static final String SERVICE_QUERY_TODO_LIST_BY_CONDITION="queryToDoListByCondition";
	
	private static final String SERVICE_QUERY_DONE_LIST_BY_CONDITION="queryDoneListByCondition";
	
	private static final String QUERY_PORTAL_TODO_LIST_BY_CONDITION = "queryPortalToDoListByCondition";
	private static final String QUERY_PORTAL_DONE_LIST_BY_CONDITION = "queryPortalDoneListByCondition";
	private static final String GET_CURRENT_TASK_ASSIGNEE_BY_WORKFLOWID_AND_ORGID = "getCurrentTaskAssigneeByWorkflowIdAndOrgId";
	
	private static final String ERR_MSG = "调用webservice时发生异常";
	
	@SuppressWarnings({ "unchecked", "rawtypes" })
	private final TypedResult<?> nullResp = new TypedResult(Boolean.FALSE,"调用webservice返回结果为空", null);
	@SuppressWarnings({ "unchecked", "rawtypes" })
	private final TypedResult<?> errResp = new TypedResult(Boolean.FALSE,ERR_MSG, null);
	
	@Autowired
	private WebServices webServices;

	@Override
	public TypedResult<WorkFlowTaskIds> startWorkflow(SysCode sysCode, WorkFlowCode workflowCode, WorkFlowNode node,
			String userId, String taskSubject,String orgId) {
		return this.doInvokeWebService(WORK_FLOW_SERVICE_NAME,
										SERVICE_START_WORKFLOW, 
										new TypeReference<WorkFlowTaskIds>(){},
										sysCode==null?null:sysCode.getCodeId(),
										workflowCode==null?null:workflowCode.getCodeId(),
										node.getId(),
										userId,
										taskSubject,
										orgId);
	}

	@Override
	public TypedResult<WorkFlowId> startProcessingTask(String workflowId, String taskId,String logName) {
		return this.doInvokeWebService(WORK_FLOW_SERVICE_NAME,
										SERVICE_START_PROCESSING_TASK, 
										new TypeReference<WorkFlowId>(){},
										workflowId,
										taskId,
										logName);
	}

	@Override
	public TypedResult<List<TaskAction>> getTaskActions(WorkFlowNode node) {
		return this.doInvokeWebService(WORK_FLOW_SERVICE_NAME,
				SERVICE_GET_TASK_ACTIONS, 
				new TypeReference<List<TaskAction>>(){},
				node.getId());
	}
	
	/**
	 * 获取待办列表(新)
	 */
	@Override
	public TypedResult<PageTypedResultData<TodoTask>> queryPortalToDoListByCondition(
										String curUser,
										String sysCode,
										String workflowCode,
										String taskCreatorName,
										String taskSubject,
										String taskCreateDateStart,
										String taskCreateDateEnd,
										Integer pageNumber,
										Integer pageSize) {
		
		return this.doInvokeWebService(
										TASK_CENTER_SERVICE_NAME, 
										QUERY_PORTAL_TODO_LIST_BY_CONDITION, 
										new TypeReference<PageTypedResultData<TodoTask>>(){}, 
										curUser,
										sysCode,
										workflowCode,
										taskCreatorName,
										taskSubject,
										taskCreateDateStart,
										taskCreateDateEnd,
										pageNumber,
										pageSize);
		
	}
	
	/**
	 * 获取已办列表(新)
	 */
	@Override
	public TypedResult<PageTypedResultData<DoneTask>> queryPortalDoneListByCondition(
										String curUser,
										String sysCode,
										String workflowCode,
										String taskCreatorName,
										String taskSubject,
										String taskConfirmDateStart,
										String taskConfirmDateEnd,
										String taskAssignDateStart,
										String taskAssignDateEnd,
										Integer pageNumber,
										Integer pageSize) {
			
		return this.doInvokeWebService(
										TASK_CENTER_SERVICE_NAME,
										QUERY_PORTAL_DONE_LIST_BY_CONDITION, 
										new TypeReference<PageTypedResultData<DoneTask>>(){},
										curUser,
										sysCode,
										workflowCode,
										taskCreatorName,
										taskSubject,
										taskConfirmDateStart,
										taskConfirmDateEnd,
										taskAssignDateStart,
										taskAssignDateEnd,
										pageNumber,
										pageSize);
	}	
	/**
	 * TODO
	 * 获取当前流程所处环节信息
	 */
	@Override
	public TypedResult<CurrentTask> getCurrentTaskAssigneeByWorkflowIdAndOrgId(
										String workflowId,
										String orgId) {
			
		return this.doInvokeWebService1(
										TASK_CENTER_SERVICE_NAME,
										GET_CURRENT_TASK_ASSIGNEE_BY_WORKFLOWID_AND_ORGID, 
										new TypeReference<CurrentTask>(){},
										workflowId,
										orgId);
	}
	/**
	 * 获取当前流程所处环节信息
	 * @param serviceName
	 * @param methodName
	 * @param dataType
	 * @param params
	 * @return
	 */
	@SuppressWarnings({ "unchecked" })
	private <T> TypedResult<T> doInvokeWebService1(String serviceName,String methodName ,TypeReference<T> dataType,Object... params){
		String invokeResult = null;
		try {
			invokeResult = this.invokeService(serviceName,methodName,params);
		} catch (Exception e) {
			logger.error(ERR_MSG,e);
			return (TypedResult<T>) errResp;
		}
		return parseResult1(invokeResult,dataType);
	}
	/**
	 * 获取当前流程所处环节信息
	 * @param invokeResult
	 * @param dataTypeToken
	 * @return
	 */
	@SuppressWarnings({ "unchecked"})
	private <T> TypedResult<T> parseResult1(String invokeResult,TypeReference<T> dataTypeToken){
		if(invokeResult==null){
			return (TypedResult<T>) nullResp;
		}
		TypedResult<T> result = JSON.parseObject(invokeResult,
				new TypeReference<TypedResult<T>>(){});
		
		if(result.getData() instanceof JSON){
			JSON data = (JSON)result.getData();
			result.setData(JSON.parseArray(data.toJSONString()));
		}
		return result;
	}

	@Override
	public TypedResult<List<NextTaskReceiver>> getNextTaskReceivers(
													String taskId,
													ActionCode actionCode) {
		return this.doInvokeWebService(WORK_FLOW_SERVICE_NAME,
										SERVICE_GET_NEXT_TASK_RECEIVERS, 
										new TypeReference<List<NextTaskReceiver>>(){},
										taskId,
										actionCode.getCodeId());
	}
	
	/**
	 * 退回重发
	 */
	@Override
	public TypedResult<WorkFlowTaskIds> executeTask(WorkFlowCode workflowCode,
												String workflowId,
												String taskId,
												String logName,
												WorkFlowNode node,
												ActionCode actionCode,
												String taskReceiver,
												String comments,
												String taskSubject,
												String orgId) {
		
		return this.doInvokeWebService(WORK_FLOW_SERVICE_NAME,
										SERVICE_EXECUTE_TASK, 
										new TypeReference<WorkFlowTaskIds>(){},
										workflowCode==null?null:workflowCode.getCodeId(),
										workflowId,
										taskId,
										logName,
										node.getId(),
										actionCode.getCodeId(),
										taskReceiver,
										comments,
										taskSubject,
										orgId);
	}

	@Override
	public TypedResult<WorkFlowId> transferTask(String workflowId, String taskId,
			String transferor, String transferee, String reason) {
		
		return this.doInvokeWebService(WORK_FLOW_SERVICE_NAME,
										SERVICE_TRANSFER_TASK, 
										new TypeReference<WorkFlowId>(){},
										workflowId,
										taskId,
										transferor,
										transferee,
										reason);
	}

	@Override
	public TypedResult<List<TaskTransferProcess>> getTaskTransferProcessOfWorkflow(String workflowId,
			String sortFlag) {
		return this.doInvokeWebService(WORK_FLOW_SERVICE_NAME,SERVICE_GET_TASK_TRANSFER_PROCESS_OF_WORKFLOW, 
				new TypeReference<List<TaskTransferProcess>>(){},
				workflowId,
				sortFlag);
	}

	@Override
	public TypedResult<PageTypedResultData<TodoTask>> queryToDoListByCondition(String logName, 
															List<WorkFlowCode> workflowCodes,
															SysCode sysCode, 
															List<String> nodeIds,
															String taskCreatorName,
															String taskSubject,
															String taskCreateDateStart,
															String taskCreateDateEnd, 
															Integer pageNumber, 
															Integer pageSize) {
		List<String> wfCodeList = null;
		if(workflowCodes!=null&&!workflowCodes.isEmpty()){
			wfCodeList = Lists.transform(workflowCodes,new Function<WorkFlowCode, String>(){
						@Override
						public String apply(WorkFlowCode input) {
							return input.getCodeId();
						}
					});
		}
		
		return this.doInvokeWebService(TASK_CENTER_SERVICE_NAME,
				SERVICE_QUERY_TODO_LIST_BY_CONDITION,
				new TypeReference<PageTypedResultData<TodoTask>>(){},
				logName, 
				wfCodeList,
				sysCode==null?null:sysCode.getCodeId(), 
				nodeIds,
				taskCreatorName,
				taskSubject,
				taskCreateDateStart,
				taskCreateDateEnd, 
				pageNumber, 
				pageSize);
	}
	
	
	@Override
	public TypedResult<PageTypedResultData<HandledWorkflows>> getHandledWorkflowsByUser(
															String deptCode,
															String logName,
															SysCode sysCode,
															String sortFlag,
															List<WorkFlowCode> workflowCodes,
															String taskStatus,
															String taskSubject,
															String taskCreateDateStart,
															String taskCreateDateEnd,
															Integer pageNumber, 
															Integer pageSize){
		
		List<String> wfCodeList = null;
		if(workflowCodes!=null&&!workflowCodes.isEmpty()){
			wfCodeList = Lists.transform(workflowCodes,new Function<WorkFlowCode, String>(){
						@Override
						public String apply(WorkFlowCode input) {
							return input.getCodeId();
						}
					});
		}		
		return this.doInvokeWebService(
				WORK_FLOW_SERVICE_NAME,
				SERVICE_GET_HANDLED_WORK_FLOWS_BY_USER, 
				new TypeReference<PageTypedResultData<HandledWorkflows>>(){},
				deptCode,
				logName,
				sysCode==null?null:sysCode.getCodeId(),
				sortFlag,
				wfCodeList,
				taskStatus,
				taskSubject,
				taskCreateDateStart,
				taskCreateDateEnd,
				pageNumber,
				pageSize);
	}
	
	@Override
	public TypedResult<PageTypedResultData<DoneTask>> queryDoneListByCondition(
														String logName, 
														List<WorkFlowCode> workflowCodes,
														SysCode sysCode, 
														String taskCreatorName,
														String taskSubject,
														String taskConfirmDateStart,
														String taskConfirmDateEnd, 
														String taskAssignDateStart,
														String taskAssignDateEnd, 
														Integer pageNumber, 
														Integer pageSize) {
		
		List<String> wfCodeList = null;
		if(workflowCodes!=null&&!workflowCodes.isEmpty()){
			wfCodeList = Lists.transform(workflowCodes,new Function<WorkFlowCode, String>(){
						@Override
						public String apply(WorkFlowCode input) {
							return input.getCodeId();
						}
					});
		}		
		
		return this.doInvokeWebService(
				TASK_CENTER_SERVICE_NAME,
				SERVICE_QUERY_DONE_LIST_BY_CONDITION, 
				new TypeReference<PageTypedResultData<DoneTask>>(){},
				logName, 
				wfCodeList,
				sysCode==null?null:sysCode.getCodeId(), 
				taskCreatorName,
				taskSubject,
				taskConfirmDateStart,
				taskConfirmDateEnd, 
				taskAssignDateStart,
				taskAssignDateEnd, 
				pageNumber, 
				pageSize);
		
	}

	
	@SuppressWarnings({ "unchecked"})
	private <T> TypedResult<T> parseResult(String invokeResult,TypeReference<T> dataTypeToken){
		if(invokeResult==null){
			return (TypedResult<T>) nullResp;
		}
		TypedResult<T> result = JSON.parseObject(invokeResult,
				new TypeReference<TypedResult<T>>(){});
		
		if(result.getData() instanceof JSON){
			JSON data = (JSON)result.getData();
			result.setData(JSON.parseObject(data.toJSONString(),dataTypeToken));
		}
		return result;
	}
	
	@SuppressWarnings({ "unchecked" })
	private <T> TypedResult<T> doInvokeWebService(String serviceName,String methodName ,TypeReference<T> dataType,Object... params){
		String invokeResult = null;
		try {
			invokeResult = this.invokeService(serviceName,methodName,params);
		} catch (Exception e) {
			logger.error(ERR_MSG,e);
			return (TypedResult<T>) errResp;
		}
		return parseResult(invokeResult,dataType) ;
	}
	
	private String invokeService(String serviceName,String methodName,Object...params) throws Exception{
		return this.webServices.invoke(serviceName, methodName, params);
	}


	public static void main(String[] args) {
		System.out.println(RoleCode.getById("100510").getId());
	}
}
