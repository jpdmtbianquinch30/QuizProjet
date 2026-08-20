package com.master.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "scores")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Score {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "questionnaire_id", nullable = false)
    private Questionnaire questionnaire;

    @Column(name = "score_obtenu", nullable = false)
    private Integer scoreObtenu;

    @Column(name = "score_max", nullable = false)
    private Integer scoreMax;

    @Column(name = "date_soumission", updatable = false)
    private LocalDateTime dateSoumission;

    @PrePersist
    protected void onCreate() {
        dateSoumission = LocalDateTime.now();
    }
}