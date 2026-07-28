package br.ufpb.dsc.mercado.controller;

import br.ufpb.dsc.mercado.domain.Usuario;
import br.ufpb.dsc.mercado.dto.UsuarioForm;
import br.ufpb.dsc.mercado.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import br.ufpb.dsc.mercado.aspect.AuditAction;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @PostMapping
    @AuditAction("CRIAR_USUARIO")
    public ResponseEntity<?> criarConta(@Valid @RequestBody UsuarioForm form) {
        try {
            Usuario usuarioCriado = usuarioService.criar(form);
            return ResponseEntity.status(HttpStatus.CREATED).body(usuarioCriado);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}
