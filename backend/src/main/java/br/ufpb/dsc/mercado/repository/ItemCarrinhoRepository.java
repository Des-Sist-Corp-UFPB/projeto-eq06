package br.ufpb.dsc.mercado.repository;

import br.ufpb.dsc.mercado.domain.ItemCarrinho;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ItemCarrinhoRepository extends JpaRepository<ItemCarrinho, Long> {
}
