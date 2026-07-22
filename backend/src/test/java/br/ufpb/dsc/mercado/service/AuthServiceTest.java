package br.ufpb.dsc.mercado.service;

import br.ufpb.dsc.mercado.domain.Usuario;
import br.ufpb.dsc.mercado.dto.LoginRequest;
import br.ufpb.dsc.mercado.dto.LoginResponse;
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
public class AuthServiceTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @InjectMocks
    private AuthService authService;

    private Usuario usuarioMock;

    @BeforeEach
    void setUp() {
        usuarioMock = new Usuario();
        usuarioMock.setId(1L);
        usuarioMock.setNome("Teste");
        usuarioMock.setEmail("teste@teste.com");
        usuarioMock.setSenha("123456");
    }

    @Test
    void autenticar_ComCredenciaisValidas_RetornaLoginResponse() {
        LoginRequest request = new LoginRequest("teste@teste.com", "123456");
        when(usuarioRepository.findByEmail(request.email())).thenReturn(Optional.of(usuarioMock));

        LoginResponse response = authService.autenticar(request);

        assertNotNull(response);
        assertEquals(usuarioMock.getId(), response.id());
        assertEquals(usuarioMock.getNome(), response.nome());
        assertEquals(usuarioMock.getEmail(), response.email());
        verify(usuarioRepository, times(1)).findByEmail(request.email());
    }

    @Test
    void autenticar_ComEmailInvalido_LancaException() {
        LoginRequest request = new LoginRequest("inexistente@teste.com", "123456");
        when(usuarioRepository.findByEmail(request.email())).thenReturn(Optional.empty());

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            authService.autenticar(request);
        });

        assertEquals("Credenciais inválidas", exception.getMessage());
        verify(usuarioRepository, times(1)).findByEmail(request.email());
    }

    @Test
    void autenticar_ComSenhaInvalida_LancaException() {
        LoginRequest request = new LoginRequest("teste@teste.com", "senhaerrada");
        when(usuarioRepository.findByEmail(request.email())).thenReturn(Optional.of(usuarioMock));

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            authService.autenticar(request);
        });

        assertEquals("Credenciais inválidas", exception.getMessage());
        verify(usuarioRepository, times(1)).findByEmail(request.email());
    }
}
