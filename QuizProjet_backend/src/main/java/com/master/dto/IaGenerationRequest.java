package com.master.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class IaGenerationRequest {

    @NotBlank(message = "Le thème est obligatoire")
    private String theme;

    @NotNull(message = "Le nombre de questions est obligatoire")
    @Min(value = 1, message = "Minimum 1 question")
    @Max(value = 20, message = "Maximum 20 questions")
    private Integer nombreQuestions;

    // FACILE, MOYEN, DIFFICILE
    @NotBlank(message = "Le niveau est obligatoire")
    private String niveau;
}