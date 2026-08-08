package br.ufpb.dsc.mercado.controller;

import br.ufpb.dsc.mercado.domain.AuditLog;
import br.ufpb.dsc.mercado.repository.AuditLogRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auditoria")
@CrossOrigin(origins = "*") // Permite o frontend chamar a API localmente
public class AuditLogController {

    private final AuditLogRepository auditLogRepository;

    public AuditLogController(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    @GetMapping
    public ResponseEntity<Page<AuditLog>> listar(
            @RequestParam(defaultValue = "0") int pagina,
            @RequestParam(defaultValue = "15") int tamanho) {
        
        // Retorna os logs mais recentes primeiro
        PageRequest pageRequest = PageRequest.of(pagina, tamanho, Sort.by(Sort.Direction.DESC, "criadoEm"));
        Page<AuditLog> logs = auditLogRepository.findAll(pageRequest);
        
        return ResponseEntity.ok(logs);
    }
}
