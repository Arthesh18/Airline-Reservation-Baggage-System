package com.airline.system.util;

import java.io.BufferedReader;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.sql.*;
import java.util.*;

public class DatabaseMigrator {

    public static void main(String[] args) {
        // Load .env directly without Spring dependencies
        loadDotenvDirect();

        String host = getProp("DB_HOST");
        String port = getProp("DB_PORT");
        String dbName = getProp("DB_NAME");
        String user = getProp("DB_USER");
        String password = getProp("DB_PASSWORD");
        String sslMode = getProp("DB_SSLMODE");

        if (host == null || port == null || dbName == null || user == null || password == null) {
            System.err.println("Error: Required database environment variables are missing.");
            System.exit(1);
        }

        String jdbcUrl = String.format("jdbc:postgresql://%s:%s/%s?sslmode=%s",
                host, port, dbName, sslMode != null ? sslMode : "require");

        System.out.println("Connecting to Timescale Cloud at " + host + ":" + port + "/" + dbName + " ...");

        Properties props = new Properties();
        props.setProperty("user", user);
        props.setProperty("password", password);
        props.setProperty("connectTimeout", "10");

        try (Connection conn = DriverManager.getConnection(jdbcUrl, props)) {
            System.out.println("Connected successfully to: " + jdbcUrl);

            // 1. Execute schema_timescale.sql
            Path schemaPath = findFile("database/schema_timescale.sql");
            System.out.println("\n--- Executing Schema Script: " + schemaPath + " ---");
            executeSqlScript(conn, schemaPath);

            // 2. Execute sample_data.sql
            Path dataPath = findFile("database/sample_data.sql");
            System.out.println("\n--- Executing Sample Data Script: " + dataPath + " ---");
            executeSqlScript(conn, dataPath);

            // 3. Verification
            System.out.println("\n--- Verification: Checking All 13 Tables ---");
            verifyTables(conn);

            System.out.println("\n--- Verification: Checking TimescaleDB Hypertables ---");
            verifyHypertables(conn);

            System.out.println("\n--- Verification: Row Counts Across All 13 Tables ---");
            verifyRowCounts(conn);

            System.out.println("\nDatabase setup and verification completed successfully!");

        } catch (SQLException e) {
            System.err.println("\nDatabase Error: " + e.getMessage());
            e.printStackTrace();
            System.exit(1);
        }
    }

    private static String getProp(String key) {
        String val = System.getProperty(key);
        if (val == null || val.isBlank()) {
            val = System.getenv(key);
        }
        return val;
    }

    private static void loadDotenvDirect() {
        Path[] candidatePaths = new Path[]{
                Paths.get(".env"),
                Paths.get("..", ".env"),
                Paths.get("backend", ".env")
        };

        for (Path p : candidatePaths) {
            if (Files.isRegularFile(p)) {
                try (BufferedReader reader = Files.newBufferedReader(p, StandardCharsets.UTF_8)) {
                    String line;
                    while ((line = reader.readLine()) != null) {
                        line = line.trim();
                        if (line.isEmpty() || line.startsWith("#")) continue;
                        int eq = line.indexOf('=');
                        if (eq > 0) {
                            String k = line.substring(0, eq).trim();
                            String v = line.substring(eq + 1).trim();
                            if ((v.startsWith("\"") && v.endsWith("\"")) || (v.startsWith("'") && v.endsWith("'"))) {
                                v = v.substring(1, v.length() - 1);
                            }
                            System.setProperty(k, v);
                        }
                    }
                } catch (IOException ignored) {}
                break;
            }
        }
    }

    private static Path findFile(String relativePath) {
        Path p = Paths.get(relativePath);
        if (Files.exists(p)) return p;
        p = Paths.get("..", relativePath);
        if (Files.exists(p)) return p;
        p = Paths.get(System.getProperty("user.dir", "."), relativePath);
        if (Files.exists(p)) return p;
        throw new RuntimeException("Could not locate file: " + relativePath);
    }

    private static void executeSqlScript(Connection conn, Path scriptPath) throws SQLException {
        StringBuilder sb = new StringBuilder();
        try (BufferedReader reader = Files.newBufferedReader(scriptPath, StandardCharsets.UTF_8)) {
            String line;
            while ((line = reader.readLine()) != null) {
                String trimmed = line.trim();
                if (trimmed.startsWith("--") || trimmed.isEmpty()) {
                    continue;
                }
                sb.append(line).append("\n");
            }
        } catch (IOException e) {
            throw new RuntimeException("Failed reading " + scriptPath, e);
        }

        String[] rawStatements = sb.toString().split(";\\s*(\\r?\\n)+");

        try (Statement stmt = conn.createStatement()) {
            for (String raw : rawStatements) {
                String sql = raw.trim();
                if (sql.isEmpty()) continue;
                try {
                    stmt.execute(sql);
                    String firstLine = sql.lines().findFirst().orElse(sql);
                    if (firstLine.length() > 60) firstLine = firstLine.substring(0, 60) + "...";
                    System.out.println("  [OK] " + firstLine);
                } catch (SQLException e) {
                    System.err.println("  [ERROR] Statement: " + sql);
                    System.err.println("          Message: " + e.getMessage());
                    throw e;
                }
            }
        }
    }

    private static void verifyTables(Connection conn) throws SQLException {
        String sql = """
                SELECT table_name
                FROM information_schema.tables
                WHERE table_schema = current_schema()
                  AND table_type = 'BASE TABLE'
                  AND table_name NOT LIKE '_hyper_%'
                ORDER BY table_name
                """;

        List<String> expectedTables = List.of(
                "airlines", "airport", "baggage", "baggage_tracking",
                "employee", "flight", "flight_status_history", "passenger",
                "passenger_phone", "payment", "reservation", "ticket", "ticket_baggage"
        );

        List<String> actualTables = new ArrayList<>();
        try (Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            while (rs.next()) {
                actualTables.add(rs.getString(1).toLowerCase());
            }
        }

        System.out.println("  Found " + actualTables.size() + " tables in current schema:");
        for (String t : actualTables) {
            boolean isExpected = expectedTables.contains(t);
            System.out.printf("   - %-25s %s\n", t, isExpected ? "[VERIFIED]" : "[UNEXPECTED]");
        }

        for (String exp : expectedTables) {
            if (!actualTables.contains(exp)) {
                throw new RuntimeException("Missing expected table: " + exp);
            }
        }
    }

    private static void verifyHypertables(Connection conn) throws SQLException {
        String sql = "SELECT hypertable_name FROM timescaledb_information.hypertables;";
        try (Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            boolean foundBaggageTracking = false;
            while (rs.next()) {
                String ht = rs.getString(1);
                System.out.println("  Hypertable: " + ht);
                if (ht.equalsIgnoreCase("baggage_tracking")) {
                    foundBaggageTracking = true;
                }
            }
            if (foundBaggageTracking) {
                System.out.println("  [VERIFIED] BAGGAGE_TRACKING is registered as a TimescaleDB hypertable!");
            } else {
                throw new RuntimeException("BAGGAGE_TRACKING is not listed in timescaledb_information.hypertables!");
            }
        }
    }

    private static void verifyRowCounts(Connection conn) throws SQLException {
        String[] tables = {
                "airlines", "airport", "employee", "passenger", "passenger_phone",
                "baggage", "flight", "reservation", "ticket", "payment",
                "ticket_baggage", "baggage_tracking", "flight_status_history"
        };

        try (Statement stmt = conn.createStatement()) {
            for (String table : tables) {
                try (ResultSet rs = stmt.executeQuery("SELECT COUNT(*) FROM " + table)) {
                    if (rs.next()) {
                        System.out.printf("  Table %-24s : %d rows\n", table, rs.getLong(1));
                    }
                }
            }
        }
    }
}
