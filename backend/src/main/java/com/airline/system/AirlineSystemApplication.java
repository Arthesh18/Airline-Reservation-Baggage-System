package com.airline.system;

import com.airline.system.config.DotenvEnvironmentPostProcessor;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class AirlineSystemApplication {

    public static void main(String[] args) {
        // Pre-load .env into system properties before SpringApplication boots
        DotenvEnvironmentPostProcessor.loadDotenv(null);
        SpringApplication.run(AirlineSystemApplication.class, args);
    }
}
