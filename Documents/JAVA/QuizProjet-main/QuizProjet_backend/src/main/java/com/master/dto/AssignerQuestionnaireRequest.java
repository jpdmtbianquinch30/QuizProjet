package com.master.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AssignerQuestionnaireRequest {

    @NotNull(message = "L'identifiant du questionnaire est obligatoire")
    private Long questionnaireId;
}