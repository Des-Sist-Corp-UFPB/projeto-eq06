package br.ufpb.dsc.mercado.dto;

public record LoginResponse(
        Long id,
        String nome,
        String email
) {}
