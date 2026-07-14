package com.master.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UpdateUserRequest {

    @NotBlank
    private String nom;

    private String prenom;

    @Email
    @NotBlank
    private String email;
}