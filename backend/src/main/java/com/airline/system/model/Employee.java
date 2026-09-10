package com.airline.system.model;

import jakarta.validation.constraints.NotBlank;

public class Employee {

    @NotBlank(message = "Employee ID is required")
    private String employeeID;

    @NotBlank(message = "Employee name is required")
    private String name;

    @NotBlank(message = "Designation is required")
    private String designation;

    @NotBlank(message = "Phone is required")
    private String phone;

    public Employee() {
    }

    public Employee(String employeeID, String name,
                    String designation, String phone) {
        this.employeeID = employeeID;
        this.name = name;
        this.designation = designation;
        this.phone = phone;
    }

    public String getEmployeeID() {
        return employeeID;
    }

    public void setEmployeeID(String employeeID) {
        this.employeeID = employeeID;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDesignation() {
        return designation;
    }

    public void setDesignation(String designation) {
        this.designation = designation;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }
}