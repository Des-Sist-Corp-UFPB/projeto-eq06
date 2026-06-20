package br.ufpb.dsc.mercado.dto;

import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
        @NotBlank(message = "O email/username é obrigatório")
        String email,

        @NotBlank(message = "A senha é obrigatória")
        String senha
) {}
