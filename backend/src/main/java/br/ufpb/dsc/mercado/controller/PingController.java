package br.ufpb.dsc.mercado.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;

@RestController
public class PingController {

    private final JdbcTemplate jdbcTemplate;

    public PingController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @GetMapping("/ping")
    public ResponseEntity<Map<String, Object>> ping() {
        String dbStatus;
        boolean dbUp = false;
        try {
            Integer result = jdbcTemplate.queryForObject("SELECT 1", Integer.class);
            if (result != null && result == 1) {
                dbStatus = "up";
                dbUp = true;
            } else {
                dbStatus = "down (unexpected result)";
            }
        } catch (Exception e) {
            dbStatus = "down (" + e.getMessage() + ")";
        }

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("status", dbUp ? "ok" : "error");
        response.put("database", dbStatus);
        response.put("service", "eq06");
        response.put("timestamp", Instant.now().toString());

        if (dbUp) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(response);
        }
    }
}
