package com.master.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import java.util.ArrayList;
import java.util.List;
import jakarta.persistence.FetchType;

@Entity
@Table(name = "questions")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Le contenu est obligatoire")
    @Column(columnDefinition = "TEXT", nullable = false)
    private String contenu;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
            name = "question_choix",
            joinColumns = @JoinColumn(name = "question_id")
    )
    @Column(name = "choix")
    @Builder.Default
    private List<String> choix = new ArrayList<>();

    @Column(name = "bonne_reponse_index")
    private Integer bonneReponseIndex;

    @Builder.Default
    private Integer points = 1;

    @Column(name = "ordre")
    private Integer ordre;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "questionnaire_id", nullable = false)
    private Questionnaire questionnaire;
}