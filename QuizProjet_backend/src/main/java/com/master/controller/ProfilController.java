package com.master.controller;

import com.master.dto.ChangerMotDePasseRequest;
import com.master.dto.ProfilResponse;
import com.master.dto.ProfilUpdateRequest;
import com.master.entity.User;
import com.master.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profil")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class ProfilController {

    private final UserService userService;

    // GET /api/profil
    @GetMapping
    public ResponseEntity<ProfilResponse> voirProfil(Authentication authentication) {
        User user = userService.findByEmail(authentication.getName());
        return ResponseEntity.ok(versProfilResponse(user));
    }

    // PUT /api/profil (nom / prénom)
    @PutMapping
    public ResponseEntity<ProfilResponse> modifierProfil(
            @Valid @RequestBody ProfilUpdateRequest request,
            Authentication authentication) {

        User user = userService.modifierProfil(
                authentication.getName(), request.getNom(), request.getPrenom());

        return ResponseEntity.ok(versProfilResponse(user));
    }

    // PUT /api/profil/mot-de-passe
    @PutMapping("/mot-de-passe")
    public ResponseEntity<?> changerMotDePasse(
            @Valid @RequestBody ChangerMotDePasseRequest request,
            Authentication authentication) {

        try {
            userService.changerMotDePasse(
                    authentication.getName(),
                    request.getAncienMotDePasse(),
                    request.getNouveauMotDePasse());
            return ResponseEntity.ok("Mot de passe modifié avec succès");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    private ProfilResponse versProfilResponse(User user) {
        return ProfilResponse.builder()
                .id(user.getId())
                .nom(user.getNom())
                .prenom(user.getPrenom())
                .email(user.getEmail())
                .role(user.getRole().name())
                .build();
    }
}