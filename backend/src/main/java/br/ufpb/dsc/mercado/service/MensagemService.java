package br.ufpb.dsc.mercado.service;

import java.util.List;

import org.springframework.stereotype.Service;

import br.ufpb.dsc.mercado.domain.Mensagem;
import br.ufpb.dsc.mercado.dto.MensagemForm;
import br.ufpb.dsc.mercado.repository.MensagemRepository;

@Service
public class MensagemService {

    private final MensagemRepository mensagemRepository;

    public MensagemService(MensagemRepository mensagemRepository) {
        this.mensagemRepository = mensagemRepository;
    }

    public List<Mensagem> listarPorProduto(Long produtoId, Long userId) {
    return mensagemRepository
            .findByProdutoIdOrderByEnviadaEmAsc(produtoId);
    }

    public Mensagem criar(MensagemForm form) {

        Mensagem mensagem = new Mensagem(
                form.produtoId(),
                form.remetenteId(),
                form.texto()
        );

        return mensagemRepository.save(mensagem);
    }
}