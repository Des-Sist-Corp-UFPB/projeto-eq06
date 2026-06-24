package br.ufpb.dsc.mercado.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import br.ufpb.dsc.mercado.domain.Mensagem;
import br.ufpb.dsc.mercado.dto.MensagemForm;
import br.ufpb.dsc.mercado.service.MensagemService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/mensagens")
public class MensagemController {

    private final MensagemService mensagemService;

    public MensagemController(MensagemService mensagemService) {
        this.mensagemService = mensagemService;
    }

    @GetMapping("/produto/{produtoId}")
    public ResponseEntity<List<Mensagem>> listar(
            @PathVariable Long produtoId,
            @RequestParam Long userId) {

        return ResponseEntity.ok(
                mensagemService.listarPorProduto(produtoId, userId)
        );
    }

    @PostMapping
    public ResponseEntity<Mensagem> criar(
            @Valid @RequestBody MensagemForm form) {

        Mensagem mensagem = mensagemService.criar(form);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(mensagem);
    }
}