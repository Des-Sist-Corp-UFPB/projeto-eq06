package br.ufpb.dsc.mercado.controller;

import br.ufpb.dsc.mercado.domain.Produto;
import br.ufpb.dsc.mercado.dto.ProdutoForm;
import br.ufpb.dsc.mercado.service.ProdutoService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import br.ufpb.dsc.mercado.aspect.AuditAction;

/**
 * REST Controller para operações de produtos.
 */
@RestController
@RequestMapping("/api/produtos")
public class ProdutoController {

    private static final int TAMANHO_PAGINA = 10;

    private final ProdutoService produtoService;

    public ProdutoController(ProdutoService produtoService) {
        this.produtoService = produtoService;
    }

    @GetMapping
    public ResponseEntity<Page<Produto>> listar(
            @RequestParam(name = "busca", required = false, defaultValue = "") String busca,
            @RequestParam(name = "pagina", defaultValue = "0") int pagina) {

        PageRequest pageRequest = PageRequest.of(pagina, TAMANHO_PAGINA, Sort.by("nome").ascending());
        Page<Produto> produtos = produtoService.buscar(busca, pageRequest);

        return ResponseEntity.ok(produtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Produto> buscarPorId(@PathVariable Long id) {
        Produto produto = produtoService.buscarPorId(id);
        return ResponseEntity.ok(produto);
    }

    @PostMapping
    @AuditAction("CRIAR_PRODUTO")
    public ResponseEntity<Produto> criar(@Valid @RequestBody ProdutoForm form) {
        Produto novoProduto = produtoService.criar(form);
        return ResponseEntity.status(HttpStatus.CREATED).body(novoProduto);
    }

    @PutMapping("/{id}")
    @AuditAction("ATUALIZAR_PRODUTO")
    public ResponseEntity<Produto> atualizar(
            @PathVariable Long id,
            @Valid @RequestBody ProdutoForm form) {

        Produto produtoAtualizado = produtoService.atualizar(id, form);
        return ResponseEntity.ok(produtoAtualizado);
    }

    @DeleteMapping("/{id}")
    @AuditAction("EXCLUIR_PRODUTO")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        produtoService.excluir(id);
        return ResponseEntity.noContent().build();
    }
}
