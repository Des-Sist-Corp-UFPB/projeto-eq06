package br.ufpb.dsc.mercado.service;

import br.ufpb.dsc.mercado.domain.Carrinho;
import br.ufpb.dsc.mercado.domain.ItemCarrinho;
import br.ufpb.dsc.mercado.domain.Produto;
import br.ufpb.dsc.mercado.domain.Usuario;
import br.ufpb.dsc.mercado.dto.AdicionarItemDTO;
import br.ufpb.dsc.mercado.dto.CarrinhoDTO;
import br.ufpb.dsc.mercado.exception.ResourceNotFoundException;
import br.ufpb.dsc.mercado.repository.CarrinhoRepository;
import br.ufpb.dsc.mercado.repository.ProdutoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Testes unitários para {@link CarrinhoService}.
 *
 * <p>Cobre os cenários principais de negócio do carrinho de compras:
 * obter, adicionar, atualizar quantidade, remover item e limpar carrinho.
 *
 * @author DSC - UFPB Campus IV
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("CarrinhoService — Testes Unitários")
class CarrinhoServiceTest {

    @Mock
    private CarrinhoRepository carrinhoRepository;

    @Mock
    private ProdutoRepository produtoRepository;

    @Mock
    private UsuarioService usuarioService;

    @InjectMocks
    private CarrinhoService carrinhoService;

    private Usuario usuario;
    private Produto produto;
    private Carrinho carrinho;

    @BeforeEach
    void setUp() {
        usuario = new Usuario();
        usuario.setId(1L);
        usuario.setNome("João");
        usuario.setEmail("joao@teste.com");

        produto = new Produto();
        produto.setId(10L);
        produto.setNome("Produto Teste");
        produto.setPreco(new BigDecimal("50.00"));
        produto.setImagem("imagem.png");

        carrinho = new Carrinho();
        carrinho.setId(1L);
        carrinho.setUsuario(usuario);
    }

    // =========================================================================
    // obterCarrinhoDoUsuario
    // =========================================================================

    @Test
    @DisplayName("obterCarrinhoDoUsuario — carrinho já existe — retorna DTO com itens")
    void obterCarrinho_CarrinhoExistente_RetornaDTO() {
        when(usuarioService.getUsuarioPorId(1L)).thenReturn(usuario);
        when(carrinhoRepository.findByUsuario(usuario)).thenReturn(Optional.of(carrinho));

        CarrinhoDTO resultado = carrinhoService.obterCarrinhoDoUsuario(1L);

        assertThat(resultado).isNotNull();
        assertThat(resultado.id()).isEqualTo(1L);
        assertThat(resultado.itens()).isEmpty();
        assertThat(resultado.total()).isEqualByComparingTo(BigDecimal.ZERO);
        assertThat(resultado.quantidadeTotal()).isEqualTo(0);

        verify(carrinhoRepository, never()).save(any());
    }

    @Test
    @DisplayName("obterCarrinhoDoUsuario — carrinho não existe — cria novo carrinho")
    void obterCarrinho_SemCarrinho_CriaERetornaDTO() {
        when(usuarioService.getUsuarioPorId(1L)).thenReturn(usuario);
        when(carrinhoRepository.findByUsuario(usuario)).thenReturn(Optional.empty());
        when(carrinhoRepository.save(any(Carrinho.class))).thenReturn(carrinho);

        CarrinhoDTO resultado = carrinhoService.obterCarrinhoDoUsuario(1L);

        assertThat(resultado).isNotNull();
        verify(carrinhoRepository, times(1)).save(any(Carrinho.class));
    }

    // =========================================================================
    // adicionarItem
    // =========================================================================

    @Test
    @DisplayName("adicionarItem — produto novo — adiciona item ao carrinho")
    void adicionarItem_ProdutoNovo_AdicionaItemNoCarrinho() {
        AdicionarItemDTO dto = new AdicionarItemDTO(10L, 2);

        when(usuarioService.getUsuarioPorId(1L)).thenReturn(usuario);
        when(carrinhoRepository.findByUsuario(usuario)).thenReturn(Optional.of(carrinho));
        when(produtoRepository.findById(10L)).thenReturn(Optional.of(produto));
        when(carrinhoRepository.save(any(Carrinho.class))).thenReturn(carrinho);

        CarrinhoDTO resultado = carrinhoService.adicionarItem(1L, dto);

        assertThat(resultado).isNotNull();
        assertThat(carrinho.getItens()).hasSize(1);
        assertThat(carrinho.getItens().get(0).getQuantidade()).isEqualTo(2);
        verify(carrinhoRepository, times(1)).save(carrinho);
    }

    @Test
    @DisplayName("adicionarItem — produto já existe no carrinho — incrementa quantidade")
    void adicionarItem_ProdutoExistente_IncrementaQuantidade() {
        // Adiciona o produto uma vez diretamente no carrinho
        ItemCarrinho itemExistente = new ItemCarrinho(carrinho, produto, 3);
        carrinho.adicionarItem(itemExistente);

        AdicionarItemDTO dto = new AdicionarItemDTO(10L, 2);

        when(usuarioService.getUsuarioPorId(1L)).thenReturn(usuario);
        when(carrinhoRepository.findByUsuario(usuario)).thenReturn(Optional.of(carrinho));
        when(produtoRepository.findById(10L)).thenReturn(Optional.of(produto));
        when(carrinhoRepository.save(any(Carrinho.class))).thenReturn(carrinho);

        carrinhoService.adicionarItem(1L, dto);

        // Quantidade deve ser 3 + 2 = 5
        assertThat(carrinho.getItens()).hasSize(1);
        assertThat(carrinho.getItens().get(0).getQuantidade()).isEqualTo(5);
    }

    @Test
    @DisplayName("adicionarItem — produto não encontrado — lança ResourceNotFoundException")
    void adicionarItem_ProdutoNaoEncontrado_LancaException() {
        AdicionarItemDTO dto = new AdicionarItemDTO(99L, 1);

        when(usuarioService.getUsuarioPorId(1L)).thenReturn(usuario);
        when(carrinhoRepository.findByUsuario(usuario)).thenReturn(Optional.of(carrinho));
        when(produtoRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> carrinhoService.adicionarItem(1L, dto))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Produto não encontrado.");

        verify(carrinhoRepository, never()).save(any());
    }

    @Test
    @DisplayName("adicionarItem — carrinho não existe — cria carrinho e adiciona item")
    void adicionarItem_SemCarrinho_CriaCarrinhoEAdiciona() {
        AdicionarItemDTO dto = new AdicionarItemDTO(10L, 1);

        when(usuarioService.getUsuarioPorId(1L)).thenReturn(usuario);
        when(carrinhoRepository.findByUsuario(usuario)).thenReturn(Optional.empty());
        when(carrinhoRepository.save(any(Carrinho.class))).thenReturn(carrinho);
        when(produtoRepository.findById(10L)).thenReturn(Optional.of(produto));

        CarrinhoDTO resultado = carrinhoService.adicionarItem(1L, dto);

        assertThat(resultado).isNotNull();
        // save é chamado duas vezes: uma para criar o carrinho, outra para salvar o item
        verify(carrinhoRepository, times(2)).save(any(Carrinho.class));
    }

    // =========================================================================
    // atualizarQuantidade
    // =========================================================================

    @Test
    @DisplayName("atualizarQuantidade — quantidade válida — atualiza e retorna DTO")
    void atualizarQuantidade_QuantidadeValida_AtualizaItem() {
        ItemCarrinho item = new ItemCarrinho(carrinho, produto, 2);
        carrinho.adicionarItem(item);

        when(usuarioService.getUsuarioPorId(1L)).thenReturn(usuario);
        when(carrinhoRepository.findByUsuario(usuario)).thenReturn(Optional.of(carrinho));
        when(carrinhoRepository.save(any(Carrinho.class))).thenReturn(carrinho);

        CarrinhoDTO resultado = carrinhoService.atualizarQuantidade(1L, 10L, 5);

        assertThat(resultado).isNotNull();
        assertThat(item.getQuantidade()).isEqualTo(5);
        verify(carrinhoRepository, times(1)).save(carrinho);
    }

    @Test
    @DisplayName("atualizarQuantidade — quantidade zero — remove o item")
    void atualizarQuantidade_QuantidadeZero_RemoveItem() {
        ItemCarrinho item = new ItemCarrinho(carrinho, produto, 1);
        carrinho.adicionarItem(item);

        when(usuarioService.getUsuarioPorId(1L)).thenReturn(usuario);
        when(carrinhoRepository.findByUsuario(usuario)).thenReturn(Optional.of(carrinho));
        when(carrinhoRepository.save(any(Carrinho.class))).thenReturn(carrinho);

        CarrinhoDTO resultado = carrinhoService.atualizarQuantidade(1L, 10L, 0);

        assertThat(resultado).isNotNull();
        // Item deve ter sido removido
        verify(carrinhoRepository, atLeastOnce()).save(any(Carrinho.class));
    }

    @Test
    @DisplayName("atualizarQuantidade — carrinho não encontrado — lança ResourceNotFoundException")
    void atualizarQuantidade_SemCarrinho_LancaException() {
        when(usuarioService.getUsuarioPorId(1L)).thenReturn(usuario);
        when(carrinhoRepository.findByUsuario(usuario)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> carrinhoService.atualizarQuantidade(1L, 10L, 3))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Carrinho não encontrado.");
    }

    @Test
    @DisplayName("atualizarQuantidade — produto não está no carrinho — lança ResourceNotFoundException")
    void atualizarQuantidade_ProdutoNaoNoCarrinho_LancaException() {
        when(usuarioService.getUsuarioPorId(1L)).thenReturn(usuario);
        when(carrinhoRepository.findByUsuario(usuario)).thenReturn(Optional.of(carrinho));

        assertThatThrownBy(() -> carrinhoService.atualizarQuantidade(1L, 99L, 3))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Produto não está no carrinho.");
    }

    // =========================================================================
    // removerItem
    // =========================================================================

    @Test
    @DisplayName("removerItem — item existe — remove e retorna carrinho atualizado")
    void removerItem_ItemExistente_RemoveERetornaDTO() {
        ItemCarrinho item = new ItemCarrinho(carrinho, produto, 1);
        carrinho.adicionarItem(item);

        when(usuarioService.getUsuarioPorId(1L)).thenReturn(usuario);
        when(carrinhoRepository.findByUsuario(usuario)).thenReturn(Optional.of(carrinho));
        when(carrinhoRepository.save(any(Carrinho.class))).thenReturn(carrinho);

        CarrinhoDTO resultado = carrinhoService.removerItem(1L, 10L);

        assertThat(resultado).isNotNull();
        assertThat(carrinho.getItens()).isEmpty();
        verify(carrinhoRepository, times(1)).save(carrinho);
    }

    @Test
    @DisplayName("removerItem — carrinho não encontrado — lança ResourceNotFoundException")
    void removerItem_SemCarrinho_LancaException() {
        when(usuarioService.getUsuarioPorId(1L)).thenReturn(usuario);
        when(carrinhoRepository.findByUsuario(usuario)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> carrinhoService.removerItem(1L, 10L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Carrinho não encontrado.");
    }

    @Test
    @DisplayName("removerItem — produto não está no carrinho — lança ResourceNotFoundException")
    void removerItem_ProdutoNaoNoCarrinho_LancaException() {
        when(usuarioService.getUsuarioPorId(1L)).thenReturn(usuario);
        when(carrinhoRepository.findByUsuario(usuario)).thenReturn(Optional.of(carrinho));

        assertThatThrownBy(() -> carrinhoService.removerItem(1L, 99L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Produto não está no carrinho.");
    }

    // =========================================================================
    // limparCarrinho
    // =========================================================================

    @Test
    @DisplayName("limparCarrinho — com itens — remove todos os itens e retorna DTO vazio")
    void limparCarrinho_ComItens_RetornaCarrinhoVazio() {
        ItemCarrinho item1 = new ItemCarrinho(carrinho, produto, 2);
        Produto produto2 = new Produto();
        produto2.setId(20L);
        produto2.setNome("Produto 2");
        produto2.setPreco(new BigDecimal("30.00"));
        ItemCarrinho item2 = new ItemCarrinho(carrinho, produto2, 1);
        carrinho.adicionarItem(item1);
        carrinho.adicionarItem(item2);

        when(usuarioService.getUsuarioPorId(1L)).thenReturn(usuario);
        when(carrinhoRepository.findByUsuario(usuario)).thenReturn(Optional.of(carrinho));
        when(carrinhoRepository.save(any(Carrinho.class))).thenReturn(carrinho);

        CarrinhoDTO resultado = carrinhoService.limparCarrinho(1L);

        assertThat(resultado).isNotNull();
        assertThat(carrinho.getItens()).isEmpty();
        assertThat(resultado.total()).isEqualByComparingTo(BigDecimal.ZERO);
        assertThat(resultado.quantidadeTotal()).isEqualTo(0);
        verify(carrinhoRepository, times(1)).save(carrinho);
    }

    @Test
    @DisplayName("limparCarrinho — carrinho não encontrado — lança ResourceNotFoundException")
    void limparCarrinho_SemCarrinho_LancaException() {
        when(usuarioService.getUsuarioPorId(1L)).thenReturn(usuario);
        when(carrinhoRepository.findByUsuario(usuario)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> carrinhoService.limparCarrinho(1L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Carrinho não encontrado.");
    }

    // =========================================================================
    // Cálculo do total
    // =========================================================================

    @Test
    @DisplayName("adicionarItem — cálculo do total — total correto para múltiplos itens")
    void adicionarItem_CalculoTotal_TotalCorreto() {
        // Produto a R$ 50,00 x 2 = R$ 100,00
        ItemCarrinho itemExistente = new ItemCarrinho(carrinho, produto, 2);
        carrinho.adicionarItem(itemExistente);

        AdicionarItemDTO dto = new AdicionarItemDTO(10L, 1);

        when(usuarioService.getUsuarioPorId(1L)).thenReturn(usuario);
        when(carrinhoRepository.findByUsuario(usuario)).thenReturn(Optional.of(carrinho));
        when(produtoRepository.findById(10L)).thenReturn(Optional.of(produto));
        when(carrinhoRepository.save(any(Carrinho.class))).thenReturn(carrinho);

        // Adiciona mais 1 unidade: 2 + 1 = 3 unidades x R$ 50,00 = R$ 150,00
        CarrinhoDTO resultado = carrinhoService.adicionarItem(1L, dto);

        assertThat(resultado.total()).isEqualByComparingTo(new BigDecimal("150.00"));
        assertThat(resultado.quantidadeTotal()).isEqualTo(3);
    }
}
