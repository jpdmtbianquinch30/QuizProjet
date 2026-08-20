package com.master.controller;

import com.master.dto.*;
import com.master.entity.User;
import com.master.service.GroupeService;
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
@RequestMapping("/api/groupes")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
@PreAuthorize("hasAnyRole('EVALUATEUR', 'ADMIN')")
public class GroupeController {

    private final GroupeService groupeService;
    private final UserService userService;

    @PostMapping
    public ResponseEntity<GroupeResponse> creer(
            @Valid @RequestBody GroupeRequest request,
            Authentication authentication) {

        User evaluateur = userService.findByEmail(authentication.getName());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(groupeService.creer(request, evaluateur));
    }

    @GetMapping
    public ResponseEntity<List<GroupeResponse>> lister(Authentication authentication) {
        String role = authentication.getAuthorities()
                .stream().findFirst().get().getAuthority();

        if (role.equals("ROLE_ADMIN")) {
            return ResponseEntity.ok(groupeService.listerTous());
        }

        User evaluateur = userService.findByEmail(authentication.getName());
        return ResponseEntity.ok(groupeService.listerParEvaluateur(evaluateur.getId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<GroupeResponse> afficher(@PathVariable Long id) {
        return ResponseEntity.ok(groupeService.findById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<GroupeResponse> modifier(
            @PathVariable Long id,
            @Valid @RequestBody GroupeRequest request) {
        return ResponseEntity.ok(groupeService.modifier(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> supprimer(@PathVariable Long id) {
        groupeService.supprimer(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/apprenants")
    public ResponseEntity<?> ajouterApprenants(
            @PathVariable Long id,
            @Valid @RequestBody AjouterApprenantsRequest request) {
        try {
            return ResponseEntity.ok(
                    groupeService.ajouterApprenants(id, request.getEmails()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}/apprenants/{apprenantId}")
    public ResponseEntity<GroupeResponse> retirerApprenant(
            @PathVariable Long id,
            @PathVariable Long apprenantId) {
        return ResponseEntity.ok(groupeService.retirerApprenant(id, apprenantId));
    }

    @PutMapping("/{id}/questionnaire")
    public ResponseEntity<?> assignerQuestionnaire(
            @PathVariable Long id,
            @Valid @RequestBody AssignerQuestionnaireRequest request) {
        try {
            return ResponseEntity.ok(
                    groupeService.assignerQuestionnaire(id, request.getQuestionnaireId()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}