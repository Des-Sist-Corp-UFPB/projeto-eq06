package br.ufpb.dsc.mercado.dto;

import java.math.BigDecimal;

public record ItemCarrinhoDTO(
        Long produtoId,
        String nomeProduto,
        BigDecimal precoProduto,
        String imagemProduto,
        Integer quantidade,
        BigDecimal subtotal
) {
}
