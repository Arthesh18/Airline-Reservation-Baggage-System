package com.airline.system.controller;

import com.airline.system.model.SqlRequest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/sql")
@CrossOrigin(origins = {
        "http://127.0.0.1:5500",
        "http://localhost:5500",
        "https://airline-reservation-frontend-8bns.onrender.com"
})
public class SqlController {

    private final JdbcTemplate jdbcTemplate;

    public SqlController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    /* =====================================================
       EXECUTE SQL
    ===================================================== */

    @PostMapping("/execute")
    public Map<String, Object> executeSql(@RequestBody SqlRequest request) {

        long startTime = System.currentTimeMillis();

        if (request == null ||
                request.getSql() == null ||
                request.getSql().trim().isEmpty()) {

            throw new IllegalArgumentException("SQL query cannot be empty.");
        }

        String sql = request.getSql().trim();
        sql = cleanSqlCommands(sql);

        if (sql.isBlank()) {
            throw new IllegalArgumentException("SQL query cannot be empty.");
        }

        // Protect database/server-level commands
        validateSql(sql);

        String normalized = sql.toLowerCase(Locale.ROOT).trim();
        Map<String, Object> result = new LinkedHashMap<>();

        /*
         * Queries that return rows.
         */
        if (isResultQuery(normalized)) {

            List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);

            List<String> columns = rows.isEmpty()
                    ? getColumnsFromQuery(sql)
                    : new ArrayList<>(rows.get(0).keySet());

            result.put("success", true);
            result.put("type", "RESULT");
            result.put("columns", columns);
            result.put("rows", rows);
            result.put("rowCount", rows.size());

        } else {
            /*
             * INSERT / UPDATE / DELETE / DDL / CREATE FUNCTION etc.
             */
            int affectedRows = jdbcTemplate.update(sql);

            result.put("success", true);
            result.put("type", "UPDATE");
            result.put("rowsAffected", affectedRows);
            result.put(
                    "message",
                    affectedRows >= 0
                            ? "Query executed successfully."
                            : "Statement executed successfully."
            );
        }

        long executionTime = System.currentTimeMillis() - startTime;
        result.put("executionTimeMs", executionTime);

        return result;
    }

    /* =====================================================
       GET ALL TABLES (Filters out TimescaleDB internal chunks)
    ===================================================== */

    @GetMapping("/tables")
    public List<String> getTables() {

        return jdbcTemplate.queryForList(
                """
                SELECT table_name
                FROM information_schema.tables
                WHERE table_schema = current_schema()
                  AND table_type = 'BASE TABLE'
                  AND table_name NOT LIKE '_hyper_%'
                ORDER BY table_name
                """,
                String.class
        );
    }

    /* =====================================================
       GET TABLE COLUMNS
    ===================================================== */

    @GetMapping("/tables/{tableName}/columns")
    public List<Map<String, Object>> getTableColumns(@PathVariable String tableName) {

        String canonicalTable = validateAndGetCanonicalTableName(tableName);

        return jdbcTemplate.queryForList(
                """
                SELECT
                    c.column_name AS "COLUMN_NAME",
                    c.data_type AS "DATA_TYPE",
                    c.is_nullable AS "IS_NULLABLE",
                    COALESCE(
                        (SELECT 'PRI'
                         FROM information_schema.table_constraints tc
                         JOIN information_schema.key_column_usage kcu
                           ON tc.constraint_name = kcu.constraint_name
                          AND tc.table_schema = kcu.table_schema
                         WHERE tc.constraint_type = 'PRIMARY KEY'
                           AND tc.table_schema = c.table_schema
                           AND lower(tc.table_name) = lower(c.table_name)
                           AND kcu.column_name = c.column_name
                         LIMIT 1),
                        ''
                    ) AS "COLUMN_KEY",
                    c.column_default AS "COLUMN_DEFAULT"
                FROM information_schema.columns c
                WHERE c.table_schema = current_schema()
                  AND lower(c.table_name) = lower(?)
                ORDER BY c.ordinal_position
                """,
                canonicalTable
        );
    }

    /* =====================================================
       GET TABLE DATA (Uses PostgreSQL Quoted Identifiers)
    ===================================================== */

    @GetMapping("/tables/{tableName}/data")
    public Map<String, Object> getTableData(@PathVariable String tableName) {

        String canonicalTable = validateAndGetCanonicalTableName(tableName);

        String sql = "SELECT * FROM \"" + canonicalTable + "\"";

        List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);

        List<String> columns = rows.isEmpty()
                ? new ArrayList<>()
                : new ArrayList<>(rows.get(0).keySet());

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("table", canonicalTable);
        result.put("columns", columns);
        result.put("rows", rows);
        result.put("rowCount", rows.size());

        return result;
    }

    /* =====================================================
       QUERY TYPE DETECTION
    ===================================================== */

    private boolean isResultQuery(String sql) {
        return sql.startsWith("select")
                || sql.startsWith("show")
                || sql.startsWith("explain")
                || sql.startsWith("with ")
                || sql.startsWith("table ");
    }

    /* =====================================================
       TABLE NAME VALIDATION AGAINST POSTGRESQL METADATA
    ===================================================== */

    private String validateAndGetCanonicalTableName(String tableName) {

        if (tableName == null || !tableName.matches("[A-Za-z_][A-Za-z0-9_]*")) {
            throw new IllegalArgumentException("Invalid table name: " + tableName);
        }

        List<String> matchingTables = jdbcTemplate.queryForList(
                """
                SELECT table_name
                FROM information_schema.tables
                WHERE table_schema = current_schema()
                  AND table_type = 'BASE TABLE'
                  AND table_name NOT LIKE '_hyper_%'
                  AND lower(table_name) = lower(?)
                """,
                String.class,
                tableName
        );

        if (matchingTables.isEmpty()) {
            throw new IllegalArgumentException("Table does not exist: " + tableName);
        }

        return matchingTables.get(0);
    }

    /* =====================================================
       SQL VALIDATION
    ===================================================== */

    private void validateSql(String sql) {

        String normalized = sql.toLowerCase(Locale.ROOT)
                .replaceAll("\\s+", " ")
                .trim();

        String[] blockedCommands = {
                "drop database",
                "create database",
                "alter database",
                "grant ",
                "revoke ",
                "create role",
                "drop role",
                "alter role",
                "create user",
                "drop user",
                "alter user",
                "shutdown",
                "checkpoint"
        };

        for (String blocked : blockedCommands) {
            if (normalized.startsWith(blocked)) {
                throw new IllegalArgumentException(
                        "This database/server-level command is disabled in the SQL Console."
                );
            }
        }
    }

    /* =====================================================
       CLEANUP CLIENT COMMANDS
    ===================================================== */

    private String cleanSqlCommands(String sql) {
        return sql
                .replaceAll("(?im)^\\s*delimiter\\s+\\S+\\s*$", "")
                .trim();
    }

    /* =====================================================
       COLUMN FALLBACK
    ===================================================== */

    private List<String> getColumnsFromQuery(String sql) {
        try {
            return jdbcTemplate.query(
                    sql,
                    resultSet -> {
                        int count = resultSet.getMetaData().getColumnCount();
                        List<String> columns = new ArrayList<>();
                        for (int i = 1; i <= count; i++) {
                            columns.add(resultSet.getMetaData().getColumnLabel(i));
                        }
                        return columns;
                    }
            );
        } catch (Exception ignored) {
            return new ArrayList<>();
        }
    }
}
