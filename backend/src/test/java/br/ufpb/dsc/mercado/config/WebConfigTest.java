package br.ufpb.dsc.mercado.config;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;

import java.nio.file.Path;
import java.nio.file.Paths;

import static org.mockito.Mockito.*;

class WebConfigTest {

    @Test
    @DisplayName("Deve registrar os resource handlers corretamente para /uploads/**")
    void addResourceHandlers_deveRegistrarHandlers() {
        // GIVEN
        WebConfig webConfig = new WebConfig();
        ResourceHandlerRegistry registry = mock(ResourceHandlerRegistry.class);
        ResourceHandlerRegistration registration = mock(ResourceHandlerRegistration.class);

        when(registry.addResourceHandler("/uploads/**")).thenReturn(registration);

        Path uploadDir = Paths.get("uploads");
        String uploadPath = uploadDir.toFile().getAbsolutePath();
        String expectedLocation = "file:" + uploadPath + "/";

        // WHEN
        webConfig.addResourceHandlers(registry);

        // THEN
        verify(registry).addResourceHandler("/uploads/**");
        verify(registration).addResourceLocations(expectedLocation);
    }
}
