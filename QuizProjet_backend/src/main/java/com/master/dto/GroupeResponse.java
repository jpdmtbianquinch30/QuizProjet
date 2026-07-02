package com.master.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class GroupeResponse {

    private Long id;
    private String nom;
    private String description;
    private String createdByNom;
    private LocalDateTime createdAt;
    private Long questionnaireAssigneId;
    private String questionnaireAssigneTitre;
    private List<ApprenantDTO> apprenants;

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ApprenantDTO {
        private Long id;
        private String nom;
        private String prenom;
        private String email;
    }
}