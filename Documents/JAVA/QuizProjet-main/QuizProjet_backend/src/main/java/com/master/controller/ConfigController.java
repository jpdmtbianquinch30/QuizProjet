package com.master.controller;

import com.master.dto.ConfigDto;
import com.master.service.ConfigService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/config")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class ConfigController {

    private final ConfigService configService;

    @GetMapping("/public")
    public ResponseEntity<ConfigDto> getPublicConfig() {
        return ResponseEntity.ok(configService.getPublicConfig());
    }

    @PutMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ConfigDto> updateConfig(@Valid @RequestBody ConfigDto dto) {
        // Validation supplémentaire (ex: couleurs hex)
        if (dto.getPrimaryColor() != null && !dto.getPrimaryColor().matches("^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$")) {
            throw new IllegalArgumentException("Couleur primaire invalide");
        }
        if (dto.getSecondaryColor() != null && !dto.getSecondaryColor().matches("^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$")) {
            throw new IllegalArgumentException("Couleur secondaire invalide");
        }
        return ResponseEntity.ok(configService.updateConfig(dto));
    }
}