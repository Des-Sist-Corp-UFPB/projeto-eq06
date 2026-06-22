package br.ufpb.dsc.mercado.aspect;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Anotação para marcar métodos que devem ser auditados via AOP.
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface AuditAction {
    /**
     * O nome ou categoria da ação sendo auditada.
     * Ex: "LOGIN", "CRIAR_PRODUTO", "EXCLUIR_USUARIO"
     */
    String value();
}
