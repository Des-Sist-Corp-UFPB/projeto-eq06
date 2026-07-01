package br.ufpb.dsc.mercado.controller;

import br.ufpb.dsc.mercado.service.GeminiService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ChatIAController.class)
@AutoConfigureMockMvc(addFilters = false)
public class ChatIAControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private GeminiService geminiService;

    @Test
    void conversar_ComSucesso_RetornaRespostaDaIA() throws Exception {
        when(geminiService.perguntar("Olá")).thenReturn("Resposta da IA");

        mockMvc.perform(post("/api/chat/ia")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"mensagem\": \"Olá\"}"))
                .andExpect(status().isOk())
                .andExpect(content().string("Resposta da IA"));

        verify(geminiService, times(1)).perguntar("Olá");
    }
}
