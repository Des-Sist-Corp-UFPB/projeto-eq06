package br.ufpb.dsc.mercado.controller;

import br.ufpb.dsc.mercado.domain.Mensagem;
import br.ufpb.dsc.mercado.dto.MensagemForm;
import br.ufpb.dsc.mercado.service.MensagemService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(MensagemController.class)
@AutoConfigureMockMvc(addFilters = false)
public class MensagemControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private MensagemService mensagemService;

    @Test
    void listar_RetornaStatusOkEMensagens() throws Exception {
        Mensagem msg = new Mensagem(1L, 2L, "Olá");
        when(mensagemService.listarPorProduto(1L, 2L)).thenReturn(List.of(msg));

        mockMvc.perform(get("/api/mensagens/produto/1")
                        .param("userId", "2")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].texto").value("Olá"));

        verify(mensagemService, times(1)).listarPorProduto(1L, 2L);
    }

    @Test
    void criar_SalvaERetornaMensagemCriada() throws Exception {
        Mensagem msg = new Mensagem(1L, 2L, "Olá");
        when(mensagemService.criar(any(MensagemForm.class))).thenReturn(msg);

        mockMvc.perform(post("/api/mensagens")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"produtoId\": 1, \"remetenteId\": 2, \"texto\": \"Olá\"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.texto").value("Olá"));

        verify(mensagemService, times(1)).criar(any(MensagemForm.class));
    }
}
