package com.master.service;

import com.master.dto.ScoreResponse;
import com.master.dto.SoumissionRequest;
import com.master.entity.Question;
import com.master.entity.Questionnaire;
import com.master.entity.Score;
import com.master.entity.User;
import com.master.repository.QuestionRepository;
import com.master.repository.QuestionnaireRepository;
import com.master.repository.ScoreRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ScoreService {

    private final ScoreRepository scoreRepository;
    private final QuestionnaireRepository questionnaireRepository;
    private final QuestionRepository questionRepository;

    /**
     * Corrige les réponses envoyées par l'utilisateur et enregistre le score.
     */
    public ScoreResponse soumettre(SoumissionRequest request, User user) {

        Questionnaire questionnaire = questionnaireRepository.findById(request.getQuestionnaireId())
                .orElseThrow(() -> new IllegalArgumentException("Questionnaire introuvable"));

        List<Question> questions = questionRepository
                .findByQuestionnaireIdOrderByOrdre(questionnaire.getId());

        if (questions.isEmpty()) {
            throw new IllegalStateException("Ce questionnaire ne contient aucune question");
        }
        if (request.getReponses().size() != questions.size()) {
            throw new IllegalArgumentException(
                    "Nombre de réponses incorrect : " + questions.size() + " attendues");
        }

        int scoreObtenu = 0;
        int scoreMax = 0;

        for (int i = 0; i < questions.size(); i++) {
            Question question = questions.get(i);
            Integer reponseUtilisateur = request.getReponses().get(i);
            int points = question.getPoints() != null ? question.getPoints() : 1;

            scoreMax += points;

            if (reponseUtilisateur != null
                    && reponseUtilisateur.equals(question.getBonneReponseIndex())) {
                scoreObtenu += points;
            }
        }

        Score score = Score.builder()
                .user(user)
                .questionnaire(questionnaire)
                .scoreObtenu(scoreObtenu)
                .scoreMax(scoreMax)
                .build();

        score = scoreRepository.save(score);

        return versScoreResponse(score);
    }

    /**
     * Classement d'un questionnaire, meilleur score en premier.
     */
    public List<ScoreResponse> classementParQuestionnaire(Long questionnaireId) {
        return scoreRepository
                .findByQuestionnaireIdOrderByScoreObtenuDescDateSoumissionAsc(questionnaireId)
                .stream()
                .map(this::versScoreResponse)
                .toList();
    }

    /**
     * Historique des scores d'un utilisateur (tous questionnaires confondus).
     */
    public List<ScoreResponse> historiqueUtilisateur(Long userId) {
        return scoreRepository.findByUserIdOrderByDateSoumissionDesc(userId)
                .stream()
                .map(this::versScoreResponse)
                .toList();
    }

    private ScoreResponse versScoreResponse(Score score) {
        double pourcentage = score.getScoreMax() > 0
                ? Math.round((score.getScoreObtenu() * 10000.0) / score.getScoreMax()) / 100.0
                : 0.0;

        return ScoreResponse.builder()
                .id(score.getId())
                .utilisateurId(score.getUser().getId())
                .utilisateurNom(score.getUser().getNom())
                .utilisateurPrenom(score.getUser().getPrenom())
                .questionnaireId(score.getQuestionnaire().getId())
                .questionnaireTitre(score.getQuestionnaire().getTitre())
                .scoreObtenu(score.getScoreObtenu())
                .scoreMax(score.getScoreMax())
                .pourcentage(pourcentage)
                .dateSoumission(score.getDateSoumission())
                .build();
    }
}