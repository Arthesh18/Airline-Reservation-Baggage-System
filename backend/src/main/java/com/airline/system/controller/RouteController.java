
package com.airline.system.controller;

import com.airline.system.service.RouteService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/routes")
public class RouteController {

    private final RouteService routeService;

    public RouteController(RouteService routeService) {
        this.routeService = routeService;
    }

    @GetMapping
    public ResponseEntity<?> searchRoutes(
            @RequestParam(required = false) String source,
            @RequestParam(required = false) String destination) {

        if (source == null || source.isBlank()
                || destination == null || destination.isBlank()) {

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of(
                            "error", "Bad Request",
                            "message",
                            "Both source and destination are required."
                    ));
        }

        source = source.trim().toUpperCase();
        destination = destination.trim().toUpperCase();

        if (source.equals(destination)) {
            return ResponseEntity
                    .badRequest()
                    .body(Map.of(
                            "error", "Bad Request",
                            "message",
                            "Source and destination must be different."
                    ));
        }

        List<Map<String, Object>> routes =
                routeService.searchRoutes(source, destination);

        return ResponseEntity.ok(routes);
    }
}
