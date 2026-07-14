package com.master.service;

import com.master.dto.DashboardResponse;
import com.master.entity.Questionnaire;
import com.master.entity.User;
import com.master.repository.QuestionnaireRepository;
import com.master.repository.ScoreRepository;
import com.master.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminDashboardService {

    private final UserRepository userRepository;

    private final QuestionnaireRepository questionnaireRepository;

    private final ScoreRepository scoreRepository;

    public DashboardResponse dashboard() {

        return DashboardResponse.builder()

                .admins(userRepository.countByRole(User.Role.ADMIN))

                .evaluateurs(userRepository.countByRole(User.Role.EVALUATEUR))

                .utilisateurs(userRepository.countByRole(User.Role.USER))

                .questionnaires(questionnaireRepository.count())

                .publies(questionnaireRepository.countByStatut(
                        Questionnaire.Statut.PUBLIE))

                .archives(questionnaireRepository.countByStatut(
                        Questionnaire.Statut.ARCHIVE))

                .brouillons(questionnaireRepository.countByStatut(
                        Questionnaire.Statut.BROUILLON))

                .scores(scoreRepository.count())

                .build();
    }

}