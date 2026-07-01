package br.ufpb.dsc.mercado.service;

import br.ufpb.dsc.mercado.domain.Mensagem;
import br.ufpb.dsc.mercado.dto.MensagemForm;
import br.ufpb.dsc.mercado.repository.MensagemRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class MensagemServiceTest {

    @Mock
    private MensagemRepository mensagemRepository;

    @InjectMocks
    private MensagemService mensagemService;

    private Mensagem mensagemMock;
    private MensagemForm formMock;

    @BeforeEach
    void setUp() {
        mensagemMock = new Mensagem(1L, 2L, "Olá, tudo bem?");
        formMock = new MensagemForm(1L, 2L, "Olá, tudo bem?");
    }

    @Test
    void listarPorProduto_RetornaListaDeMensagens() {
        when(mensagemRepository.findByProdutoIdOrderByEnviadaEmAsc(1L)).thenReturn(List.of(mensagemMock));

        List<Mensagem> resultado = mensagemService.listarPorProduto(1L, 2L);

        assertNotNull(resultado);
        assertEquals(1, resultado.size());
        assertEquals("Olá, tudo bem?", resultado.get(0).getTexto());
        verify(mensagemRepository, times(1)).findByProdutoIdOrderByEnviadaEmAsc(1L);
    }

    @Test
    void criar_SalvaERetornaMensagem() {
        when(mensagemRepository.save(any(Mensagem.class))).thenReturn(mensagemMock);

        Mensagem resultado = mensagemService.criar(formMock);

        assertNotNull(resultado);
        assertEquals(1L, resultado.getProdutoId());
        assertEquals(2L, resultado.getRemetenteId());
        assertEquals("Olá, tudo bem?", resultado.getTexto());
        verify(mensagemRepository, times(1)).save(any(Mensagem.class));
    }
}
