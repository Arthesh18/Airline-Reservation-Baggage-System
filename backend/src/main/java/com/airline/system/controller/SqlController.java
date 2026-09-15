package com.airline.system.controller;

import com.airline.system.model.SqlRequest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;
@RestController
@RequestMapping("/api/sql")
@CrossOrigin(origins = {
        "http://127.0.0.1:5500",
        "http://localhost:5500"
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
    public Map<String, Object> executeSql(
            @RequestBody SqlRequest request) {

        long startTime = System.currentTimeMillis();

        if (request == null ||
                request.getSql() == null ||
                request.getSql().trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "SQL query cannot be empty."
            );
        }

        String sql = request.getSql().trim();

        // Remove MySQL client DELIMITER commands.
        // DELIMITER is not part of SQL sent to MySQL.
        sql = removeDelimiterCommands(sql);

        if (sql.isBlank()) {
            throw new IllegalArgumentException(
                    "SQL query cannot be empty."
            );
        }

        // Protect database/server-level commands.
        validateSql(sql);

        String normalized =
                sql.toLowerCase(Locale.ROOT).trim();

        Map<String, Object> result =
                new LinkedHashMap<>();

        /*
         * Queries that return rows.
         */
        if (isResultQuery(normalized)) {

            List<Map<String, Object>> rows =
                    jdbcTemplate.queryForList(sql);

            List<String> columns =
                    rows.isEmpty()
                            ? getColumnsFromQuery(sql)
                            : new ArrayList<>(
                                    rows.get(0).keySet()
                            );

            result.put("success", true);
            result.put("type", "RESULT");
            result.put("columns", columns);
            result.put("rows", rows);
            result.put("rowCount", rows.size());

        }

        /*
         * INSERT / UPDATE / DELETE / DDL /
         * CREATE PROCEDURE / CREATE TRIGGER etc.
         */
        else {

            int affectedRows =
                    jdbcTemplate.update(sql);

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

        long executionTime =
                System.currentTimeMillis() - startTime;

        result.put(
                "executionTimeMs",
                executionTime
        );

        return result;
    }


    /* =====================================================
       GET ALL TABLES
    ===================================================== */

    @GetMapping("/tables")
    public List<String> getTables() {

        return jdbcTemplate.queryForList(
                """
                SELECT TABLE_NAME
                FROM information_schema.TABLES
                WHERE TABLE_SCHEMA = DATABASE()
                AND TABLE_TYPE = 'BASE TABLE'
                ORDER BY TABLE_NAME
                """,
                String.class
        );
    }


    /* =====================================================
       GET TABLE COLUMNS
    ===================================================== */

    @GetMapping("/tables/{tableName}/columns")
    public List<Map<String, Object>> getTableColumns(
            @PathVariable String tableName) {

        validateTableName(tableName);

        return jdbcTemplate.queryForList(
                """
                SELECT
                    COLUMN_NAME,
                    DATA_TYPE,
                    IS_NULLABLE,
                    COLUMN_KEY,
                    COLUMN_DEFAULT
                FROM information_schema.COLUMNS
                WHERE TABLE_SCHEMA = DATABASE()
                AND TABLE_NAME = ?
                ORDER BY ORDINAL_POSITION
                """,
                tableName
        );
    }


    /* =====================================================
       GET TABLE DATA
    ===================================================== */

    @GetMapping("/tables/{tableName}/data")
    public Map<String, Object> getTableData(
            @PathVariable String tableName) {

        validateTableName(tableName);

        String sql =
                "SELECT * FROM `" +
                tableName +
                "`";

        List<Map<String, Object>> rows =
                jdbcTemplate.queryForList(sql);

        List<String> columns =
                rows.isEmpty()
                        ? new ArrayList<>()
                        : new ArrayList<>(
                                rows.get(0).keySet()
                        );

        Map<String, Object> result =
                new LinkedHashMap<>();

        result.put("table", tableName);
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
                || sql.startsWith("describe")
                || sql.startsWith("desc ")
                || sql.startsWith("explain")
                || sql.startsWith("with ")
                || sql.startsWith("call ");
    }


    /* =====================================================
       TABLE NAME VALIDATION
    ===================================================== */

    private void validateTableName(String tableName) {

        if (tableName == null ||
                !tableName.matches(
                        "[A-Za-z_][A-Za-z0-9_]*")) {

            throw new IllegalArgumentException(
                    "Invalid table name."
            );
        }

        Integer count =
                jdbcTemplate.queryForObject(
                        """
                        SELECT COUNT(*)
                        FROM information_schema.TABLES
                        WHERE TABLE_SCHEMA = DATABASE()
                        AND TABLE_NAME = ?
                        """,
                        Integer.class,
                        tableName
                );

        if (count == null || count == 0) {
            throw new IllegalArgumentException(
                    "Table does not exist: " + tableName
            );
        }
    }


    /* =====================================================
       SQL VALIDATION
    ===================================================== */

    private void validateSql(String sql) {

        String normalized =
                sql.toLowerCase(Locale.ROOT)
                        .replaceAll("\\s+", " ")
                        .trim();

        String[] blockedCommands = {
                "drop database",
                "create database",
                "alter database",
                "grant ",
                "revoke ",
                "create user",
                "drop user",
                "alter user",
                "flush privileges",
                "shutdown"
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
       DELIMITER CLEANUP
    ===================================================== */

    private String removeDelimiterCommands(
            String sql) {

        return sql
                .replaceAll(
                        "(?im)^\\s*delimiter\\s+\\S+\\s*$",
                        ""
                )
                .trim();
    }


    /* =====================================================
       COLUMN FALLBACK
    ===================================================== */

    private List<String> getColumnsFromQuery(
            String sql) {

        try {

            return jdbcTemplate.query(
                    sql,
                    resultSet -> {

                        int count =
                                resultSet
                                        .getMetaData()
                                        .getColumnCount();

                        List<String> columns =
                                new ArrayList<>();

                        for (int i = 1;
                             i <= count;
                             i++) {

                            columns.add(
                                    resultSet
                                            .getMetaData()
                                            .getColumnLabel(i)
                            );
                        }

                        return columns;
                    }
            );

        } catch (Exception ignored) {

            return new ArrayList<>();
        }
    }
}