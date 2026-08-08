package br.ufpb.dsc.mercado.repository;

import br.ufpb.dsc.mercado.domain.Favorito;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FavoritoRepository extends JpaRepository<Favorito, Long> {
    List<Favorito> findByUsuarioId(Long usuarioId);
    boolean existsByUsuarioIdAndProdutoId(Long usuarioId, Long produtoId);
    void deleteByUsuarioIdAndProdutoId(Long usuarioId, Long produtoId);
}
