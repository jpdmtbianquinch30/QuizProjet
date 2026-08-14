package com.master.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ScoreResponse {

    private Long id;
    private Long utilisateurId;
    private String utilisateurNom;
    private String utilisateurPrenom;
    private Long questionnaireId;
    private String questionnaireTitre;
    private Integer scoreObtenu;
    private Integer scoreMax;
    private Double pourcentage;
    private LocalDateTime dateSoumission;
}