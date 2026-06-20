package br.ufpb.dsc.mercado.controller;

import br.ufpb.dsc.mercado.domain.Favorito;
import br.ufpb.dsc.mercado.domain.Produto;
import br.ufpb.dsc.mercado.domain.Usuario;
import br.ufpb.dsc.mercado.repository.FavoritoRepository;
import br.ufpb.dsc.mercado.repository.ProdutoRepository;
import br.ufpb.dsc.mercado.repository.UsuarioRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios/{usuarioId}/favoritos")
public class FavoritoController {

    private final FavoritoRepository favoritoRepository;
    private final ProdutoRepository produtoRepository;
    private final UsuarioRepository usuarioRepository;

    public FavoritoController(FavoritoRepository favoritoRepository, ProdutoRepository produtoRepository, UsuarioRepository usuarioRepository) {
        this.favoritoRepository = favoritoRepository;
        this.produtoRepository = produtoRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @GetMapping
    public ResponseEntity<List<Produto>> listarFavoritos(@PathVariable Long usuarioId) {
        List<Produto> produtos = favoritoRepository.findByUsuarioId(usuarioId).stream()
            .map(Favorito::getProduto)
            .toList();
        return ResponseEntity.ok(produtos);
    }

    @PostMapping("/{produtoId}")
    public ResponseEntity<?> adicionarFavorito(@PathVariable Long usuarioId, @PathVariable Long produtoId) {
        if (favoritoRepository.existsByUsuarioIdAndProdutoId(usuarioId, produtoId)) {
            return ResponseEntity.badRequest().body("Produto já favoritado");
        }
        Usuario usuario = usuarioRepository.findById(usuarioId).orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado"));
        Produto produto = produtoRepository.findById(produtoId).orElseThrow(() -> new IllegalArgumentException("Produto não encontrado"));
        
        Favorito fav = new Favorito();
        fav.setUsuario(usuario);
        fav.setProduto(produto);
        favoritoRepository.save(fav);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{produtoId}")
    @Transactional
    public ResponseEntity<?> removerFavorito(@PathVariable Long usuarioId, @PathVariable Long produtoId) {
        favoritoRepository.deleteByUsuarioIdAndProdutoId(usuarioId, produtoId);
        return ResponseEntity.ok().build();
    }
}
