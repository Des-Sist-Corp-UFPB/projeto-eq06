package br.ufpb.dsc.mercado.controller;

import java.util.Map;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.ufpb.dsc.mercado.service.GeminiService;

@RestController
@RequestMapping("/api/chat")
public class ChatIAController {

    private final GeminiService geminiService;

    public ChatIAController(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    @PostMapping("/ia")
    public String conversar(@RequestBody Map<String, String> body) {

        return geminiService.perguntar(
                body.get("mensagem")
        );
    }
}
