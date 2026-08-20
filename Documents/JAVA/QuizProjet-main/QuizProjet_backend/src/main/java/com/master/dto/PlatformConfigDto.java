package com.master.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record PlatformConfigDto(
        @NotBlank(message = "Le nom est obligatoire")
        String platformName,

        @Pattern(regexp = "^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$", message = "Couleur hexadécimale invalide")
        String primaryColor,

        @Pattern(regexp = "^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$", message = "Couleur hexadécimale invalide")
        String secondaryColor,

        String logoUrl,

        Boolean maintenanceMode
) {}