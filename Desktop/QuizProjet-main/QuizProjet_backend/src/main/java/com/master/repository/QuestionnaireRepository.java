package com.master.repository;

import com.master.entity.Questionnaire;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionnaireRepository extends JpaRepository<Questionnaire, Long> {


    // Recherche par statut
    List<Questionnaire> findByStatut(Questionnaire.Statut statut);


    // Compter par statut pour le dashboard admin
    long countByStatut(Questionnaire.Statut statut);


    // Recherche des questionnaires d'un évaluateur
    List<Questionnaire> findByCreatedById(Long id);


    // Recherche par thème
    List<Questionnaire> findByThemeContainingIgnoreCase(String theme);



    // Vérifier doublon titre
    boolean existsByTitreIgnoreCase(String titre);

}