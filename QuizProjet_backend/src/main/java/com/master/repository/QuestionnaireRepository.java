package com.master.repository;

import com.master.entity.Questionnaire;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface QuestionnaireRepository extends JpaRepository<Questionnaire, Long> {

    // Recherche par thème
    List<Questionnaire> findByThemeContainingIgnoreCase(String theme);

    // Filtrer par statut
    List<Questionnaire> findByStatut(Questionnaire.Statut statut);

    // Questionnaires d'un admin
    List<Questionnaire> findByCreatedById(Long adminId);

    // Vérifier si titre existe déjà
    boolean existsByTitreIgnoreCase(String titre);
}