package br.ufpb.dsc.mercado.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.Map;

@RestController
public class PingController {

    private final JdbcTemplate jdbcTemplate;

    public PingController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @GetMapping("/ping")
    public ResponseEntity<Map<String, Object>> ping() {
        try {
            // Executa uma query simples para verificar a conexão com o banco
            jdbcTemplate.execute("SELECT 1");
            
            return ResponseEntity.ok(Map.of(
                "status", "ok",
                "service", "eq06",
                "database", "ok",
                "timestamp", Instant.now().toString()
            ));
        } catch (Exception e) {
            // Em caso de falha, retorna um erro 503 (Service Unavailable)
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(Map.of(
                "status", "error",
                "service", "eq06",
                "database", "down",
                "timestamp", Instant.now().toString()
            ));
        }
    }
}
