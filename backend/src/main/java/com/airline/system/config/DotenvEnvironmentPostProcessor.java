package com.airline.system.config;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.env.EnvironmentPostProcessor;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;

/**
 * Automatically loads .env file properties into the Spring Environment and
 * System properties prior to DataSource/HikariCP initialization.
 * Operates during both SpringApplication.run() and @SpringBootTest execution.
 */
@Order(Ordered.HIGHEST_PRECEDENCE)
public class DotenvEnvironmentPostProcessor implements EnvironmentPostProcessor {

    private static final String PROPERTY_SOURCE_NAME = "dotenvProperties";

    @Override
    public void postProcessEnvironment(ConfigurableEnvironment environment,
                                       SpringApplication application) {
        loadDotenv(environment);
    }

    public static void loadDotenv(ConfigurableEnvironment environment) {
        Map<String, Object> envProperties = findAndLoadEnvFile();

        if (!envProperties.isEmpty()) {
            if (environment != null && !environment.getPropertySources().contains(PROPERTY_SOURCE_NAME)) {
                environment.getPropertySources()
                        .addFirst(new MapPropertySource(PROPERTY_SOURCE_NAME, envProperties));
            }

            // Also populate System properties so early driver initializers can read them
            for (Map.Entry<String, Object> entry : envProperties.entrySet()) {
                if (System.getProperty(entry.getKey()) == null && System.getenv(entry.getKey()) == null) {
                    System.setProperty(entry.getKey(), String.valueOf(entry.getValue()));
                }
            }
        }
    }

    public static Map<String, Object> findAndLoadEnvFile() {
        Map<String, Object> properties = new HashMap<>();

        // Candidate paths to search for .env
        Path[] candidatePaths = new Path[]{
                Paths.get(".env"),
                Paths.get("../.env"),
                Paths.get("backend", ".env"),
                Paths.get(System.getProperty("user.dir", "."), ".env"),
                Paths.get(System.getProperty("user.dir", "."), "..", ".env")
        };

        Path foundPath = null;
        for (Path path : candidatePaths) {
            if (Files.isRegularFile(path)) {
                foundPath = path.toAbsolutePath().normalize();
                break;
            }
        }

        if (foundPath != null) {
            try (BufferedReader reader = Files.newBufferedReader(foundPath, StandardCharsets.UTF_8)) {
                String line;
                while ((line = reader.readLine()) != null) {
                    line = line.trim();
                    if (line.isEmpty() || line.startsWith("#")) {
                        continue;
                    }
                    int eqIdx = line.indexOf('=');
                    if (eqIdx > 0) {
                        String key = line.substring(0, eqIdx).trim();
                        String value = line.substring(eqIdx + 1).trim();

                        // Strip wrapping quotes if present
                        if ((value.startsWith("\"") && value.endsWith("\"")) ||
                                (value.startsWith("'") && value.endsWith("'"))) {
                            value = value.substring(1, value.length() - 1);
                        }

                        properties.put(key, value);
                    }
                }
            } catch (IOException ignored) {
                // Ignore and proceed with environment variables
            }
        }

        return properties;
    }
}
