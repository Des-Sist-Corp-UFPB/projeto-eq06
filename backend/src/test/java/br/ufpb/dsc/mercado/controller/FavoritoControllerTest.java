package br.ufpb.dsc.mercado.controller;

import br.ufpb.dsc.mercado.domain.Favorito;
import br.ufpb.dsc.mercado.domain.Produto;
import br.ufpb.dsc.mercado.domain.Usuario;
import br.ufpb.dsc.mercado.repository.FavoritoRepository;
import br.ufpb.dsc.mercado.repository.ProdutoRepository;
import br.ufpb.dsc.mercado.repository.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;

@WebMvcTest(FavoritoController.class)
@AutoConfigureMockMvc(addFilters = false)
public class FavoritoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private FavoritoRepository favoritoRepository;

    @MockBean
    private ProdutoRepository produtoRepository;

    @MockBean
    private UsuarioRepository usuarioRepository;

    private Usuario usuario;
    private Produto produto;
    private Favorito favorito;

    @BeforeEach
    void setUp() {
        usuario = new Usuario();
        usuario.setId(1L);
        usuario.setNome("Usuario 1");

        produto = new Produto();
        produto.setId(10L);
        produto.setNome("Produto 1");

        favorito = new Favorito();
        favorito.setId(100L);
        favorito.setUsuario(usuario);
        favorito.setProduto(produto);
    }

    @Test
    void listarFavoritos_RetornaListaDeProdutos() throws Exception {
        when(favoritoRepository.findByUsuarioId(1L)).thenReturn(List.of(favorito));

        mockMvc.perform(get("/api/usuarios/1/favoritos"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(10))
                .andExpect(jsonPath("$[0].nome").value("Produto 1"));
    }

    @Test
    void adicionarFavorito_ProdutoNaoFavoritado_RetornaOk() throws Exception {
        when(favoritoRepository.existsByUsuarioIdAndProdutoId(1L, 10L)).thenReturn(false);
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));
        when(produtoRepository.findById(10L)).thenReturn(Optional.of(produto));

        mockMvc.perform(post("/api/usuarios/1/favoritos/10"))
                .andExpect(status().isOk());

        verify(favoritoRepository, times(1)).save(any(Favorito.class));
    }

    @Test
    void adicionarFavorito_ProdutoJaFavoritado_RetornaBadRequest() throws Exception {
        when(favoritoRepository.existsByUsuarioIdAndProdutoId(1L, 10L)).thenReturn(true);

        mockMvc.perform(post("/api/usuarios/1/favoritos/10"))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Produto já favoritado"));

        verify(favoritoRepository, never()).save(any(Favorito.class));
    }

    @Test
    void removerFavorito_RetornaOk() throws Exception {
        mockMvc.perform(delete("/api/usuarios/1/favoritos/10"))
                .andExpect(status().isOk());

        verify(favoritoRepository, times(1)).deleteByUsuarioIdAndProdutoId(1L, 10L);
    }
}
