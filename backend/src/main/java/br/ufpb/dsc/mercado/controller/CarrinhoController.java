package br.ufpb.dsc.mercado.controller;

import br.ufpb.dsc.mercado.dto.AdicionarItemDTO;
import br.ufpb.dsc.mercado.dto.CarrinhoDTO;
import br.ufpb.dsc.mercado.service.CarrinhoService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/carrinho")
public class CarrinhoController {

    private final CarrinhoService carrinhoService;

    public CarrinhoController(CarrinhoService carrinhoService) {
        this.carrinhoService = carrinhoService;
    }

    @GetMapping
    public ResponseEntity<CarrinhoDTO> obterCarrinho(@RequestHeader("user-id") Long usuarioId) {
        return ResponseEntity.ok(carrinhoService.obterCarrinhoDoUsuario(usuarioId));
    }

    @PostMapping("/itens")
    public ResponseEntity<CarrinhoDTO> adicionarItem(
            @RequestHeader("user-id") Long usuarioId,
            @Valid @RequestBody AdicionarItemDTO dto) {
        return ResponseEntity.ok(carrinhoService.adicionarItem(usuarioId, dto));
    }

    @PutMapping("/itens/{produtoId}")
    public ResponseEntity<CarrinhoDTO> atualizarQuantidade(
            @RequestHeader("user-id") Long usuarioId,
            @PathVariable Long produtoId,
            @RequestParam Integer quantidade) {
        return ResponseEntity.ok(carrinhoService.atualizarQuantidade(usuarioId, produtoId, quantidade));
    }

    @DeleteMapping("/itens/{produtoId}")
    public ResponseEntity<CarrinhoDTO> removerItem(
            @RequestHeader("user-id") Long usuarioId,
            @PathVariable Long produtoId) {
        return ResponseEntity.ok(carrinhoService.removerItem(usuarioId, produtoId));
    }

    @DeleteMapping
    public ResponseEntity<CarrinhoDTO> limparCarrinho(@RequestHeader("user-id") Long usuarioId) {
        return ResponseEntity.ok(carrinhoService.limparCarrinho(usuarioId));
    }
}
