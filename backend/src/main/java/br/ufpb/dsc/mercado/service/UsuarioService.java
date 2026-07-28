package br.ufpb.dsc.mercado.service;

import br.ufpb.dsc.mercado.domain.Usuario;
import br.ufpb.dsc.mercado.dto.UsuarioForm;
import br.ufpb.dsc.mercado.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
}
