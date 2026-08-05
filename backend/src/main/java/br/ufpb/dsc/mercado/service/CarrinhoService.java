package br.ufpb.dsc.mercado.service;

import br.ufpb.dsc.mercado.domain.Carrinho;
import br.ufpb.dsc.mercado.domain.ItemCarrinho;
import br.ufpb.dsc.mercado.domain.Produto;
import br.ufpb.dsc.mercado.domain.Usuario;
import br.ufpb.dsc.mercado.dto.AdicionarItemDTO;
import br.ufpb.dsc.mercado.dto.CarrinhoDTO;
import br.ufpb.dsc.mercado.dto.ItemCarrinhoDTO;
import br.ufpb.dsc.mercado.exception.ResourceNotFoundException;
import br.ufpb.dsc.mercado.repository.CarrinhoRepository;
import br.ufpb.dsc.mercado.repository.ProdutoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CarrinhoService {

    private final CarrinhoRepository carrinhoRepository;
    private final ProdutoRepository produtoRepository;
    private final UsuarioService usuarioService;

    public CarrinhoService(CarrinhoRepository carrinhoRepository,
                           ProdutoRepository produtoRepository,
                           UsuarioService usuarioService) {
        this.carrinhoRepository = carrinhoRepository;
        this.produtoRepository = produtoRepository;
        this.usuarioService = usuarioService;
    }

    @Transactional
    public CarrinhoDTO obterCarrinhoDoUsuario(Long usuarioId) {
        Usuario usuario = usuarioService.getUsuarioPorId(usuarioId);
        Carrinho carrinho = carrinhoRepository.findByUsuario(usuario)
                .orElseGet(() -> criarCarrinhoParaUsuario(usuario));
        return converterParaDTO(carrinho);
    }

    @Transactional
    public CarrinhoDTO adicionarItem(Long usuarioId, AdicionarItemDTO dto) {
        Usuario usuario = usuarioService.getUsuarioPorId(usuarioId);
        Carrinho carrinho = carrinhoRepository.findByUsuario(usuario)
                .orElseGet(() -> criarCarrinhoParaUsuario(usuario));

        Produto produto = produtoRepository.findById(dto.produtoId())
                .orElseThrow(() -> new ResourceNotFoundException("Produto não encontrado."));

        Optional<ItemCarrinho> itemExistente = carrinho.getItens().stream()
                .filter(item -> item.getProduto().getId().equals(produto.getId()))
                .findFirst();

        if (itemExistente.isPresent()) {
            ItemCarrinho item = itemExistente.get();
            item.setQuantidade(item.getQuantidade() + dto.quantidade());
        } else {
            ItemCarrinho novoItem = new ItemCarrinho(carrinho, produto, dto.quantidade());
            carrinho.adicionarItem(novoItem);
        }

        carrinho = carrinhoRepository.save(carrinho);
        return converterParaDTO(carrinho);
    }

    @Transactional
    public CarrinhoDTO atualizarQuantidade(Long usuarioId, Long produtoId, Integer quantidade) {
        Usuario usuario = usuarioService.getUsuarioPorId(usuarioId);
        Carrinho carrinho = carrinhoRepository.findByUsuario(usuario)
                .orElseThrow(() -> new ResourceNotFoundException("Carrinho não encontrado."));

        if (quantidade <= 0) {
            return removerItem(usuarioId, produtoId);
        }

        ItemCarrinho item = carrinho.getItens().stream()
                .filter(i -> i.getProduto().getId().equals(produtoId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Produto não está no carrinho."));

        item.setQuantidade(quantidade);
        carrinho = carrinhoRepository.save(carrinho);
        return converterParaDTO(carrinho);
    }

    @Transactional
    public CarrinhoDTO removerItem(Long usuarioId, Long produtoId) {
        Usuario usuario = usuarioService.getUsuarioPorId(usuarioId);
        Carrinho carrinho = carrinhoRepository.findByUsuario(usuario)
                .orElseThrow(() -> new ResourceNotFoundException("Carrinho não encontrado."));

        ItemCarrinho item = carrinho.getItens().stream()
                .filter(i -> i.getProduto().getId().equals(produtoId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Produto não está no carrinho."));

        carrinho.removerItem(item);
        carrinho = carrinhoRepository.save(carrinho);
        return converterParaDTO(carrinho);
    }

    @Transactional
    public CarrinhoDTO limparCarrinho(Long usuarioId) {
        Usuario usuario = usuarioService.getUsuarioPorId(usuarioId);
        Carrinho carrinho = carrinhoRepository.findByUsuario(usuario)
                .orElseThrow(() -> new ResourceNotFoundException("Carrinho não encontrado."));

        carrinho.getItens().clear();
        carrinho = carrinhoRepository.save(carrinho);
        return converterParaDTO(carrinho);
    }

    private Carrinho criarCarrinhoParaUsuario(Usuario usuario) {
        Carrinho novoCarrinho = new Carrinho();
        novoCarrinho.setUsuario(usuario);
        return carrinhoRepository.save(novoCarrinho);
    }

    private CarrinhoDTO converterParaDTO(Carrinho carrinho) {
        List<ItemCarrinhoDTO> itensDTO = carrinho.getItens().stream()
                .map(this::converterItemParaDTO)
                .collect(Collectors.toList());

        BigDecimal total = itensDTO.stream()
                .map(ItemCarrinhoDTO::subtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Integer quantidadeTotal = itensDTO.stream()
                .mapToInt(ItemCarrinhoDTO::quantidade)
                .sum();

        return new CarrinhoDTO(carrinho.getId(), itensDTO, total, quantidadeTotal);
    }

    private ItemCarrinhoDTO converterItemParaDTO(ItemCarrinho item) {
        Produto produto = item.getProduto();
        BigDecimal subtotal = produto.getPreco().multiply(BigDecimal.valueOf(item.getQuantidade()));

        return new ItemCarrinhoDTO(
                produto.getId(),
                produto.getNome(),
                produto.getPreco(),
                produto.getImagem(),
                item.getQuantidade(),
                subtotal
        );
    }
}
