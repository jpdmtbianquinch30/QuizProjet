package com.master.service;

import com.master.dto.QuestionnaireRequest;
import com.master.dto.QuestionnaireResponse;
import com.master.entity.Question;
import com.master.entity.Questionnaire;
import com.master.entity.User;
import com.master.repository.QuestionnaireRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class QuestionnaireService {

    private final QuestionnaireRepository questionnaireRepository;

    // ============ CREATE ============
    public QuestionnaireResponse creer(QuestionnaireRequest request, User admin) {
        Questionnaire questionnaire = Questionnaire.builder()
                .titre(request.getTitre())
                .description(request.getDescription())
                .theme(request.getTheme())
                .dureeSecondes(request.getDureeSecondes())
                .statut(parseStatut(request.getStatut()))
                .createdBy(admin)
                .build();

        if (request.getQuestions() != null) {
            List<Question> questions = request.getQuestions().stream()
                    .map(q -> mapToQuestion(q, questionnaire))
                    .collect(Collectors.toList());
            questionnaire.getQuestions().addAll(questions);
        }

        return toResponse(questionnaireRepository.save(questionnaire));
    }

    // ============ READ ALL ============
    @Transactional(readOnly = true)
    public List<QuestionnaireResponse> listerTous() {
        return questionnaireRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // ============ READ ONE ============
    @Transactional(readOnly = true)
    public QuestionnaireResponse findById(Long id) {
        Questionnaire q = questionnaireRepository.findById(id)
                .orElseThrow(() ->
                        new EntityNotFoundException("Questionnaire non trouvé : " + id));
        return toResponse(q);
    }

    // ============ UPDATE ============
    public QuestionnaireResponse modifier(Long id, QuestionnaireRequest request) {
        Questionnaire questionnaire = questionnaireRepository.findById(id)
                .orElseThrow(() ->
                        new EntityNotFoundException("Questionnaire non trouvé : " + id));

        questionnaire.setTitre(request.getTitre());
        questionnaire.setDescription(request.getDescription());
        questionnaire.setTheme(request.getTheme());
        questionnaire.setDureeSecondes(request.getDureeSecondes());
        questionnaire.setStatut(parseStatut(request.getStatut()));

        if (request.getQuestions() != null) {
            questionnaire.getQuestions().clear();
            List<Question> nouvelles = request.getQuestions().stream()
                    .map(q -> mapToQuestion(q, questionnaire))
                    .collect(Collectors.toList());
            questionnaire.getQuestions().addAll(nouvelles);
        }

        return toResponse(questionnaireRepository.save(questionnaire));
    }

    // ============ DELETE ============
    public void supprimer(Long id) {
        if (!questionnaireRepository.existsById(id)) {
            throw new EntityNotFoundException("Questionnaire non trouvé : " + id);
        }
        questionnaireRepository.deleteById(id);
    }

    // ============ RECHERCHE ============
    @Transactional(readOnly = true)
    public List<QuestionnaireResponse> rechercherParTheme(String theme) {
        return questionnaireRepository
                .findByThemeContainingIgnoreCase(theme).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // ============ MAPPERS ============
    private Question mapToQuestion(QuestionnaireRequest.QuestionDTO dto,
                                   Questionnaire q) {
        return Question.builder()
                .contenu(dto.getContenu())
                .choix(dto.getChoix())
                .bonneReponseIndex(dto.getBonneReponseIndex())
                .points(dto.getPoints() != null ? dto.getPoints() : 1)
                .ordre(dto.getOrdre())
                .questionnaire(q)
                .build();
    }

    private QuestionnaireResponse toResponse(Questionnaire q) {
        List<QuestionnaireResponse.QuestionDTO> questionDTOs = q.getQuestions()
                .stream()
                .map(question -> QuestionnaireResponse.QuestionDTO.builder()
                        .id(question.getId())
                        .contenu(question.getContenu())
                        .choix(question.getChoix())
                        .bonneReponseIndex(question.getBonneReponseIndex())
                        .points(question.getPoints())
                        .ordre(question.getOrdre())
                        .build())
                .collect(Collectors.toList());

        return QuestionnaireResponse.builder()
                .id(q.getId())
                .titre(q.getTitre())
                .description(q.getDescription())
                .theme(q.getTheme())
                .dureeSecondes(q.getDureeSecondes())
                .statut(q.getStatut().name())
                .createdAt(q.getCreatedAt())
                .updatedAt(q.getUpdatedAt())
                .createdByNom(q.getCreatedBy() != null
                        ? q.getCreatedBy().getNom() : "Système")
                .nombreQuestions(q.getQuestions().size())
                .questions(questionDTOs)
                .build();
    }

    private Questionnaire.Statut parseStatut(String statut) {
        if (statut == null) return Questionnaire.Statut.BROUILLON;
        try {
            return Questionnaire.Statut.valueOf(statut.toUpperCase());
        } catch (IllegalArgumentException e) {
            return Questionnaire.Statut.BROUILLON;
        }
    }
}