package com.master.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.util.List;

@Data
public class QuestionnaireRequest {

    @NotBlank(message = "Le titre est obligatoire")
    private String titre;

    private String description;

    @NotBlank(message = "Le thème est obligatoire")
    private String theme;

    @NotNull(message = "La durée est obligatoire")
    @Min(value = 30, message = "Durée minimum 30 secondes")
    private Integer dureeSecondes;

    private String statut;

    private List<QuestionDTO> questions;

    @Data
    public static class QuestionDTO {
        @NotBlank(message = "La question ne peut pas être vide")
        private String contenu;
        private List<String> choix;
        private Integer bonneReponseIndex;
        private Integer points;
        private Integer ordre;
    }
}