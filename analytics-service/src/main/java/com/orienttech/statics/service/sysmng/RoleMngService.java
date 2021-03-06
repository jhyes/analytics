package com.orienttech.statics.service.sysmng;

import java.util.List;

import org.springframework.data.domain.Page;

import com.orienttech.statics.dao.entity.Role;

public interface RoleMngService {
	
	Page<Role> findAll(Role role,String search,Integer pageNumber, Integer pageSize);
	
	void add(Role role);
	
	void modify(Role role);
	
	/**
	 * 是否为查阅角色
	 * @param role
	 */
	void modifyIfCheckRole(String ifCheckRole, Integer id);
	
	boolean getCountByName(int id,String name,String flag);
	/**
	 * 根据id查角色
	 * @param id
	 * @return
	 */
	Role findById(Integer id);
	/**
	 * 查询是否为查阅角色
	 * @param id
	 * @return
	 */
	Role findCheckRoleById(Integer id);
	
	void deleteFunction(Integer roleId);
	
	void saveFunction(Integer roleId,String functionId); 
	/**
	 * 工作面板权限控制
	 * @param roleId
	 */
	void deleteDashboardFunction(String roleId);
	
	void saveDashboardFunction(String roleId,String functionId); 
	
	List<Role> findAll();
	
	List<Role> findAllCheckRole();
	
}
