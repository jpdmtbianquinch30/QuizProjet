package com.master.service;

import com.master.dto.GroupeRequest;
import com.master.dto.GroupeResponse;
import com.master.entity.Groupe;
import com.master.entity.Questionnaire;
import com.master.entity.User;
import com.master.repository.GroupeRepository;
import com.master.repository.QuestionnaireRepository;
import com.master.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class GroupeService {

    private final GroupeRepository groupeRepository;
    private final UserRepository userRepository;
    private final QuestionnaireRepository questionnaireRepository;

    public GroupeResponse creer(GroupeRequest request, User evaluateur) {
        Groupe groupe = Groupe.builder()
                .nom(request.getNom())
                .description(request.getDescription())
                .createdBy(evaluateur)
                .build();

        return versGroupeResponse(groupeRepository.save(groupe));
    }

    public List<GroupeResponse> listerParEvaluateur(Long evaluateurId) {
        return groupeRepository.findByCreatedById(evaluateurId)
                .stream().map(this::versGroupeResponse).toList();
    }

    public List<GroupeResponse> listerTous() {
        return groupeRepository.findAll()
                .stream().map(this::versGroupeResponse).toList();
    }

    public GroupeResponse findById(Long id) {
        return versGroupeResponse(getGroupeOuException(id));
    }

    public GroupeResponse modifier(Long id, GroupeRequest request) {
        Groupe groupe = getGroupeOuException(id);
        groupe.setNom(request.getNom());
        groupe.setDescription(request.getDescription());
        return versGroupeResponse(groupeRepository.save(groupe));
    }

    public void supprimer(Long id) {
        if (!groupeRepository.existsById(id)) {
            throw new IllegalArgumentException("Groupe introuvable");
        }
        groupeRepository.deleteById(id);
    }

    public GroupeResponse ajouterApprenants(Long groupeId, List<String> emails) {
        Groupe groupe = getGroupeOuException(groupeId);

        for (String email : emails) {
            User apprenant = userRepository.findByEmail(email.trim())
                    .orElseThrow(() -> new IllegalArgumentException(
                            "Aucun utilisateur trouvé avec l'email : " + email));

            if (apprenant.getRole() != User.Role.USER) {
                throw new IllegalArgumentException(
                        email + " n'est pas un apprenant (rôle USER)");
            }

            boolean dejaPresent = groupe.getApprenants().stream()
                    .anyMatch(a -> a.getId().equals(apprenant.getId()));

            if (!dejaPresent) {
                groupe.getApprenants().add(apprenant);
            }
        }

        return versGroupeResponse(groupeRepository.save(groupe));
    }

    public GroupeResponse retirerApprenant(Long groupeId, Long apprenantId) {
        Groupe groupe = getGroupeOuException(groupeId);
        groupe.getApprenants().removeIf(a -> a.getId().equals(apprenantId));
        return versGroupeResponse(groupeRepository.save(groupe));
    }

    public GroupeResponse assignerQuestionnaire(Long groupeId, Long questionnaireId) {
        Groupe groupe = getGroupeOuException(groupeId);

        Questionnaire questionnaire = questionnaireRepository.findById(questionnaireId)
                .orElseThrow(() -> new IllegalArgumentException("Questionnaire introuvable"));

        groupe.setQuestionnaireAssigne(questionnaire);
        return versGroupeResponse(groupeRepository.save(groupe));
    }

    private Groupe getGroupeOuException(Long id) {
        return groupeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Groupe introuvable"));
    }

    private GroupeResponse versGroupeResponse(Groupe groupe) {
        return GroupeResponse.builder()
                .id(groupe.getId())
                .nom(groupe.getNom())
                .description(groupe.getDescription())
                .createdByNom(groupe.getCreatedBy() != null ? groupe.getCreatedBy().getNom() : null)
                .createdAt(groupe.getCreatedAt())
                .questionnaireAssigneId(
                        groupe.getQuestionnaireAssigne() != null
                                ? groupe.getQuestionnaireAssigne().getId() : null)
                .questionnaireAssigneTitre(
                        groupe.getQuestionnaireAssigne() != null
                                ? groupe.getQuestionnaireAssigne().getTitre() : null)
                .apprenants(
                        groupe.getApprenants().stream()
                                .map(a -> GroupeResponse.ApprenantDTO.builder()
                                        .id(a.getId())
                                        .nom(a.getNom())
                                        .prenom(a.getPrenom())
                                        .email(a.getEmail())
                                        .build())
                                .toList()
                )
                .build();
    }
}