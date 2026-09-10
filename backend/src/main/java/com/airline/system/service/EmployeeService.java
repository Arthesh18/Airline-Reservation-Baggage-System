package com.airline.system.service;

import com.airline.system.dao.EmployeeDao;
import com.airline.system.model.Employee;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmployeeService {

    private final EmployeeDao employeeDao;

    public EmployeeService(EmployeeDao employeeDao) {
        this.employeeDao = employeeDao;
    }

    public List<Employee> getAllEmployees() {
        return employeeDao.findAll();
    }

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
        return employeeDao.delete(id) > 0;
    }
}