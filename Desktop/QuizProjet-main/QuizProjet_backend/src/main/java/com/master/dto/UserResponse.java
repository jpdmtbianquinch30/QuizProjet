package com.master.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserResponse {

    private Long id;
    private String nom;
    private String prenom;
    private String email;
    private String role;
    private Boolean actif;
}