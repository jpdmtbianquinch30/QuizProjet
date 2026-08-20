package com.master.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ProfilUpdateRequest {

    @NotBlank(message = "Le nom est obligatoire")
    private String nom;

    private String prenom;
}