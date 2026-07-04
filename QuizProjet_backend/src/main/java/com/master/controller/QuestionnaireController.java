package com.master.controller;

import com.master.dto.QuestionnaireRequest;
import com.master.dto.QuestionnaireResponse;
import com.master.entity.User;
import com.master.service.QuestionnaireService;
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
@RequestMapping("/api/questionnaires")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class QuestionnaireController {

    private final QuestionnaireService questionnaireService;
    private final UserService userService;


    // POST /api/questionnaires
    @PostMapping
    @PreAuthorize("hasAnyRole('EVALUATEUR', 'ADMIN')")
    public ResponseEntity<QuestionnaireResponse> creer(
            @Valid @RequestBody QuestionnaireRequest request,
            Authentication authentication) {

        User evaluateur = userService.findByEmail(authentication.getName());
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(questionnaireService.creer(request, evaluateur));
    }

    // GET /api/questionnaires — chaque évaluateur voit ses propres questionnaires
    @GetMapping
    @PreAuthorize("hasAnyRole('EVALUATEUR', 'ADMIN')")
    public ResponseEntity<List<QuestionnaireResponse>> listerTous(
            Authentication authentication) {

        String role = authentication.getAuthorities()
                .stream().findFirst().get().getAuthority();

        if (role.equals("ROLE_ADMIN")) {
            // ADMIN voit tous les questionnaires
            return ResponseEntity.ok(questionnaireService.listerTous());
        } else {
            // EVALUATEUR voit seulement les siens
            return ResponseEntity.ok(
                    questionnaireService.listerParEvaluateur(
                            authentication.getName()));
        }
    }

    // GET /api/questionnaires/{id}
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('EVALUATEUR', 'ADMIN')")
    public ResponseEntity<QuestionnaireResponse> afficher(
            @PathVariable Long id) {
        return ResponseEntity.ok(questionnaireService.findById(id));
    }

    // PUT /api/questionnaires/{id}
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('EVALUATEUR', 'ADMIN')")
    public ResponseEntity<QuestionnaireResponse> modifier(
            @PathVariable Long id,
            @Valid @RequestBody QuestionnaireRequest request) {
        return ResponseEntity.ok(questionnaireService.modifier(id, request));
    }

    // GET /api/questionnaires/assignes — questionnaires assignés à l'apprenant connecté
    @GetMapping("/assignes")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<QuestionnaireResponse>> listerAssignes(
            Authentication authentication) {

        User apprenant = userService.findByEmail(authentication.getName());
        return ResponseEntity.ok(questionnaireService.listerAssignes(apprenant.getId()));
    }

    // GET /api/questionnaires/{id}/jouer — questionnaire sans les bonnes réponses
    @GetMapping("/{id}/jouer")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> afficherPourJeu(
            @PathVariable Long id,
            Authentication authentication) {

        User apprenant = userService.findByEmail(authentication.getName());
        try {
            return ResponseEntity.ok(
                    questionnaireService.findByIdPourApprenant(id, apprenant.getId()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }
    }

    // DELETE /api/questionnaires/{id}
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('EVALUATEUR', 'ADMIN')")
    public ResponseEntity<Void> supprimer(@PathVariable Long id) {
        questionnaireService.supprimer(id);
        return ResponseEntity.noContent().build();
    }


    // GET /api/questionnaires/recherche?theme=Java
    @GetMapping("/recherche")
    @PreAuthorize("hasAnyRole('EVALUATEUR', 'ADMIN')")
    public ResponseEntity<List<QuestionnaireResponse>> rechercherParTheme(
            @RequestParam String theme,
            Authentication authentication) {

        String role = authentication.getAuthorities()
                .stream().findFirst().get().getAuthority();

        if (role.equals("ROLE_ADMIN")) {
            return ResponseEntity.ok(
                    questionnaireService.rechercherParTheme(theme));
        } else {
            return ResponseEntity.ok(
                    questionnaireService.rechercherParThemeEtEvaluateur(
                            theme, authentication.getName()));
        }
    }

    // GET /api/questionnaires/publies
    @GetMapping("/publies")
    @PreAuthorize("hasAnyRole('USER', 'EVALUATEUR', 'ADMIN')")
    public ResponseEntity<List<QuestionnaireResponse>> listerPublies() {
        return ResponseEntity.ok(
                questionnaireService.listerTous().stream()
                        .filter(q -> "PUBLIE".equals(q.getStatut()))
                        .toList()
        );
    }


}