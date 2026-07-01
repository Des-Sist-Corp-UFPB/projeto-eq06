package br.ufpb.dsc.mercado.aspect;

import br.ufpb.dsc.mercado.domain.AuditLog;
import br.ufpb.dsc.mercado.repository.AuditLogRepository;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.reflect.MethodSignature;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import java.lang.reflect.Method;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AuditAspectTest {

    @Mock
    private AuditLogRepository auditLogRepository;

    @InjectMocks
    private AuditAspect auditAspect;

    @Mock
    private JoinPoint joinPoint;

    @Mock
    private MethodSignature methodSignature;

    @Mock
    private AuditAction auditAction;

    @BeforeEach
    void setUp() throws NoSuchMethodException {
        // Mock do JoinPoint e MethodSignature para simular a interceptação
        when(joinPoint.getSignature()).thenReturn(methodSignature);
        
        // Simula o retorno do método interceptado
        Method dummyMethod = Object.class.getMethod("toString");
        when(methodSignature.getMethod()).thenReturn(dummyMethod);
        when(methodSignature.getDeclaringType()).thenReturn(Object.class);
        
        // Simula os argumentos do método
        when(joinPoint.getArgs()).thenReturn(new Object[]{"arg1"});
        
        // Simula o valor da anotação
        when(auditAction.value()).thenReturn("TEST_ACTION");
    }

    @Test
    void logSuccessAction_ComSucessoSimples_SalvaLogDeSucesso() {
        // GIVEN
        Object result = "success_result";

        // WHEN
        auditAspect.logSuccessAction(joinPoint, auditAction, result);

        // THEN
        ArgumentCaptor<AuditLog> captor = ArgumentCaptor.forClass(AuditLog.class);
        verify(auditLogRepository, times(1)).save(captor.capture());
        
        AuditLog savedLog = captor.getValue();
        assertEquals("TEST_ACTION_SUCCESS", savedLog.getAcao());
        assertTrue(savedLog.getDetalhes().contains("success_result"));
    }

    @Test
    void logSuccessAction_ComResponseEntityErro_SalvaLogDeFalha() {
        // GIVEN
        ResponseEntity<String> result = ResponseEntity.badRequest().body("Client Error");

        // WHEN
        auditAspect.logSuccessAction(joinPoint, auditAction, result);

        // THEN
        ArgumentCaptor<AuditLog> captor = ArgumentCaptor.forClass(AuditLog.class);
        verify(auditLogRepository, times(1)).save(captor.capture());
        
        AuditLog savedLog = captor.getValue();
        assertEquals("TEST_ACTION_FAILURE", savedLog.getAcao());
    }

    @Test
    void logFailureAction_ComExcecao_SalvaLogDeFalha() {
        // GIVEN
        RuntimeException exception = new RuntimeException("Test Exception");

        // WHEN
        auditAspect.logFailureAction(joinPoint, auditAction, exception);

        // THEN
        ArgumentCaptor<AuditLog> captor = ArgumentCaptor.forClass(AuditLog.class);
        verify(auditLogRepository, times(1)).save(captor.capture());
        
        AuditLog savedLog = captor.getValue();
        assertEquals("TEST_ACTION_FAILURE", savedLog.getAcao());
        assertTrue(savedLog.getDetalhes().contains("Test Exception"));
    }
}
