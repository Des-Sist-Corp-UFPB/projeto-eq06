package br.ufpb.dsc.mercado.service;

import br.ufpb.dsc.mercado.domain.Usuario;
import br.ufpb.dsc.mercado.dto.UsuarioForm;
import br.ufpb.dsc.mercado.repository.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UsuarioServiceTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @InjectMocks
    private UsuarioService usuarioService;

    private UsuarioForm form;

    @BeforeEach
    void setUp() {
        form = new UsuarioForm("Teste", "teste@teste.com", "12345678901", "123456");
    }

    @Test
    void criar_ComDadosValidos_RetornaUsuarioCriado() {
        when(usuarioRepository.findByEmail(form.email())).thenReturn(Optional.empty());

        Usuario usuarioSalvo = new Usuario();
        usuarioSalvo.setId(1L);
        usuarioSalvo.setNome(form.nome());
        usuarioSalvo.setEmail(form.email());
        usuarioSalvo.setCpf(form.cpf());
        usuarioSalvo.setSenha(form.senha());
        
        when(usuarioRepository.save(any(Usuario.class))).thenReturn(usuarioSalvo);

        Usuario resultado = usuarioService.criar(form);

        assertNotNull(resultado);
        assertEquals(1L, resultado.getId());
        assertEquals("Teste", resultado.getNome());
        verify(usuarioRepository, times(1)).findByEmail(form.email());
        verify(usuarioRepository, times(1)).save(any(Usuario.class));
    }

    @Test
    void criar_ComEmailExistente_LancaException() {
        Usuario usuarioExistente = new Usuario();
        when(usuarioRepository.findByEmail(form.email())).thenReturn(Optional.of(usuarioExistente));

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            usuarioService.criar(form);
        });

        assertEquals("E-mail já está em uso.", exception.getMessage());
        verify(usuarioRepository, times(1)).findByEmail(form.email());
        verify(usuarioRepository, never()).save(any(Usuario.class));
    }
}
