package br.ufpb.dsc.mercado.controller;

import br.ufpb.dsc.mercado.domain.Produto;
import br.ufpb.dsc.mercado.dto.ProdutoForm;
import br.ufpb.dsc.mercado.service.ProdutoService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ProdutoController.class)
@AutoConfigureMockMvc(addFilters = false)
class ProdutoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ProdutoService produtoService;

    @Autowired
    private ObjectMapper objectMapper;

    private Produto produtoMock;

    @BeforeEach
    void setUp() {
        produtoMock = new Produto("Teste", "Desc", new BigDecimal("10.00"));
        produtoMock.setId(1L);
    }

    @Test
    void listar_deveRetornarPaginaDeProdutos() throws Exception {
        Page<Produto> page = new PageImpl<>(List.of(produtoMock));
        when(produtoService.buscar(eq(""), any(PageRequest.class))).thenReturn(page);

        mockMvc.perform(get("/api/produtos"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].nome").value("Teste"))
                .andExpect(jsonPath("$.content[0].id").value(1));
    }

    @Test
    void buscarPorId_deveRetornarProduto() throws Exception {
        when(produtoService.buscarPorId(1L)).thenReturn(produtoMock);

        mockMvc.perform(get("/api/produtos/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nome").value("Teste"));
    }

    @Test
    void criar_deveRetornarProdutoCriado() throws Exception {
        ProdutoForm form = new ProdutoForm("Novo", "Desc", new BigDecimal("20.0"), null);
        Produto novo = new Produto("Novo", "Desc", new BigDecimal("20.0"));
        novo.setId(2L);

        when(produtoService.criar(any(ProdutoForm.class))).thenReturn(novo);

        mockMvc.perform(post("/api/produtos")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(form)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.nome").value("Novo"));
    }

    @Test
    void atualizar_deveRetornarProdutoAtualizado() throws Exception {
        ProdutoForm form = new ProdutoForm("Atualizado", "Desc", new BigDecimal("20.0"), null);
        Produto atualizado = new Produto("Atualizado", "Desc", new BigDecimal("20.0"));
        atualizado.setId(1L);

        when(produtoService.atualizar(eq(1L), any(ProdutoForm.class))).thenReturn(atualizado);

        mockMvc.perform(put("/api/produtos/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(form)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nome").value("Atualizado"));
    }

    @Test
    void excluir_deveRetornarNoContent() throws Exception {
        doNothing().when(produtoService).excluir(1L);

        mockMvc.perform(delete("/api/produtos/1"))
                .andExpect(status().isNoContent());
    }
}
