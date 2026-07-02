package com.master.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class SoumissionRequest {

    @NotNull(message = "L'identifiant du questionnaire est obligatoire")
    private Long questionnaireId;

    // Index (0 à 3) de la réponse choisie pour chaque question,
    // dans l'ordre des questions du questionnaire (champ "ordre").
    @NotEmpty(message = "Les réponses sont obligatoires")
    private List<Integer> reponses;
}