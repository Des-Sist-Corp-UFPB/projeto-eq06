package br.ufpb.dsc.mercado.controller;

import br.ufpb.dsc.mercado.repository.ProdutoRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/admin/chat")
public class AdminChatController {

    private final ProdutoRepository produtoRepository;

    public AdminChatController(ProdutoRepository produtoRepository) {
        this.produtoRepository = produtoRepository;
    }

    @PostMapping
    public ResponseEntity<Map<String, String>> chat(@RequestBody Map<String, String> request) {
        String message = request.getOrDefault("message", "").toLowerCase();
        String reply = "Desculpe, não entendi. Você pode me perguntar sobre 'quantidade de produtos' ou 'valor total'.";

        if (message.contains("quant") && message.contains("produto")) {
            long count = produtoRepository.count();
            reply = "Atualmente, temos " + count + " produtos cadastrados no sistema.";
        } else if (message.contains("valor") && message.contains("total")) {
            BigDecimal total = produtoRepository.calcularValorTotalEstoque();
            if (total == null) total = BigDecimal.ZERO;
            reply = "O valor total de todos os produtos cadastrados é R$ " + String.format("%.2f", total) + ".";
        } else if (message.contains("olá") || message.contains("oi") || message.contains("bom dia") || message.contains("boa tarde") || message.contains("boa noite")) {
            reply = "Olá! Sou o assistente virtual do administrador. Posso informar a quantidade de produtos ou o valor total do estoque.";
        }

        Map<String, String> response = new HashMap<>();
        response.put("reply", reply);
        return ResponseEntity.ok(response);
    }
}
