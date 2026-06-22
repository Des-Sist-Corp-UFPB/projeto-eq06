package br.ufpb.dsc.mercado.aspect;

import br.ufpb.dsc.mercado.domain.AuditLog;
import br.ufpb.dsc.mercado.repository.AuditLogRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.AfterThrowing;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.util.Arrays;

@Aspect
@Component
public class AuditAspect {

    private final AuditLogRepository auditLogRepository;

    public AuditAspect(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    @AfterReturning(pointcut = "@annotation(auditAction)", returning = "result")
    public void logSuccessAction(JoinPoint joinPoint, AuditAction auditAction, Object result) {
        saveLog(joinPoint, auditAction.value() + "_SUCCESS", result != null ? result.toString() : "null");
    }

    @AfterThrowing(pointcut = "@annotation(auditAction)", throwing = "exception")
    public void logFailureAction(JoinPoint joinPoint, AuditAction auditAction, Throwable exception) {
        saveLog(joinPoint, auditAction.value() + "_FAILURE", exception.getMessage());
    }

    private void saveLog(JoinPoint joinPoint, String action, String details) {
        String usuario = "anonymous";
        String ipAddress = "unknown";
        
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attributes != null) {
            HttpServletRequest request = attributes.getRequest();
            ipAddress = request.getRemoteAddr();
            String xfHeader = request.getHeader("X-Forwarded-For");
            if (xfHeader != null) {
                ipAddress = xfHeader.split(",")[0];
            }
            
            // Lemos um header customizado porque o frontend não usa JWT real
            String headerUser = request.getHeader("X-User-Email");
            if (headerUser != null && !headerUser.trim().isEmpty()) {
                usuario = headerUser;
            }
        }

        if (usuario.equals("anonymous")) {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication != null && authentication.isAuthenticated() && !authentication.getPrincipal().equals("anonymousUser")) {
                usuario = authentication.getName();
            } else {
                try {
                    Object[] args = joinPoint.getArgs();
                    if (args.length > 0 && args[0] != null && args[0].getClass().getSimpleName().equals("LoginRequest")) {
                        usuario = args[0].toString();
                    }
                } catch (Exception ignored) { }
            }
        }

        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        String methodName = signature.getMethod().getName();
        String className = signature.getDeclaringType().getSimpleName();
        Object[] args = joinPoint.getArgs();
        
        // Limita o tamanho dos detalhes para evitar problemas no banco se for muito grande
        String argsString = Arrays.toString(args);
        if (argsString.length() > 500) argsString = argsString.substring(0, 500) + "...";
        
        String extraDetails = String.format("Class: %s, Method: %s, Args: %s. Resp/Err: %s",
                className, methodName, argsString, details);
                
        if (extraDetails.length() > 2000) extraDetails = extraDetails.substring(0, 1990) + "...";

        AuditLog log = new AuditLog(action, extraDetails, ipAddress, usuario);
        auditLogRepository.save(log);
    }
}
