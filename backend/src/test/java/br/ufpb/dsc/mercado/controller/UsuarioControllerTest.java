package br.ufpb.dsc.mercado.controller;

import br.ufpb.dsc.mercado.domain.Usuario;
import br.ufpb.dsc.mercado.dto.UsuarioForm;
import br.ufpb.dsc.mercado.service.UsuarioService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;

@WebMvcTest(UsuarioController.class)
@AutoConfigureMockMvc(addFilters = false)
class UsuarioControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UsuarioService usuarioService;

    @Autowired
    private ObjectMapper objectMapper;

    private UsuarioForm form;
    private Usuario usuarioMock;

    @BeforeEach
    void setUp() {
        form = new UsuarioForm("Teste", "teste@teste.com", "12345678901", "123456");
        
        usuarioMock = new Usuario();
        usuarioMock.setId(1L);
        usuarioMock.setNome("Teste");
        usuarioMock.setEmail("teste@teste.com");
    }

    @Test
    void criarConta_ComDadosValidos_Retorna201() throws Exception {
        when(usuarioService.criar(any(UsuarioForm.class))).thenReturn(usuarioMock);

        mockMvc.perform(post("/api/usuarios")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(form)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.nome").value("Teste"))
                .andExpect(jsonPath("$.email").value("teste@teste.com"));
    }

    @Test
    void criarConta_ComEmailExistente_Retorna400() throws Exception {
        when(usuarioService.criar(any(UsuarioForm.class)))
                .thenThrow(new IllegalArgumentException("E-mail já está em uso."));

        mockMvc.perform(post("/api/usuarios")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(form)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("E-mail já está em uso."));
    }
}
