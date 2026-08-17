package com.master.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class StatistiquesResponse {

    private long totalApprenants;
    private long totalEvaluateurs;
    private long totalQuestionnaires;
    private long totalQuestionnairesPublies;
    private double tauxReussiteGlobal; // en %
}