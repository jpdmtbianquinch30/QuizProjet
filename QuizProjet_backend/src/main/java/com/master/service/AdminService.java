package com.master.service;

import com.master.dto.ApprenantStatResponse;
import com.master.dto.EvaluateurStatResponse;
import com.master.dto.StatistiquesResponse;
import com.master.entity.Score;
import com.master.entity.Questionnaire;
import com.master.entity.User;
import com.master.dto.QuestionnaireResponse;
import com.master.repository.GroupeRepository;
import com.master.repository.QuestionnaireRepository;
import com.master.repository.ScoreRepository;
import com.master.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
@Transactional
public class AdminService {

    private final UserRepository userRepository;
    private final QuestionnaireRepository questionnaireRepository;
    private final ScoreRepository scoreRepository;
    private final GroupeRepository groupeRepository;

    // ============ STATISTIQUES GLOBALES ============
    @Transactional(readOnly = true)
    public StatistiquesResponse statistiques() {
        long totalApprenants = userRepository.findByRole(User.Role.USER).size();
        long totalEvaluateurs = userRepository.findByRole(User.Role.EVALUATEUR).size();
        long totalQuestionnaires = questionnaireRepository.count();
        long totalPublies = questionnaireRepository
                .findByStatut(com.master.entity.Questionnaire.Statut.PUBLIE).size();

        List<Score> tousLesScores = scoreRepository.findAll();
        double tauxReussite = tousLesScores.isEmpty() ? 0.0 : tousLesScores.stream()
                .mapToDouble(this::pourcentage)
                .average()
                .orElse(0.0);

        return StatistiquesResponse.builder()
                .totalApprenants(totalApprenants)
                .totalEvaluateurs(totalEvaluateurs)
                .totalQuestionnaires(totalQuestionnaires)
                .totalQuestionnairesPublies(totalPublies)
                .tauxReussiteGlobal(Math.round(tauxReussite * 100.0) / 100.0)
                .build();
    }

    // ============ LISTE DES APPRENANTS + STATS ============
    @Transactional(readOnly = true)
    public List<ApprenantStatResponse> listerApprenants() {
        return userRepository.findByRole(User.Role.USER).stream()
                .map(this::versApprenantStat)
                .toList();
    }

    // ============ LISTE DES EVALUATEURS + STATS ============
    @Transactional(readOnly = true)
    public List<EvaluateurStatResponse> listerEvaluateurs() {
        return userRepository.findByRole(User.Role.EVALUATEUR).stream()
                .map(this::versEvaluateurStat)
                .toList();
    }

    // ============ BLOQUER / DEBLOQUER UN COMPTE ============
    public boolean changerStatut(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Utilisateur introuvable"));

        boolean actifActuel = user.getActif() == null || user.getActif();
        user.setActif(!actifActuel);
        userRepository.save(user);

        return user.getActif();
    }

    /** Archive un questionnaire sans supprimer son historique de résultats. */
    public QuestionnaireResponse archiverQuestionnaire(Long questionnaireId) {
        Questionnaire questionnaire = questionnaireRepository.findById(questionnaireId)
                .orElseThrow(() -> new IllegalArgumentException("Questionnaire introuvable"));

        questionnaire.setStatut(Questionnaire.Statut.ARCHIVE);
        return toQuestionnaireResponse(questionnaireRepository.save(questionnaire));
    }

    // ============ LISTE DE TOUS LES QUESTIONNAIRES (vue admin) ============
    @Transactional(readOnly = true)
    public List<QuestionnaireResponse> listerQuestionnaires() {
        return questionnaireRepository.findAll().stream()
                .map(this::toQuestionnaireResponse)
                .toList();
    }

    private QuestionnaireResponse toQuestionnaireResponse(Questionnaire q) {
        return QuestionnaireResponse.builder()
                .id(q.getId())
                .titre(q.getTitre())
                .description(q.getDescription())
                .theme(q.getTheme())
                .dureeSecondes(q.getDureeSecondes())
                .statut(q.getStatut().name())
                .createdAt(q.getCreatedAt())
                .updatedAt(q.getUpdatedAt())
                .createdByNom(q.getCreatedBy() == null ? "Système" : q.getCreatedBy().getNom())
                .nombreQuestions(q.getQuestions().size())
                .build();
    }
    // ============ MAPPERS ============
    private ApprenantStatResponse versApprenantStat(User user) {
        List<Score> scores = scoreRepository.findByUserIdOrderByDateSoumissionDesc(user.getId());

        double scoreMoyen = scores.isEmpty() ? 0.0 : scores.stream()
                .mapToDouble(this::pourcentage)
                .average()
                .orElse(0.0);

        int totalAssignes = (int) groupeRepository.findByApprenantId(user.getId()).stream()
                .map(g -> g.getQuestionnaireAssigne())
                .filter(Objects::nonNull)
                .distinct()
                .count();

        return ApprenantStatResponse.builder()
                .id(user.getId())
                .nom(user.getNom())
                .prenom(user.getPrenom())
                .email(user.getEmail())
                .actif(user.getActif() == null || user.getActif())
                .scoreMoyen(Math.round(scoreMoyen * 100.0) / 100.0)
                .quizCompletes(scores.size())
                .totalQuizAssignes(totalAssignes)
                .build();
    }

    private EvaluateurStatResponse versEvaluateurStat(User user) {
        int quizCrees = questionnaireRepository.findByCreatedById(user.getId()).size();

        return EvaluateurStatResponse.builder()
                .id(user.getId())
                .nom(user.getNom())
                .prenom(user.getPrenom())
                .email(user.getEmail())
                .actif(user.getActif() == null || user.getActif())
                .quizCrees(quizCrees)
                .build();
    }

    private double pourcentage(Score score) {
        return score.getScoreMax() > 0
                ? (score.getScoreObtenu() * 100.0) / score.getScoreMax()
                : 0.0;
    }
}
