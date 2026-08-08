package br.ufpb.dsc.mercado.service;

import br.ufpb.dsc.mercado.domain.Usuario;
import br.ufpb.dsc.mercado.dto.UsuarioForm;
import br.ufpb.dsc.mercado.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;

    public UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @Transactional
    public Usuario criar(UsuarioForm form) {
        // Verificar se e-mail já existe
        if (usuarioRepository.findByEmail(form.email()).isPresent()) {
            throw new IllegalArgumentException("E-mail já está em uso.");
        }

        Usuario usuario = new Usuario();
        usuario.setNome(form.nome());
        usuario.setEmail(form.email());
        usuario.setCpf(form.cpf());
        usuario.setSenha(form.senha()); // Salvando em texto puro conforme definido no plano

        return usuarioRepository.save(usuario);
    }

    public Usuario getUsuarioAutenticado() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal().equals("anonymousUser")) {
            throw new RuntimeException("Usuário não autenticado");
        }
        String email = authentication.getName();
        return usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário autenticado não encontrado no banco"));
    }

    public Usuario getUsuarioPorId(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
    }
}
