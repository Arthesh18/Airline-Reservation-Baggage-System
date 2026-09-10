package com.airline.system.controller;

import com.airline.system.exception.ApiError;
import com.airline.system.model.Employee;
import com.airline.system.service.EmployeeService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employees")
@CrossOrigin(origins = "*")
public class EmployeeController {

    private final EmployeeService employeeService;

    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    @GetMapping
    public ResponseEntity<List<Employee>> getAllEmployees() {
        return ResponseEntity.ok(employeeService.getAllEmployees());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getEmployee(@PathVariable String id) {

        Employee employee = employeeService.getEmployee(id);

        if (employee == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiError(
                            "Employee Not Found",
                            "No employee exists with ID " + id + "."
                    ));
        }

        return ResponseEntity.ok(employee);
    }

    @PostMapping
    public ResponseEntity<String> addEmployee(
            @Valid @RequestBody Employee employee) {

        employeeService.addEmployee(employee);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body("Employee added successfully");
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> updateEmployee(
            @PathVariable String id,
            @Valid @RequestBody Employee employee) {

        boolean updated = employeeService.updateEmployee(id, employee);

        if (!updated) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Employee not found: " + id);
        }

        return ResponseEntity.ok("Employee updated successfully");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteEmployee(
            @PathVariable String id) {

        boolean deleted = employeeService.deleteEmployee(id);

        if (!deleted) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Employee not found: " + id);
        }

        return ResponseEntity.ok("Employee deleted successfully");
    }
}