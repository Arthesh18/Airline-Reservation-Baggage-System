# ✈️ Airline Reservation & Baggage Tracking System

## Database Management Systems — DA-2 Project

A full-stack database-driven web application developed to manage airline reservations, passengers, flights, tickets, payments, baggage, baggage tracking, airports, airlines, and employee information through a centralized relational database system.

The project demonstrates the practical implementation of **EER modeling, relational mapping, normalization, SQL, primary keys, foreign keys, composite keys, referential integrity, CRUD operations, JDBC connectivity, REST APIs, database constraints, and MySQL procedural SQL**.

---

# 📌 1. Project Overview

Airline reservation systems involve multiple interconnected entities such as passengers, reservations, flights, tickets, payments, baggage, airports, and airlines.

Managing these entities independently can lead to:

- Data redundancy
- Inconsistent information
- Difficult data retrieval
- Poor relationship management
- Difficulty tracking baggage
- Problems maintaining referential integrity

The **Airline Reservation & Baggage Tracking System** provides a centralized database system where these entities and their relationships are represented using a properly structured relational database.

The application provides a web-based interface through which users can view, add, update, delete, search, and manage records stored in the MySQL database.

---

# 🎯 2. Objectives

The main objectives of the project are:

1. Design an appropriate **EER model** for an airline reservation and baggage tracking system.
2. Convert the EER model into a **relational database schema**.
3. Identify and implement appropriate **Primary Keys and Foreign Keys**.
4. Handle **composite keys** where required.
5. Represent multivalued attributes and many-to-many relationships correctly.
6. Apply **normalization principles** to reduce redundancy and improve data integrity.
7. Implement the database using **MySQL**.
8. Develop a Java Spring Boot backend using **JDBC**.
9. Implement CRUD operations for the database entities.
10. Provide a user-friendly web interface for database operations.
11. Provide an interactive SQL Console for executing and constructing SQL queries.
12. Demonstrate MySQL procedural SQL concepts.
13. Implement validation and database error handling.
14. Maintain referential integrity using database constraints.

---

# 🏗️ 3. System Architecture

The application follows a three-layer architecture:

```text
┌─────────────────────────────────────────────┐
│                  FRONTEND                   │
│             HTML + CSS + JavaScript         │
└──────────────────────┬──────────────────────┘
                       │
                       │ HTTP / REST API
                       ▼
┌─────────────────────────────────────────────┐
│                   BACKEND                   │
│             Java + Spring Boot              │
│              REST Controllers               │
│                   Service                   │
│                     DAO                     │
│                JdbcTemplate                 │
└──────────────────────┬──────────────────────┘
                       │
                       │ JDBC
                       ▼
┌─────────────────────────────────────────────┐
│                  DATABASE                   │
│                    MySQL                    │
│              airline_system                 │
└─────────────────────────────────────────────┘
