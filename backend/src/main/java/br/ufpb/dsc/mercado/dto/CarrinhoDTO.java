package br.ufpb.dsc.mercado.dto;

import java.math.BigDecimal;
import java.util.List;

public record CarrinhoDTO(
        Long id,
        List<ItemCarrinhoDTO> itens,
        BigDecimal total,
        Integer quantidadeTotal
) {
}
