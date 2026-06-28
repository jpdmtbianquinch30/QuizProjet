package com.master.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class QuestionnaireResponse {

    private Long id;
    private String titre;
    private String description;
    private String theme;
    private Integer dureeSecondes;
    private String statut;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String createdByNom;
    private int nombreQuestions;
    private List<QuestionDTO> questions;

    @Data
    @Builder
    public static class QuestionDTO {
        private Long id;
        private String contenu;
        private List<String> choix;
        private Integer bonneReponseIndex;
        private Integer points;
        private Integer ordre;
    }
}