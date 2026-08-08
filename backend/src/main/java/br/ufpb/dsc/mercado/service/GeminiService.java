package br.ufpb.dsc.mercado.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import br.ufpb.dsc.mercado.dto.GeminiResponse;

@Service
public class GeminiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    private final RestClient restClient = RestClient.create();

    public String perguntar(String pergunta) {
        String url =
                "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key="
                        + apiKey;

        Map<String, Object> body = Map.of(
                "contents",
                List.of(
                        Map.of(
                                "parts",
                                List.of(
                                        Map.of(
                                                "text",
                                                pergunta
                                        )
                                )
                        )
                )
        );

        GeminiResponse response = restClient.post()
                .uri(url)
                .body(body)
                .retrieve()
                .body(GeminiResponse.class);

        return response.candidates()
                .get(0)
                .content()
                .parts()
                .get(0)
                .text();
    }
}