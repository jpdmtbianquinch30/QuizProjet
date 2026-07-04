package com.master.repository;

import com.master.entity.Score;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ScoreRepository extends JpaRepository<Score, Long> {

    List<Score> findByQuestionnaireIdOrderByScoreObtenuDescDateSoumissionAsc(Long questionnaireId);

    List<Score> findByUserIdOrderByDateSoumissionDesc(Long userId);

    boolean existsByUserIdAndQuestionnaireId(Long userId, Long questionnaireId);
}