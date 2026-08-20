package com.master.controller;

import com.master.dto.ScoreResponse;
import com.master.dto.SoumissionRequest;
import com.master.entity.User;
import com.master.service.ScoreService;
import com.master.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/scores")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class ScoreController {

    private final ScoreService scoreService;
    private final UserService userService;

    // POST /api/scores — soumettre les réponses d'un quiz
    @PostMapping
    @PreAuthorize("hasAnyRole('USER', 'EVALUATEUR', 'ADMIN')")
    public ResponseEntity<?> soumettre(
            @Valid @RequestBody SoumissionRequest request,
            Authentication authentication) {

        User user = userService.findByEmail(authentication.getName());
        try {
            ScoreResponse response = scoreService.soumettre(request, user);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }
    }

    // GET /api/scores/classement/{questionnaireId} — classement d'un questionnaire
    @GetMapping("/classement/{questionnaireId}")
    @PreAuthorize("hasAnyRole('EVALUATEUR', 'ADMIN')")
    public ResponseEntity<List<ScoreResponse>> classement(
            @PathVariable Long questionnaireId) {
        return ResponseEntity.ok(
                scoreService.classementParQuestionnaire(questionnaireId));
    }

    // GET /api/scores/mon-historique — historique de l'utilisateur connecté
    @GetMapping("/mon-historique")
    @PreAuthorize("hasAnyRole('USER', 'EVALUATEUR', 'ADMIN')")
    public ResponseEntity<List<ScoreResponse>> monHistorique(
            Authentication authentication) {

        User user = userService.findByEmail(authentication.getName());
        return ResponseEntity.ok(scoreService.historiqueUtilisateur(user.getId()));
    }
}