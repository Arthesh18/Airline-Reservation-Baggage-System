package com.airline.system.dao;

import com.airline.system.model.Employee;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class EmployeeDao {

    private final JdbcTemplate jdbcTemplate;

    public EmployeeDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Employee> findAll() {

        String sql = """
                SELECT EmployeeID, Name, Designation, Phone
                FROM EMPLOYEE
                ORDER BY EmployeeID
                """;

        return jdbcTemplate.query(sql, (rs, rowNum) ->
                new Employee(
                        rs.getString("EmployeeID"),
                        rs.getString("Name"),
                        rs.getString("Designation"),
                        rs.getString("Phone")
                )
        );
    }

    public Employee findById(String id) {

        String sql = """
                SELECT EmployeeID, Name, Designation, Phone
                FROM EMPLOYEE
                WHERE EmployeeID = ?
                """;

        List<Employee> employees = jdbcTemplate.query(sql, (rs, rowNum) ->
                new Employee(
                        rs.getString("EmployeeID"),
                        rs.getString("Name"),
                        rs.getString("Designation"),
                        rs.getString("Phone")
                ), id);

        return employees.isEmpty() ? null : employees.get(0);
    }

    public int save(Employee employee) {

        String sql = """
                INSERT INTO EMPLOYEE
                (EmployeeID, Name, Designation, Phone)
                VALUES (?, ?, ?, ?)
                """;

        return jdbcTemplate.update(
                sql,
                employee.getEmployeeID(),
                employee.getName(),
                employee.getDesignation(),
                employee.getPhone()
        );
    }

    public int update(String id, Employee employee) {

        String sql = """
                UPDATE EMPLOYEE
                SET Name = ?,
                    Designation = ?,
                    Phone = ?
                WHERE EmployeeID = ?
                """;

        return jdbcTemplate.update(
                sql,
                employee.getName(),
                employee.getDesignation(),
                employee.getPhone(),
                id
        );
    }

    public int delete(String id) {

        String sql = """
                DELETE FROM EMPLOYEE
                WHERE EmployeeID = ?
                """;

        return jdbcTemplate.update(sql, id);
    }
}