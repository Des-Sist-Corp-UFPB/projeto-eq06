package br.ufpb.dsc.mercado.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.Map;

@RestController
public class PingController {

    @GetMapping("/ping")
    public Map<String, Object> ping() {
        return Map.of(
            "status", "ok",
            "service", "eq06",
            "timestamp", Instant.now().toString()
        );
    }
}
