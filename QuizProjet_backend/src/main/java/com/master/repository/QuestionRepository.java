package com.master.repository;

import com.master.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {

    // Toutes les questions d'un questionnaire
    List<Question> findByQuestionnaireIdOrderByOrdre(Long questionnaireId);

    // Nombre de questions d'un questionnaire
    int countByQuestionnaireId(Long questionnaireId);
}