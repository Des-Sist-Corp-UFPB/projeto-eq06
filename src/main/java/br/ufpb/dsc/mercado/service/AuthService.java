package br.ufpb.dsc.mercado.service;

import br.ufpb.dsc.mercado.domain.Usuario;
import br.ufpb.dsc.mercado.dto.LoginRequest;
import br.ufpb.dsc.mercado.dto.LoginResponse;
import br.ufpb.dsc.mercado.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    private final UsuarioRepository usuarioRepository;

    public AuthService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    public LoginResponse autenticar(LoginRequest request) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(request.email());
        
        if (usuarioOpt.isEmpty()) {
            throw new IllegalArgumentException("Credenciais inválidas");
        }

        Usuario usuario = usuarioOpt.get();
        
        // Verificação simples em texto puro (deve ser substituído por BCrypt futuramente)
        if (!usuario.getSenha().equals(request.senha())) {
            throw new IllegalArgumentException("Credenciais inválidas");
        }

        return new LoginResponse(usuario.getNome(), usuario.getEmail());
    }
}
