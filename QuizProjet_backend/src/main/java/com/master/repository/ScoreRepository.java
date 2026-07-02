package com.master.repository;

import com.master.entity.Score;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ScoreRepository extends JpaRepository<Score, Long> {

    // Classement d'un questionnaire : meilleur score en premier
    List<Score> findByQuestionnaireIdOrderByScoreObtenuDescDateSoumissionAsc(Long questionnaireId);

    // Historique des scores d'un utilisateur
    List<Score> findByUserIdOrderByDateSoumissionDesc(Long userId);
}