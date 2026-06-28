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
    public ResponseEntity<QuestionnaireResponse> creer(
            @Valid @RequestBody QuestionnaireRequest request,
            Authentication authentication) {

        User admin = userService.findByEmail(authentication.getName());
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(questionnaireService.creer(request, admin));
    }

    // GET /api/questionnaires
    @GetMapping
    public ResponseEntity<List<QuestionnaireResponse>> listerTous() {
        return ResponseEntity.ok(questionnaireService.listerTous());
    }

    // GET /api/questionnaires/{id}
    @GetMapping("/{id}")
    public ResponseEntity<QuestionnaireResponse> afficher(
            @PathVariable Long id) {
        return ResponseEntity.ok(questionnaireService.findById(id));
    }

    // PUT /api/questionnaires/{id}
    @PutMapping("/{id}")
    public ResponseEntity<QuestionnaireResponse> modifier(
            @PathVariable Long id,
            @Valid @RequestBody QuestionnaireRequest request) {
        return ResponseEntity.ok(questionnaireService.modifier(id, request));
    }

    // DELETE /api/questionnaires/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> supprimer(@PathVariable Long id) {
        questionnaireService.supprimer(id);
        return ResponseEntity.noContent().build();
    }

    // GET /api/questionnaires/recherche?theme=Java
    @GetMapping("/recherche")
    public ResponseEntity<List<QuestionnaireResponse>> rechercherParTheme(
            @RequestParam String theme) {
        return ResponseEntity.ok(
                questionnaireService.rechercherParTheme(theme));
    }

    // GET /api/questionnaires/publies
    @GetMapping("/publies")
    public ResponseEntity<List<QuestionnaireResponse>> listerPublies() {
        return ResponseEntity.ok(
                questionnaireService.listerTous().stream()
                        .filter(q -> "PUBLIE".equals(q.getStatut()))
                        .toList()
        );
    }
}