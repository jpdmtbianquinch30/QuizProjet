package com.master.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class EvaluateurStatResponse {

    private Long id;
    private String nom;
    private String prenom;
    private String email;
    private boolean actif;
    private int quizCrees;
}