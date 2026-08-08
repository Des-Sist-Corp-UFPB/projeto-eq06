package br.ufpb.dsc.mercado.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import br.ufpb.dsc.mercado.domain.Mensagem;

public interface MensagemRepository
        extends JpaRepository<Mensagem, Long> {

    List<Mensagem> findByProdutoIdOrderByEnviadaEmAsc(Long produtoId);

}