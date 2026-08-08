package br.ufpb.dsc.mercado.repository;

import br.ufpb.dsc.mercado.domain.Carrinho;
import br.ufpb.dsc.mercado.domain.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CarrinhoRepository extends JpaRepository<Carrinho, Long> {
    Optional<Carrinho> findByUsuario(Usuario usuario);
}
