package br.ufpb.dsc.mercado.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record MensagemForm(

        @NotNull
        Long produtoId,

        @NotNull
        Long remetenteId,

        @NotBlank
        String texto

) {
}
