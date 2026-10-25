package com.airline.system.service;

import com.airline.system.dao.EmployeeDao;
import com.airline.system.model.Employee;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(rollbackFor = Exception.class)
public class EmployeeService {

    private final EmployeeDao employeeDao;

    public EmployeeService(EmployeeDao employeeDao) {
        this.employeeDao = employeeDao;
    }

    @Transactional(readOnly = true)
    public List<Employee> getAllEmployees() {
        return employeeDao.findAll();
    }

    @Transactional(readOnly = true)
    public Employee getEmployee(String id) {
        return employeeDao.findById(id);
    }

    public void addEmployee(Employee employee) {
        employeeDao.save(employee);
    }

    public boolean updateEmployee(String id, Employee employee) {
        return employeeDao.update(id, employee) > 0;
    }

    public boolean deleteEmployee(String id) {
        if (id == null || id.trim().isEmpty()) {
            return false;
        }

        Employee employee = employeeDao.findById(id);
        if (employee == null) {
            return false;
        }

        return employeeDao.delete(id) > 0;
    }
}
